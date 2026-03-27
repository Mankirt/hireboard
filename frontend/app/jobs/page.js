import Link from 'next/link'
import { Search, MapPin, Briefcase, DollarSign, Clock } from 'lucide-react'
import SearchForm from '@/components/SearchForm'

async function getJobs(params) {
    try {
        const searchParams = new URLSearchParams()
        if (params.query) searchParams.set('query', params.query)
        if (params.location) searchParams.set('location', params.location)
        if (params.jobType) searchParams.set('jobType', params.jobType)
        if (params.page) searchParams.set('page', params.page)
        searchParams.set('limit', '10')

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/search?${searchParams}`,
            { cache: 'no-store' }
        )
        const data = await res.json()
        return data.data
    } catch {
        return { jobs: [], total: 0, totalPages: 0 }
    }
}

function JobCard({ job }) {
    return (
        <Link href={`/jobs/${job.slug || job.id}`}>
            <div className="bg-white border border-slate-200 rounded-2xl p-6
                            hover:shadow-md hover:border-blue-200 transition-all group">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">

                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-blue-600 bg-blue-50
                                            px-2 py-0.5 rounded-full">
                                {job.company_name}
                            </span>
                        </div>

                        <h3 className="font-semibold text-slate-900 text-lg mb-2
                                    group-hover:text-blue-600 transition-colors">
                        {job.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            {job.location && (
                                <span className="flex items-center gap-1">
                                <MapPin size={13} />
                                {job.location}
                                </span>
                            )}
                            {job.job_type && (
                                <span className="flex items-center gap-1">
                                <Briefcase size={13} />
                                {job.job_type}
                                </span>
                            )}
                            {job.salary_min && (
                                <span className="flex items-center gap-1">
                                <DollarSign size={13} />
                                {job.salary_min.toLocaleString()}
                                {job.salary_max && ` — ${job.salary_max.toLocaleString()}`}
                                </span>
                            )}
                        </div>
                    </div>

                    <span className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                        <Clock size={12} />
                        {new Date(job.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default async function JobsPage({ searchParams }) {
    const resolvedParams = await searchParams
    const result = await getJobs(resolvedParams)
    const currentPage = Number(resolvedParams.page) || 1

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">

            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    Find your next role
                </h1>
                <p className="text-slate-500">
                    {result.total} jobs available
                </p>
            </div>

            {/* Search form — client component */}
            <SearchForm initialParams={resolvedParams} />

            {/* Results */}
            <div className="mt-8 space-y-4">
                {result.jobs?.length === 0 ? (
                <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
                    <Search size={40} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No jobs found</p>
                    <p className="text-slate-400 text-sm mt-1">
                        Try different search terms or filters
                    </p>
                </div>
                ) : (
                result.jobs?.map(job => (
                    <JobCard key={job.id} job={job} />
                    ))
                )}
            </div>

            {/* Pagination */}
            {result.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                    {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(page => (
                        <Link
                            key={page}
                            href={`/jobs?${new URLSearchParams({
                                ...resolvedParams,
                                page: page.toString()
                            })}`}
                            className={`w-10 h-10 rounded-xl text-sm font-medium
                                        flex items-center justify-center transition-colors
                                        ${page === currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                                        }`}
                            >
                            {page}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}