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

  function handleSubcategoryBenefitChange(subIdx: number, benefitIdx: number, key: string, value: string) {
    setSubcategories((subs) =>
      subs.map((s, i) =>
        i === subIdx
          ? {
              ...s,
              benefits: (s.benefits || []).map((b: any, j: number) =>
                j === benefitIdx ? { ...b, [key]: value } : b
              ),
            }
          : s
      )
    );
  }

  function handleSubcategoryBenefitImageChange(subIdx: number, benefitIdx: number, file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSubcategories((subs) =>
        subs.map((s, i) =>
          i === subIdx
            ? {
                ...s,
                benefits: (s.benefits || []).map((b: any, j: number) =>
                  j === benefitIdx ? { ...b, imageFile: file, imagePreview: reader.result as string } : b
                ),
              }
            : s
        )
      );
    };
    reader.readAsDataURL(file);
  }

  function handleAddBenefit(subIdx: number) {
    setSubcategories((subs) =>
      subs.map((s, i) =>
        i === subIdx
          ? { ...s, benefits: [...(s.benefits || []), { image: '', imageFile: null, imagePreview: null, description_en: '', description_ar: '' }] }
          : s
      )
    );
  }

  function handleRemoveBenefit(subIdx: number, benefitIdx: number) {
    setSubcategories((subs) =>
      subs.map((s, i) =>
        i === subIdx
          ? { ...s, benefits: (s.benefits || []).filter((_: any, j: number) => j !== benefitIdx) }
          : s
      )
    );
  }

  function handleSubcategoryColorImageChange(subIdx: number, colorIdx: number, file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSubcategories((subs) =>
        subs.map((s, i) =>
          i === subIdx
            ? {
                ...s,
                colors: (s.colors || []).map((c: any, j: number) =>
                  j === colorIdx ? { ...c, imageFile: file, imagePreview: reader.result as string } : c
                ),
              }
            : s
        )
      );
    };
    reader.readAsDataURL(file);
  }

  function handleAddColor(subIdx: number) {
    setSubcategories((subs) =>
      subs.map((s, i) =>
        i === subIdx
          ? { ...s, colors: [...(s.colors || []), { image: '', imageFile: null, imagePreview: null }] }
          : s
      )
    );
  }

  function handleRemoveColor(subIdx: number, colorIdx: number) {
    setSubcategories((subs) =>
      subs.map((s, i) =>
        i === subIdx
          ? { ...s, colors: (s.colors || []).filter((_: any, j: number) => j !== colorIdx) }
          : s
      )
    );
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
      // Upload benefit images
      if (Array.isArray(sub.benefits)) {
        for (let j = 0; j < sub.benefits.length; j++) {
          const benefit = sub.benefits[j];
          if (benefit.imageFile) {
            const benefitForm = new FormData();
            benefitForm.append("file", benefit.imageFile);
            const response = await fetch("/api/images/upload", {
              method: "POST",
              body: benefitForm,
            });
            if (response.ok) {
              const data = await response.json();
              updatedSubs[i].benefits[j].image = data.id;
            }
          }
        }
      }
      // Upload color images
      if (Array.isArray(sub.colors)) {
        for (let j = 0; j < sub.colors.length; j++) {
          const color = sub.colors[j];
          if (color.imageFile) {
            const colorForm = new FormData();
            colorForm.append("file", color.imageFile);
            const response = await fetch("/api/images/upload", {
              method: "POST",
              body: colorForm,
            });
            if (response.ok) {
              const data = await response.json();
              updatedSubs[i].colors[j].image = data.id;
            }
          }
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
      benefits: (s.benefits || []).map((b: any) => ({
        image: b.image,
        description_en: b.description_en || "",
        description_ar: b.description_ar || "",
      })),
      colors: (s.colors || []).map((c: any) => ({
        image: c.image,
      })),
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
            {/* Benefits Section */}
            <div className="mt-2">
              <Label>Benefits (optional)</Label>
              {(sub.benefits || []).map((benefit: any, bIdx: number) => (
                <div key={bIdx} className="flex flex-col gap-2 border p-2 rounded-md mb-2 bg-gray-50">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={e => handleSubcategoryBenefitImageChange(idx, bIdx, e.target.files?.[0] || null)}
                    className="w-40"
                  />
                  {benefit.imagePreview ? (
                    <div className="relative w-16 h-16">
                      <Image src={benefit.imagePreview} alt="Benefit preview" fill className="object-contain rounded" />
                    </div>
                  ) : benefit.image ? (
                    <div className="relative w-16 h-16">
                      <Image src={`/api/images/${benefit.image}`} alt="Benefit" fill className="object-contain rounded" />
                    </div>
                  ) : null}
                  <textarea
                    value={benefit.description_en || ""}
                    onChange={e => handleSubcategoryBenefitChange(idx, bIdx, "description_en", e.target.value)}
                    placeholder="Benefit Description (English)"
                    className="w-full border rounded p-2 min-h-[40px]"
                  />
                  <textarea
                    value={benefit.description_ar || ""}
                    onChange={e => handleSubcategoryBenefitChange(idx, bIdx, "description_ar", e.target.value)}
                    placeholder="Benefit Description (Arabic)"
                    className="w-full border rounded p-2 min-h-[40px]"
                  />
                  <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveBenefit(idx, bIdx)}>Remove Benefit</Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => handleAddBenefit(idx)}>Add Benefit</Button>
            </div>
            {/* Colors Section */}
            <div className="mt-2">
              <Label>Colors (optional)</Label>
              {(sub.colors || []).map((color: any, cIdx: number) => (
                <div key={cIdx} className="flex flex-col gap-2 border p-2 rounded-md mb-2 bg-gray-50">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={e => handleSubcategoryColorImageChange(idx, cIdx, e.target.files?.[0] || null)}
                    className="w-40"
                  />
                  {color.imagePreview ? (
                    <div className="relative w-16 h-16">
                      <Image src={color.imagePreview} alt="Color preview" fill className="object-contain rounded" />
                    </div>
                  ) : color.image ? (
                    <div className="relative w-16 h-16">
                      <Image src={`/api/images/${color.image}`} alt="Color" fill className="object-contain rounded" />
                    </div>
                  ) : null}
                  <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveColor(idx, cIdx)}>Remove Color</Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => handleAddColor(idx)}>Add Color</Button>
            </div>
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