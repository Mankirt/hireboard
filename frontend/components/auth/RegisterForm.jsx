'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/Providers'

export default function RegisterForm() {
    const { user, register } = useAuth()
    const router = useRouter()

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'seeker',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) router.replace(user.role === 'employer' ? '/dashboard' : '/jobs')
    }, [user])

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data = await register(form)
            router.push(data.user.role === 'employer' ? '/dashboard' : '/jobs')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
                    <p className="text-slate-500 mt-1 text-sm">Join HireBoard today — it's free</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Full name
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Jane Smith"
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg
                                           text-slate-900 placeholder-slate-400 text-sm
                                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                           transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg
                                           text-slate-900 placeholder-slate-400 text-sm
                                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                           transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                minLength={8}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Min. 8 characters"
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg
                                           text-slate-900 placeholder-slate-400 text-sm
                                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                           transition-colors"
                            />
                        </div>

                        {/* Role toggle */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                I am a...
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['seeker', 'employer'].map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, role: r }))}
                                        className={`py-2.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer
                                            ${form.role === r
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        {r === 'seeker' ? '🔍 Job Seeker' : '🏢 Employer'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                                       text-white font-medium rounded-lg text-sm
                                       transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>

                    </form>
                </div>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    )
}