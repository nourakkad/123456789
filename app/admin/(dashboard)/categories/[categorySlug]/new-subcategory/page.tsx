"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function NewSubcategoryPage({
  params,
}: {
  params: { categorySlug: string }
}) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0);

  function uploadWithProgress(formData: FormData, onProgress: (percent: number) => void) {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/images/upload");
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error("Upload failed"));
        }
      };
      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(formData);
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setUploadProgress(0);
    try {
      // First upload the logo if there is one
      let logoUrl = ""
      if (logoFile) {
        const formData = new FormData()
        formData.append("file", logoFile)
        const data = await uploadWithProgress(formData, setUploadProgress);
        logoUrl = data.id
      }
      // Then create the subcategory
      const formData = new FormData(event.currentTarget)
      formData.append("categorySlug", params.categorySlug)
      formData.append("logo", logoUrl)
      const response = await fetch("/api/categories/subcategory", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create subcategory")
      }
      toast({
        title: "Subcategory created",
        description: "The subcategory has been created successfully.",
      })
      router.push("/admin/categories")
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "The subcategory couldn't be created. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0);
    }
  }

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
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

      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Add a helper to check if upload is in progress
  const isUploading = uploadProgress > 0 && uploadProgress < 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Subcategory</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subcategory Information</CardTitle>
          <CardDescription>Enter the details for the new subcategory and upload a logo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name_en">Subcategory Name (English)</Label>
              <Input id="name_en" name="name_en" placeholder="Enter subcategory name in English" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_ar">Subcategory Name (Arabic)</Label>
              <Input id="name_ar" name="name_ar" placeholder="Enter subcategory name in Arabic" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="cursor-pointer"
              />
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="flex items-center gap-2 mt-2">
                  <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div className="bg-blue-500 h-2 rounded" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <span className="text-sm text-blue-600">Uploading...</span>
                </div>
              )}
              {uploadProgress === 100 && (
                <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Image uploaded!
                </div>
              )}
              {logoPreview && (
                <div className="mt-2 relative w-32 h-32">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting ? "Creating..." : "Create Subcategory"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 