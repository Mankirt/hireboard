'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useSocket } from '@/components/Providers'
import { Briefcase, MapPin, Clock, Bell } from 'lucide-react'

const STATUS_COLORS = {
    pending:   { bg: 'bg-slate-100',    text: 'text-slate-600',    label: 'Pending' },
    reviewing: { bg: 'bg-blue-50',      text: 'text-blue-700',     label: 'Under Review' },
    accepted:  { bg: 'bg-emerald-50',   text: 'text-emerald-700',  label: 'Accepted! 🎉' },
    rejected:  { bg: 'bg-red-50',       text: 'text-red-600',      label: 'Not Selected' },
}

export default function MyApplicationsPage() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [notification, setNotification] = useState(null)
    const socket = useSocket()

    useEffect(() => {
        api.getMyApplications()
        .then(({ data }) => setApplications(data.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }, [])

    // Listen for real-time status updates
    useEffect(() => {
        if (!socket) return

        socket.on('application:status_updated', (data) => {
        // Update the application in the list
        setApplications(prev =>
            prev.map(app =>
            app.id === data.applicationId
                ? { ...app, status: data.newStatus }
                : app
            )
        )

        // Show notification banner
        setNotification(data)
        setTimeout(() => setNotification(null), 5000)
        })

        return () => socket.off('application:status_updated')
    }, [socket])

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

        {/* Real-time notification banner */}
        {notification && (
            <div className="flex items-center gap-3 px-5 py-4 bg-blue-50
                            border border-blue-200 rounded-2xl">
                <Bell size={18} className="text-blue-600 shrink-0" />
                <p className="text-sm text-blue-700">
                    Your application for <strong>{notification.jobTitle}</strong> at{' '}
                    <strong>{notification.companyName}</strong> is now{' '}
                    <strong>{notification.newStatus}</strong>
                </p>
            </div>
        )}

        <div>
            <h2 className="text-xl font-black text-slate-900">My Applications</h2>
            <p className="text-slate-500 text-sm mt-0.5">
                {applications.length} applications submitted
            </p>
        </div>

        {applications.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                <Briefcase size={40} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No applications yet</p>
                <Link
                    href="/jobs"
                    className="inline-block mt-4 text-sm text-blue-600
                            hover:text-blue-700 font-medium"
                >
                    Browse jobs →
                </Link>
            </div>
        ) : (
            <div className="space-y-3">
                {applications.map(app => {
                    const status = STATUS_COLORS[app.status] || STATUS_COLORS.pending
                    return (
                        <div
                            key={app.id}
                            className="bg-white border border-slate-200 rounded-2xl p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <Link
                                    href={`/jobs/${app.job_slug || app.job_id}`}
                                    className="font-semibold text-slate-900 hover:text-blue-600
                                                transition-colors"
                                    >
                                        {app.job_title}
                                    </Link>
                                    <p className="text-blue-600 text-sm font-medium mt-0.5">
                                        {app.company_name}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 mt-2
                                                    text-xs text-slate-500">
                                        {app.job_location && (
                                            <span className="flex items-center gap-1">
                                            <MapPin size={11} />
                                            {app.job_location}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Clock size={11} />
                                            Applied {new Date(app.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <span className={`shrink-0 text-xs px-3 py-1.5 rounded-full
                                                font-medium ${status.bg} ${status.text}`}>
                                    {status.label}
                                </span>
                            </div>
                        </div>
                        )
                })}
            </div>
        )}
        </div>
    )
}