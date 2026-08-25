import { beforeAll, describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../lib/theme'
import { TodoPage } from '../pages/TodoPage'

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

describe('TodoPage', () => {
  it('renders the route and lets users add, bulk-complete, filter, and clear todo items', async () => {
    window.localStorage.clear()

    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <MemoryRouter>
          <TodoPage />
        </MemoryRouter>
      </ThemeProvider>,
    )

    expect(screen.getByRole('heading', { name: /todo app that stays out of your way/i })).toBeTruthy()
    expect(screen.getByText(/built as a standalone route at/i)).toBeTruthy()
    expect(screen.getByText(/1 active/i)).toBeTruthy()

    await user.type(screen.getByLabelText(/add a task/i), 'Write the deployment note')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByText(/write the deployment note/i)).toBeTruthy()
    expect(screen.getByText(/2 active/i)).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /mark all complete/i }))
    expect(screen.getByText(/0 active/i)).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Active' }))
    expect(screen.getByText(/nothing here yet. add a task or switch filters./i)).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'All' }))

    await user.click(screen.getByRole('button', { name: /mark ship one small win before lunch as active/i }))
    expect(screen.getByText(/1 active/i)).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Completed' }))
    expect(screen.getByText(/write the deployment note/i)).toBeTruthy()
    expect(screen.queryByText(/ship one small win before lunch/i)).toBeNull()

    await user.click(screen.getByRole('button', { name: 'All' }))
    await user.click(screen.getByRole('button', { name: /mark sketch today's top priorities as active/i }))
    await user.click(screen.getByRole('button', { name: /clear completed/i }))

    expect(screen.getByText(/sketch today's top priorities/i)).toBeTruthy()
    expect(screen.queryByText(/write the deployment note/i)).toBeNull()
  })
})
