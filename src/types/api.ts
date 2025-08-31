// Generic API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// AI API types
export interface AIRequest {
  model: string;
  messages: AIMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: AIChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIChoice {
  index: number;
  message: AIMessage;
  finish_reason: string;
}

// Route optimization types
export interface RouteOptimizationRequest {
  origin: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  waypoints?: Array<{
    lat: number;
    lng: number;
  }>;
  preferences: {
    avoidTolls: boolean;
    avoidHighways: boolean;
    optimizeFor: 'time' | 'distance' | 'fuel';
  };
}

export interface OptimizedRoute {
  distance: number;
  duration: number;
  route: Array<{
    lat: number;
    lng: number;
  }>;
  instructions: string[];
  estimatedFuel: number;
  tollCost?: number;
}

// Payment API types
export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: string;
  transactionId?: string;
  receiptUrl?: string;
}

// Analytics types
export interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'year';
  metrics: {
    totalRides: number;
    totalRevenue: number;
    averageFare: number;
    activeDrivers: number;
    activePassengers: number;
    cancellationRate: number;
    averageRating: number;
  };
  trends: {
    date: string;
    rides: number;
    revenue: number;
  }[];
}

// Notification types
export interface NotificationPayload {
  userId: string;
  type: 'ride_update' | 'payment' | 'promotion' | 'system';
  title: string;
  body: string;
  data?: Record<string, any>;
  priority: 'low' | 'normal' | 'high';
}