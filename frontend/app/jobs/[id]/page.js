import { notFound } from 'next/navigation'
import { MapPin, Briefcase, DollarSign, Building2, Calendar } from 'lucide-react'
import ApplyButton from '@/components/ApplyButton'

async function getJob(id) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`,
            { cache: 'no-store' }
        )
        if (!res.ok) return null
        const data = await res.json()
        return data.data
    } catch {
        return null
    }
}

export default async function JobDetailPage({ params }) {
    const { id } = await params
    const job = await getJob(id)

    if (!job) notFound()

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">

                {/* Header */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8">
                    <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center
                                    justify-center shrink-0">
                        <Building2 size={24} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-black text-slate-900 mb-1">
                        {job.title}
                        </h1>
                        <p className="text-blue-600 font-medium mb-4">
                        {job.company_name}
                        </p>
                        <div className="flex flex-wrap gap-3">
                        {job.location && (
                            <span className="flex items-center gap-1.5 text-sm
                                            text-slate-600 bg-slate-50 px-3 py-1 rounded-full">
                            <MapPin size={13} />
                            {job.location}
                            </span>
                        )}
                        {job.job_type && (
                            <span className="flex items-center gap-1.5 text-sm
                                            text-slate-600 bg-slate-50 px-3 py-1 rounded-full">
                            <Briefcase size={13} />
                            {job.job_type}
                            </span>
                        )}
                        {job.salary_min && (
                            <span className="flex items-center gap-1.5 text-sm
                                            text-slate-600 bg-slate-50 px-3 py-1 rounded-full">
                            <DollarSign size={13} />
                            ${job.salary_min.toLocaleString()}
                            {job.salary_max && ` — $${job.salary_max.toLocaleString()}`}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 text-sm
                                        text-slate-600 bg-slate-50 px-3 py-1 rounded-full">
                            <Calendar size={13} />
                            {new Date(job.created_at).toLocaleDateString()}
                        </span>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8">
                    <h2 className="font-semibold text-slate-900 text-lg mb-4">
                    Job Description
                    </h2>
                    <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                    {job.description}
                    </div>
                </div>

                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24">
                        <h3 className="font-semibold text-slate-900 mb-4">
                            Apply for this role
                        </h3>
                        <ApplyButton jobId={job.id} />
                </div>

                {/* Company info */}
                {job.company_description && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="font-semibold text-slate-900 mb-3">
                            About {job.company_name}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            {job.company_description}
                        </p>
                        {job.website && (
                            <a
                                href={job.website}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block mt-3 text-sm text-blue-600
                                            hover:text-blue-700 font-medium"
                            >
                                Visit website →
                            </a>
                        )}
                    </div>
                )}
                </div>

            </div>
        </div>
    )
}