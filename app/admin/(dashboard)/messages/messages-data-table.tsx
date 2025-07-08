"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/data-table"
import { markMessageAsRead as originalMarkMessageAsRead, deleteMessage as originalDeleteMessage } from "@/lib/actions"
import { Eye, EyeOff, Trash2 } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  name: string
  number: string // phone number
  message: string
  createdAt: string
  read: boolean
}

interface MessagesDataTableProps {
  messages: Message[]
}

export default function MessagesDataTable({ messages }: MessagesDataTableProps) {
  async function markMessageAsRead(formData: FormData) {
    await originalMarkMessageAsRead(formData);
  }

  async function deleteMessage(formData: FormData) {
    await originalDeleteMessage(formData);
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message, idx) => (
            <tr key={message.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50" + " hover:bg-blue-50 transition"}>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">{message.name}</td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">{message.number}</td>
              <td
                className="px-6 py-4 whitespace-nowrap border-b border-gray-200 max-w-xs truncate"
                title={message.message}
              >
                {message.message}
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                <span className={`inline-block px-2 py-1 text-xs rounded ${message.read ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white'}`}>{message.read ? 'Read' : 'Unread'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">{new Date(message.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap flex gap-2 border-b border-gray-200">
                <Link href={`/admin/messages/${message.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Eye className="w-4 h-4" /> View
                  </Button>
                </Link>
                <form action={markMessageAsRead} style={{ display: 'inline' }}>
                  <input type="hidden" name="id" value={message.id} />
                  <input type="hidden" name="read" value={(!message.read).toString()} />
                  <Button variant="outline" size="sm" type="submit">
                    {message.read ? 'Mark Unread' : 'Mark Read'}
                  </Button>
                </form>
                <form action={deleteMessage} style={{ display: 'inline' }}>
                  <input type="hidden" name="id" value={message.id} />
                  <Button variant="destructive" size="sm" type="submit">Delete</Button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
