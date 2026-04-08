import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from './HomePage'
import { ThemeProvider } from '../lib/theme'

function renderHomePage() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  it('renders hero content, features, and primary navigation links', () => {
    renderHomePage()

    expect(screen.getByText('Build agent products teams actually use.')).toBeInTheDocument()
    expect(screen.getByText('Enterprise AI agents, designed with restraint')).toBeInTheDocument()

    expect(screen.getAllByRole('link', { name: 'Pricing' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'About' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Sign in' }).every((link) => link.getAttribute('href') === '/login')).toBe(true)
    expect(screen.getAllByRole('link', { name: 'Get started' })[0]).toHaveAttribute('href', '/register')

    expect(screen.getByText('Agent orchestration')).toBeInTheDocument()
    expect(screen.getByText('Enterprise control')).toBeInTheDocument()
    expect(screen.getByText('Modern deployment')).toBeInTheDocument()
  })

  it('renders enterprise use cases and CTA links', () => {
    renderHomePage()

    expect(screen.getByText('Customer support copilots with persistent memory')).toBeInTheDocument()
    expect(screen.getByText('Internal research and ops assistants for enterprise teams')).toBeInTheDocument()
    expect(screen.getByText('Multi-agent product workflows with human review in the loop')).toBeInTheDocument()

    expect(screen.getAllByRole('link', { name: 'View pricing' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: 'Create account' })).toHaveAttribute('href', '/register')
  })

  it('toggles dark mode and persists the preference', async () => {
    const user = userEvent.setup()
    renderHomePage()

    const toggle = screen.getByRole('button', { name: 'Toggle dark mode' })
    expect(localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    await user.click(toggle)

    expect(localStorage.getItem('theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
