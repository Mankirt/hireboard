'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Plus, Edit, Trash2, Users, BarChart3, Briefcase } from 'lucide-react'

const STATUS_COLORS = {
    active: 'bg-emerald-50 text-emerald-700',
    closed: 'bg-slate-100 text-slate-600',
    draft:  'bg-orange-50 text-orange-700',
}

export default function MyJobsPage() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.getMyJobs()
        .then(({ data }) => setJobs(data.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }, [])

    async function handleDelete(id) {
        if (!confirm('Close this job listing?')) return
        try {
            await api.deleteJob(id)
            setJobs(prev => prev.filter(j => j.id !== id))
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to close job')
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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-900">My Job Listings</h2>
                    <p className="text-slate-500 text-sm mt-0.5">{jobs.length} total listings</p>
                </div>
                <Link
                href="/dashboard/jobs/new"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600
                            hover:bg-blue-700 text-white text-sm font-medium
                            rounded-xl transition-colors"
                >
                    <Plus size={15} />
                    Post Job
                </Link>
            </div>

            {jobs.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                    <Briefcase size={40} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No job listings yet</p>
                    <Link
                        href="/dashboard/jobs/new"
                        className="inline-block mt-4 text-sm text-blue-600
                                hover:text-blue-700 font-medium"
                    >
                        Post your first job →
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {jobs.map(job => (
                        <div
                        key={job.id}
                        className="bg-white border border-slate-200 rounded-2xl p-5
                                    flex items-center gap-4"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-slate-900 truncate">
                                        {job.title}
                                    </h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                                    ${STATUS_COLORS[job.status]}`}>
                                        {job.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Users size={12} />
                                        {job.application_count || 0} applicants
                                    </span>
                                    <span>
                                        {new Date(job.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <Link
                                href={`/dashboard/applicants?jobId=${job.id}`}
                                className="p-2 text-slate-400 hover:text-blue-600
                                            hover:bg-blue-50 rounded-lg transition-colors"
                                title="View applicants"
                                >
                                    <BarChart3 size={16} />
                                </Link>
                                <Link
                                href={`/dashboard/jobs/${job.id}/edit`}
                                className="p-2 text-slate-400 hover:text-slate-700
                                            hover:bg-slate-50 rounded-lg transition-colors"
                                title="Edit job"
                                >
                                    <Edit size={16} />
                                </Link>
                                <button
                                onClick={() => handleDelete(job.id)}
                                className="p-2 text-slate-400 hover:text-red-500
                                            hover:bg-red-50 rounded-lg transition-colors"
                                title="Close job"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}