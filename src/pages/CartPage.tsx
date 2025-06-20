import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  // This could be a slug or any identifier for the product page
  productPath?: string; 
}

const CartPage: React.FC = () => {
  console.log('CartPage loaded');
  const navigate = useNavigate();

  // Sample cart items. In a real app, this would come from context, Zustand, Redux, or API.
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 'item1', name: 'Dorayaki Deluxe Pack (6pcs)', price: 1200, quantity: 1, imageUrl: 'https://doraemon.pages.dev/images/dorayaki.png', productPath: '/menu/dorayaki-deluxe' },
    { id: 'item2', name: 'Memory Bread Slice', price: 350, quantity: 2, imageUrl: 'https://doraemon.pages.dev/images/memory-bread.png', productPath: '/menu/memory-bread' },
    { id: 'item3', name: 'Anywhere Door Pastry', price: 500, quantity: 1, imageUrl: 'https://doraemon.pages.dev/images/anywhere-door-pastry.jpg', productPath: '/menu/anywhere-door-pastry'},
  ]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const quantity = Math.max(1, newQuantity); // Ensure quantity is at least 1
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const calculateItemSubtotal = (item: CartItem): number => {
    return item.price * item.quantity;
  };

  const calculateOrderTotal = (): number => {
    return cartItems.reduce((total, item) => total + calculateItemSubtotal(item), 0);
  };

  const shippingCost = cartItems.length > 0 ? 500 : 0; // Example flat shipping cost
  const orderTotal = calculateOrderTotal();
  const finalTotal = orderTotal + shippingCost;

  useEffect(() => {
    // Potentially save cart to localStorage or sync with a backend here
    console.log('Cart items updated:', cartItems);
  }, [cartItems]);

  return (
    <div className="flex flex-col min-h-screen bg-sky-50 dark:bg-slate-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 
            className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-sky-400 mb-2"
            style={{ fontFamily: "var(--font-doraemon-display, 'Arial Rounded MT Bold', 'Comic Sans MS', sans-serif)" }}
          >
            Your 4D Pocket
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Review your amazing gadgets and treats!</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500 mb-6" />
            <h2 
              className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3"
              style={{ fontFamily: "var(--font-doraemon-display, 'Arial Rounded MT Bold', 'Comic Sans MS', sans-serif)" }}
            >
              Your 4D Pocket is Empty!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added any items yet. Time to explore!</p>
            <Button 
              onClick={() => navigate('/menu')} 
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-700 dark:text-blue-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out text-lg"
            >
              Find Some Gadgets!
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-2 border-blue-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                <CardHeader className="bg-blue-100 dark:bg-slate-700/50 p-4">
                  <CardTitle 
                    className="text-2xl text-blue-700 dark:text-sky-400"
                    style={{ fontFamily: "var(--font-doraemon-display, 'Arial Rounded MT Bold', 'Comic Sans MS', sans-serif)" }}
                  >
                    Items in Pocket
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-blue-200 dark:border-b-slate-600">
                        <TableHead className="text-left text-blue-800 dark:text-sky-300 font-semibold w-[40%] sm:w-[50%] p-4">Product</TableHead>
                        <TableHead className="text-center text-blue-800 dark:text-sky-300 font-semibold p-4">Price</TableHead>
                        <TableHead className="text-center text-blue-800 dark:text-sky-300 font-semibold p-4">Quantity</TableHead>
                        <TableHead className="text-right text-blue-800 dark:text-sky-300 font-semibold p-4">Subtotal</TableHead>
                        <TableHead className="text-center text-blue-800 dark:text-sky-300 font-semibold p-4">Remove</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map(item => (
                        <TableRow key={item.id} className="border-b-gray-100 dark:border-b-slate-700 hover:bg-sky-50 dark:hover:bg-slate-700/30 transition-colors">
                          <TableCell className="font-medium p-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.imageUrl || 'https://doraemon.pages.dev/images/placeholder-food.jpg'} 
                                alt={item.name} 
                                className="w-16 h-16 object-cover rounded-md border border-gray-200 dark:border-slate-600"
                              />
                              <div>
                                <Link 
                                  to={item.productPath || `/menu`} 
                                  className="text-blue-600 dark:text-sky-400 hover:underline font-semibold"
                                >
                                  {item.name}
                                </Link>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center p-4 text-gray-700 dark:text-gray-300">¥{item.price.toLocaleString()}</TableCell>
                          <TableCell className="text-center p-4">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={e => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                              min="1"
                              className="w-20 text-center mx-auto border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-blue-500 dark:focus:ring-sky-500"
                              aria-label={`Quantity for ${item.name}`}
                            />
                          </TableCell>
                          <TableCell className="text-right p-4 text-gray-800 dark:text-gray-200 font-semibold">¥{calculateItemSubtotal(item).toLocaleString()}</TableCell>
                          <TableCell className="text-center p-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="shadow-xl border-2 border-yellow-400 dark:border-yellow-600 rounded-xl bg-white dark:bg-slate-800">
                <CardHeader className="bg-yellow-100 dark:bg-yellow-700/30 p-4">
                  <CardTitle 
                    className="text-2xl text-yellow-700 dark:text-yellow-400"
                    style={{ fontFamily: "var(--font-doraemon-display, 'Arial Rounded MT Bold', 'Comic Sans MS', sans-serif)" }}
                  >
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                    <span className="font-medium">¥{orderTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Shipping</span>
                    <span className="font-medium">¥{shippingCost.toLocaleString()}</span>
                  </div>
                  <hr className="my-2 border-gray-200 dark:border-slate-600" />
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>¥{finalTotal.toLocaleString()}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 flex flex-col gap-4">
                  <Button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                    size="lg"
                  >
                    Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/menu')}
                    className="w-full text-blue-600 dark:text-sky-400 border-blue-500 dark:border-sky-500 hover:bg-blue-50 dark:hover:bg-slate-700 font-semibold py-3 text-lg rounded-lg"
                    size="lg"
                  >
                    Continue Shopping
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;