'use client'

import { useAuth } from '@/components/Providers'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Briefcase, Users, CreditCard, LayoutDashboard } from 'lucide-react'

export default function DashboardLayout({ children }) {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!user) router.push('/login')
    }, [user])

    if (!user) return null

    const seekerNav = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/applications', label: 'My Applications', icon: Briefcase },
    ]

    const employerNav = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/jobs', label: 'My Jobs', icon: Briefcase },
        { href: '/dashboard/applicants', label: 'Applicants', icon: Users },
        { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
    ]

    const nav = user.role === 'employer' ? employerNav : seekerNav

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Sidebar */}
                <div className="md:col-span-1">
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sticky top-24">

                        <div className="mb-4 px-3 py-2">
                            <p className="font-semibold text-slate-900 text-sm truncate">
                                {user.full_name}
                            </p>
                            <p className="text-slate-500 text-xs truncate">{user.email}</p>
                        </div>

                        <nav className="space-y-1">
                            {nav.map(item => (
                                <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                                            text-sm font-medium text-slate-600
                                            hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                <item.icon size={16} />
                                {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="md:col-span-3">
                    {children}
                </div>

            </div>
        </div>
    )
}