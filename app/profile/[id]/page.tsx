import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Header } from '@/components/headers'
import { ProfileHeader } from '@/components/profile-header'
import { UserPosts } from '@/components/user-post'

interface ProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProfilePage({ params } : ProfilePageProps) {

    const supabase = await createClient()
    const id = (await params).id
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }



  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !profile) {
    notFound()
  }

  const isOwnProfile = session.user.id === id

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />

          <UserPosts userId={id} />
        </div>
      </main>
    </div>
  )
}
