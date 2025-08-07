import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { PostCard } from '@/components/post-card'

interface UserPostsProps {
  userId: string
}

export async function UserPosts({ userId }: UserPostsProps) {

    const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        name,
        bio
      )
    `)
    .eq('author_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user posts:', error)
    return <div>Error loading posts</div>
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No posts yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Posts</h2>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
