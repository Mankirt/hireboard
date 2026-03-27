'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Briefcase, X } from 'lucide-react'

export default function SearchForm({ initialParams = {} }) {
    const router = useRouter()
    const [form, setForm] = useState({
        query:    initialParams.query    || '',
        location: initialParams.location || '',
        jobType:  initialParams.jobType  || '',
    })

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        const params = new URLSearchParams()
        if (form.query)    params.set('query', form.query)
        if (form.location) params.set('location', form.location)
        if (form.jobType)  params.set('jobType', form.jobType)
        params.set('page', '1')
        router.push(`/jobs?${params.toString()}`)
    }

    function handleClear() {
        setForm({ query: '', location: '', jobType: '' })
        router.push('/jobs')
    }

    const hasFilters = form.query || form.location || form.jobType

    return (
        <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
        >
            <div className="flex flex-col md:flex-row gap-3">

            {/* Search query */}
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5
                            border border-slate-200 rounded-xl">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                    type="text"
                    name="query"
                    value={form.query}
                    onChange={handleChange}
                    placeholder="Job title, skill, company..."
                    className="flex-1 text-sm text-slate-900 placeholder-slate-400
                            bg-transparent focus:outline-none"
                />
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 px-4 py-2.5
                            border border-slate-200 rounded-xl md:w-48">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="flex-1 text-sm text-slate-900 placeholder-slate-400
                            bg-transparent focus:outline-none"
                />
            </div>

            {/* Job type */}
            <div className="flex items-center gap-2 px-4 py-2.5
                            border border-slate-200 rounded-xl md:w-44">
                <Briefcase size={16} className="text-slate-400 shrink-0" />
                <select
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                    className="flex-1 text-sm text-slate-900 bg-transparent
                            focus:outline-none cursor-pointer"
                >
                    <option value="">All types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                </select>
            </div>

            <div className="flex gap-2">
                {hasFilters && (
                    <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl
                                text-slate-500 hover:text-slate-700 text-sm
                                transition-colors flex items-center gap-1"
                    >
                    <X size={14} />
                    Clear
                    </button>
                )}
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700
                            text-white font-medium rounded-xl text-sm
                            transition-colors"
                >
                    Search
                </button>
            </div>
            </div>
        </form>
    )
}