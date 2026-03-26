'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']
const SALARY_RANGES = [
    { label: 'Any', value: '' },
    { label: '$50k+', value: '50000' },
    { label: '$80k+', value: '80000' },
    { label: '$100k+', value: '100000' },
    { label: '$150k+', value: '150000' },
]

export default function JobFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const activeType = searchParams.get('type') || ''
    const activeSalary = searchParams.get('salary') || ''

    function setFilter(key, value) {
        const params = new URLSearchParams(searchParams.toString())
        if (value) params.set(key, value)
        else params.delete(key)
        params.delete('page')
        router.push(`${pathname}?${params.toString()}`)
    }

    function clearAll() {
        router.push(pathname)
    }

    const hasFilters = activeType || activeSalary

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">Filters</h3>
                {hasFilters && (
                    <button
                        onClick={clearAll}
                        className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Job type */}
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                    Job Type
                </p>
                <div className="space-y-2">
                    {JOB_TYPES.map(type => (
                        <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={activeType === type}
                                onChange={() => setFilter('type', activeType === type ? '' : type)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600
                                           focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="text-sm text-slate-700 group-hover:text-slate-900">
                                {type}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Salary */}
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                    Minimum Salary
                </p>
                <div className="space-y-2">
                    {SALARY_RANGES.map(({ label, value }) => (
                        <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="radio"
                                checked={activeSalary === value}
                                onChange={() => setFilter('salary', value)}
                                className="w-4 h-4 border-slate-300 text-blue-600
                                           focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="text-sm text-slate-700 group-hover:text-slate-900">
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

        </div>
    )
}