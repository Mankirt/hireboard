import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'HireBoard — Find Your Next Role',
    description: 'Production-grade job board with real-time notifications',
}

export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen`}>
          <Providers>
            <Header />
            <main>
              {children}
            </main>
          </Providers>
        </body>
      </html>
    )
}