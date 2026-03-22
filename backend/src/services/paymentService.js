import Stripe from 'stripe'
import pool from '../config/db.js'
import { ApiError } from '../utils/ApiError.js'


export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
})

export async function getOrCreateStripeCustomer(user) {

    const result = await pool.query(
        'SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1',
        [user.id]
    )

    const existing = result.rows[0]
    
    if (existing?.stripe_customer_id) {
        return existing.stripe_customer_id
    }

    const customer = await stripe.customers.create({
        email: user.email,
        name: user.full_name,
        metadata: {
            userId: user.id.toString(),
        },
    })

    await pool.query(
        `UPDATE subscriptions
        SET stripe_customer_id = $1, updated_at = NOW()
        WHERE user_id = $2`,
        [customer.id, user.id]
    )

    return customer.id
}


export async function createCheckoutSession(user) {
    if (user.role !== 'employer') {
        throw new ApiError(403, 'Only employers can subscribe to a plan')
    }

    const subResult = await pool.query(
        'SELECT plan, status FROM subscriptions WHERE user_id = $1',
        [user.id]
    )

    const subscription = subResult.rows[0]

    if (subscription?.plan === 'pro' && subscription?.status === 'active') {
        throw new ApiError(400, 'You are already on the Pro plan')
    }

    const customerId = await getOrCreateStripeCustomer(user)

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
            {
                price: process.env.STRIPE_PRO_PRICE_ID,
                quantity: 1,
            },
        ],

        success_url: `${process.env.FRONTEND_URL}/dashboard?upgraded=true`,
        cancel_url:  `${process.env.FRONTEND_URL}/pricing?cancelled=true`,

        metadata: {
            userId: user.id.toString(),
        },

        subscription_data: {
            metadata: {
                userId: user.id.toString(),
        },
        },

       
    })

    return session.url
}

export async function getSubscriptionStatus(userId) {
    const result = await pool.query(
        `SELECT
        plan,
        status,
        stripe_customer_id,
        stripe_subscription_id,
        current_period_end
        FROM subscriptions
        WHERE user_id = $1`,
        [userId]
    )

    return result.rows[0] || { plan: 'free', status: 'active' }
}

export async function cancelSubscription(userId) {
    const result = await pool.query(
        'SELECT stripe_subscription_id FROM subscriptions WHERE user_id = $1',
        [userId]
    )

    const { stripe_subscription_id } = result.rows[0] || {}

    if (!stripe_subscription_id) {
        throw new ApiError(400, 'No active subscription found')
    }

    await stripe.subscriptions.update(stripe_subscription_id, {
        cancel_at_period_end: true,
    })

    await pool.query(
        `UPDATE subscriptions
        SET status = 'cancelling', updated_at = NOW()
        WHERE user_id = $1`,
        [userId]
    )

    return { message: 'Subscription will cancel at end of billing period' }
}
