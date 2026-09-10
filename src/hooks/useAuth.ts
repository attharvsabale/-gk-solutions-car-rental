import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

export function useAuth() {
  const { user, status, error, login, register, logout, updateProfile, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: status !== 'ready',
    error,
    login,
    register,
    logout,
    updateProfile,
  }
}
