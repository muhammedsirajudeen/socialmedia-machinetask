"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, MessageSquare, ThumbsUp, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import axiosInstance from "@/app/utils/axios.instance"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useFetch } from "@/app/utils/useFetch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { IUser, PopulatedPost } from "@/app/types"
import { login } from "@/store/user.slice"

interface PostResponse {
    data: {
        posts: PopulatedPost[]
    } | undefined,
    isLoading: boolean
    mutate: () => void
}

interface UserResponse {
    data: { user: IUser } | undefined
    isLoading: boolean
    mutate: () => void
}

interface CommentTexts {
    [postId: string]: string
}

export default function SeeProfile() {
    const { id } = useParams() as { id: string }
    const router = useRouter()
    const currentUserId = useAppSelector((state) => state.global.user)
    const { data, isLoading, mutate }: UserResponse = useFetch(`/user/profile/${id}`)
    const { data: postsData, isLoading: postLoading, mutate: postMutate }: PostResponse = useFetch(`/user/posts/${id}`)
    const [isFollowing, setIsFollowing] = useState(false)
    const [commentTexts, setCommentTexts] = useState<CommentTexts>({})
    const dispatch=useAppDispatch()
    useEffect(()=>{
      async function userFetcher(){
        try {
          const response=await axiosInstance.get('/auth/verify')
            console.log(response.data.user)
            dispatch(login(response.data.user))          
        } catch (error) {
          console.log('error',error)
        }
      }
      userFetcher()
    },[])
    // Check if the current user is following this profile
    useEffect(() => {
        if (data?.user) {
            console.log(data.user.followers,currentUserId?.id)
            if (data.user.followers.includes(currentUserId?.id!)) {
                setIsFollowing(true)
            }
        }
    }, [data])

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await axiosInstance.put(`/user/unfollow/${id}`)
                toast.success("Unfollowed successfully")
                setIsFollowing(false)
            } else {
                await axiosInstance.put(`/user/follow/${id}`)
                toast.success("Followed successfully")
                setIsFollowing(true)
            }
            mutate()
        } catch (error) {
            toast.error(isFollowing ? "Failed to unfollow" : "Failed to follow")
        }
    }

    const handleLikePost = async (postId: string) => {
        try {
            await axiosInstance.put(`/user/post/like/${postId}`)
            postMutate()
            toast.success("Post liked")
        } catch (error) {
            toast.error("Failed to like post")
        }
    }

    const handleCommentChange = (postId: string, text: string) => {
        setCommentTexts((prev) => ({ ...prev, [postId]: text }))
    }

    const handleAddComment = async (postId: string) => {
        if (!commentTexts[postId]) {
            return toast.error("Comment cannot be empty")
        }

        try {
            await axiosInstance.put(`/user/post/comment/${postId}`, { content: commentTexts[postId] })
            setCommentTexts((prev) => ({ ...prev, [postId]: "" }))
            postMutate()
            toast.success("Comment added")
        } catch (error) {
            toast.error("Failed to add comment")
        }
    }

    const handleDeleteComment = async (postId: string, commentId: string) => {
        try {
            await axiosInstance.delete(`/user/post/comment/${postId}/${commentId}`)
            postMutate()
            toast.success("Comment deleted")
        } catch (error) {
            toast.error("Failed to delete comment")
        }
    }

    const renderLoadingState = () => (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
    )

    if (isLoading) return renderLoadingState()
    if (!data?.user) return <div className="container py-6"><p className="text-center text-lg text-red-500">User not found</p></div>

    return (
        <div className="container py-6 max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Dashboard</span>
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">User Profile</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_2fr] mb-8">
                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Profile Information</CardTitle>
                        {currentUserId?.id !== id && (
                            <Button
                                variant={isFollowing ? "outline" : "default"}
                                onClick={handleFollow}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-28 w-28 border-2 border-primary/10">
                                <AvatarImage src={data.user.profilePicture} alt={data.user.username} />
                                <AvatarFallback className="text-xl bg-primary/10">{data.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h2 className="text-xl font-semibold">@{data.user.username}</h2>
                                <p className="text-sm text-muted-foreground">Member since {new Date(data.user.createdAt || Date.now()).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p>{data.user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Bio</p>
                                <p className="whitespace-pre-wrap">{data.user.bio || "No bio provided."}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div>
                    <Tabs defaultValue="posts" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="posts">Posts</TabsTrigger>
                            <TabsTrigger value="stats">Activity</TabsTrigger>
                        </TabsList>
                        <TabsContent value="posts">
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle>{data.user.username}'s Activity</CardTitle>
                                    <CardDescription>
                                        Has {postsData?.posts.length || 0} posts and {postsData?.posts.reduce((acc, post) => acc + post.comments.length, 0) || 0} comments
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4 text-center">
                                    <div className="rounded-lg bg-primary/10 p-4">
                                        <p className="text-3xl font-bold">{postsData?.posts.length || 0}</p>
                                        <p className="text-sm text-muted-foreground">Posts</p>
                                    </div>
                                    <div className="rounded-lg bg-primary/10 p-4">
                                        <p className="text-3xl font-bold">{postsData?.posts.reduce((acc, post) => acc + post.likeCount, 0) || 0}</p>
                                        <p className="text-sm text-muted-foreground">Total Likes</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="stats">
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle>User Statistics</CardTitle>
                                    <CardDescription>Activity details and engagement metrics</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-3 gap-4 text-center">
                                    <div className="rounded-lg bg-primary/10 p-4">
                                        <p className="text-3xl font-bold">{postsData?.posts.length || 0}</p>
                                        <p className="text-sm text-muted-foreground">Posts</p>
                                    </div>
                                    <div className="rounded-lg bg-primary/10 p-4">
                                        <p className="text-3xl font-bold">{postsData?.posts.reduce((acc, post) => acc + post.comments.length, 0) || 0}</p>
                                        <p className="text-sm text-muted-foreground">Comments</p>
                                    </div>
                                    <div className="rounded-lg bg-primary/10 p-4">
                                        <p className="text-3xl font-bold">{postsData?.posts.reduce((acc, post) => acc + post.likeCount, 0) || 0}</p>
                                        <p className="text-sm text-muted-foreground">Likes</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold">{data.user.username}'s Posts</h2>

                {postLoading ? (
                    renderLoadingState()
                ) : postsData?.posts.length ? (
                    <div className="space-y-4">
                        {postsData.posts.map((post) => (
                            <Card key={post.id} className="shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2">
                                    <Avatar>
                                        <AvatarImage src={post.authorId.profilePicture} alt={post.authorId.username} />
                                        <AvatarFallback>{post.authorId.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1 flex-1">
                                        <div className="flex items-center justify-between w-full">
                                            <div>
                                                <p className="text-sm font-medium leading-none">@{post.authorId.username}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-2">
                                    <p className="whitespace-pre-wrap">{post.content}</p>
                                    {post?.media?.length! > 0 && (
                                        <div className="mt-4 grid gap-2 grid-cols-1 md:grid-cols-2">
                                            {post?.media?.map((mediaItem, index) => (
                                                <div key={index} className="overflow-hidden rounded-lg border">
                                                    {mediaItem.type === "image" ? (
                                                        <img
                                                            src={mediaItem.url}
                                                            alt="Post media"
                                                            className="w-full h-64 object-cover transition-all hover:scale-105"
                                                        />
                                                    ) : (
                                                        <video controls className="w-full h-64 object-cover">
                                                            <source src={mediaItem.url} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex flex-col gap-4">
                                    <div className="flex items-center gap-4 w-full">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={post.likes.includes(currentUserId?.id || '') ? "text-primary" : ""}
                                            onClick={() => handleLikePost(post.id)}
                                        >
                                            <ThumbsUp className="h-4 w-4 mr-1" />
                                            <span>{post.likeCount}</span>
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="h-4 w-4" />
                                            <span className="text-sm">{post.comments.length}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full">
                                        <Input
                                            value={commentTexts[post.id] || ""}
                                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                            placeholder="Add a comment..."
                                        />
                                        <Button onClick={() => handleAddComment(post.id)}>Post</Button>
                                    </div>
                                </CardFooter>
                                {post.comments.length > 0 && (
                                    <div className="p-4 border-t bg-muted/30">
                                        <h3 className="text-sm font-semibold mb-2">Comments</h3>
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                            {post.comments.map((comment) => (
                                                <div key={comment.id} className="flex gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={comment.authorId.profilePicture} alt={comment.authorId.username} />
                                                        <AvatarFallback>{comment.authorId.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="bg-background p-2 rounded-lg w-full shadow-sm">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs font-medium">@{comment.authorId.username}</p>
                                                            <p className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p>
                                                        </div>
                                                        <p className="text-sm mt-1">{comment.content}</p>
                                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                            <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                                                👍 {comment.likeCount}
                                                            </button>
                                                            <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                                                👎 {comment.dislikeCount}
                                                            </button>
                                                            {comment.authorId.id === currentUserId?.id && (
                                                                <button
                                                                    className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
                                                                    onClick={() => handleDeleteComment(post.id, comment.id)}
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 text-center">
                        <p className="text-muted-foreground mb-4">{data.user.username} hasn't created any posts yet.</p>
                    </Card>
                )}
            </div>
        </div>
    )
}