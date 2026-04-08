import { test, expect } from '@playwright/test'

test.describe('Brightcone public and access-control flows', () => {
  test('homepage renders core hero and primary links', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Build agent products teams actually use.')).toBeVisible()
    await expect(page.getByText('Enterprise AI agents, designed with restraint')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Pricing' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'About' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign in' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Get started' }).first()).toBeVisible()
  })

  test('about page renders mission and team content', async ({ page }) => {
    await page.goto('/about')
    await expect(page.getByText('Built for teams who take')).toBeVisible()
    await expect(page.getByText('Our Mission')).toBeVisible()
    await expect(page.getByText('The people building Brightcone.')).toBeVisible()
  })

  test('pricing page renders all pricing tiers', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText('Simple pricing for teams building with AI agents.')).toBeVisible()
    await expect(page.getByText('Starter')).toBeVisible()
    await expect(page.getByText('Pro')).toBeVisible()
    await expect(page.getByText('Enterprise')).toBeVisible()
  })

  test('unauthenticated chat redirects to login', async ({ page }) => {
    await page.goto('/chat')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByText('Welcome back')).toBeVisible()
  })

  test('unauthenticated crm redirects to login', async ({ page }) => {
    await page.goto('/crm')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByText('Welcome back')).toBeVisible()
  })

  test('unauthenticated report redirects to login', async ({ page }) => {
    await page.goto('/report')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByText('Welcome back')).toBeVisible()
  })

  test('hr login page renders top-level tabs', async ({ page }) => {
    await page.goto('/hr')
    await expect(page.getByText('HR Portal')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Register Company' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Register Employee' })).toBeVisible()
  })

  test('unauthenticated hr dashboard redirects to hr login', async ({ page }) => {
    await page.goto('/hr/dashboard')
    await expect(page).toHaveURL(/\/hr$/)
    await expect(page.getByText('HR Portal')).toBeVisible()
  })
})
