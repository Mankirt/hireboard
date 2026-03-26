'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function JobSearch() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [query, setQuery] = useState(searchParams.get('query') || '')
    const [location, setLocation] = useState(searchParams.get('location') || '')

    // Debounce — wait 400ms after typing before pushing to URL
    const debouncedSearch = useDebouncedCallback((q, loc) => {
        const params = new URLSearchParams(searchParams.toString())

        if (q) params.set('query', q)
        else params.delete('query')

        if (loc) params.set('location', loc)
        else params.delete('location')

        params.delete('page') // reset to page 1 on new search
        router.push(`${pathname}?${params.toString()}`)
    }, 400)

    useEffect(() => {
        debouncedSearch(query, location)
    }, [query, location])

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                        🔍
                    </span>
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Job title, keyword..."
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg
                                   text-sm text-slate-900 placeholder-slate-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                        📍
                    </span>
                    <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="City, remote..."
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg
                                   text-sm text-slate-900 placeholder-slate-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    )
}