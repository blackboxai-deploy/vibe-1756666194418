'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { mockAnalytics } from '@/lib/mockData';

export default function AdminDashboard() {
  const { isLoading: authLoading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  if (authLoading) {
    return <PageLoader />;
  }

  const stats = mockAnalytics.dailyStats;
  const trends = mockAnalytics.weeklyTrends;
  const topRoutes = mockAnalytics.topRoutes;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and analytics</p>
        </div>

        {/* Period Selector */}
        <div className="mb-8 flex space-x-2">
          {(['today', 'week', 'month'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? 'bg-gradient-to-r from-blue-600 to-green-600' : ''}
            >
              {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
            </Button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
              <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRides.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12.5% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                +8.2% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
              <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDrivers}</div>
              <p className="text-xs text-muted-foreground">
                +5 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <div className="h-4 w-4 bg-orange-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activePassengers}</div>
              <p className="text-xs text-muted-foreground">
                +23 from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>
                  Daily revenue over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2 p-4">
                  {trends.map((day, index) => {
                    const maxRevenue = Math.max(...trends.map(d => d.revenue));
                    const height = (day.revenue / maxRevenue) * 200;
                    return (
                      <div key={day.date} className="flex flex-col items-center space-y-2">
                        <div className="text-xs text-gray-600 transform -rotate-45 origin-center whitespace-nowrap">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div
                          className="bg-gradient-to-t from-blue-600 to-green-600 rounded-t-sm min-h-[20px] w-8 flex items-end justify-center relative group"
                          style={{ height: `${height}px` }}
                        >
                          <div className="absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                            {formatCurrency(day.revenue)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Routes */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Routes</CardTitle>
                <CardDescription>
                  Most requested routes today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topRoutes.map((route, index) => (
                    <div key={`${route.from}-${route.to}`} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{route.from} → {route.to}</p>
                          <p className="text-sm text-gray-600">{route.count} rides today</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(route.avgFare)}</p>
                        <p className="text-sm text-gray-600">avg fare</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest platform events and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'success', message: 'Driver John D. completed 10 rides today', time: '2 minutes ago' },
                    { type: 'warning', message: 'High demand detected in Manhattan area', time: '15 minutes ago' },
                    { type: 'info', message: 'New driver Sarah M. joined the platform', time: '1 hour ago' },
                    { type: 'success', message: 'Payment of $2,450 processed successfully', time: '2 hours ago' },
                    { type: 'warning', message: 'Driver rating below threshold: Mike R.', time: '3 hours ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Fare</span>
                  <span className="font-semibold">{formatCurrency(stats.averageFare)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Cancellation Rate</span>
                  <span className="font-semibold text-red-600">{formatPercentage(stats.cancellationRate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Rating</span>
                  <span className="font-semibold">{stats.averageRating} ⭐</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Driver Utilization</span>
                  <span className="font-semibold text-green-600">73%</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600">
                  Send Notification
                </Button>
                <Button variant="outline" className="w-full">
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full">
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full">
                  View Support Tickets
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Status</span>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Database</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment System</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">AI Services</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Limited</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">⚠️ Active Alerts</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-orange-100">• High demand in downtown area</p>
                  <p className="text-orange-100">• 3 drivers below rating threshold</p>
                  <p className="text-orange-100">• Payment delays reported</p>
                </div>
                <Button size="sm" variant="outline" className="bg-white text-red-600 hover:bg-gray-100 mt-3">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}