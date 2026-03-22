import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import {
  createCheckoutSession,
  getSubscriptionStatus,
  cancelSubscription,
  handleWebhookEvent
} from '../services/paymentService.js'
import pool from '../config/db.js'

export const createCheckoutController = asyncHandler(async (req, res) => {

    const userResult = await pool.query(
        'SELECT id, email, full_name, role FROM users WHERE id = $1',
        [req.user.userId]
    )

    const user = userResult.rows[0]

    if (!user) {
        throw new ApiError(404, 'User not found')
    }

    const checkoutUrl = await createCheckoutSession(user)

    return res.status(200).json(
        new ApiResponse(200, { url: checkoutUrl }, 'Checkout session created')
    )
})

export const getSubscriptionController = asyncHandler(async (req, res) => {

    const subscription = await getSubscriptionStatus(req.user.userId)

    return res.status(200).json(
        new ApiResponse(200, subscription, 'Subscription fetched successfully')
  )
})

export const cancelSubscriptionController = asyncHandler(async (req, res) => {
    
    const result = await cancelSubscription(req.user.userId)

    return res.status(200).json(
        new ApiResponse(200, result, 'Subscription cancellation scheduled')
    )
})

export const webhookController = asyncHandler(async (req, res) => {
    const signature = req.headers['stripe-signature']

    if (!signature) {
        throw new ApiError(400, 'Missing stripe-signature header')
    }

    const result = await handleWebhookEvent(req.body, signature)

    return res.status(200).json(result)
})