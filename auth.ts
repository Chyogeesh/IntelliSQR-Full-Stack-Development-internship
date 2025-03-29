import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface AuthResponse {
  user: {
    email: string
  }
  token: string
}

interface AuthCredentials {
  email: string
  password: string
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation<AuthResponse, Error, AuthCredentials>({
    mutationFn: async (credentials) => {
      const { data } = await axios.post(`${API_URL}/auth/login`, credentials)
      return data
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      queryClient.setQueryData(['user'], data.user)
    }
  })
}

export const useRegister = () => {
  return useMutation<AuthResponse, Error, AuthCredentials>({
    mutationFn: async (credentials) => {
      const { data } = await axios.post(`${API_URL}/auth/register`, credentials)
      return data
    }
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('token')
    },
    onSuccess: () => {
      queryClient.clear()
    }
  })
}
