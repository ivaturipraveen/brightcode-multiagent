import type { PropsWithChildren } from 'react'

type AuthLayoutProps = PropsWithChildren<{
  title: string
  subtitle: string
}>

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.14),_transparent_30%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden rounded-[2rem] border border-white/70 bg-white/70 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">OpenClaw</p>
              <h1 className="mt-5 max-w-lg text-5xl font-semibold leading-tight text-slate-900">
                A lighter, sharper workspace for chat and collaboration.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                Clean authentication, fast streaming chat, and a calmer UI that feels more polished than the original dark shell.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Fast auth', 'Register and sign in with minimal friction.'],
                ['Live chat', 'Read streamed responses as they arrive.'],
                ['Clean layout', 'Bright panels, clear spacing, softer shadows.'],
              ].map(([label, copy]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <p className="font-semibold text-slate-900">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.12)] sm:p-10">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">OpenClaw</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{title}</h2>
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
