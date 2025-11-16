import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin-token')

    return NextResponse.json(
      {
        success: true,
        message: 'Admin logout successful',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error logging out admin:', error)
    return NextResponse.json(
      { error: 'Failed to logout', details: error.message },
      { status: 500 }
    )
  }
}

