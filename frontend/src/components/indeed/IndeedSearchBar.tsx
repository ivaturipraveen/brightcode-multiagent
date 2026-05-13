/** ALEX 🎨 — Search bar for Indeed portal */
interface Filters {
  q: string
  location: string
  job_type: string
  category: string
}

interface Props {
  filters: Filters
  onSearch: (f: Filters) => void
}

const JOB_TYPES = ['', 'Full-Time', 'Part-Time', 'Contract', 'Remote', 'Internship']
const CATEGORIES = ['', 'Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'Operations', 'HR', 'Product', 'Data']

export function IndeedSearchBar({ filters, onSearch }: Props) {
  const update = (key: keyof Filters, value: string) => {
    const next = { ...filters, [key]: value }
    onSearch(next)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-wrap gap-3 items-center max-w-4xl mx-auto">
      {/* Keyword */}
      <div className="flex-1 min-w-[180px] flex items-center gap-2 border-r border-gray-200 pr-3">
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="#6B7280" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Job title, company, or keyword"
          value={filters.q}
          onChange={e => update('q', e.target.value)}
          className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
          style={{ color: '#0A1F44' }}
        />
      </div>

      {/* Location */}
      <div className="flex-1 min-w-[140px] flex items-center gap-2 border-r border-gray-200 pr-3">
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="#6B7280" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          type="text"
          placeholder="City or remote"
          value={filters.location}
          onChange={e => update('location', e.target.value)}
          className="w-full outline-none text-sm placeholder-gray-400"
          style={{ color: '#0A1F44' }}
        />
      </div>

      {/* Job Type */}
      <select
        value={filters.job_type}
        onChange={e => update('job_type', e.target.value)}
        className="text-sm outline-none border-r border-gray-200 pr-3 cursor-pointer"
        style={{ color: filters.job_type ? '#0A1F44' : '#9CA3AF' }}
      >
        {JOB_TYPES.map(t => (
          <option key={t} value={t}>{t || 'Job Type'}</option>
        ))}
      </select>

      {/* Category */}
      <select
        value={filters.category}
        onChange={e => update('category', e.target.value)}
        className="text-sm outline-none cursor-pointer"
        style={{ color: filters.category ? '#0A1F44' : '#9CA3AF' }}
      >
        {CATEGORIES.map(c => (
          <option key={c} value={c}>{c || 'Category'}</option>
        ))}
      </select>

      {/* Search button */}
      <button
        onClick={() => onSearch(filters)}
        style={{ background: '#F5821F' }}
        className="px-6 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition"
      >
        Search
      </button>
    </div>
  )
}
