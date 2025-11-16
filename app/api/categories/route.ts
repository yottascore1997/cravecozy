import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Try to get categories from Category table first
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { categoryRel: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // If categories exist in Category table, return them
    if (categories.length > 0) {
      const categoriesWithCount = categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        imageUrl: cat.imageUrl,
        description: cat.description,
        productCount: cat._count.categoryRel,
      }))
      return NextResponse.json(categoriesWithCount)
    }

    // Fallback: Get categories from products (old way)
    const products = await prisma.product.findMany({
      where: {
        category: {
          not: null,
        },
      },
      select: {
        category: true,
        imageUrl: true,
      },
    })

    // Group products by category and count
    const categoryMap = new Map<string, { count: number; imageUrl: string | null }>()
    
    products.forEach((product: { category: string | null; imageUrl: string | null }) => {
      if (product.category) {
        const categoryName = product.category.trim()
        if (categoryMap.has(categoryName)) {
          const existing = categoryMap.get(categoryName)!
          existing.count++
          if (!existing.imageUrl && product.imageUrl) {
            existing.imageUrl = product.imageUrl
          }
        } else {
          categoryMap.set(categoryName, {
            count: 1,
            imageUrl: product.imageUrl,
          })
        }
      }
    })

    // Convert map to array and format response
    const fallbackCategories = Array.from(categoryMap.entries()).map(([name, data], index) => ({
      id: index + 1,
      name: name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      imageUrl: data.imageUrl,
      productCount: data.count,
    }))

    fallbackCategories.sort((a, b) => b.productCount - a.productCount)

    return NextResponse.json(fallbackCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, imageUrl, description } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        imageUrl: imageUrl || null,
        description: description || null,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error('Error creating category:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
