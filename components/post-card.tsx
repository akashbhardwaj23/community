import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'

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
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {post.profiles?.name ? getInitials(post.profiles.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Link 
              href={`/profile/${post.author_id}`}
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {post.profiles?.name || 'Unknown User'}
            </Link>
            <p className="text-sm text-gray-500">
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </CardContent>
    </Card>
  )
}
