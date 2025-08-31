import { API_CONFIG } from '@/lib/constants';
import { ApiResponse, AIRequest, AIResponse, RouteOptimizationRequest, OptimizedRoute } from '@/types/api';

// Generic API client
class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'API_ERROR',
          timestamp: new Date()
        }
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// AI API client for OpenRouter integration
export class AIClient {
  private client: ApiClient;

  constructor() {
    this.client = new ApiClient(API_CONFIG.openrouter.baseUrl, API_CONFIG.openrouter.headers);
  }

  async chat(request: AIRequest): Promise<ApiResponse<AIResponse>> {
    const payload = {
      model: request.model || API_CONFIG.openrouter.defaultModel,
      messages: request.messages,
      temperature: request.temperature || 0.7,
      max_tokens: request.max_tokens || 1000,
      stream: request.stream || false
    };

    return this.client.post<AIResponse>('', payload);
  }

  async optimizeRoute(request: RouteOptimizationRequest): Promise<ApiResponse<OptimizedRoute>> {
    const aiRequest: AIRequest = {
      model: API_CONFIG.openrouter.defaultModel,
      messages: [
        {
          role: 'system',
          content: `You are a route optimization expert. Given origin and destination coordinates, 
                   provide optimal route suggestions with distance, duration, and turn-by-turn directions.
                   Always respond with valid JSON in the following format:
                   {
                     "distance": number (in miles),
                     "duration": number (in minutes),
                     "route": [{"lat": number, "lng": number}],
                     "instructions": ["string array of turn-by-turn directions"],
                     "estimatedFuel": number (in gallons),
                     "tollCost": number (optional)
                   }`
        },
        {
          role: 'user',
          content: `Optimize route from ${request.origin.lat},${request.origin.lng} to ${request.destination.lat},${request.destination.lng}.
                   Preferences: avoid tolls: ${request.preferences.avoidTolls}, avoid highways: ${request.preferences.avoidHighways}, optimize for: ${request.preferences.optimizeFor}`
        }
      ]
    };

    const response = await this.chat(aiRequest);
    
    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error
      };
    }

    try {
      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content');
      }

      const optimizedRoute = JSON.parse(content) as OptimizedRoute;
      return {
        success: true,
        data: optimizedRoute
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to parse route optimization response',
          code: 'PARSE_ERROR',
          timestamp: new Date()
        }
      };
    }
  }

  async generateCustomerSupport(query: string, context?: Record<string, any>): Promise<ApiResponse<string>> {
    const aiRequest: AIRequest = {
      model: API_CONFIG.openrouter.defaultModel,
      messages: [
        {
          role: 'system',
          content: `You are a helpful customer support assistant for RideShare, a ride-hailing platform.
                   Provide friendly, accurate, and concise responses to user queries.
                   If you cannot help with a specific issue, politely direct them to human support.
                   Keep responses under 200 words and maintain a professional, empathetic tone.`
        },
        {
          role: 'user',
          content: `User query: ${query}${context ? `\nContext: ${JSON.stringify(context)}` : ''}`
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    };

    const response = await this.chat(aiRequest);
    
    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error
      };
    }

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      return {
        success: false,
        error: {
          message: 'No response generated',
          code: 'NO_CONTENT',
          timestamp: new Date()
        }
      };
    }

    return {
      success: true,
      data: content
    };
  }

  async predictDemand(location: { lat: number; lng: number }, timeContext: string): Promise<ApiResponse<{ demandLevel: 'low' | 'medium' | 'high'; suggestedSurge: number }>> {
    const aiRequest: AIRequest = {
      model: API_CONFIG.openrouter.defaultModel,
      messages: [
        {
          role: 'system',
          content: `You are a demand prediction expert for a ride-hailing service.
                   Analyze location and time context to predict ride demand.
                   Respond with JSON: {"demandLevel": "low|medium|high", "suggestedSurge": number}`
        },
        {
          role: 'user',
          content: `Predict demand for location: ${location.lat}, ${location.lng} at ${timeContext}`
        }
      ]
    };

    const response = await this.chat(aiRequest);
    
    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error
      };
    }

    try {
      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content');
      }

      const prediction = JSON.parse(content);
      return {
        success: true,
        data: prediction
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to parse demand prediction',
          code: 'PARSE_ERROR',
          timestamp: new Date()
        }
      };
    }
  }
}

// Export singleton instances
export const aiClient = new AIClient();

// Utility functions for common API operations
export async function withRetry<T>(
  operation: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await operation();
      if (result.success) {
        return result;
      }
      lastError = result.error;
    } catch (error) {
      lastError = error;
    }

    if (attempt < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }

  return {
    success: false,
    error: lastError || {
      message: 'Operation failed after retries',
      code: 'MAX_RETRIES_EXCEEDED',
      timestamp: new Date()
    }
  };
}

// Mock data generators for development
export function generateMockApiDelay(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
}

// Environment-specific configurations
export const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    timeout: isDevelopment ? 10000 : 30000,
    retries: isDevelopment ? 1 : 3,
    enableLogging: isDevelopment
  };
};