import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://hrlqwcjrpeoqwkrhufhu.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybHF3Y2pycGVvcXdrcmh1Zmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NzAyMjYsImV4cCI6MjA3MzI0NjIyNn0.DQIqkfMs3zxkbNm4xLGDpr8sQG7ZobsASjjhSBvwJzU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  email: string
  full_name: string
  major: string
  skills: string[]
  avatar_url?: string
  created_at: string
}

export type Project = {
  id: string
  title: string
  description: string
  required_skills: string[]
  looking_for_skills: string[]
  author_id: string
  created_at: string
  updated_at: string
  author?: Profile
  interested_users?: string[]
}