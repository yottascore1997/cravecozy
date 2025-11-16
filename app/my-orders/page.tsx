'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
  LogIn
} from 'lucide-react'

interface OrderItem {
  id: number
  productId: number
  productName: string
  price: number
  quantity: number
  imageUrl: string | null
  product?: {
    id: number
    name: string
    imageUrl: string | null
  }
}

interface Order {
  id: number
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  deliveryCity: string
  deliveryState: string
  deliveryZip: string
  paymentMethod: string
  status: string
  subtotal: number
  shipping: number
  total: number
  createdAt: string
  items: OrderItem[]
}

export default function MyOrdersPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchOrders()
      } else {
        setLoading(false)
      }
    }
  }, [user, authLoading])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login?return=/my-orders')
          return
        }
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders || [])
      setError('')
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      setError('Failed to load orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'confirmed':
      case 'processing':
        return <Package className="w-5 h-5 text-blue-600" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-indigo-600" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-indigo-50/30 to-purple-50/30">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
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
              <span className="text-gray-900 font-semibold">My Orders</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-indigo-100">
              <div className="mb-6 flex justify-center">
                <div className="p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full">
                  <LogIn className="w-16 h-16 text-indigo-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4 text-center">
                Login Required
              </h1>
              <p className="text-gray-600 mb-6 text-center">
                Please login to your account to view your orders
              </p>
              <Link
                href={`/login?return=/my-orders`}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-3"
              >
                <LogIn className="w-5 h-5" />
                Login to View Orders
              </Link>
            </div>
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
            <span className="text-gray-900 font-semibold">My Orders</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-2">
            My Orders
          </h1>
          {user && (
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-indigo-100">
              <div className="mb-6 flex justify-center">
                <div className="p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full">
                  <Package className="w-16 h-16 text-indigo-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4">
                No Orders Yet
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                You haven't placed any orders yet. Start shopping now!
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
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-xl p-8 border-2 border-indigo-100 hover:shadow-2xl transition-all"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b-2 border-indigo-100">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <span
                        className={`px-4 py-2 rounded-full font-semibold border-2 flex items-center gap-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {order.customerEmail}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ${Number(order.total).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-4 border border-indigo-100"
                    >
                      <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border-2 border-indigo-100 flex-shrink-0">
                        {item.imageUrl || item.product?.imageUrl ? (
                          <Image
                            src={item.imageUrl || item.product?.imageUrl || ''}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{item.productName}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}
                        </p>
                        <p className="text-lg font-bold text-indigo-600">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Information */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200 mb-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Delivery Address
                  </h4>
                  <div className="space-y-2 text-gray-700">
                    <p className="font-semibold">{order.customerName}</p>
                    <p>{order.deliveryAddress}</p>
                    <p>
                      {order.deliveryCity}, {order.deliveryState} {order.deliveryZip}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span>{order.customerPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="flex justify-end">
                  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-6 border-2 border-indigo-200 min-w-[300px]">
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">Subtotal:</span>
                        <span className="font-bold">${Number(order.subtotal).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">Shipping:</span>
                        <span className="font-bold">
                          ${Number(order.shipping).toFixed(2)}
                        </span>
                      </div>
                      <div className="pt-3 border-t-2 border-indigo-200 flex justify-between items-baseline">
                        <span className="text-lg font-bold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          ${Number(order.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Shopping */}
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-purple-600 font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

