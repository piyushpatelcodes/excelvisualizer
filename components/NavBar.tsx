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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UploadFileComponent from "@/components/UploadFileComponent";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

const Customerpage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

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
            variant="ghost"
            className="w-full justify-start gap-3 bg-[#F3F4FF]"
          >
            <div className="h-5 w-5 text-indigo-500">📲</div>
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <div className="h-5 w-5">🛒</div>
            Orders
          </Button>
          <Button
            onClick={(e) => {
              window.location.assign("/customers");
            }}
            variant="ghost"
            className="w-full justify-start gap-3"
          >
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

        <UploadFileComponent />

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
      </div>
    </div>
  );
};

export default Customerpage;
