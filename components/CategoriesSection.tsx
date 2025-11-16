'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Shirt, ShoppingBag, Watch, Glasses } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  imageUrl: string | null
  productCount: number
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Keep empty array to show fallback categories
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  // Fallback categories with icons
  const defaultCategories = [
    { name: 'Women\'s Fashion', icon: Shirt, gradient: 'from-pink-400 to-rose-500', slug: 'womens-fashion' },
    { name: 'Men\'s Fashion', icon: Shirt, gradient: 'from-blue-400 to-indigo-500', slug: 'mens-fashion' },
    { name: 'Accessories', icon: Sparkles, gradient: 'from-purple-400 to-pink-500', slug: 'accessories' },
    { name: 'Bags', icon: ShoppingBag, gradient: 'from-orange-400 to-red-500', slug: 'bags' },
    { name: 'Watches', icon: Watch, gradient: 'from-cyan-400 to-blue-500', slug: 'watches' },
    { name: 'Sunglasses', icon: Glasses, gradient: 'from-yellow-400 to-orange-500', slug: 'sunglasses' },
  ]

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Discover our curated collections</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Only show fallback if no categories from API
  const displayCategories = categories.length > 0 
    ? categories 
    : defaultCategories.map((cat, idx) => ({
        id: idx + 1,
        name: cat.name,
        slug: cat.slug,
        imageUrl: null,
        productCount: 0,
        icon: cat.icon,
        gradient: cat.gradient,
      }))

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our carefully curated collections and find your perfect style
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {displayCategories.slice(0, 6).map((category, index) => {
            // For categories from API, assign gradient and icon based on index
            // For fallback categories, use their predefined gradient/icon
            const gradients = [
              'from-pink-400 to-rose-500',
              'from-blue-400 to-indigo-500',
              'from-purple-400 to-pink-500',
              'from-orange-400 to-red-500',
              'from-cyan-400 to-blue-500',
              'from-yellow-400 to-orange-500',
            ]
            
            const Icon = (category as any).icon || Shirt
            const gradient = (category as any).gradient || gradients[index % gradients.length]
            
            return (
              <Link
                key={category.id || index}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Category Image or Gradient */}
                <div className={`aspect-square relative overflow-hidden bg-gradient-to-br ${gradient}`}>
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-16 h-16 text-white opacity-80 group-hover:scale-125 transition-transform duration-500" />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Product Count Badge */}
                  {category.productCount > 0 && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-bold text-gray-900">{category.productCount} Items</span>
                    </div>
                  )}
                </div>

                {/* Category Info */}
                <div className="p-5 bg-white">
                  <h3 className="font-bold text-gray-900 text-center mb-2 group-hover:text-indigo-600 transition-colors text-sm md:text-base">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-semibold">Shop Now</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            View All Categories
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
