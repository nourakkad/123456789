"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCategory } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import Image from "next/image"

interface Subcategory {
  en: string
  ar: string
  logoFile?: File | null
  logoPreview?: string | null
  logoUrl?: string
  description_en?: string
  description_ar?: string
  slogan_en?: string
  slogan_ar?: string
}

export default function NewCategoryPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    let subcats = [...subcategories]

    // Upload all logos first
    for (let i = 0; i < subcats.length; i++) {
      const sub = subcats[i]
      if (sub.logoFile) {
        const logoForm = new FormData()
        logoForm.append("file", sub.logoFile)
        const response = await fetch("/api/images/upload", {
          method: "POST",
          body: logoForm,
        })
        if (response.ok) {
          const data = await response.json()
          subcats[i].logoUrl = data.id
        } else {
          toast({
            title: "Logo upload failed",
            description: `Could not upload logo for subcategory #${i + 1}`,
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }
      }
    }

    // Only send en, ar, logoUrl for each subcategory
    const subcategoriesToSend = subcats
      .filter(s => s.en.trim() !== "" && s.ar.trim() !== "")
      .map(s => ({ en: s.en, ar: s.ar, logo: s.logoUrl || "", description_en: s.description_en, description_ar: s.description_ar, slogan_en: s.slogan_en, slogan_ar: s.slogan_ar }))
    formData.set("subcategories", JSON.stringify(subcategoriesToSend))

    try {
      await createCategory(formData)
      toast({
        title: "Category created",
        description: "The category has been created successfully.",
      })
      router.push("/admin/categories")
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "The category couldn't be created. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleAddSubcategory() {
    setSubcategories([...subcategories, { en: "", ar: "", logoFile: null, logoPreview: null }])
  }

  function handleRemoveSubcategory(idx: number) {
    setSubcategories(subcategories.filter((_, i) => i !== idx))
  }

  function handleSubcategoryChange(idx: number, lang: "en" | "ar" | "description_en" | "description_ar" | "slogan_en" | "slogan_ar", value: string) {
    setSubcategories(subcategories.map((s, i) => i === idx ? { ...s, [lang]: value } : s))
  }

  function handleLogoChange(idx: number, file: File | null) {
    if (!file) return
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setSubcategories(subcategories => subcategories.map((s, i) => i === idx ? { ...s, logoFile: file, logoPreview: reader.result as string } : s))
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Category</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>Enter the details for the new category. Optionally add subcategories below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name_en">Category Name (English)</Label>
              <Input id="name_en" name="name_en" placeholder="Enter category name in English" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_ar">Category Name (Arabic)</Label>
              <Input id="name_ar" name="name_ar" placeholder="Enter category name in Arabic" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_en">Category Description (English)</Label>
              <textarea id="description_en" name="description_en" placeholder="Enter category description in English" className="w-full border rounded p-2 min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_ar">Category Description (Arabic)</Label>
              <textarea id="description_ar" name="description_ar" placeholder="Enter category description in Arabic" className="w-full border rounded p-2 min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label>Subcategories (optional)</Label>
              {subcategories.map((sub, idx) => (
                <div key={idx} className="flex gap-2 items-center flex-wrap border p-2 rounded-md mb-2">
                  <Input
                    type="text"
                    value={sub.en}
                    onChange={e => handleSubcategoryChange(idx, "en", e.target.value)}
                    placeholder={`Subcategory #${idx + 1} (English)`}
                    className="flex-1"
                  />
                  <Input
                    type="text"
                    value={sub.ar}
                    onChange={e => handleSubcategoryChange(idx, "ar", e.target.value)}
                    placeholder={`Subcategory #${idx + 1} (Arabic)`}
                    className="flex-1"
                  />
                  <textarea
                    value={sub.description_en || ''}
                    onChange={e => handleSubcategoryChange(idx, "description_en", e.target.value)}
                    placeholder="Subcategory Description (English)"
                    className="w-full border rounded p-2 min-h-[40px]"
                  />
                  <textarea
                    value={sub.description_ar || ''}
                    onChange={e => handleSubcategoryChange(idx, "description_ar", e.target.value)}
                    placeholder="Subcategory Description (Arabic)"
                    className="w-full border rounded p-2 min-h-[40px]"
                  />
                  <Input
                    type="text"
                    value={sub.slogan_en || ''}
                    onChange={e => handleSubcategoryChange(idx, "slogan_en", e.target.value)}
                    placeholder="Subcategory Slogan (English)"
                    className="w-full border rounded p-2"
                  />
                  <Input
                    type="text"
                    value={sub.slogan_ar || ''}
                    onChange={e => handleSubcategoryChange(idx, "slogan_ar", e.target.value)}
                    placeholder="Subcategory Slogan (Arabic)"
                    className="w-full border rounded p-2"
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={e => handleLogoChange(idx, e.target.files?.[0] || null)}
                    className="w-40"
                  />
                  {sub.logoPreview && (
                    <div className="relative w-12 h-12">
                      <Image src={sub.logoPreview} alt="Logo preview" fill className="object-contain rounded" />
                    </div>
                  )}
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSubcategory(idx)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddSubcategory}>
                Add Subcategory
              </Button>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
