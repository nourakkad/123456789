"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" defaultValue={product.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} defaultValue={product.description} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={product.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select name="subcategory" defaultValue={product.subcategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="living-room">Living Room</SelectItem>
                    <SelectItem value="lighting">Lighting</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="wearables">Wearables</SelectItem>
                    <SelectItem value="computers">Computers</SelectItem>
                  </SelectContent>
                </Select>
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