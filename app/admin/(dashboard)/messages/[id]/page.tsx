"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { markMessageAsRead } from "@/lib/actions"

export default function ViewMessagePage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params as { id: string }
  const [message, setMessage] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/messages/${id}`)
      .then(res => res.json())
      .then(async data => {
        setMessage(data)
        setLoading(false)
        // Mark as read if not already
        if (data && data.read === false) {
          const formData = new FormData()
          formData.append("id", id)
          formData.append("read", "true")
          await markMessageAsRead(formData)
        }
      })
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!message) return <div>Message not found.</div>

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Message from {message.name}</CardTitle>
          <CardDescription>{message.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <strong>Status:</strong> {message.read ? "Read" : "Unread"}
          </div>
          <div className="mb-4">
            <strong>Date:</strong> {new Date(message.createdAt).toLocaleString()}
          </div>
          <div className="mb-4">
            <strong>Message:</strong>
            <div className="border rounded p-2 mt-2 bg-gray-50 whitespace-pre-line">{message.message}</div>
          </div>
          <Button variant="outline" onClick={() => router.push("/admin/messages")}>Back to Messages</Button>
        </CardContent>
      </Card>
    </div>
  )
} 