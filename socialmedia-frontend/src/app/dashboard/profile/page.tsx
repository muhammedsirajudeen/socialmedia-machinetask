"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Edit2, Save, Trash2, MoreHorizontal, MessageSquare, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import axiosInstance from "@/app/utils/axios.instance"
import { useAppSelector } from "@/store/hooks"
import { useFetch } from "@/app/utils/useFetch"
import { IUser, PopulatedPost } from "@/app/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { set } from "zod"
import FollowInfoDialog from "@/components/follow-info-dialog"

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

export default function ProfilePage() {
  const userId = useAppSelector((state) => state.global.user?.id)
  const { data, isLoading, mutate }: UserResponse = useFetch(`/user/profile/${userId}`)
  const { data: postData, isLoading: isPostsLoading, mutate: mutatePostData }: PostResponse = useFetch(`/user/posts/${userId}`)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<IUser | undefined>(data?.user)
  console.log(data)
  // Post editing states
  const [isEditingPost, setIsEditingPost] = useState<string | null>(null)
  const [editedPostContent, setEditedPostContent] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [following,setFollowing]=useState<IUser[]>([])
  const [followers,setFollowers]=useState<IUser[]>([])
  const [followinfoDialog,setFollowInfoDialog]=useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (data?.user) {
      setEditedUser(data.user)
    }
  }, [data])

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedUser((prev) => prev && { ...prev, [name]: value })
  }

  const handleSaveProfile = async () => {
    if (!editedUser) return
    const emailRegex=new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    if(!emailRegex.test(editedUser.email)){
      toast("email must be valid")
      return
    }
    if(editedUser.bio?.length!<10){
      toast('bio cannot be less that 10')
      return
    }
    if(editedUser.username.length<5){
      toast('usernmae cannot be less that 5 chars')
      return
    }
    try {
      await axiosInstance.put(`/user/profile/${userId}`, editedUser)
      toast.success("Profile updated successfully")
      setIsEditing(false)
      mutate()
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  const handleEditPost = (post: PopulatedPost) => {
    setIsEditingPost(post.id)
    setEditedPostContent(post.content)
  }

  const handleSavePost = async (postId: string) => {
    try {
      await axiosInstance.put(`/user/post/${postId}`, { content: editedPostContent })
      toast.success("Post updated successfully")
      setIsEditingPost(null)
      mutatePostData()
    } catch (error) {
      toast.error("Failed to update post")
    }
  }

  const confirmDeletePost = (postId: string) => {
    setPostToDelete(postId)
    setDeleteDialogOpen(true)
  }

  const handleDeletePost = async () => {
    if (!postToDelete) return

    try {
      await axiosInstance.delete(`/user/post/${postToDelete}`)
      toast.success("Post deleted successfully")
      mutatePostData()
    } catch (error) {
      toast.error("Failed to delete post")
    } finally {
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    }
  }

  const viewFollowing=async (followers:Array<IUser>,following:Array<IUser>)=>{
    console.log(followers,following)
    setFollowInfoDialog(true)
    setFollowers(followers)
    setFollowing(following)
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
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      <FollowInfoDialog setOpen={setFollowInfoDialog} open={followinfoDialog} followers={followers} following={following} />
      <div className="grid gap-6 md:grid-cols-[1fr_2fr] mb-8">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            <Button 
              variant={isEditing ? "default" : "ghost"} 
              size="icon" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              <span className="sr-only">{isEditing ? "Save" : "Edit"} Profile</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-28 w-28 border-2 border-primary/10">
                <AvatarImage src={data.user.profilePicture} alt={data.user.username} />
                <AvatarFallback className="text-xl bg-primary/10">{data.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {isEditing ? (
                <Button variant="outline" size="sm">Change Avatar</Button>
              ) : (
                <div className="text-center">
                  <h2 className="text-xl font-semibold">@{data.user.username}</h2>
                  <p className="text-sm text-muted-foreground">Member since {new Date(data.user.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
              )}
              <Button onClick={()=>viewFollowing(data.user.followers,data.user.following)} size={"sm"} >view following</Button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" value={editedUser?.username || ""} onChange={handleEditChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={editedUser?.email || ""} onChange={handleEditChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" value={editedUser?.bio || ""} onChange={handleEditChange} className="min-h-[100px]" />
                </div>
                <Button onClick={handleSaveProfile} className="w-full mt-4">Save Changes</Button>
              </div>
            ) : (
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
            )}
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
                  <CardTitle>Your Activity</CardTitle>
                  <CardDescription>
                    You have {postData?.posts.length || 0} posts and {postData?.posts.reduce((acc, post) => acc + post.comments.length, 0) || 0} comments
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-lg bg-primary/10 p-4">
                    <p className="text-3xl font-bold">{postData?.posts.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-4">
                    <p className="text-3xl font-bold">{postData?.posts.reduce((acc, post) => acc + post.likeCount, 0) || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Likes</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="stats">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                  <CardDescription>Your activity details and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-lg bg-primary/10 p-4">
                    <p className="text-3xl font-bold">{postData?.posts.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-4">
                    <p className="text-3xl font-bold">{postData?.posts.reduce((acc, post) => acc + post.comments.length, 0) || 0}</p>
                    <p className="text-sm text-muted-foreground">Comments</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-4">
                    <p className="text-3xl font-bold">{postData?.posts.reduce((acc, post) => acc + post.likeCount, 0) || 0}</p>
                    <p className="text-sm text-muted-foreground">Likes</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Posts</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/create-post">Create New Post</Link>
          </Button>
        </div>

        {isPostsLoading ? (
          renderLoadingState()
        ) : postData?.posts.length ? (
          <div className="space-y-4">
            {postData?.posts.map((post) => (
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Post menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPost(post)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => confirmDeletePost(post.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  {isEditingPost === post.id ? (
                    <div className="space-y-3">
                      <Textarea 
                        value={editedPostContent} 
                        onChange={(e) => setEditedPostContent(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsEditingPost(null)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleSavePost(post.id)}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{post.content}</p>
                  )}
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
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">{post.likeCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm">{post.comments.length}</span>
                    </div>
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
            <p className="text-muted-foreground mb-4">You haven't created any posts yet.</p>
            <Button asChild>
              <Link href="/create-post">Create Your First Post</Link>
            </Button>
          </Card>
        )}
      </div>

      {/* Delete Post Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}