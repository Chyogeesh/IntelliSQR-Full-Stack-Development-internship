import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/Form'

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type AuthFormValues = z.infer<typeof authSchema>

interface AuthFormProps {
  isLogin?: boolean
  onSubmit: (values: AuthFormValues) => void
  isLoading?: boolean
  error?: string | null
}

export const AuthForm = ({ isLogin = true, onSubmit, isLoading, error }: AuthFormProps) => {
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  )
}
