"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/login")
      return
    }
    // Optionally decode token or fetch user info
    // For now, greet with placeholder
    setUsername(localStorage.getItem("username") || "User")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <main>
        <p className="text-lg text-gray-700">Welcome back{username ? `, ${username}` : ""}!</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Hospitals</h2>
            <p className="text-gray-600">View and manage hospitals</p>
            <Link
              href="/hospitals"
              className="mt-4 inline-block text-cyan-600 hover:underline"
            >
              Go to Hospitals
            </Link>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <p className="text-gray-600">Manage user accounts</p>
            <Link
              href="/users"
              className="mt-4 inline-block text-cyan-600 hover:underline"
            >
              Go to Users
            </Link>
          </div>
          {/* Add more cards for other resources */}
        </div>
      </main>
    </div>
  )
}
