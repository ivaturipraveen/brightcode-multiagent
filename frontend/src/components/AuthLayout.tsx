import { Link } from 'react-router-dom'
import type { PropsWithChildren } from 'react'

type AuthLayoutProps = PropsWithChildren<{
  title: string
  subtitle: string
}>

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f4ed] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-10 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                clipRule="evenodd"
              />
            </svg>
            Back to home
          </Link>
          <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#d97757]" />
            Brightcone
          </div>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">Thoughtful AI workspace</p>
            <h1 className="mt-6 text-5xl font-medium leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
              Quiet design.
              <br />
              Focused conversations.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Sign in to continue with a calmer chat experience built for longer conversations, cleaner history, and less visual noise.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                ['Minimal interface', 'Simple surfaces, softer contrast, and more room to read.'],
                ['Conversation memory', 'Revisit older threads from the sidebar without losing context.'],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-3xl border border-black/8 bg-white/65 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                  <p className="text-base font-medium text-slate-900">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-[2rem] border border-black/10 bg-white px-7 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-9 sm:py-10">
              <div className="mb-8">
                <p className="text-sm font-medium tracking-wide text-slate-500">Brightcone account</p>
                <h2 className="mt-3 text-3xl font-medium tracking-tight text-slate-900">{title}</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">{subtitle}</p>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
