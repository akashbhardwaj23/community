import { createClient } from "@/lib/supabase/server"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PostFeed } from '@/components/post-feed'
import { CreatePost } from '@/components/create-post'
import { Header } from '@/components/headers'

export default async function HomePage() {
  const supabase = await createClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <CreatePost />
          <PostFeed />
        </div>
      </main>
    </div>
  )
}
