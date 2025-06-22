"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { deleteCategory as originalDeleteCategory } from "@/lib/actions"
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
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import React from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Category {
  id: string
  name: string
  slug: string
  subcategories?: {
    id: string
    name: string
    slug: string
  }[]
}

interface CategoriesDataTableProps {
  categories: Category[]
}

async function deleteCategory(formData: FormData) {
  await originalDeleteCategory(formData);
}

export default function CategoriesDataTable({ categories: initialCategories }: CategoriesDataTableProps) {
  const [categories, setCategories] = React.useState(initialCategories);
  const sensors = useSensors(useSensor(PointerSensor));
  const router = useRouter();

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      const newCategories = arrayMove(categories, oldIndex, newIndex);
      setCategories(newCategories);
      // Persist new order to backend
      await fetch('/api/categories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: newCategories.map((c) => c.id) }),
      });
    }
  }

  function DraggableRow({ category, children }: { category: Category; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      background: isDragging ? '#f3f4f6' : undefined,
    };
    return (
      <tr ref={setNodeRef} style={style} {...attributes}>
        <td {...listeners} className="cursor-grab pr-2 text-gray-400 align-middle w-8"><GripVertical size={18} /></td>
        {children}
      </tr>
    );
  }

  const columns = [
    {
      id: 'drag',
      header: '',
      cell: () => <span />,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      id: "subcategories",
      header: "Subcategories",
      cell: ({ row }: { row: any }) => {
        const category = row.original
        if (!category) return 0
        return Array.isArray(category.subcategories) ? category.subcategories.length : 0
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        const category = row.original
        if (!category) return null

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/categories/${category.slug}/edit`)}
            >
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Category</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <b>{(category as any).name?.en || (category as any).name || ''}</b>? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
                      Delete
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]

  function handleDelete(categoryId: string) {
    const formData = new FormData();
    formData.append("id", categoryId);
    fetch("/api/categories/delete", {
      method: "POST",
      body: formData,
    }).then(() => window.location.reload());
  }

  // Render table manually for drag-and-drop
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="w-8"></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subcategories</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, idx) => (
                <DraggableRow key={category.id} category={category}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {(category as any).name?.en || (category as any).name || ''}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 {idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">{category.slug}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex flex-row flex-wrap gap-2 items-center">
                      {Array.isArray((category as any).subcategories) && (category as any).subcategories.length > 0 ? (
                        (category as any).subcategories.map((sub: any) => (
                          <span key={sub.id} className="inline-flex items-center">
                            {sub.logo ? (
                              <Image
                                src={`/api/images/${sub.logo}`}
                                alt={sub.name?.en || "Logo"}
                                width={24}
                                height={24}
                                className="object-contain rounded-full border mr-1"
                              />
                            ) : (
                              <span className="text-xs text-gray-400 mr-1">{sub.name?.en || "No Logo"}</span>
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No subcategories</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/categories/${category.slug}/edit`)}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <b>{(category as any).name?.en || (category as any).name || ''}</b>? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
                                Delete
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </DraggableRow>
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  );
}
