'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { Filter, X } from 'lucide-react'

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  category: string | null
  stock: number
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      const filtered = products.filter(
        (product) => product.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [selectedCategory, products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.map((p: Product) => p.category).filter(Boolean))
      ) as string[]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilter = () => {
    setSelectedCategory(null)
    // Update URL without category parameter
    window.history.pushState({}, '', '/products')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
          </h1>
          <p className="text-lg text-white/90">
            {selectedCategory 
              ? `Browse our ${selectedCategory.toLowerCase()} collection`
              : 'Discover our complete product range'}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={clearFilter}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      !selectedCategory
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category)
                        window.history.pushState({}, '', `/products?category=${encodeURIComponent(category)}`)
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        selectedCategory?.toLowerCase() === category.toLowerCase()
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filter */}
              {selectedCategory && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between bg-indigo-50 px-4 py-2 rounded-lg">
                    <span className="text-sm font-semibold text-indigo-700">
                      {selectedCategory}
                    </span>
                    <button
                      onClick={clearFilter}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Clear filter"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 font-medium">
                Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> of{' '}
                <span className="font-bold text-gray-900">{products.length}</span> products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-16 h-16 text-indigo-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedCategory ? `No Products Found in ${selectedCategory}` : 'No Products Available'}
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  {selectedCategory
                    ? 'Try selecting a different category or browse all products.'
                    : "We don't have any products yet."}
                </p>
                {selectedCategory && (
                  <button
                    onClick={clearFilter}
                    className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
                  >
                    View All Products
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
