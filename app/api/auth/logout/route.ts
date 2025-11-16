import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('auth-token')

    return NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error logging out:', error)
    return NextResponse.json(
      { error: 'Failed to logout', details: error.message },
      { status: 500 }
    )
  }
}

