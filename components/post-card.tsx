'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Repeat2, Send, MoreHorizontal, Globe, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: {
    id: string
    content: string
    created_at: string
    author_id: string
    likes_count: number
    profiles: {
      name: string
      bio: string | null
    } | null
  }
  initialIsLiked: boolean;
}

export function PostCard({ post, initialIsLiked }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [isLoadingLike, setIsLoadingLike] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }
    getUser()
  }, [supabase])

  const handleLike = async () => {
    if (!user || isLoadingLike) return

    setIsLoadingLike(true)

    try {
      if (isLiked) {
        // Unlike the post
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id)

        if (!error) {
          setIsLiked(false)
          setLikesCount(prev => Math.max(0, prev - 1))
        } else {
          console.error('Error unliking post:', error);
        }
      } else {
        // Like the post
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: post.id,
            user_id: user.id
          })

        if (!error) {
          setIsLiked(true)
          setLikesCount(prev => prev + 1)
        } else {
          console.error('Error liking post:', error);
        }
      }
    } catch (error) {
      console.error('An unexpected error occurred toggling like:', error)
    } finally {
      setIsLoadingLike(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Recently'
    }
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-200 border-0 p-0 px-4 py-8 rounded-[10px]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 ring-2 ring-gray-100">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                {post.profiles?.name ? getInitials(post.profiles.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Link 
                  href={`/profile/${post.author_id}`}
                  className="font-semibold text-neutral-900 mt-2 hover:text-blue-600 transition-colors"
                >
                  {post.profiles?.name || 'Unknown User'}
                </Link>
                <span className="text-neutral-400 mt-2">•</span>
                <span className="text-sm text-neutral-600 mt-2">
                  {formatDate(post.created_at)}
                </span>
              </div>
               <div className="flex items-center space-x-2">
              {post.profiles?.bio && (
                <p className="text-sm text-neutral-600 line-clamp-1">
                  {post.profiles.bio}
                </p>
              )}
              <div className='flex justify-center items-center mt-1 space-x-1'>
                <Globe className="h-3 w-3 text-neutral-400" />
                <span className="text-xs text-neutral-500">Public</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 rounded-full p-2">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-[15px]">
          {post.content}
        </div>
        

{/* 
        {likesCount > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 pb-2">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">❤</span>
              </div>
              <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
            </div>
          </div>
        )} */}
    
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              disabled={!user || isLoadingLike}
              className={cn(
                "transition-all duration-200 rounded-full px-3 py-2 group",
                isLiked 
                  ? "text-red-600 hover:text-red-700 hover:bg-red-50 bg-red-50/50" 
                  : "text-gray-600 hover:text-red-600 hover:bg-red-50",
              )}
            >
              {isLoadingLike ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Heart 
                  className={cn(
                    "h-4 w-4 mr-2 transition-all duration-200",
                    isLiked ? "fill-red-600 stroke-red-600 scale-110" : "stroke-gray-600 group-hover:stroke-red-600 group-hover:scale-110"
                  )} 
                />
              )}
              <span className="text-sm font-medium">
                {likesCount > 0 ? `${likesCount}` : 'Like'}
              </span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full px-3 py-2 transition-all duration-200"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Comment</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full px-3 py-2 transition-all duration-200"
            >
              <Repeat2 className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Repost</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full px-3 py-2 transition-all duration-200"
            >
              <Send className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Send</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
