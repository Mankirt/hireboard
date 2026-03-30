'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import { CheckCircle, CreditCard, AlertCircle } from 'lucide-react'

export default function BillingPage() {
    const [subscription, setSubscription] = useState(null)
    const [loading, setLoading] = useState(true)
    const [cancelling, setCancelling] = useState(false)
    const searchParams = useSearchParams()
    const upgraded = searchParams.get('upgraded')

    useEffect(() => {
        api.getSubscription()
        .then(({ data }) => setSubscription(data.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }, [])

    async function handleCancel() {
        if (!confirm('Cancel your Pro subscription? You keep access until period end.')) return
        setCancelling(true)
        try {
            await api.cancelSubscription()
            setSubscription(prev => ({ ...prev, status: 'cancelling' }))
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel')
        } finally {
            setCancelling(false)
        }
    }

    if (loading) {
        return (
        <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600
                            rounded-full animate-spin" />
        </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-slate-900">Billing</h2>
                <p className="text-slate-500 text-sm mt-0.5">Manage your subscription</p>
            </div>

            {upgraded && (
                <div className="flex items-center gap-3 px-5 py-4 bg-emerald-50
                                border border-emerald-200 rounded-2xl">
                <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                <p className="text-sm text-emerald-700 font-medium">
                    Welcome to Pro! Your subscription is now active.
                </p>
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <CreditCard size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Current Plan</h3>
                        <p className="text-slate-500 text-sm">
                        {subscription?.plan === 'pro' ? 'HireBoard Pro' : 'HireBoard Free'}
                        </p>
                    </div>
                    <span className={`ml-auto text-xs px-3 py-1.5 rounded-full font-medium ${
                        subscription?.plan === 'pro'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                        {subscription?.plan?.toUpperCase() || 'FREE'}
                    </span>
                </div>

                {subscription?.plan === 'pro' && (
                    <div className="space-y-4">
                        {subscription.current_period_end && (
                        <p className="text-sm text-slate-500">
                            {subscription.status === 'cancelling'
                            ? `Access until ${new Date(subscription.current_period_end).toLocaleDateString()}`
                            : `Renews ${new Date(subscription.current_period_end).toLocaleDateString()}`
                            }
                        </p>
                        )}

                        {subscription.status === 'cancelling' ? (
                        <div className="flex items-center gap-2 text-orange-600 text-sm">
                            <AlertCircle size={16} />
                            Subscription cancellation scheduled
                        </div>
                        ) : (
                        <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="text-sm text-red-500 hover:text-red-600
                                    font-medium transition-colors"
                        >
                            {cancelling ? 'Cancelling...' : 'Cancel subscription'}
                        </button>
                        )}
                    </div>
                )}

                {subscription?.plan !== 'pro' && (
                    <a
                        href="/pricing"
                        className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700
                                text-white font-medium rounded-xl text-sm transition-colors"
                    >
                        Upgrade to Pro
                    </a>
                )}
            </div>
        </div>
    )
}