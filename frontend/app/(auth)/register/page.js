'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/Providers'
import { Briefcase, User, Building2 } from 'lucide-react'

export default function RegisterPage() {
    const { register, user } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [user, router])

    const [form, setForm] = useState({
        email: '',
        password: '',
        fullName: '',
        role: searchParams.get('role') || 'seeker',
        companyName: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (form.password.length < 8) {
            return setError('Password must be at least 8 characters')
        }

        if (form.role === 'employer' && !form.companyName.trim()) {
            return setError('Company name is required for employers')
        }

        setLoading(true)

        try {
            const data = await register(form)
            if (data.user.role === 'employer') {
                router.push('/dashboard')
            } else {
                router.push('/jobs')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

            {/* Logo */}
            <div className="text-center mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center
                            justify-center mx-auto mb-4">
                <Briefcase size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Create your account</h1>
            <p className="text-slate-500 mt-1">Join thousands of professionals on HireBoard</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

            {/* Role selector */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                {
                    [
                    { value: 'seeker', label: 'Job Seeker', icon: User },
                    { value: 'employer', label: 'Employer', icon: Building2 },
                    ].map(({ value, label, icon: Icon }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, role: value }))}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl
                                    border-2 text-sm font-medium transition-all
                                    ${form.role === value
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                    >
                        <Icon size={16} />
                        {label}
                    </button>
                    ))}
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200
                                    rounded-xl text-red-600 text-sm">
                    {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl
                                    text-slate-900 placeholder-slate-400 text-sm
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                    transition-all"
                        />
                    </div>

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
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Min. 8 characters"
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl
                                    text-slate-900 placeholder-slate-400 text-sm
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                    transition-all"
                        />
                    </div>

                    {form.role === 'employer' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Company Name
                        </label>
                        <input
                        type="text"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="Acme Corporation"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl
                                    text-slate-900 placeholder-slate-400 text-sm
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                    transition-all"
                        />
                    </div>
                    )}

                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700
                                disabled:bg-slate-300 text-white font-semibold
                                rounded-xl transition-colors text-sm"
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