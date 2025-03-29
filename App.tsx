import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthForm } from './components/AuthForm'
import { useLogin, useRegister } from './services/auth'
import { Dashboard } from './pages/Dashboard'
import { Layout } from './components/Layout'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const { mutate: login, error: loginError, isPending: isLoginPending } = useLogin()
  const { mutate: register, error: registerError, isPending: isRegisterPending } = useRegister()

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      const token = localStorage.getItem('token')
      if (!token) return null
      // In a real app, you would verify the token or fetch user data
      return { email: 'user@example.com' }
    }
  })

  const handleAuthSubmit = (values: { email: string; password: string }) => {
    if (isLogin) {
      login(values)
    } else {
      register(values)
    }
  }

  if (user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{isLogin ? 'Sign in to your account' : 'Create an account'}</h1>
        </div>
        
        <AuthForm
          isLogin={isLogin}
          onSubmit={handleAuthSubmit}
          isLoading={isLogin ? isLoginPending : isRegisterPending}
          error={isLogin ? loginError?.message : registerError?.message}
        />
        
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
