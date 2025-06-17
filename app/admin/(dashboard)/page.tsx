"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Package, ShoppingCart, Users, AlertCircle, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface Stats {
  totalProducts: number
  totalCategories: number
  totalGalleryImages: number
  totalMessages: number
  unreadMessages: number
  newProducts: number
  recentProducts: Array<{
    id: string
    name: string
    createdAt: string
  }>
  recentMessages: Array<{
    id: string
    name: string
    createdAt: string
  }>
}

export default function AdminDashboard() {
  const { toast } = useToast()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionTest, setConnectionTest] = useState<any>(null)

  const loadStats = async () => {
    try {
      setError(null)
      setIsLoading(true)
      console.log("Loading dashboard stats...")

      const response = await fetch("/api/admin/stats", {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Loaded stats:", data)

      setStats(data)
    } catch (error) {
      console.error("Error loading stats:", error)
      setError(error instanceof Error ? error.message : "Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const testConnection = async () => {
    try {
      console.log("Testing database connection...")
      const response = await fetch("/api/test")
      const data = await response.json()
      setConnectionTest(data)

      if (data.success) {
        toast({
          title: "Connection successful",
          description: "Database is working properly",
        })
        // Retry loading stats after successful connection test
        loadStats()
      } else {
        toast({
          title: "Connection failed",
          description: data.error || "Database connection failed",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Connection test failed:", error)
      toast({
        title: "Connection test failed",
        description: "Could not test database connection",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Database Connection Issue
            </CardTitle>
            <CardDescription>{error || "Failed to load dashboard data"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={loadStats} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button onClick={testConnection} variant="outline" size="sm">
                Test Connection
              </Button>
            </div>

            {connectionTest && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Connection Test Result:</h4>
                <pre className="text-sm overflow-auto">{JSON.stringify(connectionTest, null, 2)}</pre>
              </div>
            )}

            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Troubleshooting steps:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Check if MONGODB_URI is set in Vercel environment variables</li>
                <li>Verify your MongoDB connection string is correct</li>
                <li>Ensure your MongoDB instance is running and accessible</li>
                <li>Check if your IP is whitelisted (for MongoDB Atlas)</li>
                <li>
                  Try running the seed script: <code>npm run seed</code>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 force-light-mode">
      <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border border-primary text-black !bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total Products</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.totalProducts}</div>
            <p className="text-xs text-primary">+{stats.newProducts} new this month</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-primary text-black !bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Categories</CardTitle>
            <BarChart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.totalCategories}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-primary text-black !bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Gallery Images</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.totalGalleryImages}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-primary text-black !bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Messages</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.totalMessages}</div>
            <p className="text-xs text-primary">{stats.unreadMessages} unread</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white border border-primary text-black !bg-white">
          <CardHeader>
            <CardTitle className="text-primary">Recent Products</CardTitle>
            <CardDescription className="text-primary">Recently added products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentProducts.length > 0 ? (
                stats.recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center">
                    <div className="w-10 h-10 rounded bg-primary/10 mr-4"></div>
                    <div>
                      <p className="font-medium text-black">{product.name}</p>
                      <p className="text-sm text-primary">{new Date(product.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-primary text-sm">No products yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-primary text-black !bg-white">
          <CardHeader>
            <CardTitle className="text-primary">Recent Messages</CardTitle>
            <CardDescription className="text-primary">Latest contact form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentMessages.length > 0 ? (
                stats.recentMessages.map((message) => (
                  <div key={message.id} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 mr-4"></div>
                    <div>
                      <p className="font-medium text-black">{message.name}</p>
                      <p className="text-sm text-primary">{new Date(message.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-primary text-sm">No messages yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
