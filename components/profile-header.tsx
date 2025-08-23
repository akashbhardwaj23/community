'use client'


import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Edit, Mail } from 'lucide-react'

interface ProfileHeaderProps {
  profile: {
    id: string
    name: string
    email: string
    bio: string | null
  }
  isOwnProfile: boolean
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
     <Card className="shadow-lg hover:shadow-xl border-none rounded-[10px]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <div className="flex items-center space-x-2 text-gray-600 mt-1">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              {profile.bio && (
                <p className="text-gray-700 mt-2 max-w-md">{profile.bio}</p>
              )}
            </div>
          </div>
          
          {isOwnProfile && (
            <Button asChild variant="outline">
              <Link href="/profile/edit">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
