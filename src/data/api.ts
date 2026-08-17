export type Media = {
  id: string
  kind: 'image' | 'video'
  name: string
  mime: string
  category: string
  alt: string
  width?: number | null
  height?: number | null
  duration?: number | null
  projectId?: string | null
  mediaUrl: string
  posterUrl?: string | null
  variants?: Record<string, string>
}

export type ApiProject = {
  id: string
  slug: string
  title: string
  category: string
  subtitle: string
  description: string
  tags: string[]
  details: string[]
  link?: string | null
  cover?: Media | null
}

export async function api<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, { credentials: 'same-origin', ...options })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Pedido falhou.')
  return data
}

export async function getPublicMedia() {
  return api<{ media: Media[] }>('/api/public/media')
}

export async function getPublicProjects() {
  return api<{ projects: ApiProject[] }>('/api/public/projects')
}
