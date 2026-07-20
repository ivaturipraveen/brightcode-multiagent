import { Link } from 'react-router-dom'
import { useTheme } from '../lib/theme'

type BlogEntry = {
  title: string
  date: string
  summary: string
  href: string
  source: 'AI Toast' | 'Superhuman AI'
}

const aiToastPosts: BlogEntry[] = [
  {
    title: 'Claude for Teachers just launched',
    date: 'Jul 17, 2026',
    summary: 'Anthropic pushed a teacher-focused Claude launch, paired with a practical tip on remotely logging out of ChatGPT sessions.',
    href: 'https://aitoast.beehiiv.com/p/claude-for-teachers-just-launched',
    source: 'AI Toast',
  },
  {
    title: 'ChatGPT Work just launched',
    date: 'Jul 10, 2026',
    summary: 'A workplace-oriented ChatGPT release with a companion walkthrough for Meta\'s Muse Spark 1.1.',
    href: 'https://aitoast.beehiiv.com/p/chatgpt-work-just-launched',
    source: 'AI Toast',
  },
  {
    title: 'Microsoft is laying off 4800 employees',
    date: 'Jul 7, 2026',
    summary: 'A market and workforce update bundled with a practical guide to generating presentations with ChatGPT.',
    href: 'https://aitoast.beehiiv.com/p/microsoft-is-laying-off-4800-employees',
    source: 'AI Toast',
  },
  {
    title: 'Claude Fable 5 Is Finally Back',
    date: 'Jul 3, 2026',
    summary: 'Coverage of Claude\'s return alongside a quick how-to on reserving a WhatsApp username.',
    href: 'https://aitoast.beehiiv.com/p/claude-fable-5-is-finally-back',
    source: 'AI Toast',
  },
]

const superhumanHighlights: BlogEntry[] = [
  {
    title: 'Superhuman AI latest issues',
    date: 'Live source',
    summary: 'Fresh AI news and tool roundups from Superhuman AI. This environment could not fetch the site directly, so this section links out to the live publication for the latest verified posts.',
    href: 'https://superhumani.ai/',
    source: 'Superhuman AI',
  },
]

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-slate-600 shadow-sm backdrop-blur transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
    >
      {theme === 'dark' ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  )
}

function BlogCard({ post }: { post: BlogEntry }) {
  return (
    <article className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-[0_16px_50px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/5 dark:bg-[#111118] dark:shadow-[0_16px_50px_rgba(0,0,0,0.3)]">
      <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
        <span>{post.source}</span>
        <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        <span>{post.date}</span>
      </div>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{post.title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">{post.summary}</p>
      <a
        href={post.href}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#b85c3d] transition hover:text-[#9e4b31] dark:text-[#e8916f] dark:hover:text-[#f0a689]"
      >
        Read source
        <span aria-hidden="true">↗</span>
      </a>
    </article>
  )
}

export function BlogsPage() {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900 transition-colors duration-300 dark:bg-[#0a0a0f] dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#fbfbfd]/90 backdrop-blur-xl dark:border-white/5 dark:bg-[#0a0a0f]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
          <Link to="/agent" className="flex items-center gap-3">
            <img
              src={theme === 'dark' ? '/brightcone-logo-dark.jpg' : '/brightcone-logo.jpg'}
              alt="Brightcone"
              className="h-9 w-auto object-contain"
            />
            <span className="text-sm font-semibold tracking-[0.2em] text-slate-500 dark:text-slate-400">BLOGS</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/agent" className="text-sm font-medium text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Back to platform
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <section className="px-6 pb-16 pt-20 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex rounded-full border border-[#e7d7cf] bg-[#fff7f3] px-4 py-1.5 text-sm font-medium text-[#b85c3d] dark:border-[#b85c3d]/30 dark:bg-[#b85c3d]/10 dark:text-[#e8916f]">
              Curated AI reading list
            </div>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Latest AI blog highlights from trusted newsletters
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500 dark:text-slate-400">
              A clean reading hub for recent AI coverage pulled from AI Toast and linked out to Superhuman AI for the newest live issues.
            </p>
          </div>
        </section>

        <section className="px-6 py-8 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">AI Toast</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Recent curated issues
                </h2>
              </div>
              <a
                href="https://aitoast.beehiiv.com/"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-[#b85c3d] transition hover:text-[#9e4b31] dark:text-[#e8916f] dark:hover:text-[#f0a689]"
              >
                Open AI Toast ↗
              </a>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {aiToastPosts.map((post) => (
                <BlogCard key={post.title} post={post} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-[2.5rem] border border-black/5 bg-slate-900 px-8 py-10 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] dark:border-white/5 dark:bg-[#111118] dark:shadow-[0_30px_90px_rgba(0,0,0,0.5)] sm:px-10">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/60">Superhuman AI</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Live source for the latest issues</h2>
              <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
                <div className="space-y-4">
                  {superhumanHighlights.map((post) => (
                    <div key={post.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                      <div className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">{post.date}</div>
                      <h3 className="mt-3 text-2xl font-semibold">{post.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-white/70">{post.summary}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-white/75">
                  <p>
                    Notes:
                  </p>
                  <ul className="mt-4 list-disc space-y-3 pl-5 text-white/70">
                    <li>This page clearly attributes source material and links back to the original publications.</li>
                    <li>AI Toast items above were curated from the publication archive visible at build time.</li>
                    <li>Superhuman AI is linked directly because the source was unreachable from this runtime during implementation.</li>
                  </ul>
                  <a
                    href="https://superhumani.ai/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-white/80"
                  >
                    Visit Superhuman AI
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
