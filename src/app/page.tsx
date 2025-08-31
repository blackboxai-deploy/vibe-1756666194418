import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                R
              </div>
              <h1 className="text-xl font-bold text-gray-900">{APP_CONFIG.name}</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How it Works
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
            </nav>
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-4 px-3 py-1">
              AI-Powered Transportation
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Your Ride, On Demand
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the future of transportation with our AI-powered ride-sharing platform. 
              Safe, reliable, and always available when you need it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup?role=passenger">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 py-3">
                  Book a Ride
                </Button>
              </Link>
              <Link href="/auth/signup?role=driver">
                <Button size="lg" variant="outline" className="px-8 py-3">
                  Become a Driver
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="mt-16 relative">
            <div className="max-w-4xl mx-auto">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4509d7cc-ad1c-4657-b0c6-9322b1462cd5.png" 
                alt="RideShare app interface showing map with available drivers and easy booking process"
                className="w-full h-auto rounded-2xl shadow-2xl border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose {APP_CONFIG.name}?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced features powered by artificial intelligence to make your ride experience seamless
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="h-6 w-6 bg-blue-600 rounded"></div>
                </div>
                <CardTitle>AI Route Optimization</CardTitle>
                <CardDescription>
                  Smart algorithms find the fastest route while considering traffic, weather, and road conditions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="h-6 w-6 bg-green-600 rounded"></div>
                </div>
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>
                  Track your driver in real-time with live location updates and accurate arrival estimates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="h-6 w-6 bg-purple-600 rounded"></div>
                </div>
                <CardTitle>Smart Pricing</CardTitle>
                <CardDescription>
                  Dynamic pricing based on demand, distance, and time with transparent fare estimates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="h-6 w-6 bg-orange-600 rounded"></div>
                </div>
                <CardTitle>24/7 Support</CardTitle>
                <CardDescription>
                  AI-powered customer support available round the clock to help with any questions or issues
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-red-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="h-6 w-6 bg-red-600 rounded"></div>
                </div>
                <CardTitle>Safety First</CardTitle>
                <CardDescription>
                  Advanced safety features including driver verification, trip sharing, and emergency assistance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-indigo-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="h-6 w-6 bg-indigo-600 rounded"></div>
                </div>
                <CardTitle>Multiple Vehicle Types</CardTitle>
                <CardDescription>
                  Choose from standard, premium, XL, and luxury vehicles to match your needs and budget
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Getting your ride is as easy as 1-2-3
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Request a Ride</h3>
              <p className="text-gray-600">
                Enter your pickup and destination locations, choose your preferred vehicle type
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Matched</h3>
              <p className="text-gray-600">
                Our AI instantly matches you with the nearest available driver for optimal pickup time
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enjoy Your Ride</h3>
              <p className="text-gray-600">
                Track your driver in real-time, enjoy a comfortable ride, and pay seamlessly through the app
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              No hidden fees. Always know what you'll pay before you ride.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">Standard</CardTitle>
                <CardDescription>Affordable rides for everyday travel</CardDescription>
                <div className="text-3xl font-bold text-gray-900 mt-4">$2.50</div>
                <div className="text-sm text-gray-600">Base fare + $1.85/mile</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• Up to 4 passengers</div>
                  <div>• Standard vehicles</div>
                  <div>• 5-10 min pickup</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-blue-200">
              <CardHeader>
                <Badge className="mb-2 bg-blue-100 text-blue-800">Popular</Badge>
                <CardTitle className="text-lg">Premium</CardTitle>
                <CardDescription>Upgraded experience with newer vehicles</CardDescription>
                <div className="text-3xl font-bold text-gray-900 mt-4">$3.50</div>
                <div className="text-sm text-gray-600">Base fare + $2.25/mile</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• Up to 4 passengers</div>
                  <div>• Premium vehicles</div>
                  <div>• 3-8 min pickup</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">XL</CardTitle>
                <CardDescription>Extra space for groups and luggage</CardDescription>
                <div className="text-3xl font-bold text-gray-900 mt-4">$4.00</div>
                <div className="text-sm text-gray-600">Base fare + $2.65/mile</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• Up to 6 passengers</div>
                  <div>• SUVs & large vehicles</div>
                  <div>• 5-12 min pickup</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">Luxury</CardTitle>
                <CardDescription>Premium experience with luxury vehicles</CardDescription>
                <div className="text-3xl font-bold text-gray-900 mt-4">$6.00</div>
                <div className="text-sm text-gray-600">Base fare + $3.25/mile</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• Up to 4 passengers</div>
                  <div>• Luxury vehicles</div>
                  <div>• 8-15 min pickup</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied riders and drivers using {APP_CONFIG.name} every day
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup?role=passenger">
                <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                  Start Riding Today
                </Button>
              </Link>
              <Link href="/auth/signup?role=driver">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                  Drive & Earn Money
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  R
                </div>
                <h3 className="text-xl font-bold">{APP_CONFIG.name}</h3>
              </div>
              <p className="text-gray-400">
                The future of transportation, powered by artificial intelligence.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <div>About Us</div>
                <div>Careers</div>
                <div>Press</div>
                <div>Blog</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Safety</div>
                <div>Contact Us</div>
                <div>Terms of Service</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Download</h4>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition-colors">
                  <div className="text-sm text-gray-400">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition-colors">
                  <div className="text-sm text-gray-400">Get it on</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {APP_CONFIG.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}