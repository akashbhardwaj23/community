import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/post-card'

interface UserPostsProps {
  userId: string
}

export async function UserPosts({ userId }: UserPostsProps) {

    const supabase = await createClient();
     const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;

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




     const { data: likedPostsData, error: likedPostsError } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', currentUserId)

    const likedPostIds = new Set(likedPostsData?.map(like => like.post_id));

    if (likedPostsError) {
      console.error('Error fetching liked posts status:', likedPostsError);
    }

  if (error) {
    console.error('Error fetching user posts:', error)
    return <div>Error loading posts</div>
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Posts</h2>
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet.</p>
          </div>
        </div>
    )
  }

  return (
   <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-900">Posts</h2>
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            initialIsLiked={currentUserId ? likedPostIds.has(post.id) : false}
          />
        ))}
      </div>
  )
}
