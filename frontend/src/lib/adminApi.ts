import { apiUrl } from './api'

const ADMIN_TOKEN_KEY = 'admin_token'

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

export interface AdminUser {
  name: string
  email: string
  access_token: string
}

export async function adminLogin(email: string, password: string): Promise<AdminUser> {
  const res = await fetch(apiUrl('/admin/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({ detail: 'Login failed' }))
    throw new Error(data.detail || 'Login failed')
  }
  return res.json()
}

export async function fetchAllContent(): Promise<Record<string, string>> {
  const res = await fetch(apiUrl('/content'))
  if (!res.ok) throw new Error('Failed to load content')
  return res.json()
}

export async function updateContentText(key: string, value: string, token: string): Promise<void> {
  const res = await fetch(apiUrl(`/content/${key}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ value }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({ detail: 'Update failed' }))
    throw new Error(data.detail || 'Update failed')
  }
}

export async function uploadContentImage(key: string, file: File, token: string): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(apiUrl(`/content/upload-image?key=${encodeURIComponent(key)}`), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({ detail: 'Upload failed' }))
    throw new Error(data.detail || 'Upload failed')
  }
  const json = await res.json()
  return json.value as string
}
