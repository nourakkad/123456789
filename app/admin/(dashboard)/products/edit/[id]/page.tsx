"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { updateProduct } from "@/lib/actions"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    // Fetch product data from API
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
  }, [params.id])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    formData.append("id", params.id)
    // Append multilingual fields
    formData.set("name_en", formData.get("name_en") || "")
    formData.set("name_ar", formData.get("name_ar") || "")
    formData.set("description_en", formData.get("description_en") || "")
    formData.set("description_ar", formData.get("description_ar") || "")
    formData.set("category_en", formData.get("category_en") || "")
    formData.set("category_ar", formData.get("category_ar") || "")
    formData.set("subcategory_en", formData.get("subcategory_en") || "")
    formData.set("subcategory_ar", formData.get("subcategory_ar") || "")
    try {
      await updateProduct(formData)
      toast({ title: "Product updated", description: "The product has been updated successfully." })
      router.push("/admin/products")
    } catch (error) {
      toast({ title: "Something went wrong", description: "The product couldn't be updated. Please try again.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!product) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Edit the details for the product</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name_en">Product Name (EN)</Label>
                <Input id="name_en" name="name_en" defaultValue={product.name?.en || ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_ar">Product Name (AR)</Label>
                <Input id="name_ar" name="name_ar" defaultValue={product.name?.ar || ""} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="description_en">Description (EN)</Label>
                <Textarea id="description_en" name="description_en" rows={4} defaultValue={product.description?.en || ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_ar">Description (AR)</Label>
                <Textarea id="description_ar" name="description_ar" rows={4} defaultValue={product.description?.ar || ""} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category_en">Category (EN)</Label>
                <Input id="category_en" name="category_en" defaultValue={product.category?.en || ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_ar">Category (AR)</Label>
                <Input id="category_ar" name="category_ar" defaultValue={product.category?.ar || ""} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subcategory_en">Subcategory (EN)</Label>
                <Input id="subcategory_en" name="subcategory_en" defaultValue={product.subcategory?.en || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory_ar">Subcategory (AR)</Label>
                <Input id="subcategory_ar" name="subcategory_ar" defaultValue={product.subcategory?.ar || ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
              <p className="text-sm text-muted-foreground">Upload a product image (optional)</p>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 