"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.categorySlug as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<any>(null);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCategory() {
      setIsLoading(true);
      const res = await fetch(`/api/categories/${slug}`);
      const data = await res.json();
      setCategory(data);
      setSubcategories(
        Array.isArray(data.subcategories)
          ? data.subcategories.map((sub: any) => ({ ...sub, logoFile: null, logoPreview: null }))
          : []
      );
      setIsLoading(false);
    }
    if (slug) fetchCategory();
  }, [slug]);

  function handleSubcategoryChange(idx: number, key: string, value: string) {
    setSubcategories((subs) =>
      subs.map((s, i) => (i === idx ? { ...s, [key]: value } : s))
    );
  }

  function handleLogoChange(idx: number, file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSubcategories((subs) =>
        subs.map((s, i) => (i === idx ? { ...s, logoFile: file, logoPreview: reader.result as string } : s))
      );
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    // Upload new logos if any
    let updatedSubs = [...subcategories];
    for (let i = 0; i < updatedSubs.length; i++) {
      const sub = updatedSubs[i];
      if (sub.logoFile) {
        const logoForm = new FormData();
        logoForm.append("file", sub.logoFile);
        const response = await fetch("/api/images/upload", {
          method: "POST",
          body: logoForm,
        });
        if (response.ok) {
          const data = await response.json();
          updatedSubs[i].logo = data.id;
        }
      }
    }
    // Prepare subcategories for backend
    const subcategoriesToSend = updatedSubs.map((s) => ({
      id: s.id,
      en: s.name?.en || s.en || "",
      ar: s.name?.ar || s.ar || "",
      logo: s.logo,
      description_en: s.description?.en || s.description_en || "",
      description_ar: s.description?.ar || s.description_ar || "",
      slogan_en: s.slogan?.en || s.slogan_en || "",
      slogan_ar: s.slogan?.ar || s.slogan_ar || "",
    }));
    formData.set("subcategories", JSON.stringify(subcategoriesToSend));
    formData.set("id", category.id || category._id);
    try {
      await fetch("/api/categories/update", {
        method: "POST",
        body: formData,
      });
      router.push("/admin/categories");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !category) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Edit Category</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name_en">Category Name (English)</Label>
          <Input id="name_en" name="name_en" defaultValue={category.name?.en} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name_ar">Category Name (Arabic)</Label>
          <Input id="name_ar" name="name_ar" defaultValue={category.name?.ar} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description_en">Category Description (English)</Label>
          <textarea id="description_en" name="description_en" defaultValue={category.description?.en} className="w-full border rounded p-2 min-h-[80px]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description_ar">Category Description (Arabic)</Label>
          <textarea id="description_ar" name="description_ar" defaultValue={category.description?.ar} className="w-full border rounded p-2 min-h-[80px]" />
        </div>
        <Label>Subcategories</Label>
        {subcategories.map((sub, idx) => (
          <div key={sub.id || idx} className="flex flex-col gap-2 border p-2 rounded-md mb-2">
            <Input
              type="text"
              value={sub.name?.en || sub.en || ""}
              onChange={e => handleSubcategoryChange(idx, "en", e.target.value)}
              placeholder="Subcategory Name (English)"
              className="flex-1"
            />
            <Input
              type="text"
              value={sub.name?.ar || sub.ar || ""}
              onChange={e => handleSubcategoryChange(idx, "ar", e.target.value)}
              placeholder="Subcategory Name (Arabic)"
              className="flex-1"
            />
            <textarea
              value={sub.description?.en || sub.description_en || ""}
              onChange={e => handleSubcategoryChange(idx, "description_en", e.target.value)}
              placeholder="Subcategory Description (English)"
              className="w-full border rounded p-2 min-h-[40px]"
            />
            <textarea
              value={sub.description?.ar || sub.description_ar || ""}
              onChange={e => handleSubcategoryChange(idx, "description_ar", e.target.value)}
              placeholder="Subcategory Description (Arabic)"
              className="w-full border rounded p-2 min-h-[40px]"
            />
            <Input
              type="text"
              value={sub.slogan?.en || sub.slogan_en || ""}
              onChange={e => handleSubcategoryChange(idx, "slogan_en", e.target.value)}
              placeholder="Subcategory Slogan (English)"
              className="w-full border rounded p-2"
            />
            <Input
              type="text"
              value={sub.slogan?.ar || sub.slogan_ar || ""}
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
            {sub.logoPreview ? (
              <div className="relative w-12 h-12">
                <Image src={sub.logoPreview} alt="Logo preview" fill className="object-contain rounded" />
              </div>
            ) : sub.logo ? (
              <div className="relative w-12 h-12">
                <Image src={`/api/images/${sub.logo}`} alt="Logo" fill className="object-contain rounded" />
              </div>
            ) : null}
          </div>
        ))}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
} 