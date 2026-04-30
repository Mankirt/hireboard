'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/Providers'
import { Briefcase, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
    const { login, user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push("/")
        }
    }, [user, router])

    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data = await login(form.email, form.password)
            if (data.user.role === 'employer') {
                router.push('/dashboard')
            } else {
                router.push('/jobs')
            }
            } catch (err) {
                setError(err.response?.data?.message || 'Invalid email or password')
            } finally {
                setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center
                                    justify-center mx-auto mb-4">
                        <Briefcase size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">Welcome back</h1>
                    <p className="text-slate-500 mt-1">Sign in to your HireBoard account</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200
                                    rounded-xl text-red-600 text-sm">
                    {error}
                    </div>
                )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl
                                        text-slate-900 placeholder-slate-400 text-sm
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        transition-all"
                            />
                            </div>

                            <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl
                                            text-slate-900 placeholder-slate-400 text-sm
                                            focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                            transition-all pr-10"
                                />
                                <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2
                                            text-slate-400 hover:text-slate-600"
                                >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700
                                    disabled:bg-slate-300 text-white font-semibold
                                    rounded-xl transition-colors text-sm"
                        >
                        {loading ? 'Signing in...' : 'Sign in'}
                        </button>

                    </form>
                </div>

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