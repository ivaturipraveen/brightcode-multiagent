import type { PropsWithChildren } from 'react'

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">OpenClaw</p>
          <h1 className="mt-2 text-3xl font-semibold">Welcome back</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
