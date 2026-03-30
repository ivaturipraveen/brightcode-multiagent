const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined

export const API_BASE_URL = rawApiBaseUrl && rawApiBaseUrl.trim().length > 0 ? rawApiBaseUrl : ''

export type AuthResponse = {
  access_token: string
  token_type: string
  name?: string
  email?: string
  avatar_url?: string
  bio?: string
}

export type Conversation = {
  id: number
  title: string
  created_at?: string | null
  updated_at?: string | null
}

export type ChatMessage = {
  id?: number
  role: 'user' | 'assistant'
  content: string
  created_at?: string | null
}

export type UserProfile = {
  name: string
  email: string
  avatar_url: string
  bio: string
}

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`
}

export async function postJson<T>(path: string, body: unknown, token?: string): Promise<T> {
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(data.detail ?? 'Request failed')
  }

  return response.json() as Promise<T>
}

export async function getJson<T>(path: string, token?: string): Promise<T> {
  const response = await fetch(apiUrl(path), {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(data.detail ?? 'Request failed')
  }

  return response.json() as Promise<T>
}

export async function putJson<T>(path: string, body: unknown, token?: string): Promise<T> {
  const response = await fetch(apiUrl(path), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(data.detail ?? 'Request failed')
  }

  return response.json() as Promise<T>
}
