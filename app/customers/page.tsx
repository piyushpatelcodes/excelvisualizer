"use client";

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
import { useUser } from "@clerk/nextjs";

const Customerpage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [salesData, setSalesData] = useState([]);
  const [searchData, setSearchdata] = useState([]);
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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchSalesData() {
        try {
            const response = await fetch("/api/sales");
            const result = await response.json();

            if (result.length > 0) {
                const sales = result[0].data;
                setSalesData(sales);

                let totalAmount = 0;
                let salesYear = {};
                let salesMonth = {};
                let salesWeek = {};
                let salesDay = {};
                let productSales = {};
                let storeSales = {};
                let customerMap = {};

                sales.forEach((sale) => {
                    if (!sale["Invoice Date"]) return;
                    const saleDate = new Date(sale["Invoice Date"]);
                    const saleAmount = sale["Total Amount"];
                    const productName = sale["Product Name"];
                    const quantity = sale["Quantity"];
                    const region = sale["Region"];
                    const customerId = sale["Customer No"];
                    const customerName = sale["Customer Name"];
                    const paymentTerms = sale["Payment Terms"];
                    const regionCode = sale["Region Code"];
                    const cluster = sale["Cluster"];
                    const clusterHead = sale["Cluster Head"];
                    const customerType = sale["Customer Type"];
                    const subType = sale["Sub Type"];

                    totalAmount += saleAmount;

                    // 🟢 Group by Year
                    const year = saleDate.getFullYear();
                    salesYear[year] = (salesYear[year] || 0) + saleAmount;

                    // 🟢 Group by Month
                    const month = saleDate.toISOString().substring(0, 7);
                    salesMonth[month] = (salesMonth[month] || 0) + saleAmount;

                    // 🟢 Group by Week
                    const dayOfWeek = saleDate.toLocaleString("en-US", { weekday: "short" });
                    salesWeek[dayOfWeek] = (salesWeek[dayOfWeek] || 0) + saleAmount;

                    // 🟢 Group by Day
                    const saleDateString = saleDate.toISOString().split("T")[0];
                    salesDay[saleDateString] = (salesDay[saleDateString] || 0) + saleAmount;

                    // 🟢 Track Product Sales
                    productSales[productName] = (productSales[productName] || 0) + quantity;

                    // 🟢 Track Store Sales
                    storeSales[region] = (storeSales[region] || 0) + saleAmount;

                    // 🟢 Track Customer Data
                    if (!customerMap[customerId]) {
                        customerMap[customerId] = {
                            customerId,
                            name: customerName,
                            orders: 0,
                            totalAmount: 0,
                            products: [],
                            totalPaymentDays: 0,
                            totalTransactions: 0,
                            region,
                            regionCode,
                            cluster,
                            clusterHead,
                            customerType,
                            subType,
                        };
                    }

                    let customer = customerMap[customerId];
                    customer.orders += 1;
                    customer.totalAmount += saleAmount;
                    customer.products.push(productName);
                    customer.totalTransactions += 1;

                    let paymentDays = parseInt(paymentTerms.replace("Net ", "")) || 0;
                    customer.totalPaymentDays += paymentDays;
                });

                // 🟢 Process Customers
                const customers = Object.values(customerMap).map((customer) => {
                    const monetaryMonthly = customer.totalAmount / 12;

                    // Monetary Score
                    let monetaryScore = monetaryMonthly > 5000 ? 5 :
                        monetaryMonthly > 4000 ? 4 :
                        monetaryMonthly > 3000 ? 3 :
                        monetaryMonthly > 2000 ? 2 : 1;

                    // Compute Average Payment Days
                    const avgPaymentDays = customer.totalPaymentDays / customer.totalTransactions;

                    // Payment Score
                    let paymentScore = avgPaymentDays < 30 ? 1 :
                        avgPaymentDays <= 45 ? 2 :
                        avgPaymentDays <= 60 ? 3 : 4;

                    // Final Score
                    const totalScore = monetaryScore + paymentScore;

                    // Assign Segment
                    let segment =
                        totalScore === 12 ? "Param" :
                        totalScore === 11 ? "Uddan" :
                        totalScore === 10 ? "Lakshya" :
                        totalScore >= 8 ? "Unnati" :
                        totalScore >= 6 ? "Yatra" : "Arambh";

                    return {
                        CustomerNo: customer.customerId,
                        Name: customer.name,
                        MonetaryValue: customer.totalAmount,
                        MonetaryScore: monetaryScore,
                        AvgPaymentDays: avgPaymentDays,
                        PaymentScore: paymentScore,
                        TotalScore: totalScore,
                        Segment: segment,
                        orders: customer.orders,
                        status: customer.totalAmount > 5000 ? "Loyal" : "Regular",
                        Region: customer.region,
                        RegionCode: customer.regionCode,
                        Cluster: customer.cluster,
                        ClusterHead: customer.clusterHead,
                        CustomerType: customer.customerType,
                        SubType: customer.subType,
                    };
                });

                // 🔥 Fix: Ensure data is actually being set
                console.log("Customers Data Before Setting:", customers);
                setCustomerList(customers);
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

  console.log("cus lis ", CustomerList);

  const filteredCustomers = searchQuery
    ? CustomerList?.filter(
        (customer) =>
          customer?.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer?.Region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer?.RegionCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer?.Cluster?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer?.ClusterHead?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer?.CustomerType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer?.SubType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer?.CustomerNo?.toString().includes(searchQuery)
      )
    : CustomerList;

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
          <Button onClick={(e) => {window.location.assign("/compare")}} variant="ghost" className="w-full justify-start gap-3">
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
              <Input
                type="text"
                placeholder="Search by Name, Customer No, Invoice No, Bill No"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
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

        {/* Order List */}
        <Card className="mt-6 p-6">
          <h2 className="text-lg font-semibold mb-4">Customer List</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b ">
                  <th className="pb-4">Customer ID</th>
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Total Purchase</th>
                  <th className="pb-4">Total Orders</th>
                  <th className="pb-4">Cluster</th>
                  <th className="pb-4">Segment</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.CustomerNo}
                    className="border-b hover:bg-gray-300/30 cursor-pointer"
                    onClick={() =>
                      window.location.assign(
                        `/customers/${customer.CustomerNo}`
                      )
                    }
                  >
                    <td className="py-4 px-4">{customer.CustomerNo}</td>
                    <td>{customer.Name}</td>
                    <td>₹{customer.MonetaryValue.toLocaleString()}</td>
                    <td>{customer.orders}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-sm `}
                      >
                        {customer.Region}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-sm bg-green-100 text-green-800`}
                      >
                        {customer?.Segment}
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
};

export default Customerpage;
