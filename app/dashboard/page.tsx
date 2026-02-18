'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [bookmarks, setBookmarks] = useState<any[]>([])

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/')
      } else {
        setUser(data.user)
        fetchBookmarks()
      }
    }

    checkUser()
  }, [])

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setBookmarks(data)
  }

  const handleAddBookmark = async () => {
    if (!title || !url) return

    await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ])

    setTitle('')
    setUrl('')
    fetchBookmarks()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
    fetchBookmarks()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) return <p className="text-white p-10">Loading...</p>

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#1b1535] to-[#090611] text-gray-200 p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Smart Bookmark App</h1>
          <p className="text-gray-400 text-sm mt-1">Signed in as: <span className="text-white font-medium ml-1">{user?.email}</span></p>
          
          <p className="text-gray-400 text-sm">{bookmarks.length} bookmarks</p>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ADD BOOKMARK SECTION */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-10">

        <h2 className="text-lg mb-4 text-white">Add Bookmark</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-[#1e1b3a] border border-white/10 p-3 rounded-lg focus:outline-none focus:border-purple-500"
          />

          <input
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-[#1e1b3a] border border-white/10 p-3 rounded-lg focus:outline-none focus:border-purple-500"
          />

          <button
            onClick={handleAddBookmark}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 px-6 py-3 rounded-lg font-medium"
          >
            Add
          </button>
        </div>
      </div>

      {/* BOOKMARK GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-purple-500 transition-all"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              {b.title}
            </h3>

            <p className="text-gray-400 text-sm mb-4 truncate">
              {b.url}
            </p>

            <div className="flex justify-between items-center">
              <a
                href={b.url}
                target="_blank"
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                Visit →
              </a>

              <button
                onClick={() => handleDelete(b.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {bookmarks.length === 0 && (
          <div className="text-gray-500 text-center col-span-full">
            No bookmarks yet.
          </div>
        )}

      </div>
    </main>
  )
}