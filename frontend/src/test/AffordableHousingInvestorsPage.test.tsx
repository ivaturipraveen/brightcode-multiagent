import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { AffordableHousingInvestorsPage } from '../pages/AffordableHousingInvestorsPage'

describe('AffordableHousingInvestorsPage', () => {
  it('renders the institutional investment thesis and roadmap', () => {
    render(
      <MemoryRouter>
        <AffordableHousingInvestorsPage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/make affordable housing/i)).toBeTruthy()
    expect(screen.getByText(/investible at institutional scale/i)).toBeTruthy()
    expect(screen.getByText(/why institutional money still hesitates/i)).toBeTruthy()
    expect(screen.getByText(/a practical path from subsidy dependence to institutional scale/i)).toBeTruthy()
    expect(screen.getByText(/need is not enough\. investability is designed\./i)).toBeTruthy()
  })
})
