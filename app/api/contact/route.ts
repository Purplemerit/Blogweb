import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendContactEmail } from '@/lib/email'

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validatedData = contactSchema.parse(body)

    // Send email notifications
    await sendContactEmail(validatedData)
    console.log('Contact emails sent successfully')

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
    }, { status: 201 })

  } catch (error) {
    console.error('Contact form error:', error)

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 })
    }

    // Handle other errors
    return NextResponse.json({
      success: false,
      error: 'Failed to submit contact form. Please try again later.',
    }, { status: 500 })
  }
}
