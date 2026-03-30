'use client'

import { useState, useEffect } from 'react'
import { useSocket } from './Providers'
import { Bell } from 'lucide-react'

export default function NotificationBell() {
    const socket = useSocket()
    const [notifications, setNotifications] = useState([])
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!socket) return

        socket.on('application:status_updated', (data) => {
            setNotifications(prev => [
                {
                    id: Date.now(),
                    message: `Your application for ${data.jobTitle} is now ${data.newStatus}`,
                    status: data.newStatus,
                    read: false,
                    timestamp: data.timestamp,
                },
                ...prev.slice(0, 19), // keep max 20
            ])
        })

        return () => socket.off('application:status_updated')
    }, [socket])

    const unread = notifications.filter(n => !n.read).length

    function markAllRead() {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }

    const STATUS_COLORS = {
        accepted:  'text-emerald-600',
        rejected:  'text-red-500',
        reviewing: 'text-blue-600',
        pending:   'text-slate-500',
    }

    return (
        <div className="relative">
            <button
                onClick={() => { setOpen(o => !o); if (!open) markAllRead() }}
                className="relative p-2 text-slate-500 hover:text-slate-700
                        hover:bg-slate-100 rounded-lg transition-colors"
            >
                    <Bell size={18} />
                {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500
                                text-white text-xs rounded-full flex items-center
                                justify-center font-medium">
                    {unread > 9 ? '9+' : unread}
                </span>
                )}
            </button>

            {open && (
                <>
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                />
                <div className="absolute right-0 top-10 w-80 bg-white border
                                border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center
                                    justify-between">
                        <span className="font-semibold text-slate-900 text-sm">
                            Notifications
                        </span>
                        {notifications.length > 0 && (
                            <button
                            onClick={() => setNotifications([])}
                            className="text-xs text-slate-400 hover:text-slate-600"
                            >
                            Clear all
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-slate-400 text-sm">
                        No notifications yet
                        </div>
                    ) : (
                        notifications.map(n => (
                        <div
                            key={n.id}
                            className="px-4 py-3 border-b border-slate-50
                                    hover:bg-slate-50 transition-colors"
                        >
                            <p className="text-sm text-slate-700 leading-relaxed">
                            {n.message}
                            </p>
                            <p className={`text-xs mt-1 font-medium ${STATUS_COLORS[n.status]}`}>
                            {n.status.charAt(0).toUpperCase() + n.status.slice(1)}
                            </p>
                        </div>
                        ))
                    )}
                    </div>
                </div>
                </>
            )}
        </div>
    )
}