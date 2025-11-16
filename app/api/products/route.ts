import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get category filter from query params if exists
    const url = new URL(request.url)
    const categoryFilter = url.searchParams.get('category')

    // Query products without category field (since column might not exist)
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        stock: true,
        createdAt: true,
        updatedAt: true,
        categoryId: true,
        categoryRel: {
          select: {
            name: true,
          },
        },
      },
    })

    // Transform products to include category name from relation
    let productsWithCategory = products.map((product) => {
      const categoryName = product.categoryRel?.name || null
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        category: categoryName,
        categoryId: product.categoryId,
      }
    })

    // Apply category filter if provided
    if (categoryFilter) {
      productsWithCategory = productsWithCategory.filter(
        (product) => product.category?.toLowerCase() === categoryFilter.toLowerCase()
      )
    }

    return NextResponse.json(productsWithCategory)
  } catch (error: any) {
    console.error('Error fetching products:', error)
    
    // Fallback: try without relation if category table doesn't exist
    if (error.code === 'P2022' || error.message?.includes('category')) {
      try {
        const products = await prisma.product.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
            stock: true,
            createdAt: true,
            updatedAt: true,
          },
        })

        // Add null category for all products
        const productsWithNullCategory = products.map((product) => ({
          ...product,
          category: null,
          categoryId: null,
        }))

        return NextResponse.json(productsWithNullCategory)
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError)
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Read body once and reuse
  let body: any
  try {
    body = await request.json()
  } catch (parseError) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }

  const { name, description, price, imageUrl, categoryId, stock } = body

  if (!name || !price) {
    return NextResponse.json(
      { error: 'Name and price are required' },
      { status: 400 }
    )
  }

  const productData: any = {
    name,
    description: description || null,
    price: parseFloat(price),
    imageUrl: imageUrl || null,
    stock: parseInt(stock) || 0,
  }

  // Only add categoryId if provided
  if (categoryId) {
    productData.categoryId = parseInt(categoryId)
  }

  try {
    const product = await prisma.product.create({
      data: productData,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        stock: true,
        categoryId: true,
        categoryRel: {
          select: {
            name: true,
          },
        },
      },
    })

    // Transform to include category name
    const productWithCategory = {
      ...product,
      category: product.categoryRel?.name || null,
    }

    return NextResponse.json(productWithCategory, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    
    // If error is about category column or relation, try without it
    if (error.code === 'P2022' || error.code === 'P2003' || error.message?.includes('category')) {
      try {
        const fallbackData: any = {
          name,
          description: description || null,
          price: parseFloat(price),
          imageUrl: imageUrl || null,
          stock: parseInt(stock) || 0,
        }

        // Only add categoryId if it doesn't cause relation errors
        // Skip it for now to avoid relation errors
        const product = await prisma.product.create({
          data: fallbackData,
        })

        return NextResponse.json({
          ...product,
          category: null,
          categoryId: null,
        }, { status: 201 })
      } catch (fallbackError) {
        console.error('Fallback create also failed:', fallbackError)
      }
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
