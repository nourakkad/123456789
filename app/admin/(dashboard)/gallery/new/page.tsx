"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createGalleryImage } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function NewGalleryImagePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [categoryInput, setCategoryInput] = useState("")

  useEffect(() => {
    // Fetch all gallery images and extract unique categories
    fetch("/api/gallery/categories")
      .then(response => response.json())
      .then(data => {
        setCategories(data.categories || []);
      })
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    // Use the selected or entered category
    formData.set("category", categoryInput)

    try {
      // Upload the image file first
      const imageFile = formData.get("image") as File
      let imageId = ""
      let thumbId = ""
      if (imageFile && imageFile.size > 0) {
        const uploadForm = new FormData()
        uploadForm.append("file", imageFile)
        const uploadRes = await fetch("/api/images/upload", {
          method: "POST",
          body: uploadForm,
        })
        const uploadData = await uploadRes.json()
        if (uploadData.id) {
          imageId = uploadData.id
        }
        if (uploadData.thumbId) {
          thumbId = uploadData.thumbId
        }
      }
      // Remove the file from the form data and add the image IDs
      formData.delete("image")
      if (imageId) {
        formData.append("url", imageId)
      }
      if (thumbId) {
        formData.append("thumbUrl", thumbId)
      }
      await createGalleryImage(formData)
      toast({
        title: "Image added",
        description: "The image has been added to the gallery successfully.",
      })
      router.push("/admin/gallery")
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "The image couldn't be added. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Gallery Image</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Image Information</CardTitle>
          <CardDescription>Upload and describe the new gallery image</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title_en">Image Title (English)</Label>
                <Input id="title_en" name="title_en" placeholder="Enter image title in English" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title_ar">Image Title (Arabic)</Label>
                <Input id="title_ar" name="title_ar" placeholder="Enter image title in Arabic" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="description_en">Description (English)</Label>
                <Textarea id="description_en" name="description_en" rows={4} placeholder="Enter image description in English" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_ar">Description (Arabic)</Label>
                <Textarea id="description_ar" name="description_ar" rows={4} placeholder="Enter image description in Arabic" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <div className="flex gap-2 flex-wrap">
                <select
                  id="category"
                  name="category"
                  className="border rounded px-2 py-1"
                  value={categoryInput}
                  onChange={e => setCategoryInput(e.target.value)}
                >
                  <option value="">-- Select category --</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Input
                  id="category_new"
                  name="category_new"
                  placeholder="Or enter new category"
                  value={categoryInput}
                  onChange={e => setCategoryInput(e.target.value)}
                  className="w-48"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image File</Label>
              <Input id="image" name="image" type="file" accept="image/*" required />
              <p className="text-sm text-muted-foreground">Upload an image file (JPG, PNG, etc.)</p>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Image"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/gallery")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
