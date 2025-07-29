import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qlqgyrfqiflnqknbtycw.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscWd5cmZxaWZsbnFrbmJ0eWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1NzkwNTAsImV4cCI6MjA0NzE1NTA1MH0.xE-ws_IkXJBMV5fwEAZhPFkjHDbN5JrXyj88QmE6kKg'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'enterprise-os'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper functions
export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const getCompany = async (companyId: string) => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single()
  
  if (error) throw error
  return data
}

// Export types
export type { Database }