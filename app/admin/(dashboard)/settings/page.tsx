"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    siteName: { en: "Company Name", ar: "اسم الشركة" },
    siteDescription: { en: "Your company description", ar: "وصف الشركة" },
    contactEmail: "info@company.com",
    contactPhone: { en: "+1 (123) 456-7890", ar: "" },
    address: { en: "123 Business Street, City, State 12345", ar: "" },
    enableNotifications: true,
    enableRegistration: false,
    maintenanceMode: false,
    theme: "light",
    itemsPerPage: "10",
    currency: "USD",
    timezone: "UTC",
    logo: "",
  } as { [key: string]: any })
  type HomepageSettingsType = {
    [key: string]: any
  }
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettingsType>({
    ourCompany: { en: "", ar: "" },
    ourVision: { en: "", ar: "" },
    ourValues: [
      { title: { en: "", ar: "" }, description: { en: "", ar: "" } },
    ],
    whyChooseUs: { en: "", ar: "" },
    foundersQuote: { en: "", ar: "" },
    ourMissions: { en: "", ar: "" },
    ourStory: { en: "", ar: "" },
    accreditations: { en: "", ar: "" },
    buildSomething: { en: "", ar: "" },
  })

  // Load settings from API
  useEffect(() => {
    async function loadSettings() {
      try {
        setError(null)
        const response = await fetch("/api/admin/settings")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        console.log("Loaded settings:", data)
        setSettings(data)
      } catch (error) {
        console.error("Error loading settings:", error)
        setError(error instanceof Error ? error.message : "Failed to load settings")
        toast({
          title: "Error loading settings",
          description: "Using default settings. Please check your database connection.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [toast])

  // Load homepage settings from API
  useEffect(() => {
    async function loadHomepageSettings() {
      try {
        const response = await fetch("/api/admin/homepage-settings")
        if (response.ok) {
          const data = await response.json()
          setHomepageSettings(data)
        }
      } catch (e) { /* ignore */ }
    }
    loadHomepageSettings()
  }, [])

  const handleChange = (key: string, value: any, lang?: "en" | "ar") => {
    setSettings((prev) => {
      if (["siteName", "siteDescription", "address", "contactPhone"].includes(key) && lang) {
        return {
          ...prev,
          [key]: {
            ...prev[key],
            [lang]: value,
          },
        }
      }
      return {
        ...prev,
        [key]: value,
      }
    })
  }

  const handleHomepageChange = (key: string, value: any, lang?: "en" | "ar") => {
    setHomepageSettings((prev) => {
      if (lang) {
        return {
          ...prev,
          [key]: {
            ...prev[key],
            [lang]: value,
          },
        }
      }
      return {
        ...prev,
        [key]: value,
      }
    })
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      handleChange('logo', data.url)
      toast({
        title: "Logo uploaded",
        description: "Your logo has been uploaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("Submitting settings:", settings)

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      })

      await fetch("/api/admin/homepage-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(homepageSettings),
      })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Failed to update settings",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 px-3 py-1 rounded">Database connection issue</div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic information about your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                {settings.logo && (
                  <div className="relative w-32 h-32">
                    <Image
                      src={settings.logo}
                      alt="Company Logo"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended size: 200x200 pixels. Max file size: 2MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName_en">Site Name (English)</Label>
                <Input
                  id="siteName_en"
                  value={settings.siteName.en}
                  onChange={(e) => handleChange("siteName", e.target.value, "en")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteName_ar">Site Name (Arabic)</Label>
                <Input
                  id="siteName_ar"
                  value={settings.siteName.ar}
                  onChange={(e) => handleChange("siteName", e.target.value, "ar")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteDescription_en">Site Description (English)</Label>
                <Textarea
                  id="siteDescription_en"
                  value={settings.siteDescription.en}
                  onChange={(e) => handleChange("siteDescription", e.target.value, "en")}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription_ar">Site Description (Arabic)</Label>
                <Textarea
                  id="siteDescription_ar"
                  value={settings.siteDescription.ar}
                  onChange={(e) => handleChange("siteDescription", e.target.value, "ar")}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone_en">Contact Phone (English)</Label>
                <Input
                  id="contactPhone_en"
                  value={settings.contactPhone.en}
                  onChange={(e) => handleChange("contactPhone", e.target.value, "en")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone_ar">Contact Phone (Arabic)</Label>
                <Input
                  id="contactPhone_ar"
                  value={settings.contactPhone.ar}
                  onChange={(e) => handleChange("contactPhone", e.target.value, "ar")}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address_en">Address (English)</Label>
                <Input
                  id="address_en"
                  value={settings.address.en}
                  onChange={(e) => handleChange("address", e.target.value, "en")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_ar">Address (Arabic)</Label>
                <Input
                  id="address_ar"
                  value={settings.address.ar}
                  onChange={(e) => handleChange("address", e.target.value, "ar")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Configure system behavior and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email notifications for new messages and orders</p>
              </div>
              <Switch
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => handleChange("enableNotifications", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableRegistration">User Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new users to register on the website</p>
              </div>
              <Switch
                id="enableRegistration"
                checked={settings.enableRegistration}
                onCheckedChange={(checked) => handleChange("enableRegistration", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put the website in maintenance mode</p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Default Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => handleChange("theme", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemsPerPage">Items Per Page</Label>
                <Select value={settings.itemsPerPage} onValueChange={(value) => handleChange("itemsPerPage", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => handleChange("currency", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage security and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Change Password</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input type="password" placeholder="Current password" />
                <Input type="password" placeholder="New password" />
              </div>
              <Button variant="outline" size="sm" type="button">
                Update Password
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              <Button variant="outline" size="sm" type="button">
                Enable 2FA
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Session Management</Label>
              <p className="text-sm text-muted-foreground">Manage active sessions and logout from all devices</p>
              <Button variant="outline" size="sm" type="button">
                Logout All Sessions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}
