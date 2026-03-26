import { api } from '@/lib/api'
import JobCard from '@/components/jobs/JobCard'
import JobSearch from '@/components/jobs/JobSearch'
import JobFilters from '@/components/jobs/JobFilters'
import Pagination from '@/components/jobs/Pagination'

async function getJobs(searchParams) {
    try {
        const params = {
            page: searchParams.page || 1,
            limit: 10,
            ...(searchParams.query && { query: searchParams.query }),
            ...(searchParams.location && { location: searchParams.location }),
            ...(searchParams.type && { type: searchParams.type }),
            ...(searchParams.salary && { salary: searchParams.salary }),
        }

        // If there's a search query, use Elasticsearch endpoint
        // Otherwise use regular jobs endpoint
        const { data } = searchParams.query
            ? await api.search(params)
            : await api.getJobs(params)

        return data.data
    } catch {
        return { jobs: [], total: 0, pages: 1 }
    }
}

export const metadata = {
    title: 'Browse Jobs — HireBoard',
}

export default async function JobsPage({ searchParams }) {
    const resolvedSearchParams = await searchParams 
    const { jobs, total, pages } = await getJobs(resolvedSearchParams)
    const currentPage = Number(resolvedSearchParams.page) || 1

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 py-10">

                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Browse Jobs</h1>
                    <p className="text-slate-500 mt-1">
                        {total > 0 ? `${total} job${total !== 1 ? 's' : ''} found` : 'No jobs found'}
                    </p>
                </div>

                {/* Search bar */}
                <JobSearch />

                <div className="flex gap-8 mt-6">

                    {/* Sidebar filters */}
                    <aside className="w-64 shrink-0 hidden lg:block">
                        <JobFilters />
                    </aside>

                    {/* Job list */}
                    <div className="flex-1 min-w-0">
                        {jobs.length === 0 ? (
                            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                                <p className="text-slate-500">No jobs match your search.</p>
                                <p className="text-slate-400 text-sm mt-1">Try adjusting your filters.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {jobs.map(job => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>
                        )}

                        {pages > 1 && (
                            <div className="mt-8">
                                <Pagination currentPage={currentPage} totalPages={pages} />
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}