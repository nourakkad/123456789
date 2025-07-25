"use client"

import type React from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createProduct } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function NewProductPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("")
  const [extraImages, setExtraImages] = useState<{
    file?: File | null
    preview?: string | null
    url?: string
    description_en: string
    description_ar: string
  }[]>([])
  const [mainImageProgress, setMainImageProgress] = useState(0);
  const [extraImagesProgress, setExtraImagesProgress] = useState<number[]>([]);

  useEffect(() => {
    // Fetch categories from the backend API route
    fetch("/api/categories/list")
      .then(res => res.json())
      .then(cats => setCategories(cats))
  }, [])

  useEffect(() => {
    // When category changes, update subcategories
    const cat = categories.find((c) => c.slug === selectedCategory)
    setSubcategories(cat && Array.isArray(cat.subcategories) ? cat.subcategories : [])
    setSelectedSubcategory("")
  }, [selectedCategory, categories])

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
    setMainImageProgress(0);
    setExtraImagesProgress([]);
    const formData = new FormData(event.currentTarget)
    // Add selected category and subcategory slugs
    formData.set("category", selectedCategory)
    if (selectedSubcategory) {
      formData.set("subcategory", selectedSubcategory)
    } else {
      formData.delete("subcategory")
    }

    // Handle extra images upload (to DB)
    let extraImagesToSend = [...extraImages]
    let newExtraImagesProgress = [...extraImagesProgress];
    for (let i = 0; i < extraImagesToSend.length; i++) {
      const img = extraImagesToSend[i]
      if (img.file) {
        const uploadForm = new FormData()
        uploadForm.append("file", img.file)
        newExtraImagesProgress[i] = 0;
        setExtraImagesProgress([...newExtraImagesProgress]);
        try {
          const uploadData = await uploadWithProgress(uploadForm, (percent) => {
            newExtraImagesProgress[i] = percent;
            setExtraImagesProgress([...newExtraImagesProgress]);
          });
          if (uploadData.id) {
            extraImagesToSend[i].url = uploadData.id // store image ID
          }
        } catch (e) {
          // handle error if needed
        }
      }
    }
    formData.append("extraImages", JSON.stringify(
      extraImagesToSend.filter(img => img.url).map(img => ({
        url: img.url, // this is now the image ID
        description_en: img.description_en,
        description_ar: img.description_ar
      }))
    ))

    try {
      // Upload the image file first (to DB)
      const imageFile = formData.get("image") as File
      let imageId = ""
      if (imageFile && imageFile.size > 0) {
        const uploadForm = new FormData()
        uploadForm.append("file", imageFile)
        setMainImageProgress(0);
        const uploadData = await uploadWithProgress(uploadForm, setMainImageProgress);
        if (uploadData.id) {
          imageId = uploadData.id // store image ID
        }
      }
      // Remove the file from the form data and add the image ID
      formData.delete("image")
      if (imageId) {
        formData.append("image", imageId)
      }
      await createProduct(formData)
      toast({
        title: "Product created",
        description: "The product has been created successfully.",
      })
      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "The product couldn't be created. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setMainImageProgress(0);
      setExtraImagesProgress([]);
    }
  }

  function handleAddExtraImage() {
    setExtraImages([...extraImages, { file: null, preview: null, url: "", description_en: "", description_ar: "" }])
  }

  function handleRemoveExtraImage(idx: number) {
    setExtraImages(extraImages.filter((_, i) => i !== idx))
  }

  function handleExtraImageFileChange(idx: number, file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setExtraImages(imgs => imgs.map((img, i) => i === idx ? { ...img, file, preview: reader.result as string } : img))
    }
    reader.readAsDataURL(file)
  }

  function handleExtraImageDescChange(idx: number, lang: "en" | "ar", value: string) {
    setExtraImages(imgs => imgs.map((img, i) => i === idx ? { ...img, [lang === "en" ? "description_en" : "description_ar"]: value } : img))
  }

  // Add a helper to check if any upload is in progress
  const isUploading = mainImageProgress > 0 && mainImageProgress < 100 || extraImagesProgress.some(p => p > 0 && p < 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Enter the details for the new product</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name_en">Product Name (English)</Label>
                <Input id="name_en" name="name_en" placeholder="Enter product name in English" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_ar">Product Name (Arabic)</Label>
                <Input id="name_ar" name="name_ar" placeholder="Enter product name in Arabic" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="description_en">Description (English)</Label>
                <Textarea id="description_en" name="description_en" rows={4} placeholder="Enter product description in English" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_ar">Description (Arabic)</Label>
                <Textarea id="description_ar" name="description_ar" rows={4} placeholder="Enter product description in Arabic" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category_en">Category (English)</Label>
                <Select name="category_en" value={selectedCategory} onValueChange={setSelectedCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>{cat.name?.en || cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_ar">Category (Arabic)</Label>
                <Select name="category_ar" value={selectedCategory} onValueChange={setSelectedCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>{cat.name?.ar || cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {subcategories.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="subcategory_en">Subcategory (English)</Label>
                  <Select name="subcategory_en" value={selectedSubcategory} onValueChange={setSelectedSubcategory} required={false}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((sub) => (
                        <SelectItem key={sub.slug} value={sub.slug}>{sub.name?.en || sub.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory_ar">Subcategory (Arabic)</Label>
                  <Select name="subcategory_ar" value={selectedSubcategory} onValueChange={setSelectedSubcategory} required={false}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((sub) => (
                        <SelectItem key={sub.slug} value={sub.slug}>{sub.name?.ar || sub.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
              <p className="text-sm text-muted-foreground">Upload a product image (optional)</p>
              {mainImageProgress > 0 && mainImageProgress < 100 && (
                <div className="flex items-center gap-2 mt-2">
                  <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div className="bg-blue-500 h-2 rounded" style={{ width: `${mainImageProgress}%` }} />
                  </div>
                  <span className="text-sm text-blue-600">Uploading...</span>
                </div>
              )}
              {mainImageProgress === 100 && (
                <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Image uploaded!
                </div>
              )}
            </div>
            {/* Extra Images Section */}
            <div className="space-y-2">
              <Label>Extra Images (with Description)</Label>
              {extraImages.map((img, idx) => (
                <div key={idx} className="border rounded p-4 mb-2 flex flex-col gap-2 bg-gray-50">
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e => handleExtraImageFileChange(idx, e.target.files?.[0] || null)}
                    />
                    {img.preview && (
                      <div className="relative w-24 h-24">
                        <Image src={img.preview} alt="Extra preview" fill className="object-contain rounded" />
                      </div>
                    )}
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveExtraImage(idx)}>
                      Remove
                    </Button>
                  </div>
                  {extraImagesProgress[idx] > 0 && extraImagesProgress[idx] < 100 && (
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <div className="w-full bg-gray-200 rounded h-2">
                        <div className="bg-blue-500 h-2 rounded" style={{ width: `${extraImagesProgress[idx]}%` }} />
                      </div>
                      <span className="text-sm text-blue-600">Uploading...</span>
                    </div>
                  )}
                  {extraImagesProgress[idx] === 100 && (
                    <div className="flex items-center gap-2 mb-2 text-green-600 text-sm">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Image uploaded!
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Textarea
                      value={img.description_en}
                      onChange={e => handleExtraImageDescChange(idx, "en", e.target.value)}
                      placeholder="Description (English)"
                      rows={2}
                    />
                    <Textarea
                      value={img.description_ar}
                      onChange={e => handleExtraImageDescChange(idx, "ar", e.target.value)}
                      placeholder="Description (Arabic)"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddExtraImage}>
                Add Extra Image
              </Button>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
