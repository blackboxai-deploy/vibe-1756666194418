'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { LoginFormData, loginSchema } from '@/lib/validation';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear auth error
    clearError();
  };

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (error: any) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        if (err.path[0]) {
          errors[err.path[0]] = err.message;
        }
      });
      setValidationErrors(errors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await login(formData);
    
    if (result.success && result.user) {
      const redirectTo = searchParams.get('redirect');
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        // Redirect based on user role
        const dashboardRoutes = {
          passenger: '/passenger/dashboard',
          driver: '/driver/dashboard',
          admin: '/admin/dashboard'
        };
        router.push(dashboardRoutes[result.user.role as keyof typeof dashboardRoutes] || '/');
      }
    }
  };

  const handleDemoLogin = async (role: 'passenger' | 'driver' | 'admin') => {
    const demoCredentials = {
      passenger: { email: 'passenger@demo.com', password: 'Password123!' },
      driver: { email: 'driver@demo.com', password: 'Password123!' },
      admin: { email: 'admin@demo.com', password: 'Password123!' }
    };

    const result = await login(demoCredentials[role]);
    
    if (result.success && result.user) {
      const dashboardRoutes = {
        passenger: '/passenger/dashboard',
        driver: '/driver/dashboard',
        admin: '/admin/dashboard'
      };
      router.push(dashboardRoutes[result.user.role as keyof typeof dashboardRoutes] || '/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              R
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your RideShare account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={validationErrors.email ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className={validationErrors.password ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {validationErrors.password && (
                <p className="text-sm text-red-500">{validationErrors.password}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or try demo accounts
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('passenger')}
              disabled={isLoading}
              className="text-xs"
            >
              Passenger
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('driver')}
              disabled={isLoading}
              className="text-xs"
            >
              Driver
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading}
              className="text-xs"
            >
              Admin
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
          
          <div className="text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div>Loading...</div></div>}>
      <LoginFormContent />
    </Suspense>
  );
}