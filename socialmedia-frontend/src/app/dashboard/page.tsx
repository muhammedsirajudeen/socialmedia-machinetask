"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Home, LogOut, MessageSquare, Plus, Search, Settings, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreatePostDialog } from "@/components/create-post-dialog"
import {toast} from "sonner"
import { useAppSelector } from "@/store/hooks"
import { useFetch } from "../utils/useFetch"
import { PopulatedPost } from "../types"
import axiosInstance from "../utils/axios.instance"
import { mutate } from "swr"
interface Response{
  posts:PopulatedPost[]
}
export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const user=useAppSelector((state)=>state.global.user)
  const {data,isLoading,mutate}:{data:Response|undefined,isLoading:boolean,mutate:()=>void}=useFetch('/user/posts')


  const handleLogout = () => {
    // In a real app, this would call an API to logout
    toast( "Logged out")
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would filter posts or call an API
    toast("Search results")
  }

  const handleLikePost = async  (postId: string) => {
    // In a real app, this would call an API to like/unlike a post
    const response=await axiosInstance.put(`/user/post/like/${postId}`)
    console.log(response.data)
    mutate()
    toast("Post liked")
  }
  const handleDislikePost=async (postId:string)=>{
    const response=await axiosInstance.put(`/user/post/dislike/${postId}`)
    console.log(response.data)
    mutate()
    toast("post disliked")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <MessageSquare className="h-6 w-6" />
            <span>SocialHub</span>
          </div>
          <form onSubmit={handleSearch} className="hidden md:flex w-full max-w-sm items-center space-x-2 mx-4">
            <Input
              type="search"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm" variant="secondary">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profilePicture} alt={user?.username} />
              <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-6">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <nav className="flex flex-col space-y-2">
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        </aside>
        <main className="flex w-full flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button onClick={() => setIsCreatePostOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </div>
          <Tabs defaultValue="feed">
            <TabsList>
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>
            <TabsContent value="feed" className="space-y-4 mt-4">
            {isLoading ? (
  <p>Loading posts...</p>
) : data?.posts.length ? (
  data.posts.map((post) => (
    <Card key={post.id}>
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarFallback>{post.authorId.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <p className="text-sm font-medium leading-none">@{post.authorId.username}</p>
          <p className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p>{post.content}</p>
        {post.media?.map((mediaItem, index) => (
          <div key={index} className="mt-2">
            {mediaItem.type === "image" ? (
              <img src={mediaItem.url} alt="Post media" className="w-96 h-96 rounded-lg" />
            ) : (
              <video controls className="w-full rounded-lg">
                <source src={mediaItem.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={post.likes.length ? "text-primary" : ""}
            onClick={() => handleLikePost(post.id)}
          >
            👍 {post.likes.length}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={post.dislikes.length ? "text-red-500" : ""}
            onClick={() => handleDislikePost(post.id)}
          >
            👎 {post.dislikeCount}
          </Button>
          <Button variant="ghost" size="sm">
            💬 {post.comments.length}
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          Share
        </Button>
      </CardFooter>
      {post.comments.length > 0 && (
        <div className="p-4 border-t">
          <h3 className="text-sm font-semibold mb-2">Comments</h3>
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{comment.authorId.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 p-2 rounded-lg w-full">
                  <p className="text-xs" >{comment.authorId.username}</p>
                  <p className="text-sm">{comment.content}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    <button className="flex items-center gap-1" >
                      👍 {comment.likeCount}
                    </button>
                    <button className="flex items-center gap-1" >
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
  ))
) : (
  <p>No posts available.</p>
)}

            </TabsContent>
            <TabsContent value="following" className="space-y-4 mt-4">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">Follow more users to see their posts here.</p>
              </div>
            </TabsContent>
            <TabsContent value="trending" className="space-y-4 mt-4">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">Trending posts will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <CreatePostDialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
    </div>
  )
}

