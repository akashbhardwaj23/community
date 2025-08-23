
'use client'

import { useState } from 'react'
import { createClient } from "@/lib/supabase/client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AlertCircle, Calendar, Globe, Image, Loader2, Send, Smile, Users, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from './ui/alert'
import { cn } from '@/lib/utils'

export function CreatePost() {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [isExpanded, setIsExpanded] = useState(false)
    const [visibility, setVisibility] = useState<'public' | 'connections'>('public')
    const supabase = createClient()
    const router = useRouter()

    useState(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setUser(session.user)

                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                setProfile(profileData)
            }
        }

        getUser()
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || !user) return

        setLoading(true)
        setError('')

        try {
            const { error } = await supabase
                .from('posts')
                .insert([
                    {
                        content: content.trim(),
                        author_id: user.id,
                    },
                ])

            if (error) {
                console.error('Error creating post:', error)
                setError('Failed to create post. Please try again.')
            } else {
                setContent('')
                router.refresh()
            }
        } catch (err) {
            setError('An unexpected error occurred.')
            console.error('Unexpected error:', err)
        } finally {
            setLoading(false)
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

    const handleTextareaFocus = () => {
        setIsExpanded(true)
    }

    const handleCancel = () => {
        setContent('')
        setIsExpanded(false)
        setError('')
    }

    return (
        <Card className="shadow-xl border-0 rounded-[10px]">
            <CardContent className="p-0">
                {error && (
                    <div className="p-4 pb-0">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="flex space-x-3">
                        <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                                {profile?.name ? getInitials(profile.name) : user?.email?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-3">
                            <div className="relative">
                                <Textarea
                                    placeholder={"What's on your mind?"}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onFocus={handleTextareaFocus}
                                    className={cn(
                                        "min-h-[60px] resize-none border-0 p-4 text-base placeholder:text-neutral-500 focus-visible:ring-0 bg-neutral-100 rounded-xl transition-all duration-200",
                                        isExpanded && "min-h-[120px] bg-white border border-neutrall-200 shadow-sm"
                                    )}
                                    disabled={loading}
                                    maxLength={2000}
                                />

                                {isExpanded && (
                                    <div className="absolute bottom-3 right-3 text-xs text-neutral-400 bg-white px-2 py-1 rounded-full">
                                        {content.length}/2000
                                    </div>
                                )}
                            </div>

                            {isExpanded && (
                                <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                                    <div className="flex items-center space-x-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full px-3 py-2"
                                            disabled
                                        >
                                            <Image className="h-4 w-4 mr-2" />
                                            Photo
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full px-3 py-2"
                                            disabled
                                        >
                                            <Video className="h-4 w-4 mr-2" />
                                            Video
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full px-3 py-2"
                                            disabled
                                        >
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Event
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-full px-3 py-2"
                                            disabled
                                        >
                                            <Smile className="h-4 w-4 mr-2" />
                                            Feeling
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setVisibility(visibility === 'public' ? 'connections' : 'public')}
                                                className="text-gray-600 hover:bg-gray-100 rounded-full px-3 py-2 text-sm"
                                            >
                                                {visibility === 'public' ? (
                                                    <>
                                                        <Globe className="h-4 w-4 mr-2" />
                                                        Anyone
                                                    </>
                                                ) : (
                                                    <>
                                                        <Users className="h-4 w-4 mr-2" />
                                                        Connections
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleCancel}
                                                disabled={loading}
                                                className="text-gray-600 hover:bg-gray-100 rounded-full px-4 py-2"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={!content.trim() || loading}
                                                className={cn(
                                                    "bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 font-medium transition-all duration-200 shadow-sm",
                                                    (!content.trim() || loading) && "opacity-50 cursor-not-allowed",
                                                    content.trim() && !loading && "hover:shadow-md hover:scale-105"
                                                )}
                                            >
                                                {loading ? (
                                                  <div className='flex justify-center items-center'>
                                                     <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                                        Posting...
                                                  </div>
                                                ) : (
                                                       <div className='flex justify-center items-center'>
                                                         <Send className="mr-1 h-4 w-4" />
                                                        Post
                                                       </div>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!isExpanded && content.length === 0 && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full px-3 py-1.5 text-sm"
                                            onClick={handleTextareaFocus}
                                        >
                                            <Image className="h-4 w-4 mr-1" />
                                            Photo
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full px-3 py-1.5 text-sm"
                                            onClick={handleTextareaFocus}
                                        >
                                            <Video className="h-4 w-4 mr-1" />
                                            Video
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full px-3 py-1.5 text-sm"
                                            onClick={handleTextareaFocus}
                                        >
                                            <Calendar className="h-4 w-4 mr-1" />
                                            Event
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>

            </CardContent>
        </Card>
    )
}
