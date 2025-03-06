import Link from "next/link"
import { ArrowRight, CheckCircle, MessageSquare, Search, ThumbsUp, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <MessageSquare className="h-6 w-6" />
            <span>SocialHub</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Connect, Share, Engage
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join our community and experience a new way to connect with friends, share your thoughts, and engage
                    with content that matters to you.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[450px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-sm space-y-4 p-4">
                      <div className="flex items-center gap-4 rounded-lg bg-background p-4 shadow-sm">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Connect with friends</p>
                          <p className="text-xs text-muted-foreground">Build your network</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 rounded-lg bg-background p-4 shadow-sm">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Share your thoughts</p>
                          <p className="text-xs text-muted-foreground">Express yourself</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 rounded-lg bg-background p-4 shadow-sm">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <ThumbsUp className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Engage with content</p>
                          <p className="text-xs text-muted-foreground">Like and comment</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides all the tools you need to connect, share, and engage with your community.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>User Profiles</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Create and customize your profile to showcase your interests and connect with like-minded
                    individuals.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Posts & Comments</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Share your thoughts through posts and engage with others through comments and reactions.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Search</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Find posts, users, and content that interests you with our powerful search functionality.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Don't just take our word for it. Here's what our community has to say about SocialHub.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-muted/50">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20"></div>
                      <div>
                        <CardTitle className="text-base">User {i}</CardTitle>
                        <CardDescription>@user{i}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      "SocialHub has completely transformed how I connect with friends and share my experiences. The
                      platform is intuitive and engaging!"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pricing</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that's right for you and start connecting today.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">$0</span> / month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {["Basic profile", "Post creation", "Limited engagement"].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-primary">
                <CardHeader>
                  <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground mb-2">
                    Popular
                  </div>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">$9.99</span> / month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Enhanced profile",
                      "Unlimited posts",
                      "Full engagement features",
                      "Advanced analytics",
                      "Priority support",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">$29.99</span> / month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {[
                      "All Pro features",
                      "Custom branding",
                      "API access",
                      "Dedicated account manager",
                      "24/7 support",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Get Started?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our community today and start connecting with like-minded individuals.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="gap-1.5">
                    Sign Up Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2 font-bold">
            <MessageSquare className="h-6 w-6" />
            <span>SocialHub</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} SocialHub. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

