import { Link } from 'react-router-dom'

const links = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Enterprise', href: '/#enterprise' },
    { label: 'CRM', href: '/crm' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Chat', href: '/chat' },
    { label: 'Report', href: '/report' },
  ],
  Account: [
    { label: 'Sign in', href: '/login' },
    { label: 'Register', href: '/register' },
    { label: 'Forgot password', href: '/forgot-password' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8C3 5.24 5.24 3 8 3s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5Z" fill="white" fillOpacity=".2"/>
                  <path d="M8 5v3l2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-base font-semibold text-slate-900">Brightcone</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              Enterprise AI platform for orchestrating intelligent agents, managing conversations, and delivering production-ready workflows.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://github.com/ivaturipraveen/brightcode-multiagent"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                aria-label="GitHub"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{group}</p>
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="text-sm text-slate-600 transition hover:text-slate-900"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 sm:flex-row">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Brightcone. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="cursor-default transition hover:text-slate-600">Privacy Policy</span>
            <span className="cursor-default transition hover:text-slate-600">Terms of Service</span>
            <span className="cursor-default transition hover:text-slate-600">Security</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
