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
  const [logoProgress, setLogoProgress] = useState<number[]>([]);
  const [benefitProgress, setBenefitProgress] = useState<number[][]>([]);
  const [colorProgress, setColorProgress] = useState<number[][]>([]);

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
      subs.map((s, i) => {
        if (i !== idx) return s;
        if (key === "en" || key === "ar") {
          return {
            ...s,
            name: { ...(s.name || {}), [key]: value },
            [key]: value, // for legacy support
          };
        }
        if (key === "slogan_en" || key === "slogan_ar") {
          const lang = key.endsWith("_ar") ? "ar" : "en";
          return {
            ...s,
            slogan: { ...(s.slogan || {}), [lang]: value },
            [key]: value, // for legacy support
          };
        }
        if (key === "description_en" || key === "description_ar") {
          const lang = key.endsWith("_ar") ? "ar" : "en";
          return {
            ...s,
            description: { ...(s.description || {}), [lang]: value },
            [key]: value, // for legacy support
          };
        }
        return { ...s, [key]: value };
      })
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

  function handleAddSubcategory() {
    setSubcategories((subs) => [
      ...subs,
      {
        id: Math.random().toString(36).slice(2),
        name: { en: '', ar: '' },
        en: '',
        ar: '',
        logo: '',
        logoFile: null,
        logoPreview: null,
        description: { en: '', ar: '' },
        description_en: '',
        description_ar: '',
        slogan: { en: '', ar: '' },
        slogan_en: '',
        slogan_ar: '',
        benefits: [],
        colors: [],
        hardcodedPageSlug: '',
      },
    ]);
  }

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setLogoProgress([]);
    setBenefitProgress([]);
    setColorProgress([]);
    const formData = new FormData(e.currentTarget);
    // Upload new logos if any
    let updatedSubs = [...subcategories];
    let newLogoProgress = [...logoProgress];
    let newBenefitProgress = [...benefitProgress];
    let newColorProgress = [...colorProgress];
    for (let i = 0; i < updatedSubs.length; i++) {
      const sub = updatedSubs[i];
      // Logo
      if (sub.logoFile) {
        const logoForm = new FormData();
        logoForm.append("file", sub.logoFile);
        newLogoProgress[i] = 0;
        setLogoProgress([...newLogoProgress]);
        try {
          const data = await uploadWithProgress(logoForm, (percent) => {
            newLogoProgress[i] = percent;
            setLogoProgress([...newLogoProgress]);
          });
          updatedSubs[i].logo = data.id;
        } catch (e) {}
      }
      // Benefits
      if (Array.isArray(sub.benefits)) {
        newBenefitProgress[i] = newBenefitProgress[i] || [];
        for (let j = 0; j < sub.benefits.length; j++) {
          const benefit = sub.benefits[j];
          if (benefit.imageFile) {
            const benefitForm = new FormData();
            benefitForm.append("file", benefit.imageFile);
            newBenefitProgress[i][j] = 0;
            setBenefitProgress([...newBenefitProgress]);
            try {
              const data = await uploadWithProgress(benefitForm, (percent) => {
                newBenefitProgress[i][j] = percent;
                setBenefitProgress([...newBenefitProgress]);
              });
              updatedSubs[i].benefits[j].image = data.id;
            } catch (e) {}
          }
        }
      }
      // Colors
      if (Array.isArray(sub.colors)) {
        newColorProgress[i] = newColorProgress[i] || [];
        for (let j = 0; j < sub.colors.length; j++) {
          const color = sub.colors[j];
          if (color.imageFile) {
            const colorForm = new FormData();
            colorForm.append("file", color.imageFile);
            newColorProgress[i][j] = 0;
            setColorProgress([...newColorProgress]);
            try {
              const data = await uploadWithProgress(colorForm, (percent) => {
                newColorProgress[i][j] = percent;
                setColorProgress([...newColorProgress]);
              });
              updatedSubs[i].colors[j].image = data.id;
            } catch (e) {}
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
      hardcodedPageSlug: s.hardcodedPageSlug || ''
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
      setLogoProgress([]);
      setBenefitProgress([]);
      setColorProgress([]);
    }
  }

  // Add a helper to check if any upload is in progress
  const isUploading = logoProgress.some(p => p > 0 && p < 100) || benefitProgress.some(arr => arr && arr.some(p => p > 0 && p < 100)) || colorProgress.some(arr => arr && arr.some(p => p > 0 && p < 100));

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
        {subcategories.length === 0 && (
          <div className="mb-4 text-gray-500">No subcategories yet.</div>
        )}
        {subcategories.map((sub, idx) => (
          <div key={sub.id || idx} className="flex flex-col gap-3 border border-gray-200 bg-white/80 rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Input
                type="text"
                value={sub.slogan?.en || sub.slogan_en || ""}
                onChange={e => handleSubcategoryChange(idx, "slogan_en", e.target.value)}
                placeholder="Slogan (English)"
                className="flex-1"
              />
              <Input
                type="text"
                value={sub.slogan?.ar || sub.slogan_ar || ""}
                onChange={e => handleSubcategoryChange(idx, "slogan_ar", e.target.value)}
                placeholder="Slogan (Arabic)"
                className="flex-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                value={sub.description?.en || sub.description_en || ""}
                onChange={e => handleSubcategoryChange(idx, "description_en", e.target.value)}
                placeholder="Description (English)"
                className="w-full border rounded p-2 min-h-[40px]"
              />
              <textarea
                value={sub.description?.ar || sub.description_ar || ""}
                onChange={e => handleSubcategoryChange(idx, "description_ar", e.target.value)}
                placeholder="Description (Arabic)"
                className="w-full border rounded p-2 min-h-[40px]"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center mt-2">
              <Input
                type="file"
                accept="image/*"
                onChange={e => handleLogoChange(idx, e.target.files?.[0] || null)}
                className="w-40"
              />
              {logoProgress[idx] > 0 && logoProgress[idx] < 100 && (
                <div className="w-40 bg-gray-200 rounded h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded" style={{ width: `${logoProgress[idx]}%` }} />
                </div>
              )}
              {sub.logoPreview ? (
                <div className="relative w-12 h-12">
                  <Image src={sub.logoPreview} alt="Logo preview" fill className="object-contain rounded" />
                </div>
              ) : sub.logo ? (
                <div className="relative w-12 h-12">
                  <Image src={`/api/images/${sub.logo}`} alt="Logo" fill className="object-contain rounded" />
                </div>
              ) : null}
              <Input
                type="text"
                value={sub.hardcodedPageSlug || ''}
                onChange={e => handleSubcategoryChange(idx, "hardcodedPageSlug", e.target.value)}
                placeholder="Hardcoded Page Slug (optional)"
                className="w-full border rounded p-2"
              />
            </div>
            {/* Benefits Section */}
            <div className="mt-4">
              <Label className="font-semibold mb-1 block">Benefits (optional)</Label>
              <div className="flex flex-row flex-wrap gap-2 items-center">
                {(sub.benefits || []).map((benefit: any, bIdx: number) => (
                  <div key={bIdx} className="flex flex-col items-center gap-1 bg-gray-50 border border-gray-200 rounded p-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e => handleSubcategoryBenefitImageChange(idx, bIdx, e.target.files?.[0] || null)}
                      className="w-20"
                    />
                    {benefitProgress[idx] && benefitProgress[idx][bIdx] > 0 && benefitProgress[idx][bIdx] < 100 && (
                      <div className="w-20 bg-gray-200 rounded h-2 mt-2">
                        <div className="bg-blue-500 h-2 rounded" style={{ width: `${benefitProgress[idx][bIdx]}%` }} />
                      </div>
                    )}
                    {benefit.imagePreview ? (
                      <div className="relative w-8 h-8">
                        <Image src={benefit.imagePreview} alt="Benefit preview" fill className="object-contain rounded" />
                      </div>
                    ) : benefit.image ? (
                      <div className="relative w-8 h-8">
                        <Image src={`/api/images/${benefit.image}`} alt="Benefit" fill className="object-contain rounded" />
                      </div>
                    ) : null}
                    <Input
                      type="text"
                      value={benefit.description_en || ""}
                      onChange={e => handleSubcategoryBenefitChange(idx, bIdx, "description_en", e.target.value)}
                      placeholder="EN"
                      className="w-32 text-xs"
                    />
                    <Input
                      type="text"
                      value={benefit.description_ar || ""}
                      onChange={e => handleSubcategoryBenefitChange(idx, bIdx, "description_ar", e.target.value)}
                      placeholder="AR"
                      className="w-32 text-xs"
                    />
                    <Button type="button" variant="destructive" size="icon" className="w-7 h-7" onClick={() => handleRemoveBenefit(idx, bIdx)}>
                      ×
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="w-24" onClick={() => handleAddBenefit(idx)}>Add Benefit</Button>
              </div>
            </div>
            {/* Colors Section */}
            <div className="mt-4">
              <Label className="font-semibold mb-1 block">Colors (optional)</Label>
              <div className="flex flex-row flex-wrap gap-2 items-center">
                {(sub.colors || []).map((color: any, cIdx: number) => (
                  <div key={cIdx} className="flex flex-col items-center gap-1 bg-gray-50 border border-gray-200 rounded p-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e => handleSubcategoryColorImageChange(idx, cIdx, e.target.files?.[0] || null)}
                      className="w-20"
                    />
                    {colorProgress[idx] && colorProgress[idx][cIdx] > 0 && colorProgress[idx][cIdx] < 100 && (
                      <div className="w-20 bg-gray-200 rounded h-2 mt-2">
                        <div className="bg-blue-500 h-2 rounded" style={{ width: `${colorProgress[idx][cIdx]}%` }} />
                      </div>
                    )}
                    {color.imagePreview ? (
                      <div className="relative w-8 h-8">
                        <Image src={color.imagePreview} alt="Color preview" fill className="object-contain rounded" />
                      </div>
                    ) : color.image ? (
                      <div className="relative w-8 h-8">
                        <Image src={`/api/images/${color.image}`} alt="Color" fill className="object-contain rounded" />
                      </div>
                    ) : null}
                    <Button type="button" variant="destructive" size="icon" className="w-7 h-7" onClick={() => handleRemoveColor(idx, cIdx)}>
                      ×
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="w-24" onClick={() => handleAddColor(idx)}>Add Color</Button>
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" className="mt-2" onClick={handleAddSubcategory}>
          Add Subcategory
        </Button>
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
} 