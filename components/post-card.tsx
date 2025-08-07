import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { Button } from './ui/button'
import { Globe, Heart, MessageCircle, MoreHorizontal, Repeat2, Send } from 'lucide-react'

interface PostCardProps {
  post: {
    id: string
    content: string
    created_at: string
    author_id: string
    profiles: {
      name: string
      bio: string | null
    } | null
  }
}

export function PostCard({ post }: PostCardProps) {
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
      <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-white">
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
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {post.profiles?.name || 'Unknown User'}
                </Link>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {formatDate(post.created_at)}
                </span>
              </div>
              {post.profiles?.bio && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {post.profiles.bio}
                </p>
              )}
              <div className="flex items-center space-x-1 mt-1">
                <Globe className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">Public</span>
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
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost" 
              size="sm" 
              className="text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full px-3 py-2 transition-all duration-200"
            >
              <Heart className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Like</span>
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
