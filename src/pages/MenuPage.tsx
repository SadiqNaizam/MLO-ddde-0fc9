import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ThemedFoodItemCard from '@/components/ThemedFoodItemCard';

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/components/ui/use-toast';

// Lucide Icons
import { Search, ShoppingCart, Lightbulb, Zap, Cake, GlassWater as BeakerIcon, Utensils } from 'lucide-react'; // Using Utensils as a fallback/general icon

// Define the structure for a menu item
interface MenuItem {
  id: string;
  name: string;
  categoryId: string; // Corresponds to FoodCategory id
  price: number;
  description: string;
  imageUrl: string;
  detailedImages?: string[];
  themeElement?: string; // e.g., "Inspired by Anywhere Door"
}

// Define food categories
const foodCategories = [
  { id: 'delights', name: "Doraemon's Delights", icon: Utensils }, // Main Courses
  { id: 'nibblers', name: "Nobita's Nibblers", icon: Zap },       // Appetizers
  { id: 'sweets', name: "Shizuka's Sweets", icon: Cake },         // Desserts
  { id: 'gadgetdrinks', name: "Gadget Drinks", icon: BeakerIcon }, // Beverages
];

// Sample menu items with Doraemon theming
const allMenuItems: MenuItem[] = [
  {
    id: 'item1',
    name: "Anywhere Door Pizza",
    categoryId: 'delights',
    price: 1800,
    description: "A cosmic pizza that opens a portal to flavor paradise! Topped with teleport-pepperoni, dimension-cheese, and stardust oregano.",
    imageUrl: 'https://images.unsplash.com/photo-1593504049358-743307551565?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGhlbWUlMjBwaXp6YXxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=500&q=60',
    detailedImages: [
      'https://images.unsplash.com/photo-1593504049358-743307551565?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGhlbWUlMjBwaXp6YXxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80'
    ],
    themeElement: "Anywhere Door"
  },
  {
    id: 'item2',
    name: "Memory Bread French Toast",
    categoryId: 'delights',
    price: 1200,
    description: "Never forget this taste! Sweet, fluffy French toast made with 'Memory Bread', served with syrup and berries.",
    imageUrl: 'https://images.unsplash.com/photo-1484726061833-0acedbac0046?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJlbmNoJTIwdG9hc3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    detailedImages: ['https://images.unsplash.com/photo-1484726061833-0acedbac0046?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJlbmNoJTIwdG9hc3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80'],
    themeElement: "Memory Bread"
  },
  {
    id: 'item3',
    name: "Take-copter Tater Tots",
    categoryId: 'nibblers',
    price: 800,
    description: "Crispy tater tots that will make you feel like you're flying! Served with a secret dipping sauce from the future.",
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e326e7e90c63?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGF0ZXIlMjB0b3RzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    themeElement: "Take-copter (Bamboo Copter)"
  },
  {
    id: 'item4',
    name: "Gian's Mighty Meat Skewers",
    categoryId: 'nibblers',
    price: 950,
    description: "Hearty and flavorful meat skewers, just like Gian would demand! For the truly courageous appetite.",
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVhdCUyMHNrZXdlcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    themeElement: "Gian's Strength"
  },
  {
    id: 'item5',
    name: "Dorayaki Dream Stack",
    categoryId: 'sweets',
    price: 700,
    description: "Doraemon's favorite! A tall stack of fluffy dorayaki pancakes filled with sweet red bean paste. Pure happiness!",
    imageUrl: 'https://images.unsplash.com/photo-1607301405390-ac81b1939963?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9yYXlha2l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    detailedImages: [
        'https://images.unsplash.com/photo-1607301405390-ac81b1939963?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9yYXlha2l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1626177101935-5ac99080f0aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9yYXlha2l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80'
    ],
    themeElement: "Dorayaki"
  },
  {
    id: 'item6',
    name: "Time Furoshiki Pudding",
    categoryId: 'sweets',
    price: 850,
    description: "A magical pudding that changes its flavor with every spoonful! What delightful taste will you discover?",
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3VzdGFyZCUyMHB1ZGRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    themeElement: "Time Furoshiki"
  },
  {
    id: 'item7',
    name: "Small Light Soda Float",
    categoryId: 'gadgetdrinks',
    price: 600,
    description: "A refreshing soda float that shrinks your worries away! Bubbly, creamy, and full of fun.",
    imageUrl: 'https://images.unsplash.com/photo-1600096194535-aff75c74692c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29kYSUyMGZsb2F0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    themeElement: "Small Light"
  },
  {
    id: 'item8',
    name: "Translation Jelly Juice",
    categoryId: 'gadgetdrinks',
    price: 550,
    description: "Understand the language of deliciousness! A fruity jelly drink that's universally loved.",
    imageUrl: 'https://images.unsplash.com/photo-1625062348690-8c6948510094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZydWl0JTIwanVpY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    themeElement: "Translation Jelly"
  }
];


const MenuPage: React.FC = () => {
  console.log('MenuPage loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  const handleViewDetails = (itemId: string | number) => {
    const item = allMenuItems.find(i => i.id === itemId);
    if (item) {
      setSelectedItem(item);
    }
  };

  const handleAddToCart = (item: { id: string | number; name: string; price: number }) => {
    console.log("Item added to cart (from page):", item);
    // In a real app, this would update global cart state
    toast({
      title: "Added to 4D Pocket!",
      description: `${item.name} has been added to your cart.`,
      className: "bg-blue-500 border-blue-700 text-white rounded-xl shadow-lg", // Themed toast
    });
  };

  const pageTitleFont = { fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'cursive'" };

  return (
    <div className="flex flex-col min-h-screen bg-sky-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <Header />
      <ScrollArea className="flex-1">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <section className="mb-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-sky-400 mb-3" style={pageTitleFont}>
              Doraemon's Delicious Menu
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8" style={pageTitleFont}>
              Discover magical meals and treats from the 22nd century!
            </p>
            <div className="relative max-w-xl mx-auto">
              <Input
                type="search"
                placeholder="Search for your favorite gadget meal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-base rounded-full border-2 border-blue-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-sky-600 bg-white dark:bg-slate-800 shadow-sm"
                aria-label="Search menu items"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
          </section>

          <Tabs defaultValue={foodCategories[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 mb-8 bg-blue-100 dark:bg-slate-800 p-2 rounded-xl shadow-md">
              {foodCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center justify-center gap-2 py-3 text-sm sm:text-base font-semibold rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-sky-500 dark:text-slate-400 dark:data-[state=active]:text-slate-900 transition-all duration-200 hover:bg-blue-200 dark:hover:bg-slate-700"
                  style={pageTitleFont}
                >
                  <category.icon className="h-5 w-5" />
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {foodCategories.map((category) => {
              const filteredItems = allMenuItems
                .filter(item => item.categoryId === category.id)
                .filter(item =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchTerm.toLowerCase())
                );

              return (
                <TabsContent key={category.id} value={category.id}>
                  {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredItems.map(item => (
                        <ThemedFoodItemCard
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          price={item.price}
                          description={item.description}
                          imageUrl={item.imageUrl}
                          onAddToCart={() => handleAddToCart(item)} // Using page level handler
                          onViewDetails={() => handleViewDetails(item.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-xl text-gray-500 dark:text-gray-400 mb-2" style={pageTitleFont}>
                        No {category.name.toLowerCase()} match your search!
                      </p>
                      <p className="text-gray-400 dark:text-gray-500">Try a different category or search term.</p>
                       <img src="https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131_640.png" alt="Empty Search" className="mx-auto mt-4 h-32 opacity-50"/>
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </main>
      </ScrollArea>
      <Footer />

      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={(isOpen) => !isOpen && setSelectedItem(null)}>
          <DialogContent className="sm:max-w-2xl w-[90vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-0 max-h-[90vh] flex flex-col">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-3xl font-bold text-blue-700 dark:text-sky-400" style={pageTitleFont}>
                {selectedItem.name}
              </DialogTitle>
              {selectedItem.themeElement && (
                <DialogDescription className="text-sm text-blue-500 dark:text-sky-600 italic" style={pageTitleFont}>
                  Inspired by: {selectedItem.themeElement}
                </DialogDescription>
              )}
            </DialogHeader>
            
            <ScrollArea className="flex-grow overflow-y-auto px-6 pt-4">
                <Carousel className="w-full mb-6 rounded-lg overflow-hidden shadow-lg">
                    <CarouselContent>
                    {(selectedItem.detailedImages && selectedItem.detailedImages.length > 0 ? selectedItem.detailedImages : [selectedItem.imageUrl]).map((img, idx) => (
                        <CarouselItem key={idx}>
                        <AspectRatio ratio={16 / 9} className="bg-slate-100 dark:bg-slate-800">
                            <img src={img} alt={`${selectedItem.name} image ${idx + 1}`} className="object-cover w-full h-full" />
                        </AspectRatio>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    {((selectedItem.detailedImages && selectedItem.detailedImages.length > 1) || (!selectedItem.detailedImages && selectedItem.imageUrl)) && (
                    <>
                        <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white dark:bg-slate-800/70 dark:hover:bg-slate-700 text-blue-600" />
                        <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white dark:bg-slate-800/70 dark:hover:bg-slate-700 text-blue-600" />
                    </>
                    )}
                </Carousel>

                <p className="text-gray-700 dark:text-gray-300 mb-4 text-base leading-relaxed">{selectedItem.description}</p>
                <p className="text-3xl font-bold text-yellow-500 dark:text-yellow-400 mb-6" style={pageTitleFont}>
                    ¥{selectedItem.price.toLocaleString()}
                </p>
            </ScrollArea>
            
            <DialogFooter className="p-6 pt-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl">
              <Button 
                variant="outline" 
                onClick={() => setSelectedItem(null)}
                className="border-blue-500 text-blue-500 hover:bg-blue-100 dark:border-sky-500 dark:text-sky-500 dark:hover:bg-slate-700 dark:hover:text-sky-400 rounded-lg py-2.5 px-5 text-base"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  handleAddToCart(selectedItem);
                  setSelectedItem(null); // Optionally close dialog after adding to cart
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all py-2.5 px-5 text-base"
                style={pageTitleFont}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to 4D Pocket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MenuPage;