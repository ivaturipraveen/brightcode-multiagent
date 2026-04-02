import { Link } from 'react-router-dom'
import type { PropsWithChildren } from 'react'

type AuthLayoutProps = PropsWithChildren<{
  title: string
  subtitle: string
}>

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f9fb] text-slate-900">
      <div className="flex min-h-screen">
        {/* Left panel — branding */}
        <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-slate-900 px-12 py-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8C3 5.24 5.24 3 8 3s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5Z" fill="white" fillOpacity=".2"/>
                <path d="M8 5v3l2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-base font-semibold text-white">Brightcone</span>
          </Link>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">Enterprise AI Platform</p>
            <h2 className="mt-4 text-4xl font-bold leading-tight text-white">
              The operating layer for enterprise AI agents.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-400">
              Orchestrate agents, manage conversations, and ship intelligent workflows — with a premium interface teams actually want to use.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                ['18x', 'Faster task routing'],
                ['92%', 'Conversation recall'],
                ['24/7', 'Agent availability'],
                ['100%', 'TypeScript codebase'],
              ].map(([val, label]) => (
                <div key={val} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <div className="text-2xl font-bold text-white">{val}</div>
                  <div className="mt-1 text-xs text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-600">© {new Date().getFullYear()} Brightcone. All rights reserved.</p>
        </div>

        {/* Right panel — form */}
        <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
          {/* Mobile logo + back */}
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
              </svg>
              Back to home
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8C3 5.24 5.24 3 8 3s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5Z" fill="white" fillOpacity=".2"/>
                  <path d="M8 5v3l2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-900">Brightcone</span>
            </Link>
          </div>

          {/* Desktop back link */}
          <Link
            to="/"
            className="mb-10 hidden items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 lg:flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
            </svg>
            Back to home
          </Link>

          <div className="mx-auto w-full max-w-sm">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
