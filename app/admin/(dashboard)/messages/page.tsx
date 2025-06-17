import { getMessages } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import MessagesDataTable from "./messages-data-table"

export default async function AdminMessagesPage() {
  const messages = await getMessages()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Total: {messages.length}</Badge>
          <Badge variant="default">Unread: {messages.filter((m) => !m.read).length}</Badge>
        </div>
      </div>

      <MessagesDataTable messages={messages as any} />
    </div>
  )
}
