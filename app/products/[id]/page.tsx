'use client'

import { useEffect, useState, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import { useCart } from '@/contexts/CartContext'
import { 
  ShoppingCart, 
  Heart, 
  ArrowLeft, 
  Star, 
  Package, 
  Truck, 
  Check,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  CheckCircle
} from 'lucide-react'

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  category: string | null
  stock: number
}

function ProductDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const id = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${id}`)
      
      if (!response.ok) {
        throw new Error('Product not found')
      }

      const data = await response.json()
      setProduct(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const newQuantity = prev + delta
      if (newQuantity < 1) return 1
      if (product && newQuantity > product.stock) return product.stock
      return newQuantity
    })
  }

  // Generate multiple image variations (in real app, these would come from API)
  const productImages = product?.imageUrl 
    ? [
        product.imageUrl,
        product.imageUrl, // In real app, these would be different images
        product.imageUrl,
        product.imageUrl,
      ]
    : []

  // Convert price to number (handles Prisma Decimal type)
  const productPrice = product ? Number(product.price) : 0

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        price: productPrice,
        imageUrl: product.imageUrl,
        quantity: quantity,
        stock: product.stock,
        category: product.category,
      })
      setAddedToCart(true)
      setTimeout(() => {
        setAddedToCart(false)
      }, 3000)
      // Navigate to cart after a short delay
      setTimeout(() => {
        router.push('/cart')
      }, 1000)
    }
  }
  
  // Calculate discount (assuming 40% off for sale items)
  const originalPrice = productPrice > 0 ? productPrice / 0.6 : 0
  const discount = productPrice > 0 ? Math.round((1 - productPrice / originalPrice) * 100) : 0
  const savings = originalPrice - productPrice

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Premium Breadcrumbs */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-indigo-100">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-indigo-600 hover:text-purple-600 font-medium transition">
              Home
            </Link>
            <span className="text-indigo-300">/</span>
            <Link href="/products" className="text-indigo-600 hover:text-purple-600 font-medium transition">
              Products
            </Link>
            <span className="text-indigo-300">/</span>
            <span className="text-gray-900 font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Premium Product Details Section */}
      <section className="container mx-auto px-4 py-12 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Product Images */}
          <div className="lg:col-span-1">
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl mb-4 border-4 border-white">
              {productImages[selectedImageIndex] ? (
                <Image
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <Package className="w-24 h-24 text-indigo-400" />
                </div>
              )}
              
              {/* Premium Sale Badge */}
              {discount > 0 && (
                <div className="absolute top-6 left-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-2xl transform rotate-[-5deg] border-2 border-white/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    SALE {discount}% OFF
                  </div>
                </div>
              )}
            </div>

            {/* Premium Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square bg-white rounded-xl overflow-hidden border-4 transition-all transform ${
                      selectedImageIndex === index
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl scale-105 ring-4 ring-indigo-200'
                        : 'border-gray-200 hover:border-indigo-400 hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      fill
                      className={`object-cover ${selectedImageIndex === index ? 'opacity-90' : ''}`}
                      sizes="25vw"
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/30 to-transparent"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center Column - Premium Product Details */}
          <div className="lg:col-span-1 space-y-6 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            {/* Premium Category Badge */}
            {product.category && (
              <div>
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-sm font-bold shadow-lg">
                  {product.category}
                </span>
              </div>
            )}

            {/* Premium Product Title */}
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent leading-tight">
              {product.name}
            </h1>

            {/* Premium Rating */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < 4 ? 'fill-yellow-400 text-yellow-400 drop-shadow-md' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-700 font-semibold">2 Reviews</span>
            </div>

            {/* Premium Price */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-100">
              {discount > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ${productPrice.toFixed(2)}
                    </span>
                    <span className="text-2xl text-gray-400 line-through font-semibold">
                      ${originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-green-600 font-bold text-sm flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Save ${savings.toFixed(2)} ({discount}% OFF)
                  </p>
                </div>
              ) : (
                <span className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${productPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Premium Description */}
            <div className="prose max-w-none bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'Premium quality product with excellent craftsmanship. Perfect for any occasion. Made with the finest materials and attention to detail.'}
              </p>
            </div>

            {/* Premium Stock Status */}
            {product.stock > 0 ? (
              <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                <div className="p-2 bg-green-500 rounded-full">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-green-700">In Stock - {product.stock} available</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border-2 border-red-200">
                <span className="font-bold text-red-600">Out of Stock</span>
              </div>
            )}

            {/* Premium Quantity Selector */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
              <label className="text-gray-800 font-bold text-lg mb-4 block">Quantity:</label>
              <div className="flex items-center border-2 border-indigo-300 rounded-xl overflow-hidden bg-white shadow-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-5 py-3 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1
                    if (val >= 1 && val <= product.stock) {
                      setQuantity(val)
                    }
                  }}
                  className="w-20 text-center font-bold text-lg focus:outline-none bg-white"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="px-5 py-3 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Premium Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addedToCart}
                className={`flex-1 px-8 py-5 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-xl ${
                  addedToCart
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white'
                }`}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    Add To Cart
                  </>
                )}
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`px-6 py-5 rounded-2xl font-bold transition-all shadow-xl hover:scale-105 ${
                  isWishlisted
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-red-50 hover:to-pink-50'
                }`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Column - Premium Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 rounded-3xl shadow-2xl p-8 space-y-6 sticky top-24 border-2 border-indigo-100">
              {/* Premium Easy Returns */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <RotateCcw className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">Easy Returns</h3>
                    <p className="text-red-600 font-bold text-lg">5 Days</p>
                  </div>
                </div>
              </div>

              {/* Premium Free Shipping */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">Free Shipping</h3>
                    <p className="text-gray-700 font-semibold">On All Orders</p>
                  </div>
                </div>
              </div>

              {/* Premium Savings Info */}
              {discount > 0 && (
                <div className="bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 border-2 border-green-300 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center gap-3 text-green-700">
                    <div className="p-2 bg-green-500 rounded-full">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg">
                      You will save {discount}% on this order
                    </span>
                  </div>
                </div>
              )}

              {/* Premium Price Summary */}
              <div className="pt-6 border-t-2 border-indigo-200 space-y-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
                {discount > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span className="font-semibold">Original Price:</span>
                    <span className="line-through font-bold">${originalPrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-indigo-200">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ${(productPrice * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Premium Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addedToCart}
                className={`w-full px-6 py-5 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-xl ${
                  addedToCart
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white'
                }`}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    Add To Cart
                  </>
                )}
              </button>

              {/* Premium Back Button */}
              <button
                onClick={() => router.back()}
                className="w-full flex items-center justify-center gap-2 text-indigo-600 hover:text-purple-600 transition font-bold bg-indigo-50 hover:bg-indigo-100 py-3 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function ProductDetailPage() {
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
      <ProductDetailContent />
    </Suspense>
  )
}
