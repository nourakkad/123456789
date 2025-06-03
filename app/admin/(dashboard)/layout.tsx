import type React from "react"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"
import { getSession } from "@/lib/auth"
import { Toaster } from "@/components/ui/toaster"

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated and is an admin
  const session = await getSession()

  // If not authenticated, redirect to login
  if (!session || !session.user || !session.user.isAdmin) {
    redirect("/admin/login")
  }

  // Render admin layout with sidebar for authenticated users
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
      <Toaster />
    </div>
  )
}
