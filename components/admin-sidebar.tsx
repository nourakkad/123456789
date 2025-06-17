"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart, ImageIcon, LayoutDashboard, LogOut, Package, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"

interface User {
  name: string
  email: string
  avatar?: string
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // In a real app, this would fetch the user from the session
    // For demo purposes, we'll use a mock user
    setUser({
      name: "Admin User",
      email: "admin@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    })
  }, [])

  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") {
      return true
    }
    return path !== "/admin" && pathname.startsWith(path)
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center font-semibold">
          Admin Dashboard
        </Link>
      </div>

      {user && (
        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/admin")
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/admin/products")
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Package className="h-4 w-4" />
            Products
          </Link>

          <Link
            href="/admin/categories"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/admin/categories")
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <BarChart className="h-4 w-4" />
            Categories
          </Link>

          <Link
            href="/admin/gallery"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/admin/gallery")
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <ImageIcon className="h-4 w-4" />
            Gallery
          </Link>

          <Link
            href="/admin/messages"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/admin/messages")
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Users className="h-4 w-4" />
            Messages
          </Link>

          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/admin/settings")
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>

          <Link
            href="/admin/homepage-settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/admin/homepage-settings")
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Settings className="h-4 w-4" />
            Home Page Settings
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-4">
        <form action={logout}>
          <Button variant="outline" className="w-full justify-start" type="submit">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>
    </div>
  )
}
