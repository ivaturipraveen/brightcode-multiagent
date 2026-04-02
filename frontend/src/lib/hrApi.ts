import { API_BASE_URL } from './api'

export function hrApiUrl(path: string) {
  return `${API_BASE_URL}${path}`
}

export async function hrPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(hrApiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({ detail: 'Request failed' }))
  if (!res.ok) throw new Error(data.detail || 'Request failed')
  return data as T
}

export async function hrGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(hrApiUrl(path), {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  })
  if (res.status === 401) { localStorage.removeItem('hr_token'); window.location.href = '/hr'; throw new Error('Session expired') }
  const data = await res.json().catch(() => ({ detail: 'Request failed' }))
  if (!res.ok) throw new Error(data.detail || 'Request failed')
  return data as T
}

export async function hrPatch<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(hrApiUrl(path), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({ detail: 'Request failed' }))
  if (!res.ok) throw new Error(data.detail || 'Request failed')
  return data as T
}

export async function hrDelete<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(hrApiUrl(path), {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  })
  const data = await res.json().catch(() => ({ detail: 'Request failed' }))
  if (!res.ok) throw new Error(data.detail || 'Request failed')
  return data as T
}

// Auth helpers
export function getHRToken() { return localStorage.getItem('hr_token') ?? '' }
export function getHRRole() { return localStorage.getItem('hr_role') ?? '' }
export function getHRName() { return localStorage.getItem('hr_name') ?? '' }
export function getHRCompanyId() { return localStorage.getItem('hr_company_id') ?? '' }
export function setHRSession(token: string, role: string, name: string, company_id: number | null) {
  localStorage.setItem('hr_token', token)
  localStorage.setItem('hr_role', role)
  localStorage.setItem('hr_name', name)
  localStorage.setItem('hr_company_id', company_id ? String(company_id) : '')
}
export function clearHRSession() {
  localStorage.removeItem('hr_token')
  localStorage.removeItem('hr_role')
  localStorage.removeItem('hr_name')
  localStorage.removeItem('hr_company_id')
}
