"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) {
      router.push("/admin/dashboard")
    } else {
      alert("Login failed")
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-96 space-y-4">
        <input
          className="w-full border p-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full border p-2"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-black text-white p-2"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  )
}