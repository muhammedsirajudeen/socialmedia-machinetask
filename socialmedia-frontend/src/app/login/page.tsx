"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, MessageSquare, Worm } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import axiosInstance from "../utils/axios.instance"
import { useAppDispatch } from "@/store/hooks"
import { login } from "@/store/user.slice"
import { useEffect, useState } from "react"

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
    const [isVerifying, setIsVerifying] = useState(true)
  
  const dispatch=useAppDispatch()
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
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response=await axiosInstance.post('/auth/signin',data)
      console.log(response.data)
      dispatch(login(response.data.user))
      toast("Login successful!")
      localStorage.setItem('accessToken',response.data.accessToken)
      router.push("/dashboard")
    } catch (error) {
      toast("Login failed")
    }
  }
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
          <CardTitle className="text-2xl font-bold">Log in</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input {...field} id="email" placeholder="john@example.com" />
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
                    <Label htmlFor="password">Password</Label>
                    <FormControl>
                      <Input {...field} id="password" type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Logging in..." : "Log in"}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/register" className="underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
