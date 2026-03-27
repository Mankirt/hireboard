'use client'

import { useState } from 'react'
import { useAuth } from './Providers'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { CheckCircle } from 'lucide-react'

export default function ApplyButton({ jobId }) {
    const { user } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [applied, setApplied] = useState(false)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [coverLetter, setCoverLetter] = useState('')

    if (!user) {
        return (
            <div className="space-y-3">
                <p className="text-sm text-slate-500">
                    Sign in to apply for this role
                </p>
                <button
                onClick={() => router.push('/login')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700
                            text-white font-semibold rounded-xl transition-colors"
                >
                    Sign in to Apply
                </button>
            </div>
        )
    }

    if (user.role === 'employer') {
        return (
            <p className="text-sm text-slate-500 text-center py-2">
                Employers cannot apply to jobs
            </p>
        )
    }

    if (applied) {
        return (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50
                            rounded-xl p-4 justify-center">
                <CheckCircle size={18} />
                <span className="font-medium text-sm">Application submitted!</span>
            </div>
        )
    }

    async function handleApply() {
        setLoading(true)
        setError('')
        try {
            await api.apply(jobId, { coverLetter: coverLetter || undefined })
            setApplied(true)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to apply')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-3">
        {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200
                            rounded-xl text-red-600 text-sm">
                {error}
            </div>
        )}

        {showForm && (
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Cover Letter (optional)
                </label>
                <textarea
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    placeholder="Tell them why you're a great fit..."
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl
                            text-slate-900 placeholder-slate-400 text-sm
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            resize-none transition-all"
                />
            </div>
        )}

        <button
            onClick={showForm ? handleApply : () => setShowForm(true)}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700
                    disabled:bg-slate-300 text-white font-semibold
                    rounded-xl transition-colors"
        >
            {loading ? 'Submitting...' : showForm ? 'Submit Application' : 'Apply Now'}
        </button>

        {showForm && (
            <button
            onClick={() => setShowForm(false)}
            className="w-full py-2 text-slate-500 hover:text-slate-700
                        text-sm transition-colors"
            >
            Cancel
            </button>
        )}
        </div>
    )
}