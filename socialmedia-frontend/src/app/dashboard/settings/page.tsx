"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import {toast} from "sonner"
export default function SettingsPage() {

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    theme: "system",
    privacy: "public",
  })

  const handleToggleChange = (field: string) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }))
  }

  const handleRadioChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveSettings = () => {
    // In a real app, this would call an API to save the settings
    toast("Event has been created.")

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
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggleChange("emailNotifications")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications on your device.</p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggleChange("pushNotifications")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the appearance of the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={settings.theme}
              onValueChange={(value:unknown) => handleRadioChange("theme", value as string)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system">System</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Manage your privacy settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={settings.privacy}
              onValueChange={(value) => handleRadioChange("privacy", value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="privacy-public" />
                <Label htmlFor="privacy-public">Public</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="followers" id="privacy-followers" />
                <Label htmlFor="privacy-followers">Followers Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="privacy-private" />
                <Label htmlFor="privacy-private">Private</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  )
}

