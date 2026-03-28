'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import { User, ChevronDown } from 'lucide-react'

const STATUS_OPTIONS = ['reviewing', 'accepted', 'rejected']

const STATUS_COLORS = {
    pending:   'bg-slate-100 text-slate-600',
    reviewing: 'bg-blue-50 text-blue-700',
    accepted:  'bg-emerald-50 text-emerald-700',
    rejected:  'bg-red-50 text-red-600',
}

export default function ApplicantsPage() {
    const searchParams = useSearchParams()
    const jobId = searchParams.get('jobId')
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!jobId) return
        api.getJobApplications(jobId)
        .then(({ data }) => setApplications(data.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }, [jobId])

    async function handleStatusChange(appId, newStatus) {
        try {
            await api.updateStatus(appId, newStatus)
            setApplications(prev =>
                prev.map(a => a.id === appId ? { ...a, status: newStatus } : a)
            )
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status')
        }
    }

    if (!jobId) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                <p className="text-slate-500">Select a job from My Jobs to view applicants</p>
            </div>
        )
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
                <h2 className="text-xl font-black text-slate-900">Applicants</h2>
                <p className="text-slate-500 text-sm mt-0.5">
                {applications.length} applications received
                </p>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                    <User size={40} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No applications yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                {applications.map(app => (
                    <div
                    key={app.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center
                                                justify-center shrink-0">
                                    <User size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        {app.seeker_name}
                                    </p>
                                    <p className="text-sm text-slate-500">{app.seeker_email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium
                                                ${STATUS_COLORS[app.status]}`}>
                                    {app.status}
                                </span>

                                {app.status !== 'accepted' && app.status !== 'rejected' && (
                                    <div className="relative">
                                        <select
                                            value={app.status}
                                            onChange={e => handleStatusChange(app.id, e.target.value)}
                                            className="text-sm border border-slate-200 rounded-lg
                                                    px-3 py-1.5 text-slate-700 bg-white
                                                    focus:ring-2 focus:ring-blue-500
                                                    focus:border-transparent cursor-pointer"
                                        >
                                            <option value={app.status} disabled>
                                                Update status
                                            </option>
                                            {STATUS_OPTIONS.map(s => (
                                            <option key={s} value={s}>
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {app.cover_letter && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-xs font-medium text-slate-500 mb-1">
                                Cover Letter
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                                {app.cover_letter}
                            </p>
                            </div>
                        )}
                    </div>
                ))}
                </div>
            )}
        </div>
    )
}