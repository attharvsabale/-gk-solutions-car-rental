import { create } from 'zustand'
import { authApi } from '@/services/api'
import { mergeGuestFavoritesIntoUser } from '@/services/favoritesService'
import type { RegisterInput } from '@/services/api/types'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  status: 'idle' | 'loading' | 'ready'
  error: string | null
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (data: RegisterInput) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ ok: boolean; error?: string }>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: 'idle',
  error: null,

  async initialize() {
    if (get().status !== 'idle') return
    set({ status: 'loading' })
    const result = await authApi.getCurrentUser()
    set({ user: result.success ? result.data : null, status: 'ready' })
  },

  async login(email, password) {
    const result = await authApi.login({ email, password })
    if (!result.success) {
      set({ error: result.error.message })
      return { ok: false, error: result.error.message }
    }
    mergeGuestFavoritesIntoUser(result.data.id)
    set({ user: result.data, error: null })
    return { ok: true }
  },

  async register(data) {
    const result = await authApi.register(data)
    if (!result.success) {
      set({ error: result.error.message })
      return { ok: false, error: result.error.message }
    }
    mergeGuestFavoritesIntoUser(result.data.id)
    set({ user: result.data, error: null })
    return { ok: true }
  },

  async logout() {
    await authApi.logout()
    set({ user: null })
  },

  async updateProfile(updates) {
    const user = get().user
    if (!user) return { ok: false, error: 'Not signed in.' }
    const result = await authApi.updateProfile(user.id, updates)
    if (!result.success) return { ok: false, error: result.error.message }
    set({ user: result.data })
    return { ok: true }
  },
}))
