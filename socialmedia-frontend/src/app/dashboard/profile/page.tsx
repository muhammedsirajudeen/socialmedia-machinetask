"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Edit2, Save } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/components/ui/use-toast"
import {toast} from "sonner"
export default function ProfilePage() {

  // Mock user data
  const [user, setUser] = useState({
    id: "1",
    username: "johndoe",
    email: "john@example.com",
    bio: "Software developer passionate about web technologies and design.",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    avatar: "/placeholder-user.jpg",
  })

  // Mock posts data
  const posts = [
    {
      id: "1",
      content: "Working on a new project using Next.js and Tailwind CSS. Loving the developer experience so far!",
      timestamp: "3 days ago",
      likes: 15,
      comments: 3,
    },
    {
      id: "2",
      content: "Just finished reading 'Atomic Habits'. Highly recommend it to anyone looking to build better habits!",
      timestamp: "1 week ago",
      likes: 32,
      comments: 7,
    },
  ]

  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user profile
    setUser(editedUser)
    setIsEditing(false)

  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              <span className="sr-only">{isEditing ? "Save" : "Edit"} Profile</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {isEditing ? (
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
              ) : (
                <h2 className="text-xl font-semibold">@{user.username}</h2>
              )}
            </div>


            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" value={editedUser.username} onChange={handleEditChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={editedUser.email} onChange={handleEditChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" value={editedUser.bio} onChange={handleEditChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={editedUser.location} onChange={handleEditChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" value={editedUser.website} onChange={handleEditChange} />
                </div>
                <Button onClick={handleSaveProfile} className="w-full">
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                  <p>{user.bio}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <p>{user.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {user.website}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="posts">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="space-y-4 mt-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">@{user.username}</span>
                      <span className="text-xs text-muted-foreground">• {post.timestamp}</span>
                    </div>
                    <p className="mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>👍 {post.likes} likes</span>
                      <span>💬 {post.comments} comments</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="likes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardDescription>Posts you've liked will appear here.</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
            <TabsContent value="comments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardDescription>Your comments will appear here.</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

