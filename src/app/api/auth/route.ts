import { NextRequest, NextResponse } from 'next/server';
import { login, signup } from '@/lib/auth';
import { loginSchema, signupSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'login') {
      // Validate login data
      const validatedData = loginSchema.parse(body);
      const result = await login(validatedData);
      
      if (result.success) {
        return NextResponse.json(result, { status: 200 });
      } else {
        return NextResponse.json(result, { status: 400 });
      }
    }

    if (action === 'signup') {
      // Validate signup data
      const validatedData = signupSchema.parse(body);
      const result = await signup(validatedData);
      
      if (result.success) {
        return NextResponse.json(result, { status: 201 });
      } else {
        return NextResponse.json(result, { status: 400 });
      }
    }

    return NextResponse.json(
      { success: false, error: { message: 'Invalid action', code: 'INVALID_ACTION', timestamp: new Date() } },
      { status: 400 }
    );

  } catch (error) {
    console.error('Auth API error:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: error,
            timestamp: new Date()
          }
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          timestamp: new Date()
        }
      },
      { status: 500 }
    );
  }
}