import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Add debug logging
console.log('Initializing Supabase with:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Simple connection test
supabase
  .from('reservations')
  .select('*')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('Failed to fetch from reservations:', error)
      if (error.code === 'PGRST301') {
        console.log('Table might not exist or you might not have access')
      }
    } else {
      console.log('Successfully connected to reservations table:', {
        hasData: !!data,
        count: data?.length
      })
    }
  })