// Authentication service
import { cookies } from "next/headers"

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  avatar?: string
}

interface Session {
  user: User
}

const SESSION_COOKIE_NAME = "admin-session"

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

    if (!sessionCookie) {
      return null
    }

    // In a real app, you would verify the JWT or session token here
    // For demo purposes, we'll parse the stored user data
    const sessionData = JSON.parse(sessionCookie.value)
    return sessionData
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function createSession(user: User): Promise<Session> {
  const session = { user }

  // Set the session cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return session
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
