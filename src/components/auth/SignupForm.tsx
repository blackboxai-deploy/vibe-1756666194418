'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { SignupFormData, signupSchema } from '@/lib/validation';
import { USER_ROLES } from '@/lib/constants';

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: (searchParams.get('role') as any) || USER_ROLES.PASSENGER
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

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({ ...prev, role: role as any }));
    clearError();
  };

  const validateForm = (): boolean => {
    try {
      signupSchema.parse(formData);
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

    const result = await signup(formData);
    
    if (result.success && result.user) {
      // Redirect based on user role
      const dashboardRoutes = {
        passenger: '/passenger/dashboard',
        driver: '/driver/dashboard',
        admin: '/admin/dashboard'
      };
      router.push(dashboardRoutes[result.user.role as keyof typeof dashboardRoutes] || '/');
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case USER_ROLES.PASSENGER:
        return 'Book rides and travel comfortably';
      case USER_ROLES.DRIVER:
        return 'Drive and earn money on your schedule';
      case USER_ROLES.ADMIN:
        return 'Manage platform operations and analytics';
      default:
        return '';
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
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Join RideShare and start your journey
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
              <Label htmlFor="role">Account Type</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={USER_ROLES.PASSENGER}>
                    <div className="space-y-1">
                      <div className="font-medium">Passenger</div>
                      <div className="text-sm text-gray-500">Book rides and travel comfortably</div>
                    </div>
                  </SelectItem>
                  <SelectItem value={USER_ROLES.DRIVER}>
                    <div className="space-y-1">
                      <div className="font-medium">Driver</div>
                      <div className="text-sm text-gray-500">Drive and earn money on your schedule</div>
                    </div>
                  </SelectItem>
                  <SelectItem value={USER_ROLES.ADMIN}>
                    <div className="space-y-1">
                      <div className="font-medium">Admin</div>
                      <div className="text-sm text-gray-500">Manage platform operations</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600">{getRoleDescription(formData.role)}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className={validationErrors.name ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {validationErrors.name && (
                <p className="text-sm text-red-500">{validationErrors.name}</p>
              )}
            </div>
            
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
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                className={validationErrors.phone ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {validationErrors.phone && (
                <p className="text-sm text-red-500">{validationErrors.phone}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                className={validationErrors.password ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {validationErrors.password && (
                <p className="text-sm text-red-500">{validationErrors.password}</p>
              )}
              <p className="text-xs text-gray-600">
                Password must contain at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
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

export default function SignupForm() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div>Loading...</div></div>}>
      <SignupFormContent />
    </Suspense>
  );
}