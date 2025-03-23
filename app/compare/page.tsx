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
  const [customerList, setCustomerList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  useEffect(() => {
    async function fetchSalesData() {
      try {
        const response = await fetch("/api/sales");
        const result = await response.json();

        if (result.length > 0) {
          const sales = result[0].data;
          setSalesData(sales);

          let customerMap = {};

          sales.forEach((sale) => {
            const customerId = sale["Customer No"];
            const customerName = sale["Customer Name"];
            const saleAmount = sale["Total Amount"];
            const paymentTerms = sale["Payment Terms"];
            const product = sale["Product Name"];
            const quantity = sale["Quantity"];

            if (!customerMap[customerId]) {
              customerMap[customerId] = {
                CustomerNo: customerId,
                Name: customerName,
                TotalAmount: 0,
                Orders: 0,
                Products: [],
                TotalPaymentDays: 0,
                TotalTransactions: 0,
              };
            }

            let customer = customerMap[customerId];
            customer.TotalAmount += saleAmount;
            customer.Orders += 1;
            customer.Products.push(product);
            customer.TotalTransactions += 1;

            let paymentDays = parseInt(paymentTerms.replace("Net ", "")) || 0;
            customer.TotalPaymentDays += paymentDays;
          });

          const customers = Object.values(customerMap).map((customer) => {
            const monetaryMonthly = customer.TotalAmount / 12;
            const monetaryScore = monetaryMonthly > 5000 ? 5 :
                                  monetaryMonthly > 4000 ? 4 :
                                  monetaryMonthly > 3000 ? 3 :
                                  monetaryMonthly > 2000 ? 2 : 1;

            const avgPaymentDays = customer.TotalPaymentDays / customer.TotalTransactions;
            const paymentScore = avgPaymentDays < 30 ? 1 :
                                 avgPaymentDays <= 45 ? 2 :
                                 avgPaymentDays <= 60 ? 3 : 4;

            const totalScore = monetaryScore + paymentScore;
            const segment = totalScore === 12 ? "Param" :
                            totalScore === 11 ? "Uddan" :
                            totalScore === 10 ? "Lakshya" :
                            totalScore >= 8 ? "Unnati" :
                            totalScore >= 6 ? "Yatra" : "Arambh";

            return {
              ...customer,
              MonetaryScore: monetaryScore,
              AvgPaymentDays: avgPaymentDays.toFixed(2),
              PaymentScore: paymentScore,
              TotalScore: totalScore,
              Segment: segment,
              Status: customer.TotalAmount > 5000 ? "Loyal" : "Regular",
            };
          });

          setCustomerList(customers);
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    }

    fetchSalesData();
  }, []);

  const filteredCustomers = searchQuery
    ? customerList.filter(
        (customer) =>
          customer.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.CustomerNo.toString().includes(searchQuery)
      )
    : customerList;

  const handleCustomerSelect = (customer) => {
    if (selectedCustomers.length === 2) return;

    if (!selectedCustomers.some((c) => c.CustomerNo === customer.CustomerNo)) {
      setSelectedCustomers([...selectedCustomers, customer]);
    }
  };

  const handleCompareReset = () => {
    setSelectedCustomers([]);
  };


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

        <Input
          type="text"
          placeholder="Search by Name or Customer No"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />

        {/* 📋 Customer List */}
        <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <button
              key={customer.CustomerNo}
              onClick={() => handleCustomerSelect(customer)}
              className={`p-3 border rounded-md ${
                selectedCustomers.some((c) => c.CustomerNo === customer.CustomerNo)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {customer.Name} (#{customer.CustomerNo})
            </button>
          ))}
        </div>

        {/* 🛑 Reset Button */}
        {selectedCustomers.length > 0 && (
          <Button onClick={handleCompareReset} className="mt-4">
            Reset Comparison
          </Button>
        )}

        {/* 🏆 Comparison Table */}
        {selectedCustomers.length === 2 && (
  <div className="mt-6">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
      Customer Comparison
    </h2>

    <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow-md">
      {selectedCustomers.map((customer, index) => (
        <div
          key={index}
          className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
        >
          <h3 className="text-xl font-bold text-blue-600 text-center mb-4">
            {customer.Name}
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <p className="font-semibold text-gray-700">Customer No:</p>
            <p className="text-gray-900">#{customer.CustomerNo}</p>

            <p className="font-semibold text-gray-700">Total Sales:</p>
            <p className="text-green-600 font-bold">
              ${customer.TotalAmount.toFixed(2)}
            </p>

            <p className="font-semibold text-gray-700">Orders:</p>
            <p className="text-gray-900">{customer.Orders}</p>

            <p className="font-semibold text-gray-700">Avg Payment Days:</p>
            <p className="text-gray-900">{customer.AvgPaymentDays} days</p>

            <p className="font-semibold text-gray-700">Monetary Score:</p>
            <p
              className={`px-2 py-1 rounded text-white font-bold ${
                customer.MonetaryScore > 3 ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {customer.MonetaryScore}
            </p>

            <p className="font-semibold text-gray-700">Payment Score:</p>
            <p
              className={`px-2 py-1 rounded text-white font-bold ${
                customer.PaymentScore > 2 ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {customer.PaymentScore}
            </p>

            <p className="font-semibold text-gray-700">Total Score:</p>
            <p className="text-gray-900 font-bold">{customer.TotalScore}</p>

            <p className="font-semibold text-gray-700">Segment:</p>
            <p className="text-gray-900">{customer.Segment}</p>

            <p className="font-semibold text-gray-700">Status:</p>
            <span
              className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                customer.Status === "Loyal" ? "bg-blue-600" : "bg-gray-500"
              }`}
            >
              {customer.Status}
            </span>
          </div>

     
        </div>
      ))}
    </div>
  </div>
)}

         

        
      </div>
    </div>
  );
};

export default Customerpage;
