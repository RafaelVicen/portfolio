export type AdminPhotoCategory = 'EcoAngola' | 'Formações' | 'Hackathons' | 'Eventos' | 'Projetos' | 'Outras'

export type AdminPhoto = {
  id: string
  name: string
  category: AdminPhotoCategory
  mime: 'image/jpeg' | 'image/png' | 'image/webp'
  size: number
  width: number
  height: number
  createdAt: string
  dataUrl: string
}

const DB_NAME = 'rq-admin-gallery'
const STORE_NAME = 'photos'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function listAdminPhotos(): Promise<AdminPhoto[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll()
    request.onsuccess = () => resolve((request.result as AdminPhoto[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
    request.onerror = () => reject(request.error)
  })
}

export async function saveAdminPhoto(photo: AdminPhoto): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(photo)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function deleteAdminPhoto(id: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function clearAdminPhotos(): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).clear()
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
