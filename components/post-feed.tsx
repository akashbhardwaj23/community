import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { PostCard } from '@/components/post-card'
import { Database } from 'lucide-react';

export async function PostFeed() {
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
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return <div>Error loading posts</div>
  }

  if (!posts || posts.length === 0) {
    return (
     <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <Database className="h-8 w-8 text-neutral-400" />
          </div>
          <p className="text-neutral-500 text-lg mb-2">No posts yet</p>
          <p className="text-neutral-400">Be the first to share something!</p>
        </div>
    )
  }

  return (
     <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
  )
}
