"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MessageSquare, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { registerSchema } from "@muhammedsirajudeenpersonal/shared"
import axiosInstance from "../utils/axios.instance"
import { useAppDispatch } from "@/store/hooks"
import { login } from "@/store/user.slice"

export default function RegisterPage() {
  const [isVerifying, setIsVerifying] = useState(true)
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    async function verifyLoginStatus() {
      try {
        const response = await axiosInstance.get('/auth/verify')
        if (response.data.user) {
          router.push('/dashboard')
          // window.location.href = '/dashboard'
        }
      } catch (error) {
        console.error("Verification error:", error)
      }
        // } finally {
      //   setIsVerifying(false)
      // }
      setTimeout(()=>{
        setIsVerifying(false)
      },1000)
    }
    
    verifyLoginStatus()
  }, [router])

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      const response = await axiosInstance.post('auth/signup', data)
      console.log(response.data)
      toast("Account created!")
      router.push("/login")
      // dispatch(login(response.data.user))
    } catch (error) {
      toast("Registration failed")
    }
  }

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking login status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Link href="/" className="absolute left-4 top-4 flex items-center gap-2 font-bold md:left-8 md:top-8">
        <MessageSquare className="h-6 w-6" />
        <span>SocialHub</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your information to create your account</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <Label>Username</Label>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Email</Label>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Password</Label>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating account..." : "Create account"}
              </Button>
              <div className="text-center text-sm">
                Already have an account? {" "}
                <Link href="/login" className="underline">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}