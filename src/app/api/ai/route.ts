import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/api';
import { aiRequestSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...requestData } = body;

    if (action === 'route-optimization') {
      const { origin, destination, preferences } = requestData;
      
      if (!origin || !destination) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Origin and destination are required',
              code: 'MISSING_PARAMETERS',
              timestamp: new Date()
            }
          },
          { status: 400 }
        );
      }

      const result = await aiClient.optimizeRoute({
        origin,
        destination,
        preferences: preferences || {
          avoidTolls: false,
          avoidHighways: false,
          optimizeFor: 'time'
        }
      });

      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    if (action === 'customer-support') {
      const validatedData = aiRequestSchema.parse(requestData);
      
      const result = await aiClient.generateCustomerSupport(
        validatedData.prompt,
        validatedData.context
      );

      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    if (action === 'demand-prediction') {
      const { location, timeContext } = requestData;
      
      if (!location) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Location is required for demand prediction',
              code: 'MISSING_PARAMETERS',
              timestamp: new Date()
            }
          },
          { status: 400 }
        );
      }

      const result = await aiClient.predictDemand(
        location,
        timeContext || new Date().toISOString()
      );

      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Invalid action',
          code: 'INVALID_ACTION',
          timestamp: new Date()
        }
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('AI API error:', error);
    
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'health') {
    return NextResponse.json({
      success: true,
      data: {
        service: 'AI API',
        status: 'healthy',
        timestamp: new Date(),
        features: [
          'route-optimization',
          'customer-support', 
          'demand-prediction'
        ]
      }
    });
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'Invalid action',
        code: 'INVALID_ACTION',
        timestamp: new Date()
      }
    },
    { status: 400 }
  );
}