import "@/styles/base.css"
import { Metadata } from "next"
import { Inter } from "next/font/google"
import { ReactNode } from "react"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: { default: "Tefflon", template: "%s - Tefflon" },
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`flex min-h-screen flex-col ${inter.className}`}>
        <header className="page-header">
          <div className="container">
            <div className="page-title">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="text-2xl font-bold text-slate-900 hover:no-underline"
                >
                  Tefflon
                </Link>
                <nav className="flex items-center space-x-6">
                  <Link href="/" className="nav-link">
                    Home
                  </Link>
                  <Link href="/requests" className="nav-link">
                    Requests
                  </Link>
                  <Link href="/requests/new" className="nav-link">
                    New Request
                  </Link>
                  <Link href="/review" className="nav-link">
                    Review
                  </Link>
                  <Link href="/promote" className="nav-link">
                    Promote
                  </Link>
                  <Link href="/login" className="nav-link">
                    Login
                  </Link>
                  <Link href="/signup" className="nav-link">
                    Sign Up
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </header>

        <main className="grow">
          <div className="main-content container">{children}</div>
        </main>

        <footer className="mt-auto border-t border-slate-200 bg-slate-100">
          <div className="container py-8">
            <p className="mb-0 text-center text-sm text-slate-600">
              © {new Date().getFullYear()} Tefflon. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
