'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import { useCart } from '@/contexts/CartContext'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  ShoppingBag,
  Truck,
  Shield,
  CreditCard,
  X
} from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const total = getCartTotal()
  const shipping = total >= 50 ? 0 : 10
  const finalTotal = total + shipping

  const handleQuantityChange = (id: number, delta: number) => {
    const item = cartItems.find((i) => i.id === id)
    if (item) {
      const newQuantity = item.quantity + delta
      if (newQuantity >= 1 && newQuantity <= item.stock) {
        updateQuantity(id, newQuantity)
      }
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    )
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
            <span className="text-gray-900 font-semibold">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-indigo-100">
              <div className="mb-6 flex justify-center">
                <div className="p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full">
                  <ShoppingBag className="w-16 h-16 text-indigo-600" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4">
                Your cart is empty
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                href="/products"
                className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all text-lg shadow-xl"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Header */}
              <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-indigo-100">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                    Shopping Cart
                  </h1>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear Cart
                  </button>
                </div>
                <p className="text-gray-600 mt-2">{cartItems.length} item(s) in your cart</p>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-indigo-200 transition-all"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="relative w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border-2 border-indigo-100 flex-shrink-0">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <Link
                              href={`/products/${item.id}`}
                              className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition mb-2 block"
                            >
                              {item.name}
                            </Link>
                            {item.category && (
                              <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-xs font-semibold mb-3">
                                {item.category}
                              </span>
                            )}
                            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-gray-600 text-sm">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="mt-4 flex items-center gap-4">
                          <span className="text-gray-700 font-semibold">Quantity:</span>
                          <div className="flex items-center border-2 border-indigo-300 rounded-xl overflow-hidden bg-white shadow-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="px-4 py-2 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1
                                if (val >= 1 && val <= item.stock) {
                                  updateQuantity(item.id, val)
                                }
                              }}
                              className="w-16 text-center font-bold text-lg focus:outline-none bg-white"
                              min="1"
                              max={item.stock}
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              disabled={item.quantity >= item.stock}
                              className="px-4 py-2 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="text-gray-600 text-sm">
                            {item.stock} available
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-purple-600 font-semibold transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 rounded-3xl shadow-2xl p-8 space-y-6 sticky top-24 border-2 border-indigo-100">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                  Order Summary
                </h2>

                {/* Summary Items */}
                <div className="space-y-4 pt-4 border-t-2 border-indigo-200">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Subtotal:</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Shipping:</span>
                    <span className="font-bold">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && total < 50 && (
                    <p className="text-sm text-indigo-600 font-semibold bg-indigo-50 p-2 rounded-lg">
                      Add ${(50 - total).toFixed(2)} more for free shipping!
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-indigo-200">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-bold text-gray-900">Total:</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-5 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-xl"
                >
                  <CreditCard className="w-6 h-6" />
                  Proceed to Checkout
                </button>

                {/* Trust Badges */}
                <div className="space-y-4 pt-6 border-t-2 border-indigo-200">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Free Shipping</p>
                      <p className="text-sm text-gray-600">On orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Secure Payment</p>
                      <p className="text-sm text-gray-600">100% secure checkout</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

