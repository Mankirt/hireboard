'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function Pagination({ currentPage, totalPages }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    function goToPage(page) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page)
        router.push(`${pathname}?${params.toString()}`)
    }

    // Build page number array — show at most 5 pages around current
    const pages = []
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, currentPage + 2)
    for (let i = start; i <= end; i++) pages.push(i)

    return (
        <div className="flex items-center justify-center gap-1">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900
                           disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
                ← Prev
            </button>

            {start > 1 && (
                <>
                    <button onClick={() => goToPage(1)}
                        className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
                        1
                    </button>
                    {start > 2 && <span className="text-slate-400 px-1">…</span>}
                </>
            )}

            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors
                        ${page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                >
                    {page}
                </button>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span className="text-slate-400 px-1">…</span>}
                    <button onClick={() => goToPage(totalPages)}
                        className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900
                           disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
                Next →
            </button>
        </div>
    )
}