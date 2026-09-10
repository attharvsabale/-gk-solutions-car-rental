import { delay } from '@/lib/delay'
import { generateId } from '@/lib/id'
import { storageKeys, storageService } from '@/lib/storageService'
import type { MockCredential, User } from '@/types/user'
import type { ApiResult } from '@/types/common'
import type { AuthApi } from './types'

/**
 * MOCK AUTHENTICATION ONLY. Credentials are stored in plain text in
 * localStorage purely to simulate a signed-in session in a backend-less
 * prototype. This is NOT secure and must never be treated as a real auth
 * system — a production backend needs hashed passwords, server sessions
 * or JWTs, and HTTPS-only cookie storage.
 */

function getUsers(): User[] {
  return storageService.get<User[]>(storageKeys.users, [])
}

function getCredentials(): MockCredential[] {
  return storageService.get<MockCredential[]>(storageKeys.credentials, [])
}

function saveSession(userId: string | null): void {
  storageService.set(storageKeys.session, userId)
}

function error(code: string, message: string): ApiResult<never> {
  return { success: false, error: { code, message } }
}

export const mockAuthApi: AuthApi = {
  async login({ email, password }) {
    await delay()
    const credentials = getCredentials()
    const credential = credentials.find((c) => c.email.toLowerCase() === email.toLowerCase())
    if (!credential || credential.password !== password) {
      return error('INVALID_CREDENTIALS', 'Incorrect email or password.')
    }
    const user = getUsers().find((u) => u.id === credential.userId)
    if (!user) return error('USER_NOT_FOUND', 'Account no longer exists.')
    saveSession(user.id)
    return { success: true, data: user }
  },

  async register(data) {
    await delay()
    const credentials = getCredentials()
    if (credentials.some((c) => c.email.toLowerCase() === data.email.toLowerCase())) {
      return error('EMAIL_TAKEN', 'An account with this email already exists.')
    }

    const users = getUsers()
    const newUser: User = {
      id: generateId('user'),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    storageService.set(storageKeys.users, users)

    credentials.push({ userId: newUser.id, email: data.email, password: data.password })
    storageService.set(storageKeys.credentials, credentials)

    saveSession(newUser.id)
    return { success: true, data: newUser }
  },

  async getCurrentUser() {
    await delay(120)
    const userId = storageService.get<string | null>(storageKeys.session, null)
    if (!userId) return { success: true, data: null }
    const user = getUsers().find((u) => u.id === userId) ?? null
    return { success: true, data: user }
  },

  async logout() {
    await delay(120)
    saveSession(null)
    return { success: true, data: null }
  },

  async updateProfile(userId, updates) {
    await delay()
    const users = getUsers()
    const index = users.findIndex((u) => u.id === userId)
    if (index === -1) return error('USER_NOT_FOUND', 'Account no longer exists.')
    const updated = { ...users[index], ...updates, id: userId }
    users[index] = updated
    storageService.set(storageKeys.users, users)
    return { success: true, data: updated }
  },
}
