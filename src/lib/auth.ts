import { AuthUser, LoginCredentials, SignupData, AuthResponse } from '@/types/auth';
import { ApiResponse } from '@/types/api';

// Mock user database (in a real app, this would be a proper database)
let mockUsers: AuthUser[] = [
  {
    id: '1',
    email: 'passenger@demo.com',
    name: 'John Passenger',
    phone: '+1234567890',
    role: 'passenger',
    profilePicture: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7ce0048a-b226-4346-ab69-2fbc5d0b6476.png',
    isVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '2',
    email: 'driver@demo.com',
    name: 'Jane Driver',
    phone: '+1234567891',
    role: 'driver',
    profilePicture: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/12acc8ed-d013-482a-bc05-5a1bec4db648.png',
    isVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '3',
    email: 'admin@demo.com',
    name: 'Admin User',
    phone: '+1234567892',
    role: 'admin',
    profilePicture: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bdf7aa42-c681-478f-aa9a-85bee83925fe.png',
    isVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

// Mock password storage (in a real app, passwords would be properly hashed)
const mockPasswords: Record<string, string> = {
  'passenger@demo.com': 'Password123!',
  'driver@demo.com': 'Password123!',
  'admin@demo.com': 'Password123!'
};

// Token utilities
export function generateToken(user: AuthUser): string {
  // In a real app, use proper JWT generation
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now()
  };
  return btoa(JSON.stringify(payload));
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token));
    const user = mockUsers.find(u => u.id === payload.userId);
    return user || null;
  } catch {
    return null;
  }
}

// Authentication functions
export async function login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

  const user = mockUsers.find(u => u.email === credentials.email);
  if (!user || mockPasswords[credentials.email] !== credentials.password) {
    return {
      success: false,
      error: {
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
        timestamp: new Date()
      }
    };
  }

  const token = generateToken(user);
  const refreshToken = generateToken({ ...user, id: user.id + '_refresh' });

  return {
    success: true,
    data: {
      user,
      token,
      refreshToken
    },
    message: 'Login successful'
  };
}

export async function signup(data: SignupData): Promise<ApiResponse<AuthResponse>> {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

  // Check if user already exists
  if (mockUsers.find(u => u.email === data.email)) {
    return {
      success: false,
      error: {
        message: 'User with this email already exists',
        code: 'USER_EXISTS',
        timestamp: new Date()
      }
    };
  }

  // Create new user
  const newUser: AuthUser = {
    id: (mockUsers.length + 1).toString(),
    email: data.email,
    name: data.name,
    phone: data.phone,
    role: data.role,
    profilePicture: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ab7e7f68-0c82-47b4-9629-37c7cda43599.png}+Profile`,
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockUsers.push(newUser);
  mockPasswords[data.email] = data.password;

  const token = generateToken(newUser);
  const refreshToken = generateToken({ ...newUser, id: newUser.id + '_refresh' });

  return {
    success: true,
    data: {
      user: newUser,
      token,
      refreshToken
    },
    message: 'Account created successfully'
  };
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  return mockUsers.find(u => u.id === id) || null;
}

export async function updateUserProfile(id: string, updates: Partial<AuthUser>): Promise<ApiResponse<AuthUser>> {
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return {
      success: false,
      error: {
        message: 'User not found',
        code: 'USER_NOT_FOUND',
        timestamp: new Date()
      }
    };
  }

  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...updates,
    updatedAt: new Date()
  };

  return {
    success: true,
    data: mockUsers[userIndex],
    message: 'Profile updated successfully'
  };
}

// Local storage utilities for client-side token management
export const tokenStorage = {
  set: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },
  get: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
};

export const refreshTokenStorage = {
  set: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
  },
  get: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  },
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refresh_token');
    }
  }
};

// Role-based access control
export function hasPermission(user: AuthUser | null, requiredRole: string): boolean {
  if (!user) return false;
  
  const roleHierarchy = {
    passenger: 1,
    driver: 2,
    admin: 3
  };

  const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
}

export function logout(): void {
  tokenStorage.remove();
  refreshTokenStorage.remove();
}