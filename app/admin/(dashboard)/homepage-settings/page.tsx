"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function AdminHomepageSettingsPage() {
  const { toast } = useToast()
  type HomepageSettingsType = {
    [key: string]: any
  }
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    async function loadHomepageSettings() {
      try {
        const response = await fetch("/api/admin/homepage-settings")
        if (response.ok) {
          const data = await response.json()
          setHomepageSettings(data)
        }
      } catch (e) { /* ignore */ }
      setIsLoading(false)
    }
    loadHomepageSettings()
  }, [])

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await fetch("/api/admin/homepage-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(homepageSettings),
      })
      toast({
        title: "Homepage settings updated",
        description: "Your homepage settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to update homepage settings",
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
        <h1 className="text-3xl font-bold">Home Page Settings</h1>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading homepage settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Home Page Settings</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Home Page Settings</CardTitle>
            <CardDescription>Descriptions for home page sections (EN/AR)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "ourCompany", label: "Our Company" },
              { key: "ourVision", label: "Our Vision" },
              { key: "ourValues", label: "Our Values" },
              { key: "whyChooseUs", label: "Why Choose Us" },
              { key: "foundersQuote", label: "Founders Quote" },
              { key: "ourMissions", label: "Our Missions" },
              { key: "ourStory", label: "Our Story" },
              { key: "accreditations", label: "Accreditations & Partnerships" },
              { key: "buildSomething", label: "Let's Build Something That Lasts" },
            ].map(({ key, label }) => (
              key === "ourValues" ? (
                <div key={key} className="space-y-4">
                  <Label>{label}</Label>
                  {(homepageSettings.ourValues ?? []).map((val: any, idx: number) => (
                    <div key={idx} className="border rounded p-2 md:p-4 mb-2 space-y-2 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                        <div className="space-y-2">
                          <Label>Title (English)</Label>
                          <Input
                            value={val.title.en}
                            onChange={e => {
                              const newValues = [...homepageSettings.ourValues]
                              newValues[idx].title.en = e.target.value
                              setHomepageSettings((prev: any) => ({ ...prev, ourValues: newValues }))
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title (Arabic)</Label>
                          <Input
                            value={val.title.ar}
                            onChange={e => {
                              const newValues = [...homepageSettings.ourValues]
                              newValues[idx].title.ar = e.target.value
                              setHomepageSettings((prev: any) => ({ ...prev, ourValues: newValues }))
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                        <div className="space-y-2">
                          <Label>Description (English)</Label>
                          <Textarea
                            value={val.description.en}
                            onChange={e => {
                              const newValues = [...homepageSettings.ourValues]
                              newValues[idx].description.en = e.target.value
                              setHomepageSettings((prev: any) => ({ ...prev, ourValues: newValues }))
                            }}
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description (Arabic)</Label>
                          <Textarea
                            value={val.description.ar}
                            onChange={e => {
                              const newValues = [...homepageSettings.ourValues]
                              newValues[idx].description.ar = e.target.value
                              setHomepageSettings((prev: any) => ({ ...prev, ourValues: newValues }))
                            }}
                            rows={2}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="button" variant="destructive" size="sm" onClick={() => {
                          const newValues = homepageSettings.ourValues.filter((_: any, i: number) => i !== idx)
                          setHomepageSettings((prev: any) => ({ ...prev, ourValues: newValues }))
                        }}>Remove</Button>
                      </div>
                    </div>
                  ))}
                  <Button type="button" onClick={() => {
                    setHomepageSettings((prev: any) => ({
                      ...prev,
                      ourValues: [
                        ...(prev.ourValues ?? []),
                        { title: { en: "", ar: "" }, description: { en: "", ar: "" } },
                      ],
                    }))
                  }}>Add Value</Button>
                </div>
              ) : (
                <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className="space-y-2">
                    <Label>{label} (English)</Label>
                    <Textarea
                      value={homepageSettings[key]?.en ?? ""}
                      onChange={e => handleHomepageChange(key, e.target.value, "en")}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{label} (Arabic)</Label>
                    <Textarea
                      value={homepageSettings[key]?.ar ?? ""}
                      onChange={e => handleHomepageChange(key, e.target.value, "ar")}
                      rows={3}
                    />
                  </div>
                </div>
              )
            ))}
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
} 