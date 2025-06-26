"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ChangePasswordPage() {
  const router = useRouter()
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string|null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirm) {
      setError("New passwords do not match")
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("access_token")
      const res = await fetch("http://127.0.0.1:5000/api/change-password/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword
        })
      })

      if (res.ok) {
        setSuccess(true)
        // clear tokens
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        // redirect after a moment
        setTimeout(() => router.push("/login"), 1500)
      } else {
        const data = await res.json()
        setError(data.old_password?.[0] || data.detail || "Failed to change password")
      }
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center text-cyan-500 mb-4">
        CHANGE PASSWORD
      </h2>

      {error && <p className="text-red-600 text-center">{error}</p>}
      {success && (
        <p className="text-green-600 text-center">
          Password changed! Redirecting to login…
        </p>
      )}

      <div>
        <label className="block mb-1">Old Password*</label>
        <input
          type="password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
          placeholder="Current password"
        />
      </div>

      <div>
        <label className="block mb-1">New Password*</label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
          placeholder="New password"
        />
      </div>

      <div>
        <label className="block mb-1">Confirm New Password*</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          className="w-full p-2 border rounded"
          placeholder="Re-enter new password"
        />
      </div>

      <button
        type="submit"
        disabled={loading || success}
        className="w-full py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition"
      >
        {loading ? "Saving…" : "Change Password"}
      </button>
    </form>
  )
}
