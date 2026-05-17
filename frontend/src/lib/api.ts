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

export type EmailPayload = {
  to: string
  subject: string
  html: string
}

export type EmailResult = {
  id: string
  message: string
}

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`
}

function parseErrorDetail(detail: unknown): string {
  if (Array.isArray(detail)) {
    return detail
      .map((e: unknown) => {
        if (typeof e === 'object' && e !== null && 'msg' in e) {
          return String((e as { msg: unknown }).msg)
        }
        return JSON.stringify(e)
      })
      .join(', ')
  }
  if (typeof detail === 'string') return detail
  return 'Request failed'
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
    throw new Error(parseErrorDetail(data.detail))
  }

  return response.json() as Promise<T>
}

export async function getJson<T>(path: string, token?: string): Promise<T> {
  const response = await fetch(apiUrl(path), {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new Error('Session expired. Please log in again.')
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(parseErrorDetail(data.detail))
  }

  return response.json() as Promise<T>
}

export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  return postJson<EmailResult>('/email/send', payload)
}

export type EmailLog = {
  id: number
  resend_id: string
  to_email: string
  subject: string
  body: string
  status: 'sent' | 'failed'
  sent_at: string
}

export async function getEmailLogs(token: string): Promise<EmailLog[]> {
  return getJson<EmailLog[]>('/email/logs', token)
}

export type OutreachReport = {
  total_sent: number
  total_failed: number
  unique_recipients: number
  logs: EmailLog[]
}

export async function getOutreachReport(token: string): Promise<OutreachReport> {
  return getJson<OutreachReport>('/email/report', token)
}

export type Lead = {
  id: number
  user_id: number
  name: string
  email: string
  company: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed'
  value: number
  created_at: string
}

export type LeadCreate = {
  name: string
  email: string
  company?: string
  value?: number
}

export type LeadUpdate = {
  status?: string
  name?: string
  email?: string
  company?: string
  value?: number
}

export async function getLeads(token: string): Promise<Lead[]> {
  return getJson<Lead[]>('/leads', token)
}

export async function createLead(payload: LeadCreate, token: string): Promise<Lead> {
  return postJson<Lead>('/leads', payload, token)
}

export async function updateLead(id: number, payload: LeadUpdate, token: string): Promise<Lead> {
  const response = await fetch(apiUrl(`/leads/${id}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(parseErrorDetail(data.detail))
  }
  return response.json()
}

export async function deleteLead(id: number, token: string): Promise<void> {
  const response = await fetch(apiUrl(`/leads/${id}`), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(parseErrorDetail(data.detail))
  }
}

export async function sendEmailAuth(payload: EmailPayload, token: string): Promise<EmailResult> {
  return postJson<EmailResult>('/email/send', payload, token)
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
    throw new Error(parseErrorDetail(data.detail))
  }

  return response.json() as Promise<T>
}


// ── Status Reports ────────────────────────────────────────────────────────────
export type StatusReportCreate = {
  submitter_name: string
  submitter_email: string
  department: string
  period: string
  period_label: string
  accomplishments: string
  blockers?: string
  next_steps?: string
  overall_status: 'on-track' | 'at-risk' | 'blocked'
}

export type StatusReportOut = {
  id: number
  submitter_name: string
  submitter_email: string
  department: string
  period: string
  period_label: string
  accomplishments: string
  blockers?: string
  next_steps?: string
  overall_status: 'on-track' | 'at-risk' | 'blocked'
  created_at: string
}

export type StatusReportSummary = {
  period: string
  period_label: string
  total: number
  on_track: number
  at_risk: number
  blocked: number
  departments: string[]
  reports: StatusReportOut[]
}

export async function submitStatusReport(payload: StatusReportCreate): Promise<StatusReportOut> {
  return postJson<StatusReportOut>('/status-reports', payload)
}

export async function getStatusReports(period?: string): Promise<StatusReportOut[]> {
  const qs = period ? `?period=${encodeURIComponent(period)}` : ''
  return getJson<StatusReportOut[]>(`/status-reports${qs}`)
}

export async function getStatusPeriods(): Promise<string[]> {
  return getJson<string[]>('/status-reports/periods')
}

export async function getStatusSummary(period: string): Promise<StatusReportSummary> {
  return getJson<StatusReportSummary>(`/status-reports/summary/${encodeURIComponent(period)}`)
}

export async function deleteStatusReport(id: number): Promise<void> {
  const response = await fetch(apiUrl(`/status-reports/${id}`), { method: 'DELETE' })
  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(parseErrorDetail(data.detail))
  }
}
