'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function NewJobPage() {
    const router = useRouter()
    const [form, setForm] = useState({
        title: '',
        description: '',
        location: '',
        jobType: '',
        salaryMin: '',
        salaryMax: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
        await api.createJob({
            ...form,
            salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
            salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
        })
        router.push('/dashboard/jobs')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create job')
        } finally {
            setLoading(false)
        }
    }

    const inputClass = `w-full px-4 py-2.5 border border-slate-300 rounded-xl
                        text-slate-900 placeholder-slate-400 text-sm
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all`

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-slate-900">Post a New Job</h2>
                <p className="text-slate-500 text-sm mt-0.5">
                    Fill in the details to attract the right candidates
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8">
                {error && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200
                                    rounded-xl text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Job Title *
                        </label>
                        <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. Senior React Engineer"
                        required
                        className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Description *
                        </label>
                        <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe the role, responsibilities, requirements..."
                        required
                        rows={8}
                        className={`${inputClass} resize-none`}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="e.g. New York, Remote"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Job Type
                            </label>
                            <select
                                name="jobType"
                                value={form.jobType}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="">Select type</option>
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="contract">Contract</option>
                                <option value="remote">Remote</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Min Salary ($)
                            </label>
                            <input
                                type="number"
                                name="salaryMin"
                                value={form.salaryMin}
                                onChange={handleChange}
                                placeholder="e.g. 80000"
                                className={inputClass}
                            />
                            </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Max Salary ($)
                            </label>
                            <input
                                type="number"
                                name="salaryMax"
                                value={form.salaryMax}
                                onChange={handleChange}
                                placeholder="e.g. 120000"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700
                                    disabled:bg-slate-300 text-white font-semibold
                                    rounded-xl transition-colors text-sm"
                        >
                            {loading ? 'Posting...' : 'Post Job'}
                        </button>
                        <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2.5 border border-slate-300 text-slate-600
                                    hover:border-slate-400 rounded-xl text-sm transition-colors"
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}