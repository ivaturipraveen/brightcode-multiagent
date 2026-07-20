import { beforeAll, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../lib/theme'
import { BlogsPage } from '../pages/BlogsPage'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
})

describe('BlogsPage', () => {
  it('renders the blogs hub with AI Toast content and Superhuman AI attribution', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <BlogsPage />
        </MemoryRouter>
      </ThemeProvider>,
    )

    expect(screen.getByRole('heading', { name: /latest ai blog highlights from trusted newsletters/i })).toBeTruthy()
    expect(screen.getByText(/recent curated issues/i)).toBeTruthy()
    expect(screen.getByText(/claude for teachers just launched/i)).toBeTruthy()
    expect(screen.getByText(/chatgpt work just launched/i)).toBeTruthy()
    expect(screen.getByRole('heading', { name: /live source for the latest issues/i })).toBeTruthy()
    expect(screen.getByText(/visit superhuman ai/i)).toBeTruthy()
    expect(screen.getByText(/this page clearly attributes source material/i)).toBeTruthy()
  })
})
