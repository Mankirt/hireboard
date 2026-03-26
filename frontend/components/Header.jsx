'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from './Providers'
import { Briefcase, LogOut, User, Plus, Search } from 'lucide-react'

export default function Header() {
    const { user, logout } = useAuth()
    const router = useRouter()

    async function handleLogout() {
        await logout()
        router.push('/')
    }

    return (
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Briefcase size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
                HireBoard
            </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
            <Link
                href="/jobs"
                className="flex items-center gap-1.5 text-sm text-slate-600
                        hover:text-blue-600 transition-colors font-medium"
            >
                <Search size={15} />
                Browse Jobs
            </Link>

            {!user ? (
                <div className="flex items-center gap-3">
                <Link
                    href="/login"
                    className="text-sm text-slate-600 hover:text-slate-900
                            transition-colors font-medium"
                >
                    Sign in
                </Link>
                <Link
                    href="/register"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700
                            text-white text-sm font-medium rounded-lg
                            transition-colors"
                >
                    Get Started
                </Link>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                {user.role === 'employer' && (
                    <Link
                    href="/dashboard/jobs/new"
                    className="flex items-center gap-1.5 px-3 py-1.5
                                bg-blue-600 hover:bg-blue-700 text-white
                                text-sm font-medium rounded-lg transition-colors"
                    >
                    <Plus size={15} />
                    Post Job
                    </Link>
                )}

                <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-sm text-slate-600
                            hover:text-slate-900 transition-colors font-medium"
                >
                    <User size={15} />
                    Dashboard
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm text-slate-500
                            hover:text-red-500 transition-colors"
                >
                    <LogOut size={15} />
                    Sign out
                </button>
                </div>
            )}
            </nav>
        </div>
        </header>
    )
}