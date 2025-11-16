'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import ProductForm from '@/components/ProductForm'
import AdminProductList from '@/components/AdminProductList'
import CategoryForm from '@/components/CategoryForm'
import AdminCategoryList from '@/components/AdminCategoryList'
import { Shield, Loader, LogOut, AlertCircle } from 'lucide-react'

type TabType = 'products' | 'categories'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('products')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [adminUser, setAdminUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  // Check admin authentication
  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      setAuthLoading(true)
      const response = await fetch('/api/auth/admin/me')
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/admin/login')
          return
        }
        throw new Error('Failed to verify admin access')
      }

      const data = await response.json()
      setAdminUser(data.user)
      setAuthError('')
    } catch (err: any) {
      console.error('Error checking admin auth:', err)
      setAuthError(err.message || 'Failed to verify admin access')
      router.push('/admin/login')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/admin/logout', {
        method: 'POST',
      })
      router.push('/admin/login')
    } catch (err) {
      console.error('Error logging out:', err)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProducts()
      } else {
        alert('Error deleting product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingProduct(null)
    setEditingCategory(null)
    fetchProducts()
    fetchCategories()
  }

  const handleCategoryEdit = (category: any) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleCategoryDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCategories()
        fetchProducts()
      } else {
        const data = await response.json()
        alert(data.error || 'Error deleting category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error deleting category')
    }
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Verifying admin access...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (authError && !adminUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-red-200">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
              <p className="text-gray-600 mb-6">{authError}</p>
              <Link
                href="/admin/login"
                className="inline-block bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
              >
                Go to Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            {adminUser && (
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-600" />
                Logged in as: <span className="font-semibold">{adminUser.name}</span>
              </p>
            )}
          </div>
          <div className="flex gap-4 items-center">
            {adminUser && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            )}
            <button
              onClick={() => {
                if (activeTab === 'products') {
                  setEditingProduct(null)
                } else {
                  setEditingCategory(null)
                }
                setShowForm(true)
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Add New {activeTab === 'products' ? 'Product' : 'Category'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('products')
              setShowForm(false)
              setEditingProduct(null)
              setEditingCategory(null)
            }}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'products'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-indigo-600'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => {
              setActiveTab('categories')
              setShowForm(false)
              setEditingProduct(null)
              setEditingCategory(null)
            }}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === 'categories'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-indigo-600'
            }`}
          >
            Categories
          </button>
        </div>

        {showForm && activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <ProductForm
              product={editingProduct}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false)
                setEditingProduct(null)
              }}
            />
          </div>
        )}

        {showForm && activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <CategoryForm
              category={editingCategory}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false)
                setEditingCategory(null)
              }}
            />
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">All Products</h2>
            <AdminProductList
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">All Categories</h2>
            <AdminCategoryList
              categories={categories}
              onEdit={handleCategoryEdit}
              onDelete={handleCategoryDelete}
            />
          </div>
        )}
      </div>
    </div>
    
  )
}
