import Link from 'next/link'
import { Search, Zap, Shield, BarChart3, ArrowRight } from 'lucide-react'

export default function HomePage() {
    const features = [
      {
        icon: Search,
        title: 'Elasticsearch Search',
        desc: 'Full-text search with fuzzy matching across thousands of listings.',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      },
      {
        icon: Zap,
        title: 'Real-time Notifications',
        desc: 'Instant WebSocket updates when your application status changes.',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
      },
      {
        icon: Shield,
        title: 'Secure Authentication',
        desc: 'JWT with refresh token rotation and httpOnly cookie storage.',
        color: 'text-violet-600',
        bg: 'bg-violet-50',
      },
      {
        icon: BarChart3,
        title: 'Analytics Dashboard',
        desc: 'Track applications, views, and hiring pipeline in real time.',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
      },
    ]

    const stats = [
      { value: '10,000+', label: 'Active Jobs' },
      { value: '50,000+', label: 'Job Seekers' },
      { value: '2,000+', label: 'Companies' },
      { value: '95%',    label: 'Hire Rate' },
    ]

    return (
      <div>

        {/* Hero Section */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-24 text-center">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-blue-50 border border-blue-200
                            text-blue-700 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Powered by Elasticsearch + Kafka + WebSockets
            </div>

            <h1 className="text-6xl font-black tracking-tight mb-6 text-slate-900">
              Find Your Next<br />
              <span className="text-blue-600">Dream Role</span>
            </h1>

            <p className="text-slate-500 text-xl max-w-2xl mx-auto mb-10">
              A production-grade job board with real-time notifications,
              full-text search, and instant application tracking.
            </p>

            <div className="flex items-center gap-4 justify-center">
              <Link
                href="/jobs"
                className="flex items-center gap-2 px-8 py-3 bg-blue-600
                          hover:bg-blue-700 text-white font-semibold
                          rounded-xl transition-colors"
              >
                Browse Jobs
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 border border-slate-300 hover:border-slate-400
                          text-slate-700 font-semibold rounded-xl transition-colors
                          bg-white hover:bg-slate-50"
              >
                Post a Job
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="bg-blue-600">
          <div className="max-w-6xl mx-auto px-6 py-10
                          grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              Built for scale
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Every feature is engineered with production-grade
              technology under the hood.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(feature => (
              <div
                key={feature.title}
                className="bg-white border border-slate-200 rounded-2xl p-6
                          hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 ${feature.bg} rounded-xl
                                flex items-center justify-center mb-4`}>
                  <feature.icon size={20} className={feature.color} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-slate-900">
          <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl font-black text-white mb-4">
              Ready to hire top talent?
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Post your first job for free. No credit card required.
            </p>
            <Link
              href="/register?role=employer"
              className="inline-flex items-center gap-2 px-8 py-3
                        bg-blue-600 hover:bg-blue-500 text-white
                        font-semibold rounded-xl transition-colors"
            >
              Start Hiring Today
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

      </div>
    )
}