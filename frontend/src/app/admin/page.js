'use client';

import { useState } from 'react';
import { Card, Metric, Text, Title, BarChart, DonutChart, LineChart } from '@tremor/react';
import { 
  Layout,
  BarChart as BarChartIcon,
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Sun,
  Moon
} from 'lucide-react';

// Mock data - replace with real data from your API
const salesData = [
  { date: '2024-01', revenue: 12000 },
  { date: '2024-02', revenue: 15000 },
  { date: '2024-03', revenue: 18000 },
];

const categoryData = [
  { category: 'Weights', sales: 3200 },
  { category: 'Cardio Equipment', sales: 2800 },
  { category: 'Supplements', sales: 2200 },
  { category: 'Apparel', sales: 1800 },
];

const customerData = [
  { segment: 'New', value: 34 },
  { segment: 'Returning', value: 45 },
  { segment: 'VIP', value: 21 },
];

export default function AdminDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Admin Dashboard
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card decoration="top" decorationColor="indigo">
            <div className="flex items-center space-x-4">
              <DollarSign className="w-8 h-8 text-indigo-500" />
              <div>
                <Text>Total Revenue</Text>
                <Metric>$45,000</Metric>
              </div>
            </div>
          </Card>
          <Card decoration="top" decorationColor="green">
            <div className="flex items-center space-x-4">
              <ShoppingCart className="w-8 h-8 text-green-500" />
              <div>
                <Text>Orders</Text>
                <Metric>256</Metric>
              </div>
            </div>
          </Card>
          <Card decoration="top" decorationColor="blue">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <Text>Active Users</Text>
                <Metric>1,234</Metric>
              </div>
            </div>
          </Card>
          <Card decoration="top" decorationColor="red">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <Text>Low Stock Items</Text>
                <Metric>12</Metric>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <Title>Revenue Trends</Title>
            <LineChart
              data={salesData}
              index="date"
              categories={["revenue"]}
              colors={["indigo"]}
              valueFormatter={(value) => `$${value.toLocaleString()}`}
              yAxisWidth={60}
            />
          </Card>
          <Card>
            <Title>Category Performance</Title>
            <BarChart
              data={categoryData}
              index="category"
              categories={["sales"]}
              colors={["blue"]}
              valueFormatter={(value) => `$${value.toLocaleString()}`}
              yAxisWidth={60}
            />
          </Card>
        </div>

        {/* Customer Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <Title>Customer Segments</Title>
            <DonutChart
              data={customerData}
              category="value"
              index="segment"
              valueFormatter={(value) => `${value}%`}
              colors={["indigo", "blue", "green"]}
            />
          </Card>
          <Card>
            <Title>Recent Orders</Title>
            <div className="mt-4">
              {/* Add a table component here for recent orders */}
              <div className="space-y-4">
                {[1, 2, 3].map((order) => (
                  <div
                    key={order}
                    className="p-4 border rounded-lg dark:border-gray-700 flex justify-between items-center"
                  >
                    <div>
                      <Text>Order #{order}23456</Text>
                      <Text className="text-sm text-gray-500">2 hours ago</Text>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
