"use client";

import { Bell, ChevronDown, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const salesData = [
  { name: "Sun", online: 3000, offline: 4000 },
  { name: "Mon", online: 2000, offline: 3000 },
  { name: "Tue", online: 2780, offline: 3908 },
  { name: "Wed", online: 1890, offline: 4800 },
  { name: "Thu", online: 2390, offline: 3800 },
  { name: "Fri", online: 3490, offline: 4300 },
  { name: "Sat", online: 3490, offline: 4300 },
];

const transactionData = [
  { name: "Sales", value: 78 },
  { name: "Distribute", value: 12 },
  { name: "Return", value: 10 },
];

const COLORS = ["#6366f1", "#fbbf24", "#f43f5e"];

const topSellingProducts = [
  { id: "01", name: "Processor", popularity: 48, sales: "48%" },
  { id: "02", name: "Mouse", popularity: 35, sales: "35%" },
  { id: "03", name: "Printer", popularity: 15, sales: "15%" },
  { id: "04", name: "Keyboard", popularity: 27, sales: "27%" },
];

const orderList = [
  { sku: "0025", name: "JQ Murkas", price: "$256.86", order: "152", status: "Completed" },
  { sku: "1834", name: "Tom Frog", price: "$625.21", order: "268", status: "Completed" },
  { sku: "2351", name: "KS Istran", price: "$864.51", order: "624", status: "Failed" },
  { sku: "0078", name: "Franklin", price: "$794.49", order: "324", status: "Pending" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F3F4FF]">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 bg-indigo-500 rounded"></div>
          <span className="text-xl font-semibold">Sales</span>
        </div>

        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3 bg-[#F3F4FF]">
            <div className="h-5 w-5 text-indigo-500">□</div>
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <div className="h-5 w-5">🛒</div>
            Orders
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <div className="h-5 w-5">👥</div>
            Customers
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <div className="h-5 w-5">📦</div>
            Products
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <div className="h-5 w-5">📊</div>
            Sales Report
          </Button>
        </nav>

        <div className="mt-12">
          <div className="text-sm font-semibold text-gray-500 mb-4">PREFERENCES</div>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <div className="h-5 w-5">⚙️</div>
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <div className="h-5 w-5">❓</div>
            Help Center
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Sales Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search here..." className="pl-10" />
            </div>
            <Button variant="ghost" className="gap-2">
              <img src="https://flagcdn.com/w20/us.png" alt="US" className="h-4" />
              Eng (US)
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="mb-4">
              <div className="text-sm text-gray-500">Total sales</div>
              <div className="text-2xl font-semibold">$16462.54</div>
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <Area type="monotone" dataKey="offline" stroke="#ec4899" fill="#fce7f3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="mb-4">
              <div className="text-sm text-gray-500">Online sessions</div>
              <div className="text-2xl font-semibold">$8950.28</div>
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <Area type="monotone" dataKey="online" stroke="#f59e0b" fill="#fef3c7" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4">
              <div className="text-sm text-gray-500">Avg. Order Value</div>
              <div className="text-2xl font-semibold">$1125.84</div>
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <Area type="monotone" dataKey="offline" stroke="#f43f5e" fill="#ffe4e6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4">
              <div className="text-sm text-gray-500">Conversion rate</div>
              <div className="text-2xl font-semibold">94.57%</div>
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <Area type="monotone" dataKey="online" stroke="#6366f1" fill="#e0e7ff" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Main Chart */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">Overall sales</h2>
              <div className="text-3xl font-semibold mt-2">
                $1125.84
                <span className="text-green-500 text-sm ml-2">↑ 65.24%</span>
              </div>
            </div>
            <Button variant="outline">
              Current Week
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="online" stackId="1" stroke="#fbbf24" fill="#fef3c7" />
                <Area type="monotone" dataKey="offline" stackId="1" stroke="#ec4899" fill="#fce7f3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bottom Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Top Selling Products */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Top Selling Product</h2>
            <div className="space-y-4">
              {topSellingProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">#{product.id}</div>
                    <div>{product.name}</div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: product.sales }}
                    ></div>
                  </div>
                  <div className="text-indigo-500">{product.sales}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Transaction Analytics */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Transaction Analytics</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {transactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* User by countries */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">User by countries</h2>
            <img
              src="https://raw.githubusercontent.com/lipis/flag-icons/main/assets/docs/world.png"
              alt="World Map"
              className="w-full h-64 object-contain"
            />
          </Card>
        </div>

        {/* Order List */}
        <Card className="mt-6 p-6">
          <h2 className="text-lg font-semibold mb-4">Order List</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-4">SKU</th>
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Order</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orderList.map((order) => (
                  <tr key={order.sku} className="border-b">
                    <td className="py-4">{order.sku}</td>
                    <td>{order.name}</td>
                    <td>{order.price}</td>
                    <td>{order.order}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}