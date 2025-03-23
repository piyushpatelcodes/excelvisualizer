"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ChevronDown, Search } from "lucide-react";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import WorldMap from "../components/Worldmap";
import { useUser } from "@clerk/nextjs";

const salessData = [
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
  {
    sku: "0025",
    name: "JQ Murkas",
    price: "$256.86",
    order: "152",
    status: "Completed",
  },
  {
    sku: "1834",
    name: "Tom Frog",
    price: "$625.21",
    order: "268",
    status: "Completed",
  },
  {
    sku: "2351",
    name: "KS Istran",
    price: "$864.51",
    order: "624",
    status: "Failed",
  },
  {
    sku: "0078",
    name: "Franklin",
    price: "$794.49",
    order: "324",
    status: "Pending",
  },
];

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [salesByYear, setSalesByYear] = useState({});
  const [salesByMonth, setSalesByMonth] = useState({});
  const [salesByWeek, setSalesByWeek] = useState({});
  const [salesByDay, setSalesByDay] = useState({});
  const [filteredSales, setFilteredSales] = useState([]);
  const [filterType, setFilterType] = useState("year");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [topSellingCountry, settopSellingCountry] = useState([]);
  const [CustomerList, setCustomerList] = useState([]);

  useEffect(() => {
    async function fetchSalesData() {
      try {
        const response = await fetch("/api/sales");
        const result = await response.json();

        if (result.length > 0) {
          const sales = result[0].data;
          setSalesData(result[0].data);

          let totalAmount = 0;
          let salesYear = {};
          let salesMonth = {};
          let salesWeek = {};
          let salesDay = {};
          let productSales = {}; // To track product sales
          let storeSales = {};
          let customerMap = {};

          const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
          const currentWeek = new Date();
          currentWeek.setDate(currentWeek.getDate() - 7); // Last 7 days

          sales.forEach((sale) => {
            if (!sale["Invoice Date"]) return;
            const saleDate = new Date(sale["Invoice Date"]);
            const saleAmount = sale["Total Amount"];
            const productName = sale["Product Name"];
            const quantity = sale["Quantity"];
            const region = sale["Region"];
            const customerId = sale["Customer No"];
            const customerName = sale["Customer Name"];
            const amount = sale["Total Amount"];
            const product = sale["Product Name"];

            totalAmount += saleAmount;

            // 🟢 Group by Year
            const year = saleDate.getFullYear();
            salesYear[year] = (salesYear[year] || 0) + saleAmount;

            // 🟢 Group by Month
            const month = saleDate.toISOString().substring(0, 7); // YYYY-MM
            salesMonth[month] = (salesMonth[month] || 0) + saleAmount;

            // 🟢 Group by Week
            const dayOfWeek = saleDate.toLocaleString("en-US", {
              weekday: "short",
            });
            salesWeek[dayOfWeek] = (salesWeek[dayOfWeek] || 0) + saleAmount;

            // 🟢 Group by Day
            const saleDateString = saleDate.toISOString().split("T")[0]; // YYYY-MM-DD
            salesDay[saleDateString] =
              (salesDay[saleDateString] || 0) + saleAmount;

            // 🟢 Track Product Sales
            productSales[productName] =
              (productSales[productName] || 0) + quantity;

            // 🟢 Track Store Sales
            storeSales[region] = (storeSales[region] || 0) + saleAmount;

            if (!customerMap[customerId]) {
              customerMap[customerId] = {
                customerId,
                name: customerName,
                orders: 0,
                totalAmount: 0,
                products: [],
              };
            }

            // Update customer data
            customerMap[customerId].orders += 1;
            customerMap[customerId].totalAmount += amount;
            customerMap[customerId].products.push(product);
          });

          let customers = Object.values(customerMap).map((customer) => ({
            ...customer,
            status: customer.totalAmount > 5000 ? "Loyal" : "Regular",
          }));

          setCustomerList(customers);
          console.log("customer: ", customers);

          // 🟢 Get Top Selling Product
          const topProducts = Object.entries(productSales)
            .map(([name, sales]) => ({ name, sales }))
            .sort((a, b) => b.sales - a.sales);

          // 🟢 Get Top Selling Store
          const topStores = Object.entries(storeSales)
            .map(([name, sales]) => ({ name, sales }))
            .sort((a, b) => b.sales - a.sales);

          setTotalSales(totalAmount);
          setSalesByYear(salesYear);
          setSalesByMonth(salesMonth);
          setSalesByWeek(salesWeek);
          setSalesByDay(salesDay);
          setTopSellingProducts(topProducts);
          settopSellingCountry(topStores);
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    }

    fetchSalesData();
  }, []);

  // 🟢 Function to Update Filtered Sales
  useEffect(() => {
    if (filterType === "year") {
      setFilteredSales(
        Object.entries(salesByYear).map(([year, sales]) => ({
          name: year,
          sales,
        }))
      );
    } else if (filterType === "month") {
      setFilteredSales(
        Object.entries(salesByMonth).map(([month, sales]) => ({
          name: month,
          sales,
        }))
      );
    } else if (filterType === "week") {
      setFilteredSales(
        Object.entries(salesByWeek).map(([day, sales]) => ({
          name: day,
          sales,
        }))
      );
    } else if (filterType === "day") {
      setFilteredSales(
        Object.entries(salesByDay).map(([date, sales]) => ({
          name: date,
          sales,
        }))
      );
    } else if (filterType === "range" && startDate && endDate) {
      const filtered = Object.entries(salesByDay)
        .filter(([date]) => date >= startDate && date <= endDate)
        .map(([date, sales]) => ({ name: date, sales }));
      setFilteredSales(filtered);
    }
  }, [
    filterType,
    startDate,
    endDate,
    salesByYear,
    salesByMonth,
    salesByWeek,
    salesByDay,
  ]);

  const customerFrequency = {};
  salesData.forEach((t) => {
    const customerId = t["Customer No"];
    customerFrequency[customerId] = (customerFrequency[customerId] || 0) + 1;
  });

  // Categorize customers based on frequency
  const categories = {
    Loyal: 0,
    "Potential Loyalist": 0,
    "Need Attention": 0,
    "At Risk": 0,
    Lost: 0,
  };

  Object.values(customerFrequency).forEach((count) => {
    if (count >= 5) categories["Loyal"]++;
    else if (count >= 3) categories["Potential Loyalist"]++;
    else if (count === 2) categories["Need Attention"]++;
    else categories["Lost"]++;
  });

  // Convert data to Pie Chart format
  const loyaltyData = Object.entries(categories)
    .filter(([_, value]) => value > 0) // Remove empty categories
    .map(([name, value]) => ({
      name,
      value,
      percentage:
        ((value / Object.keys(customerFrequency).length) * 100).toFixed(1) +
        "%",
    }));

  // Custom Label Renderer to avoid cluttering
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30; // Move labels outside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0 ? (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {loyaltyData[index].name} ({loyaltyData[index].percentage})
      </text>
    ) : null;
  };
  console.log("sales data: ", categories);

  return (
    <div className="min-h-screen bg-[#F3F4FF]">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 bg-indigo-500 rounded"></div>
          <span className="text-xl font-semibold">Sales</span>
        </div>

        <nav className="space-y-2">
          <Button
           onClick={(e) => {window.location.assign("/")}}
            variant="ghost"
            className="w-full justify-start gap-3 bg-[#F3F4FF]"
          >
            <div className="h-5 w-5 text-indigo-500">📲</div>
            Dashboard
          </Button>
          <Button  onClick={(e) => {window.location.assign("/compare")}} variant="ghost" className="w-full justify-start gap-3">
            <div className="h-5 w-5">🛒</div>
            Compare Customers
          </Button>
          <Button onClick={(e)=> {window.location.assign("/customers")}} variant="ghost" className="w-full justify-start gap-3">
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
          <Button onClick={(e) =>{window.location.assign("/upload")}} variant="ghost" className="w-full justify-start gap-3">
            <div className="h-5 w-5">📊</div>
            Upload Report
          </Button>
        </nav>


        <div className="mt-12">
          <div className="text-sm font-semibold text-gray-500 mb-4">
            PREFERENCES
          </div>
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
              <img
                src="https://flagcdn.com/w20/us.png"
                alt="US"
                className="h-4"
              />
              Eng (US)
              <ChevronDown className="h-4 w-4" />
            </Button>
            {/* <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button> */}
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <h1>Welcome, {user?.fullName}</h1>
              <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
              <UserButton />
            </SignedIn>
            {/* <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar> */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="mb-4">
              <div className="text-sm text-gray-500">Total sales</div>
              <div className="text-2xl font-semibold">
                ₹{totalSales.toLocaleString()}
              </div>
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salessData}>
                  <Area
                    type="monotone"
                    dataKey="offline"
                    stroke="#ec4899"
                    fill="#fce7f3"
                  />
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
                <AreaChart data={salessData}>
                  <Area
                    type="monotone"
                    dataKey="online"
                    stroke="#f59e0b"
                    fill="#fef3c7"
                  />
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
                <AreaChart data={salessData}>
                  <Area
                    type="monotone"
                    dataKey="offline"
                    stroke="#f43f5e"
                    fill="#ffe4e6"
                  />
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
                <AreaChart data={salessData}>
                  <Area
                    type="monotone"
                    dataKey="online"
                    stroke="#6366f1"
                    fill="#e0e7ff"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Main Chart */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">Overall Sales</h2>
              <div className="text-3xl font-semibold mt-2">
                ₹{totalSales.toLocaleString()}
                <span className="text-green-500 text-sm ml-2">↑ 65.24%</span>
              </div>
            </div>
            <div>
              <select
                className="border px-3 py-2 rounded-lg"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="year">Sales by Year</option>
                <option value="month">Sales by Month</option>
                <option value="week">Sales by Week</option>
                <option value="day">Sales by Day</option>
                <option value="range">Sales by Date Range</option>
              </select>

              {filterType === "range" && (
                <div className="mt-2 flex gap-3">
                  <input
                    type="date"
                    className="border px-3 py-2 rounded-lg"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <input
                    type="date"
                    className="border px-3 py-2 rounded-lg"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#4F46E5"
                  fill="#C7D2FE"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sales Data Table */}
          <table className="w-full mt-6 border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">
                  {filterType === "year"
                    ? "Year"
                    : filterType === "month"
                    ? "Month"
                    : "Date"}
                </th>
                <th className="p-2 border">Sales</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((entry) => (
                <tr key={entry.name}>
                  <td className="p-2 border">{entry.name}</td>
                  <td className="p-2 border">
                    ₹{entry.sales.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Bottom Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Top Selling Products */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
            <div className="space-y-4">
              {topSellingProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">#{index + 1}</div>
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-gray-400">
                      {product.sales.toLocaleString()} units
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(product.sales * 5, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">
              Top Selling in Country
            </h2>
            <div className="space-y-4">
              {topSellingCountry.map((store, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">#{index + 1}</div>
                  <div className="flex-1">
                    <div className="font-medium">{store.name}</div>
                    <div className="text-xs text-gray-400">
                      ₹{store.sales.toLocaleString()}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(store.sales / 5000, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Transaction Analytics */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Customer Loyalty Distribution
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={loyaltyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percentage }) => `${name} (${percentage})`}
                  >
                    {loyaltyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} Customers`, name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* User by countries */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">User by Countries</h2>
            <WorldMap salesData={salesData} />
          </Card>
        </div>

        {/* Order List */}
        <Card className="mt-6 p-6">
          <h2 className="text-lg font-semibold mb-4">Order List</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-4">Customer ID</th>
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Total Purchase</th>
                  <th className="pb-4">Total Orders</th>
                  <th className="pb-4">Loyalty Status</th>
                </tr>
              </thead>
              <tbody>
                {CustomerList.map((order) => (
                  <tr
                    key={order.customerId}
                    className="border-b hover:bg-gray-300/30"
                  >
                    <td className="py-4 px-4">{order.customerId}</td>
                    <td>{order.name}</td>
                    <td>₹{order.totalAmount.toLocaleString()}</td>
                    <td>{order.orders}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          order.status === "Loyal"
                            ? "bg-green-100 text-green-800"
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
