'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Sparkles, ArrowRight, Star, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'

interface Slide {
  id: number
  badge: string
  title: string
  subtitle: string
  description: string
  salePercent: number
  saleText: string
  buttonText: string
  buttonLink: string
  bgGradient: string
  image: string
  overlayColor: string
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const slides: Slide[] = [
    {
      id: 1,
      badge: "New Collection 2024",
      title: "Fashion",
      subtitle: "Redefined",
      description: "Discover the latest trends and elevate your style with our exclusive collection",
      salePercent: 50,
      saleText: "Flash Sale",
      buttonText: "Shop Now",
      buttonLink: "/products",
      bgGradient: "from-indigo-50 via-purple-50 via-pink-50 to-rose-50",
      image: "/images/hero1.png",
      overlayColor: "from-indigo-600/20 via-purple-600/20 to-pink-600/20"
    },
    {
      id: 2,
      badge: "Super Sale",
      title: "Style",
      subtitle: "Revolution",
      description: "Transform your wardrobe with premium fashion pieces at unbeatable prices",
      salePercent: 40,
      saleText: "Limited Time",
      buttonText: "Explore Sale",
      buttonLink: "/sale",
      bgGradient: "from-blue-50 via-indigo-50 via-purple-50 to-pink-50",
      image: "/images/hero1.png",
      overlayColor: "from-blue-600/20 via-indigo-600/20 to-purple-600/20"
    },
    {
      id: 3,
      badge: "Premium Quality",
      title: "Luxury",
      subtitle: "Elegance",
      description: "Experience unparalleled quality and sophistication in every piece",
      salePercent: 30,
      saleText: "Exclusive",
      buttonText: "View Collection",
      buttonLink: "/products",
      bgGradient: "from-purple-50 via-pink-50 via-rose-50 to-orange-50",
      image: "/images/hero1.png",
      overlayColor: "from-purple-600/20 via-pink-600/20 to-rose-600/20"
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (isAnimating) return prev
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 500)
        return (prev + 1) % slides.length
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length, isAnimating])

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToSlide = (index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="relative w-full overflow-hidden">
      {/* Main Hero Section with Slider */}
      <div className={`relative bg-gradient-to-br ${currentSlideData.bgGradient} min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center transition-all duration-700 ease-in-out`}>
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className={`space-y-8 relative z-10 transition-all duration-700 ${isAnimating ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-xl animate-pulse">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wide">{currentSlideData.badge}</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                    {currentSlideData.title}
                  </span>
                  <br />
                  <span className="text-gray-900">{currentSlideData.subtitle}</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-lg leading-relaxed">
                  {currentSlideData.description}
                </p>
              </div>

              {/* Sale Badge */}
              <div className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-2xl shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="text-4xl font-black">{currentSlideData.salePercent}%</div>
                  <div className="text-left">
                    <div className="text-xs font-semibold uppercase tracking-wider opacity-90">OFF</div>
                    <div className="text-sm font-bold">{currentSlideData.saleText}</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href={currentSlideData.buttonLink}
                  className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all shadow-xl"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {currentSlideData.buttonText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/category"
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-gray-300 hover:border-indigo-500 hover:shadow-xl transition-all backdrop-blur-sm bg-white/90"
                >
                  Explore Categories
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div className="group cursor-pointer">
                  <div className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">10K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">5★</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    Rated
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">500+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
              </div>
            </div>

            {/* Right Side - Hero Image */}
            <div className={`relative lg:col-span-1 transition-all duration-700 ${isAnimating ? 'opacity-0 translate-x-[20px] scale-95' : 'opacity-100 translate-x-0 scale-100'}`}>
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
                
                {/* Main Image Container */}
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-3xl transform rotate-6 opacity-20"></div>
                  <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-8 border-white transform hover:scale-105 transition-transform duration-500">
                    <Image
                      src={currentSlideData.image}
                      alt={currentSlideData.title}
                      fill
                      className="object-cover transition-all duration-700"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                    />
                    {/* Overlay Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${currentSlideData.overlayColor} via-transparent to-transparent`}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-pink-200/40 to-rose-200/40 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Slider Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl hover:bg-white hover:scale-110 transition-all border-2 border-gray-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl hover:bg-white hover:scale-110 transition-all border-2 border-gray-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? 'w-12 h-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg'
                  : 'w-3 h-3 bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all duration-5000"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Feature Icons Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800">Rapid shipping</h4>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800">Secure transaction</h4>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800">24/7 support</h4>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800">Bundle offer</h4>
          </div>
        </div>
      </div>
    </div>
  )
}
