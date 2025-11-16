'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, ShoppingBag, User, Menu, X, Package, LogOut, LogIn, Shield } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { cartItems } = useCart()
  const { user, logout, loading: authLoading } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const cartCount = isClient ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-indigo-600 text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span>Free Shipping on Orders Over $50</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/about" className="hover:text-indigo-200 transition">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-indigo-200 transition">
              Contact
            </Link>
            <span>|</span>
            <Link href="/track-order" className="hover:text-indigo-200 transition">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CraveCozy
            </span>
          </Link>

          {/* Search Bar and Navigation - Desktop */}
          <div className="hidden lg:flex flex-1 items-center gap-6 mx-8">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-indigo-500 transition-all"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-semibold transition relative group text-sm">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-indigo-600 font-semibold transition relative group text-sm">
                All Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/category" className="text-gray-700 hover:text-indigo-600 font-semibold transition relative group text-sm">
                Categories
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/sale" className="text-red-600 hover:text-red-700 font-semibold transition relative group text-sm">
                Sale
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/admin/login" className="text-red-600 hover:text-red-700 font-semibold transition relative group flex items-center gap-1 text-sm">
                <Shield className="w-4 h-4" />
                Admin
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </Link>
            </nav>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-6">
            {/* Search Icon - Mobile */}
            <button className="lg:hidden text-gray-700 hover:text-indigo-600 transition">
              <Search className="w-6 h-6" />
            </button>

            {/* User Account / Login */}
            {isClient && !authLoading && (
              <>
                {user ? (
                  <>
                    <Link href="/my-orders" className="hidden md:flex flex-col items-center text-gray-700 hover:text-indigo-600 transition group">
                      <Package className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">My Orders</span>
                    </Link>
                    <div className="hidden md:flex flex-col items-center text-gray-700 group relative">
                      <User className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">{user.name.split(' ')[0]}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="hidden md:flex flex-col items-center text-gray-700 hover:text-red-600 transition group"
                    >
                      <LogOut className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">Logout</span>
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="hidden md:flex flex-col items-center text-gray-700 hover:text-indigo-600 transition group">
                    <LogIn className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs">Login</span>
                  </Link>
                )}
              </>
            )}

            {/* Shopping Cart */}
            <Link href="/cart" className="relative flex flex-col items-center text-gray-700 hover:text-indigo-600 transition group">
              <ShoppingBag className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs hidden md:block">Cart</span>
              {isClient && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-indigo-600 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-indigo-600 font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>
                All Products
              </Link>
              <Link href="/category" className="text-gray-700 hover:text-indigo-600 font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>
                Categories
              </Link>
              <Link href="/sale" className="text-red-600 hover:text-red-700 font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>
                Sale
              </Link>
              <Link href="/admin/login" className="text-red-600 hover:text-red-700 font-semibold py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Shield className="w-4 h-4" />
                Admin Login
              </Link>
              {user ? (
                <>
                  <Link href="/my-orders" className="text-gray-700 hover:text-indigo-600 font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>
                    My Orders
                  </Link>
                  <div className="text-gray-700 font-semibold py-2 border-t border-gray-200 mt-2 pt-2">
                    <p className="text-sm text-gray-600">Logged in as</p>
                    <p className="text-indigo-600">{user.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left text-red-600 hover:text-red-700 font-semibold py-2 flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-gray-700 hover:text-indigo-600 font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
