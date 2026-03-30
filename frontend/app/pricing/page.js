'use client'

import { useState } from 'react'
import { useAuth } from '@/components/Providers'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Check, Zap } from 'lucide-react'

const PLANS = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for getting started',
        features: [
        'Up to 3 active job listings',
        'Basic applicant management',
        'Email notifications',
        'Standard support',
        ],
        cta: 'Get Started',
        highlighted: false,
    },
    {
        name: 'Pro',
        price: '$49',
        period: 'per month',
        description: 'For growing companies',
        features: [
        'Unlimited job listings',
        'Advanced applicant tracking',
        'Real-time WebSocket notifications',
        'Priority support',
        'Analytics dashboard',
        'Featured listings',
        ],
        cta: 'Upgrade to Pro',
        highlighted: true,
    },
]

export default function PricingPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleUpgrade() {
        if (!user) return router.push('/register?role=employer')
        if (user.role !== 'employer') {
            return setError('Only employers can subscribe to Pro')
        }

        setLoading(true)
        setError('')

        try {
            const { data } = await api.createCheckout()
            window.location.href = data.data.url
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to start checkout')
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-20">

            <div className="text-center mb-16">
                <h1 className="text-4xl font-black text-slate-900 mb-4">
                    Simple, transparent pricing
                </h1>
                <p className="text-slate-500 text-lg">
                    Start free, upgrade when you're ready to scale
                </p>
            </div>

            {error && (
                <div className="mb-8 px-4 py-3 bg-red-50 border border-red-200
                                rounded-xl text-red-600 text-sm text-center">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {PLANS.map(plan => (
                    <div
                        key={plan.name}
                        className={`rounded-2xl p-8 ${
                        plan.highlighted
                            ? 'bg-blue-600 border-2 border-blue-600 shadow-xl shadow-blue-100'
                            : 'bg-white border-2 border-slate-200'
                        }`}
                    >
                        {plan.highlighted && (
                        <div className="flex items-center gap-1.5 text-blue-200 text-xs
                                        font-medium mb-4">
                            <Zap size={13} />
                            MOST POPULAR
                        </div>
                        )}

                        <h2 className={`text-2xl font-black mb-1 ${
                            plan.highlighted ? 'text-white' : 'text-slate-900'
                        }`}>
                            {plan.name}
                        </h2>

                        <div className="flex items-baseline gap-1 mb-2">
                            <span className={`text-4xl font-black ${
                                plan.highlighted ? 'text-white' : 'text-slate-900'
                            }`}>
                                {plan.price}
                            </span>
                            <span className={`text-sm ${
                                plan.highlighted ? 'text-blue-200' : 'text-slate-500'
                            }`}>
                                {plan.period}
                            </span>
                        </div>

                        <p className={`text-sm mb-8 ${
                        plan.highlighted ? 'text-blue-200' : 'text-slate-500'
                        }`}>
                            {plan.description}
                        </p>

                        <ul className="space-y-3 mb-8">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-center gap-2.5">
                                <div className={`w-5 h-5 rounded-full flex items-center
                                                justify-center shrink-0 ${
                                    plan.highlighted ? 'bg-blue-500' : 'bg-emerald-50'
                                }`}>
                                    <Check size={12} className={
                                    plan.highlighted ? 'text-white' : 'text-emerald-600'
                                    } />
                                </div>
                                <span className={`text-sm ${
                                    plan.highlighted ? 'text-blue-100' : 'text-slate-600'
                                }`}>
                                    {feature}
                                </span>
                                </li>
                            ))}
                        </ul>

                        <button
                        onClick={plan.highlighted ? handleUpgrade : () => router.push('/register')}
                        disabled={loading && plan.highlighted}
                        className={`w-full py-3 rounded-xl font-semibold text-sm
                                    transition-colors ${
                            plan.highlighted
                            ? 'bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-70'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                        >
                        {loading && plan.highlighted ? 'Redirecting...' : plan.cta}
                        </button>
                    </div>
                ))}
            </div>

        </div>
    )
}