export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000'

export type AuthResponse = {
  access_token: string
  token_type: string
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

export async function postJson<T>(path: string, body: unknown, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
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
  const response = await fetch(`${API_BASE_URL}${path}`, {
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
