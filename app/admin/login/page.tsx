'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { Mail, Lock, LogIn, Loader, AlertCircle, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Redirect to admin dashboard
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-indigo-50/30 to-purple-50/30">
      <Header />

      {/* Premium Breadcrumbs */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-indigo-100">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-indigo-600 hover:text-purple-600 font-medium transition">
              Home
            </Link>
            <span className="text-indigo-300">/</span>
            <Link href="/admin" className="text-indigo-600 hover:text-purple-600 font-medium transition">
              Admin
            </Link>
            <span className="text-indigo-300">/</span>
            <span className="text-gray-900 font-semibold">Login</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-indigo-100">
            <div className="mb-6 flex justify-center">
              <div className="p-6 bg-gradient-to-br from-red-100 to-orange-100 rounded-full">
                <Shield className="w-16 h-16 text-red-600" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-900 to-orange-900 bg-clip-text text-transparent mb-2 text-center">
              Admin Login
            </h1>
            <p className="text-gray-600 mb-8 text-center">
              Access admin dashboard
            </p>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Mail className="w-5 h-5 text-red-600" />
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                  placeholder="admin@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Lock className="w-5 h-5 text-red-600" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                  placeholder="Enter your password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-6 h-6" />
                    Login to Admin Panel
                  </>
                )}
              </button>
            </form>

            {/* Customer Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Not an admin?{' '}
                <Link href="/login" className="text-indigo-600 hover:text-purple-600 font-semibold transition">
                  Customer Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

