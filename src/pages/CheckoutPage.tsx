import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, CreditCard, Gift, Package, ShoppingCart, Sparkles, Truck, Wallet } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"; // For general notifications

// Playful Doraemon-themed font (assumed to be set globally or apply locally)
const themedFontFamily = "'Comic Sans MS', 'Chalkboard SE', 'cursive'";

// Zod Schema for Checkout Form
const checkoutSchema = z.object({
  deliveryOption: z.enum(['delivery', 'pickup'], {
    required_error: "Please select how you'd like to receive your order.",
  }),
  fullName: z.string().optional(),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  saveAddress: z.boolean().default(false).optional(),
  paymentMethod: z.enum(['creditCard', 'gadgetPay', 'timeCash'], {
    required_error: 'Please select a payment method.',
  }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCVC: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions to place your order.",
  }),
}).superRefine((data, ctx) => {
  if (data.deliveryOption === 'delivery') {
    if (!data.fullName || data.fullName.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Full name is required for delivery.", path: ['fullName'] });
    }
    if (!data.addressLine1 || data.addressLine1.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Address Line 1 is required for delivery.", path: ['addressLine1'] });
    }
    if (!data.city || data.city.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "City is required for delivery.", path: ['city'] });
    }
    if (!data.postalCode || !/^\d{5}(-\d{4})?$/.test(data.postalCode)) { // Basic US-like postal code
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid postal code is required for delivery.", path: ['postalCode'] });
    }
    if (!data.country || data.country.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Country is required for delivery.", path: ['country'] });
    }
  }
  if (data.paymentMethod === 'creditCard') {
    if (!data.cardNumber || !/^\d{16}$/.test(data.cardNumber)) { // Basic 16-digit card
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid 16-digit card number is required.", path: ['cardNumber'] });
    }
    if (!data.cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.cardExpiry)) { // MM/YY
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid card expiry (MM/YY) is required.", path: ['cardExpiry'] });
    }
    if (!data.cardCVC || !/^\d{3,4}$/.test(data.cardCVC)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid CVC (3 or 4 digits) is required.", path: ['cardCVC'] });
    }
  }
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const steps = [
  { id: 1, name: 'Order Options', fields: ['deliveryOption'] },
  { id: 2, name: 'Delivery Details', fields: ['fullName', 'addressLine1', 'city', 'postalCode', 'country', 'saveAddress'] },
  { id: 3, name: 'Payment', fields: ['paymentMethod', 'cardNumber', 'cardExpiry', 'cardCVC'] },
  { id: 4, name: 'Review & Confirm', fields: ['agreeToTerms'] },
];

// Sample order items (in a real app, this would come from cart state)
const sampleOrderItems = [
  { id: '1', name: 'Giant Dorayaki Platter', quantity: 1, price: 1200, image: 'https://doraemon.pages.dev/images/food/dorayaki-platter.png' },
  { id: '2', name: 'Memory Bread Toasties (Set of 3)', quantity: 2, price: 450, image: 'https://doraemon.pages.dev/images/food/memory-bread.png' },
  { id: '3', name: 'Anywhere Door Lemonade', quantity: 4, price: 200, image: 'https://doraemon.pages.dev/images/food/anywhere-door-lemonade.png' },
];
const subtotal = sampleOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
const tax = subtotal * 0.1; // Example 10% tax
const shipping = 500; // Example shipping cost
const total = subtotal + tax + shipping;


const CheckoutPage = () => {
  console.log('CheckoutPage loaded');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryOption: 'delivery',
      saveAddress: false,
      paymentMethod: 'creditCard',
      agreeToTerms: false,
    },
  });

  const deliveryOption = form.watch('deliveryOption');
  const paymentMethod = form.watch('paymentMethod');

  const handleNextStep = async () => {
    const currentStepFields = steps[currentStep].fields;
    const isValid = await form.trigger(currentStepFields as any);

    if (isValid) {
      if (currentStep === 0 && deliveryOption === 'pickup' && steps.length === 4) { // Skip address for pickup
        setCurrentStep(2); // Jump to payment
      } else if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 2 && deliveryOption === 'pickup' && steps.length === 4) { // Go back to delivery options from payment if pickup
      setCurrentStep(0);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  
  const onSubmit = (data: CheckoutFormValues) => {
    console.log('Checkout Form Data:', data);
    // Simulate API call
    setTimeout(() => {
      setOrderCompleted(true);
      toast({
        title: "Hooray! Order Placed!",
        description: "Your Doraemon delights are being prepared! You'll be redirected shortly.",
        duration: 5000,
      });
      // Clear cart, redirect, etc.
      setTimeout(() => navigate('/'), 5000); // Redirect to homepage after 5s
    }, 2000);
  };

  const progressValue = ((currentStep + 1) / steps.length) * 100;

  if (orderCompleted) {
    return (
      <div className="flex flex-col min-h-screen bg-sky-50" style={{ fontFamily: themedFontFamily }}>
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4 flex flex-col items-center justify-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="bg-white p-10 rounded-xl shadow-2xl"
          >
            <Sparkles className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Order Confirmed!</h1>
            <p className="text-lg text-gray-700 mb-8">
              Thank you for your order! Your journey into deliciousness is about to begin.
              We've sent a confirmation to your (not really) email.
            </p>
            <img src="https://cdn.dribbble.com/users/360309/screenshots/2056305/media/7c0d2292233f0a950bd4a5ac8882f919.gif" alt="Doraemon Happy" className="mx-auto mb-8 rounded-lg w-64 h-auto" />
            <Button onClick={() => navigate('/')} size="lg" className="bg-red-500 hover:bg-red-600 text-white">
              Back to Homepage
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-sky-100 dark:bg-slate-900" style={{ fontFamily: themedFontFamily }}>
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-700 dark:text-sky-400">Checkout</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Just a few more steps to your Doraemon feast!</p>
          </div>

          <Progress value={progressValue} className="mb-10 h-3 bg-blue-200 [&>div]:bg-yellow-400" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step 1: Order Options */}
                  {currentStep === 0 && (
                    <Card className="shadow-xl border-blue-300 dark:border-sky-700 bg-white dark:bg-slate-800">
                      <CardHeader>
                        <CardTitle className="text-2xl text-blue-600 dark:text-sky-500 flex items-center">
                          <Package className="mr-3 h-7 w-7 text-yellow-500" /> How would you like your order?
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FormField
                          control={form.control}
                          name="deliveryOption"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-semibold text-gray-800 dark:text-gray-200">Select an Option:</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col sm:flex-row gap-4"
                                >
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
                                    </FormControl>
                                    <FormLabel
                                      htmlFor="delivery"
                                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-900/30 [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                      <Truck className="mb-3 h-8 w-8 text-blue-500" />
                                      Get it Delivered
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                                    </FormControl>
                                    <FormLabel
                                      htmlFor="pickup"
                                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-900/30 [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                      <Gift className="mb-3 h-8 w-8 text-red-500" />
                                      Pick Up from Restaurant
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 2: Delivery Details (Conditional) */}
                  {currentStep === 1 && deliveryOption === 'delivery' && (
                    <Card className="shadow-xl border-blue-300 dark:border-sky-700 bg-white dark:bg-slate-800">
                      <CardHeader>
                        <CardTitle className="text-2xl text-blue-600 dark:text-sky-500 flex items-center">
                          <Truck className="mr-3 h-7 w-7 text-yellow-500" /> Delivery Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField control={form.control} name="fullName" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input placeholder="Nobita Nobi" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="addressLine1" render={({ field }) => ( <FormItem> <FormLabel>Address Line 1</FormLabel> <FormControl><Input placeholder="123 Anywhere Street" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="city" render={({ field }) => ( <FormItem> <FormLabel>City</FormLabel> <FormControl><Input placeholder="Future City" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="postalCode" render={({ field }) => ( <FormItem> <FormLabel>Postal Code</FormLabel> <FormControl><Input placeholder="12345" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="country" render={({ field }) => ( <FormItem> <FormLabel>Country</FormLabel> <FormControl><Input placeholder="Japan" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="saveAddress" render={({ field }) => ( <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-sky-50 dark:bg-slate-700"> <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl> <div className="space-y-1 leading-none"> <FormLabel>Save this address for future adventures?</FormLabel> </div> </FormItem> )} />
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Step 3: Payment */}
                  {currentStep === 2 && (
                    <Card className="shadow-xl border-blue-300 dark:border-sky-700 bg-white dark:bg-slate-800">
                      <CardHeader>
                        <CardTitle className="text-2xl text-blue-600 dark:text-sky-500 flex items-center">
                           <Wallet className="mr-3 h-7 w-7 text-yellow-500" /> Payment Method
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-semibold text-gray-800 dark:text-gray-200">Choose how to pay:</FormLabel>
                              <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <FormItem> <FormControl><RadioGroupItem value="creditCard" id="creditCard" className="peer sr-only" /></FormControl> <FormLabel htmlFor="creditCard" className="flex items-center justify-center rounded-md border-2 border-muted p-4 hover:bg-accent peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-900/30 [&:has([data-state=checked])]:border-primary cursor-pointer"> <CreditCard className="mr-2 h-5 w-5" /> Credit Card </FormLabel> </FormItem>
                                  <FormItem> <FormControl><RadioGroupItem value="gadgetPay" id="gadgetPay" className="peer sr-only" /></FormControl> <FormLabel htmlFor="gadgetPay" className="flex items-center justify-center rounded-md border-2 border-muted p-4 hover:bg-accent peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-900/30 [&:has([data-state=checked])]:border-primary cursor-pointer"> <Sparkles className="mr-2 h-5 w-5 text-yellow-400" /> GadgetPay </FormLabel> </FormItem>
                                  <FormItem> <FormControl><RadioGroupItem value="timeCash" id="timeCash" className="peer sr-only" /></FormControl> <FormLabel htmlFor="timeCash" className="flex items-center justify-center rounded-md border-2 border-muted p-4 hover:bg-accent peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-900/30 [&:has([data-state=checked])]:border-primary cursor-pointer"> <Gift className="mr-2 h-5 w-5 text-red-500" /> TimeCash </FormLabel> </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {paymentMethod === 'creditCard' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{duration: 0.3}} className="space-y-4 border-t pt-6 mt-6 border-dashed border-blue-300 dark:border-sky-600">
                            <FormField control={form.control} name="cardNumber" render={({ field }) => ( <FormItem> <FormLabel>Card Number</FormLabel> <FormControl><Input placeholder="0000 0000 0000 0000" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField control={form.control} name="cardExpiry" render={({ field }) => ( <FormItem> <FormLabel>Expiry (MM/YY)</FormLabel> <FormControl><Input placeholder="MM/YY" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                              <FormField control={form.control} name="cardCVC" render={({ field }) => ( <FormItem> <FormLabel>CVC</FormLabel> <FormControl><Input placeholder="123" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                            </div>
                          </motion.div>
                        )}
                         {paymentMethod === 'gadgetPay' && (
                          <Alert className="bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-sky-700">
                            <Sparkles className="h-5 w-5 text-blue-500" />
                            <AlertTitle className="font-semibold text-blue-700 dark:text-sky-300">GadgetPay Selected!</AlertTitle>
                            <AlertDescription className="text-blue-600 dark:text-sky-400">
                              You'll be redirected to complete your payment with GadgetPay. It's super futuristic!
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 4: Review & Confirm */}
                  {currentStep === 3 && (
                    <Card className="shadow-xl border-blue-300 dark:border-sky-700 bg-white dark:bg-slate-800">
                      <CardHeader>
                        <CardTitle className="text-2xl text-blue-600 dark:text-sky-500 flex items-center">
                          <ShoppingCart className="mr-3 h-7 w-7 text-yellow-500" /> Review Your Order
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Items in your 4D Pocket:</h3>
                          {sampleOrderItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-3 bg-sky-50 dark:bg-slate-700 rounded-lg">
                               <div className="flex items-center">
                                <img src={item.image || 'https://doraemon.pages.dev/images/placeholder-food.jpg'} alt={item.name} className="w-12 h-12 object-cover rounded mr-3" />
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">{item.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                                </div>
                               </div>
                               <p className="font-semibold text-gray-800 dark:text-gray-100">¥{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-4 space-y-1 text-right text-gray-700 dark:text-gray-300">
                            <p>Subtotal: <span className="font-semibold">¥{subtotal.toLocaleString()}</span></p>
                            {deliveryOption === 'delivery' && <p>Shipping: <span className="font-semibold">¥{shipping.toLocaleString()}</span></p>}
                            <p>Tax (10%): <span className="font-semibold">¥{tax.toLocaleString()}</span></p>
                            <p className="text-xl font-bold text-blue-600 dark:text-sky-400">Total: <span className="font-bold">¥{(deliveryOption === 'delivery' ? total : subtotal + tax).toLocaleString()}</span></p>
                        </div>
                        <FormField
                          control={form.control}
                          name="agreeToTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} id="terms" />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel htmlFor="terms" className="font-medium text-yellow-800 dark:text-yellow-200">
                                  I agree to the <Link to="/terms" className="underline hover:text-red-500">Terms and Conditions</Link> of Doraemon's Eatery.
                                </FormLabel>
                                <FormDescription className="text-yellow-700 dark:text-yellow-300">
                                  Make sure you've read them, they're full of surprises!
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-blue-200 dark:border-sky-700">
                <div>
                  {currentStep > 0 && (
                    <Button type="button" onClick={handlePreviousStep} variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-sky-500 dark:text-sky-400 dark:hover:bg-sky-800">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Previous Step
                    </Button>
                  )}
                  {currentStep === 0 && (
                     <Button type="button" onClick={() => navigate('/cart')} variant="outline" className="border-gray-400 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Back to Cart
                    </Button>
                  )}
                </div>
                <div>
                  {currentStep < steps.length - 1 && (
                    <Button type="button" onClick={handleNextStep} className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-sky-600 dark:hover:bg-sky-700">
                      Next Step
                    </Button>
                  )}
                  {currentStep === steps.length - 1 && (
                    <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white" size="lg" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? "Processing..." : "Confirm & Place Order!"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;