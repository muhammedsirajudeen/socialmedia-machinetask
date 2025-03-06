"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import axiosInstance from "@/app/utils/axios.instance"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// 🔹 Zod Schema Validation
const postSchema = z.object({
  content: z.string().max(500, "Content must be less than 500 characters").optional(),
  image: z
    .instanceof(File)
    .refine((file) => file?.type.startsWith("image/"), { message: "Only image files are allowed!" })
    .optional(),
})

// 🔹 TypeScript Interface
type PostFormValues = z.infer<typeof postSchema>

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mutate:()=>void
}

export function CreatePostDialog({ open, onOpenChange,mutate }: CreatePostDialogProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      image: undefined,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (file: File | undefined) => void) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast("Only image files are allowed!")
        return
      }
      fieldChange(file)
      setPreview(URL.createObjectURL(file)) // Create preview
    }
  }

  const handleSubmit = async (data: PostFormValues) => {
    if (!data.content?.trim() && !data.image) {
      toast("Please add content or an image")
      return
    }

    setIsLoading(true)

    try {
      let mediaUrl = null
      if (data.image) {
        const formData = new FormData()
        formData.set("images", data.image)

        const uploadResponse = await axiosInstance.post("/user/uploads", formData)
        mediaUrl = uploadResponse.data.media
      }

      // Send post request
      await axiosInstance.post("/user/post", {
        content: data.content,
        media: mediaUrl,
      })

      toast("Post created successfully!")

      // Reset form
      form.reset()
      setPreview(null)
      mutate()
      onOpenChange(false)
    } catch (error) {
      toast("Error creating post")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Create Post</DialogTitle>
              <DialogDescription>Share your thoughts and an image.</DialogDescription>
            </DialogHeader>

            {/* Content Input */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What's on your mind?" {...field} className="min-h-[120px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, onChange)}
                      className="file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:border-gray-300 file:bg-gray-100 file:text-gray-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Preview */}
            {preview && <img src={preview} alt="Preview" className="w-full h-auto rounded-lg mt-2" />}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Posting..." : "Post"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
