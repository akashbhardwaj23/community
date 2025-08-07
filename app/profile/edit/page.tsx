import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/headers'
import { EditProfileForm } from '@/components/edit-profile'

export default async function EditProfilePage() {
    const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }



  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="rounded-[10px] shadow-xl p-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">Edit Profile</h1>
          <EditProfileForm profile={profile} />
        </div>
      </main>
    </div>
  )
}
