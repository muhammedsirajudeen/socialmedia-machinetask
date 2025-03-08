"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Home, LogOut, MessageSquare, Plus, Search, Settings, Trash2, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreatePostDialog } from "@/components/create-post-dialog"
import { toast } from "sonner"
import { useAppSelector } from "@/store/hooks"
import { useFetch } from "../utils/useFetch"
import { IUser, PopulatedPost } from "../types"
import axiosInstance from "../utils/axios.instance"
import ViewLikes from "@/components/view-likes"
import Pagination from "@/components/pagination-component"
interface Response {
  posts: PopulatedPost[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const user = useAppSelector((state) => state.global.user)
  const { data, isLoading, mutate }: { data: Response | undefined, isLoading: boolean, mutate: () => void } = useFetch('/user/posts')
  const { data: followingPosts, isLoading: followingisLoading, mutate: followingMutate }: { data: Response | undefined, isLoading: boolean, mutate: () => void } = useFetch('/user/posts/following')

  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({})
  const [server, setServer] = useState(true)
  const [likeopen, setLikeopen] = useState(false)
  const [likes, setLikes] = useState<IUser[]>([])
  
  // Search results state
  const [searchResults, setSearchResults] = useState<PopulatedPost[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [followingCurrentPage, setFollowingCurrentPage] = useState(1)
  const [searchCurrentPage, setSearchCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(5)
  
  useEffect(() => {
    setServer(false)
  }, [])
  
  // Reset pagination when tab or content changes
  useEffect(() => {
    if (showSearchResults) {
      setSearchCurrentPage(1)
    } else {
      setCurrentPage(1)
      setFollowingCurrentPage(1)
    }
  }, [showSearchResults])

  const handleLogout = () => {
    toast("Logged out")
    window.localStorage.clear()
    document.cookie=''
    router.push("/")
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery) return toast("Search query cannot be empty")
    
    setIsSearching(true)
    try {
      const result = await axiosInstance.get('/user/posts/search', { params: { search: searchQuery } })
      setSearchResults(result.data.posts)
      setShowSearchResults(true)
      setSearchCurrentPage(1) // Reset to first page when search results change
      const resultsLength = result.data.posts.length
      if (resultsLength > 0) {
        toast(`Found ${resultsLength} result${resultsLength === 1 ? '' : 's'}`)
      } else {
        toast("No results found")
      }
    } catch (error) {
      toast("Error performing search. Please try again.")
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Get current posts for pagination
  const getCurrentPosts = (posts: PopulatedPost[], page: number) => {
    const indexOfLastPost = page * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    return posts.slice(indexOfFirstPost, indexOfLastPost)
  }

  const handleLikePost = async (postId: string) => {
    try {
      const response = await axiosInstance.put(`/user/post/like/${postId}`)
      console.log(response.data)
      mutate()
      followingMutate()
      if (showSearchResults) {
        handleSearch(new Event('submit') as any)
      }
      toast("Post liked")
    } catch (error) {
      toast("Failed to like post")
    }
  }
  
  const handleDislikePost = async (postId: string) => {
    try {
      const response = await axiosInstance.put(`/user/post/dislike/${postId}`)
      console.log(response.data)
      mutate()
      followingMutate()
      if (showSearchResults) {
        handleSearch(new Event('submit') as any)
      }
      toast("Post disliked")
    } catch (error) {
      toast("Failed to dislike post")
    }
  }
  
  const handleCommentChange = (postId: string, text: string) => {
    setCommentTexts((prev) => ({ ...prev, [postId]: text }));
  };

  const handleAddComment = async (postId: string) => {
    if (!commentTexts[postId]) return toast("Comment cannot be empty");
    try {
      await axiosInstance.put(`/user/post/comment/${postId}`, { content: commentTexts[postId] });
      setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
      mutate();
      followingMutate();
      if (showSearchResults) {
        handleSearch(new Event('submit') as any)
      }
      toast("Comment added");
    } catch (error) {
      toast("Failed to add comment");
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await axiosInstance.delete(`/user/post/comment/${postId}/${commentId}`);
      mutate();
      followingMutate();
      if (showSearchResults) {
        handleSearch(new Event('submit') as any)
      }
      toast("Comment deleted");
    } catch (error) {
      toast("Failed to delete comment");
    }
  };
  
  const userprofilenavHandler = (id: string) => {
    router.push(`/dashboard/profile/${id}`)
  }
  
  const viewLikesHandler = (likes: IUser[]) => {
    console.log(likes)
    setLikes(likes)
    setLikeopen(true)
  }

  // Function to render post cards (reused for both regular feed and search results)
  const renderPostCard = (post: PopulatedPost) => (
    <Card key={post.id} className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar onClick={() => userprofilenavHandler(post.authorId.id)} className="cursor-pointer">
          <AvatarImage src={post.authorId.profilePicture} alt={post.authorId.username} />
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
      <Button className="ml-4" size={"sm"} onClick={() => viewLikesHandler(post.likes)}>View likes</Button>
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
      <div className="flex gap-2 w-full p-4">
        <Input
          value={commentTexts[post.id] || ""}
          onChange={(e) => handleCommentChange(post.id, e.target.value)}
          placeholder="Add a comment..."
        />
        <Button onClick={() => handleAddComment(post.id)}>Post</Button>
      </div>
      {post.comments.length > 0 && (
        <div className="p-4 border-t">
          <h3 className="text-sm font-semibold mb-2">Comments</h3>
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <Avatar className="h-6 w-6 cursor-pointer" onClick={() => userprofilenavHandler(comment.authorId.id)}>
                  <AvatarImage src={comment.authorId.profilePicture} alt={comment.authorId.username} />
                  <AvatarFallback>{comment.authorId.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 p-2 rounded-lg w-full">
                  <p className="text-xs font-medium">{comment.authorId.username}</p>
                  <p className="text-sm">{comment.content}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    <button className="flex items-center gap-1">
                      👍 {comment.likeCount}
                    </button>
                    <button className="flex items-center gap-1">
                      👎 {comment.dislikeCount}
                    </button>
                    {comment.authorId.id === (user?.id as string) && (
                      <Trash2 
                        size={15} 
                        onClick={() => handleDeleteComment(post.id, comment.id)} 
                        className="cursor-pointer hover:text-red-500"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <ViewLikes setOpen={setLikeopen} likes={likes} open={likeopen} />
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
            <Button type="submit" size="sm" variant="secondary" disabled={isSearching}>
              {isSearching ? "Searching..." : <Search className="h-4 w-4" />}
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
            {
              !server &&
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profilePicture} alt={user?.username} />
                <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            }
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
            <h1 className="text-2xl font-bold">{showSearchResults ? "Search Results" : "Dashboard"}</h1>
            <div className="flex gap-2">
              {showSearchResults && (
                <Button variant="outline" onClick={() => setShowSearchResults(false)}>
                  Back to Feed
                </Button>
              )}
              <Button onClick={() => setIsCreatePostOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </div>
          </div>
          
          {showSearchResults ? (
            // Search results section
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Results for: "{searchQuery}"</h2>
              {searchResults.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">No posts found matching your search.</p>
                </div>
              ) : (
                <>
                  {getCurrentPosts(searchResults, searchCurrentPage).map(post => renderPostCard(post))}
                  {searchResults.length > postsPerPage && (
                    <Pagination
                      currentPage={searchCurrentPage}
                      totalPages={Math.ceil(searchResults.length / postsPerPage)}
                      onPageChange={setSearchCurrentPage}
                      postsPerPage={postsPerPage}
                      onPostsPerPageChange={setPostsPerPage}
                      totalItems={searchResults.length}
                      showItemsPerPage={true}
                    />
                  )}
                </>
              )}
            </div>
          ) : (
            // Normal feed tabs
            <Tabs defaultValue="feed">
              <TabsList>
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>
              <TabsContent value="feed" className="space-y-4 mt-4">
                {isLoading ? (
                  <div className="p-12 text-center">
                    <p>Loading posts...</p>
                  </div>
                ) : data?.posts.length ? (
                  <>
                    {getCurrentPosts(data.posts, currentPage).map(post => renderPostCard(post))}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(data.posts.length / postsPerPage)}
                      onPageChange={setCurrentPage}
                      postsPerPage={postsPerPage}
                      onPostsPerPageChange={setPostsPerPage}
                      totalItems={data.posts.length}
                      showItemsPerPage={true}
                    />
                  </>
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-muted-foreground">No posts available.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="following" className="space-y-4 mt-4">
                {followingisLoading ? (
                  <div className="p-12 text-center">
                    <p>Loading posts...</p>
                  </div>
                ) : followingPosts?.posts.length ? (
                  <>
                    {getCurrentPosts(followingPosts.posts, followingCurrentPage).map(post => renderPostCard(post))}
                      <Pagination
                        currentPage={followingCurrentPage}
                        totalPages={Math.ceil(followingPosts.posts.length / postsPerPage)}
                        onPageChange={setFollowingCurrentPage}
                        postsPerPage={postsPerPage}
                        onPostsPerPageChange={setPostsPerPage}
                        totalItems={followingPosts.posts.length}
                        showItemsPerPage={true}
                      />
                  </>
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-muted-foreground">No posts available. Follow users to see their posts here.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="trending" className="space-y-4 mt-4">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">Trending posts will appear here.</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
      <CreatePostDialog mutate={mutate} open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
    </div>
  )
}