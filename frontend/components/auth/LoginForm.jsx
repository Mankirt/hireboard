'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/Providers'

export default function LoginForm() {
    const { user, login } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) {
            const redirect = searchParams.get('redirect') || (user.role === 'employer' ? '/dashboard' : '/jobs')
            router.replace(redirect)
        }
    }, [user])

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data = await login(email, password)
            const redirect = searchParams.get('redirect') || (data.user.role === 'employer' ? '/dashboard' : '/jobs')
            router.push(redirect)
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo / heading */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
                    <p className="text-slate-500 mt-1 text-sm">Sign in to your HireBoard account</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

                    {/* Error banner */}
                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg
                                           text-slate-900 placeholder-slate-400 text-sm
                                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                           transition-colors"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <Link href="/forgot-password"
                                    className="text-xs text-blue-600 hover:text-blue-700">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg
                                           text-slate-900 placeholder-slate-400 text-sm
                                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                           transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                                       text-white font-medium rounded-lg text-sm
                                       transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>

                {/* Footer link */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                        Create one
                    </Link>
                </p>

            </div>
        </div>
    )
}