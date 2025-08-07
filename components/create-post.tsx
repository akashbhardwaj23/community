
'use client'



import { useState } from 'react'
import { createClient } from "@/lib/supabase/client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Loader2, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CreatePost() {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
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
            } else {
                setContent('')
                router.refresh()
            }
        } catch (err) {
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

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Share an update</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                {profile?.name ? getInitials(profile.name) : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Textarea
                                placeholder="What's on your mind?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0 text-base"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-3 border-t">
                        <Button
                            type="submit"
                            disabled={!content.trim() || loading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Post
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
