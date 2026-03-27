'use client'

import { useAuth } from '@/components/Providers'
import Link from 'next/link'
import { Briefcase, FileText, Plus, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
    const { user } = useAuth()

    if (!user) return null

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-900">
                    Welcome back, {user.full_name.split(' ')[0]}!
                </h1>
                <p className="text-slate-500 mt-1">
                    {user.role === 'employer'
                        ? 'Manage your job listings and review applicants'
                        : 'Track your applications and find new opportunities'
                    }
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.role === 'employer' ? (
                <>
                    <Link href="/dashboard/jobs">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6
                                        hover:shadow-md transition-shadow group">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center
                                            justify-center mb-4">
                                <Briefcase size={20} className="text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-1">My Jobs</h3>
                            <p className="text-slate-500 text-sm">
                                View and manage your job listings
                            </p>
                            <div className="flex items-center gap-1 text-blue-600 text-sm
                                            font-medium mt-4 group-hover:gap-2 transition-all">
                                View jobs <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>

                    <Link href="/dashboard/jobs/new">
                        <div className="bg-blue-600 rounded-2xl p-6
                                        hover:bg-blue-700 transition-colors group">
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center
                                            justify-center mb-4">
                                <Plus size={20} className="text-white" />
                            </div>
                            <h3 className="font-semibold text-white mb-1">Post New Job</h3>
                            <p className="text-blue-200 text-sm">
                                Reach thousands of qualified candidates
                            </p>
                            <div className="flex items-center gap-1 text-white text-sm
                                            font-medium mt-4 group-hover:gap-2 transition-all">
                                Post now <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>
                </>
                ) : (
                <>
                    <Link href="/dashboard/applications">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6
                                        hover:shadow-md transition-shadow group">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center
                                            justify-center mb-4">
                                <FileText size={20} className="text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-1">My Applications</h3>
                            <p className="text-slate-500 text-sm">
                                Track your job applications
                            </p>
                            <div className="flex items-center gap-1 text-blue-600 text-sm
                                            font-medium mt-4 group-hover:gap-2 transition-all">
                                View applications <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>

                    <Link href="/jobs">
                        <div className="bg-blue-600 rounded-2xl p-6
                                        hover:bg-blue-700 transition-colors group">
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center
                                            justify-center mb-4">
                                <Briefcase size={20} className="text-white" />
                            </div>
                            <h3 className="font-semibold text-white mb-1">Browse Jobs</h3>
                            <p className="text-blue-200 text-sm">
                                Find your next opportunity
                            </p>
                            <div className="flex items-center gap-1 text-white text-sm
                                            font-medium mt-4 group-hover:gap-2 transition-all">
                                Browse now <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>
                </>
                )}
            </div>
        </div>
    )
}