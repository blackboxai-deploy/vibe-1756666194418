'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { APP_CONFIG } from '@/lib/constants';

interface HeaderProps {
  showNavigation?: boolean;
}

export default function Header({ showNavigation = true }: HeaderProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getNavigationItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'passenger':
        return [
          { href: '/passenger/dashboard', label: 'Dashboard' },
          { href: '/passenger/book-ride', label: 'Book Ride' },
          { href: '/passenger/trip-history', label: 'Trip History' },
          { href: '/passenger/profile', label: 'Profile' }
        ];
      case 'driver':
        return [
          { href: '/driver/dashboard', label: 'Dashboard' },
          { href: '/driver/earnings', label: 'Earnings' },
          { href: '/driver/profile', label: 'Profile' }
        ];
      case 'admin':
        return [
          { href: '/admin/dashboard', label: 'Dashboard' },
          { href: '/admin/trips', label: 'Trips' },
          { href: '/admin/analytics', label: 'Analytics' }
        ];
      default:
        return [];
    }
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              R
            </div>
            <h1 className="text-xl font-bold text-gray-900">{APP_CONFIG.name}</h1>
          </Link>

          {/* Navigation */}
          {showNavigation && isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-6">
              {getNavigationItems().map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profilePicture} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-blue-600 capitalize">{user.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {/* Role-specific menu items */}
                  {getNavigationItems().map((item) => (
                    <DropdownMenuItem key={item.href} asChild className="md:hidden">
                      <Link href={item.href}>
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  
                  {getNavigationItems().length > 0 && <DropdownMenuSeparator className="md:hidden" />}
                  
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}