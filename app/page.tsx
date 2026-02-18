'use client'

import { supabase } from "@/lib/supabase"

export default function Home() {
  const handleLogin = async () => {
    try {
      console.log("Button clicked");
      const redirectTo = `${window.location.origin}/auth/callback`
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/dashboard'
        }
      })
      if (error) {
        console.error('signInWithOAuth error:', error)
        alert('Login failed: ' + error.message)
      } else {
        console.log('Login started, redirecting to provider...', data)
      }
    } catch (err) {
      console.error('Unexpected error during sign-in:', err)
      alert('Unexpected error during sign-in. Check console.')
    }
  }

return (
  <main style ={{padding: 40}}>
    <h1>Welcome to Smart Bookmark App</h1>
    <button onClick={handleLogin} style={{padding: 10, backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer'}}>
      Sign in with Google
    </button> 
  </main>
)
}

