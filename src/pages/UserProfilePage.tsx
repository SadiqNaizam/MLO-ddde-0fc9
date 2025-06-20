import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '@/components/layout/Header'; // Custom component
import Footer from '@/components/layout/Footer'; // Custom component

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User2, MapPin, CreditCard, History, Edit2, PlusCircle, Save } from 'lucide-react';

// Mock data for placeholders
const mockUser = {
  name: 'Nobita Nobi',
  email: 'nobita@doraemon.future',
  phone: '080-1234-5678',
};

const mockAddresses = [
  { id: '1', street: '123 Anywhere Door Lane', city: 'Future City', zip: '123-4567', country: 'Japan', isDefault: true },
  { id: '2', street: '456 Time Machine Ave', city: 'Tokyo Suburbs', zip: '987-6543', country: 'Japan', isDefault: false },
];

const mockPaymentMethods = [
  { id: '1', type: 'Credit Card', details: 'Visa **** **** **** 1234', expiry: '12/2025', isDefault: true },
];

const mockOrderHistory = [
  { id: 'DORA-001', date: '2024-07-15', items: 'Dorayaki (x5), Memory Bread Toast (x2)', total: '¥2,500', status: 'Delivered' as 'Delivered' | 'Processing' | 'Cancelled' },
  { id: 'DORA-002', date: '2024-07-20', items: 'Anywhere Door Pizza (x1)', total: '¥1,800', status: 'Processing' as 'Delivered' | 'Processing' | 'Cancelled' },
  { id: 'DORA-003', date: '2024-06-10', items: 'Small Light Curry (x1)', total: '¥1,200', status: 'Cancelled' as 'Delivered' | 'Processing' | 'Cancelled' },
];

const UserProfilePage = () => {
  console.log('UserProfilePage loaded');

  // Basic state for form inputs (for demonstration if needed, otherwise direct value in Input)
  const [userName, setUserName] = useState(mockUser.name);
  const [userEmail, setUserEmail] = useState(mockUser.email);
  const [userPhone, setUserPhone] = useState(mockUser.phone);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving changes:', { userName, userEmail, userPhone });
    // Here you would typically call an API to save data
    alert('Changes saved (mock)!');
  };
  
  const getStatusBadgeVariant = (status: 'Delivered' | 'Processing' | 'Cancelled') => {
    switch (status) {
      case 'Delivered':
        return 'default'; // Greenish in some themes, or primary
      case 'Processing':
        return 'secondary'; // Bluish/Yellowish
      case 'Cancelled':
        return 'destructive'; // Reddish
      default:
        return 'outline';
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-sky-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 
            className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-sky-400"
            style={{ fontFamily: "var(--font-doraemon-display, 'Comic Sans MS', 'Chalkboard SE', cursive)" }}
          >
            My Doraemon Account
          </h1>
          <Button variant="outline" className="mt-4 sm:mt-0">
            <Link to="/menu">Back to Menu</Link>
          </Button>
        </div>

        <Tabs defaultValue="personal-info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 mb-6 bg-blue-100 dark:bg-slate-800 p-1 rounded-lg">
            <TabsTrigger value="personal-info" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-sky-300 data-[state=active]:shadow-sm py-2.5">
              <User2 className="w-4 h-4 mr-2" /> Personal Info
            </TabsTrigger>
            <TabsTrigger value="addresses" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-sky-300 data-[state=active]:shadow-sm py-2.5">
              <MapPin className="w-4 h-4 mr-2" /> Addresses
            </TabsTrigger>
            <TabsTrigger value="payment-methods" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-sky-300 data-[state=active]:shadow-sm py-2.5">
              <CreditCard className="w-4 h-4 mr-2" /> Payment
            </TabsTrigger>
            <TabsTrigger value="order-history" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-sky-300 data-[state=active]:shadow-sm py-2.5">
              <History className="w-4 h-4 mr-2" /> Order History
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal-info">
            <Card className="bg-white dark:bg-slate-900 shadow-lg border-blue-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-700 dark:text-sky-400 flex items-center">
                  <User2 className="w-6 h-6 mr-2" /> Your Details
                </CardTitle>
                <CardDescription className="dark:text-slate-400">Manage your personal information.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveChanges} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium dark:text-slate-300">Full Name</Label>
                    <Input id="name" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="e.g., Doraemon" className="dark:bg-slate-800 dark:border-slate-600 dark:placeholder:text-slate-500 dark:text-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium dark:text-slate-300">Email Address</Label>
                    <Input id="email" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="e.g., owner@doraemon.future" className="dark:bg-slate-800 dark:border-slate-600 dark:placeholder:text-slate-500 dark:text-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium dark:text-slate-300">Phone Number</Label>
                    <Input id="phone" type="tel" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} placeholder="e.g., 01-2345-6789" className="dark:bg-slate-800 dark:border-slate-600 dark:placeholder:text-slate-500 dark:text-slate-50" />
                  </div>
                  <Button type="submit" className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-blue-700 font-semibold">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <Card className="bg-white dark:bg-slate-900 shadow-lg border-blue-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-700 dark:text-sky-400 flex items-center">
                    <MapPin className="w-6 h-6 mr-2" /> Saved Addresses
                </CardTitle>
                <CardDescription className="dark:text-slate-400">Manage your delivery addresses.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAddresses.map(addr => (
                  <div key={addr.id} className="p-4 border rounded-lg bg-sky-50 dark:bg-slate-800/50 dark:border-slate-700 flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{addr.street}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{addr.city}, {addr.zip}, {addr.country}</p>
                      {addr.isDefault && <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300">Default</Badge>}
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400">
                      <Edit2 className="w-4 h-4" />
                      <span className="sr-only">Edit address</span>
                    </Button>
                  </div>
                ))}
                {mockAddresses.length === 0 && <p className="text-slate-500 dark:text-slate-400">No saved addresses yet. Add one!</p>}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-sky-500 dark:text-sky-400 dark:hover:bg-slate-800">
                  <PlusCircle className="w-4 h-4 mr-2" /> Add New Address
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment-methods">
            <Card className="bg-white dark:bg-slate-900 shadow-lg border-blue-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-700 dark:text-sky-400 flex items-center">
                    <CreditCard className="w-6 h-6 mr-2" /> Payment Methods
                </CardTitle>
                <CardDescription className="dark:text-slate-400">Manage your payment options.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockPaymentMethods.map(pm => (
                  <div key={pm.id} className="p-4 border rounded-lg bg-sky-50 dark:bg-slate-800/50 dark:border-slate-700 flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{pm.type}: {pm.details}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Expires: {pm.expiry}</p>
                      {pm.isDefault && <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300">Default</Badge>}
                    </div>
                     <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400">
                      <Edit2 className="w-4 h-4" />
                      <span className="sr-only">Edit payment method</span>
                    </Button>
                  </div>
                ))}
                {mockPaymentMethods.length === 0 && <p className="text-slate-500 dark:text-slate-400">No saved payment methods yet.</p>}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-sky-500 dark:text-sky-400 dark:hover:bg-slate-800">
                  <PlusCircle className="w-4 h-4 mr-2" /> Add New Payment Method
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="order-history">
            <Card className="bg-white dark:bg-slate-900 shadow-lg border-blue-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-700 dark:text-sky-400 flex items-center">
                    <History className="w-6 h-6 mr-2" /> Your Order History
                </CardTitle>
                <CardDescription className="dark:text-slate-400">Review your past orders from Doraemon's Eatery.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption className="dark:text-slate-500">A list of your recent orders.</TableCaption>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                      <TableHead className="w-[120px] dark:text-slate-300">Order ID</TableHead>
                      <TableHead className="dark:text-slate-300">Date</TableHead>
                      <TableHead className="dark:text-slate-300">Items Summary</TableHead>
                      <TableHead className="text-right dark:text-slate-300">Total</TableHead>
                      <TableHead className="text-center dark:text-slate-300">Status</TableHead>
                      <TableHead className="text-right dark:text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrderHistory.map((order) => (
                      <TableRow key={order.id} className="dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-800/50">
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell className="truncate max-w-xs">{order.items}</TableCell>
                        <TableCell className="text-right">{order.total}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="link" size="sm" className="text-blue-600 hover:text-red-500 dark:text-sky-400 dark:hover:text-red-400">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                     {mockOrderHistory.length === 0 && (
                        <TableRow className="dark:border-slate-700 hover:bg-transparent dark:hover:bg-transparent">
                            <TableCell colSpan={6} className="text-center text-slate-500 dark:text-slate-400 py-8">
                                You haven't placed any orders yet! How about some Dorayaki?
                                <Button asChild variant="link" className="ml-2 text-blue-600 dark:text-sky-400">
                                    <Link to="/menu">Go to Menu</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfilePage;