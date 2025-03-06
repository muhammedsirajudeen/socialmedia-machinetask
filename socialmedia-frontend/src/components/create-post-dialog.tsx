"use client"

import type React from "react"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {toast} from "sonner"
interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast("Error")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to create a post
      // const response = await fetch('/api/posts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast("Post created")

      setContent("")
      onOpenChange(false)
    } catch (error) {
      toast("Error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <DialogDescription>Share your thoughts with your followers.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

