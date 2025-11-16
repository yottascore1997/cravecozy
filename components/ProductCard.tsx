'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Heart, Eye } from 'lucide-react'

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  category: string | null
  stock: number
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const defaultImage = 'https://via.placeholder.com/400x500?text=No+Image'
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <div
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={product.imageUrl || defaultImage}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
        
        {/* Badges */}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            Out of Stock
          </div>
        )}
        {product.stock > 0 && product.stock < 10 && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            Low Stock
          </div>
        )}

        {/* Action Buttons - Show on Hover */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-500 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsWishlisted(!isWishlisted)
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            } shadow-lg hover:scale-110`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <Link
            href={`/products/${product.id}`}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-gray-700 flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
            aria-label="View product"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>

        {/* Quick Add Button - Show on Hover */}
        {product.stock > 0 && (
          <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <ShoppingBag className="w-5 h-5" />
              Quick Add
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <span className="text-indigo-600 text-xs font-bold uppercase tracking-wide mb-2 block">
          {product.category || 'Uncategorized'}
        </span>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.description || 'Premium quality product'}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
          </div>
          <Link
            href={`/products/${product.id}`}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            View
          </Link>
        </div>
      </div>
    </div>
  )
}
