"use client"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import Image from "next/image"
import CategoriesDataTable from "./categories-data-table"

interface Category {
  id?: string
  name: {
    en: string
    ar: string
  }
  slug: string
  subcategories?: {
    id: string
    name: {
      en: string
      ar: string
    }
    slug: string
    logo?: string
  }[]
}

export default function CategoriesTableClient({ categories }: { categories: Category[] }) {
  const router = useRouter();

  async function handleDelete(categoryId: string | undefined) {
    if (!categoryId) return;
    console.log('Deleting category with id:', categoryId);
    const formData = new FormData();
    formData.append("id", categoryId);
    await fetch("/api/categories/delete", {
      method: "POST",
      body: formData,
    });
    router.refresh();
  }

  return <CategoriesDataTable categories={categories as any} />;
} 