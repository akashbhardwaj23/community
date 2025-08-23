import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/post-card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Database, AlertCircle } from 'lucide-react'


export async function PostFeed() {
    const supabase = await createClient()
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
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading posts. Please check your database setup.
          </AlertDescription>
        </Alert>
      )
    }

    if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Database className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">No posts yet</p>
          <p className="text-gray-400">Be the first to share something!</p>
        </div>
      )
    }

    const { data: likedPostsData, error: likedPostsError } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', currentUserId)

    const likedPostIds = new Set(likedPostsData?.map(like => like.post_id));

    if (likedPostsError) {
      console.error('Error fetching liked posts status:', likedPostsError);
    }

    return (
      <div className="space-y-4">
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