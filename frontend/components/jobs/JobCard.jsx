import Link from 'next/link'

function timeAgo(dateString) {
    const diff = Date.now() - new Date(dateString).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return `${Math.floor(days / 30)}mo ago`
}

export default function JobCard({ job }) {
    return (
        <Link href={`/jobs/${job.id}`} className="block group">
            <div className="bg-white border border-slate-200 rounded-2xl p-6
                            hover:border-blue-200 hover:shadow-sm transition-all duration-200">
                <div className="flex items-start justify-between gap-4">

                    {/* Left — main info */}
                    <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-slate-900 group-hover:text-blue-600
                                       transition-colors truncate">
                            {job.title}
                        </h2>
                        <p className="text-slate-600 text-sm mt-0.5">{job.company}</p>

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            {/* Location */}
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                📍 {job.location}
                            </span>

                            {/* Type badge */}
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700
                                             text-xs font-medium rounded-full">
                                {job.type}
                            </span>

                            {/* Salary */}
                            {job.salary && (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600
                                                 text-xs font-medium rounded-full">
                                    {job.salary}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right — time + remote */}
                    <div className="shrink-0 text-right">
                        <span className="text-xs text-slate-400">{timeAgo(job.createdAt)}</span>
                        {job.remote && (
                            <div className="mt-1">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600
                                                 text-xs font-medium rounded-full">
                                    Remote
                                </span>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </Link>
    )
}