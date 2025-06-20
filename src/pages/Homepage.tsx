import React from 'react';
import { Link } from 'react-router-dom';

// Custom Layout Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Custom Page Section Components
import HeroIllustrationDisplay from '@/components/HeroIllustrationDisplay';
import FeaturedProductHighlight from '@/components/FeaturedProductHighlight';
import type { FeaturedItem } from '@/components/FeaturedProductHighlight'; // Import the type for item structure

// Shadcn/ui Components
import { Button } from '@/components/ui/button';

// Placeholder data for FeaturedProductHighlight
const featuredItemsData: FeaturedItem[] = [
  {
    id: 'dora001',
    name: "Dorayaki Classic Set",
    price: 350,
    imageUrl: "https://doraemon.pages.dev/images/food/dorayaki-set.jpg",
    description: "Doraemon's absolute favorite! Two fluffy pancakes filled with sweet red bean paste. Comes with a small surprise!",
    slug: "/menu/item/dorayaki-classic-set" // Example slug
  },
  {
    id: 'dora002',
    name: "Memory Bread French Toast",
    price: 480,
    imageUrl: "https://doraemon.pages.dev/images/food/memory-bread-toast.jpg",
    description: "Deliciously golden French toast that helps you remember... just how amazing it tastes! Served with syrup and berries.",
    slug: "/menu/item/memory-bread-toast"
  },
  {
    id: 'dora003',
    name: "Anywhere Door Pizza Slice",
    price: 550,
    imageUrl: "https://doraemon.pages.dev/images/food/anywhere-door-pizza.jpg",
    description: "A jumbo slice of pizza with toppings that magically change, taking your taste buds on an adventure!",
    slug: "/menu/item/anywhere-door-pizza"
  },
  {
    id: 'dora004',
    name: "Gadget Gourmet Gyoza",
    price: 420,
    imageUrl: "https://doraemon.pages.dev/images/food/big-light-gyoza.jpg", // Using Big Light Gyoza image as placeholder
    description: "A mix of uniquely flavored gyoza, each inspired by a different secret gadget. Pan-fried to perfection.",
    slug: "/menu/item/gadget-gourmet-gyoza"
  }
];

const Homepage: React.FC = () => {
  console.log('Homepage loaded');

  // Consistent playful font style, similar to what's used in HeroIllustrationDisplay
  const playfulFontStyle = { fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'cursive'" };

  return (
    <div className="flex flex-col min-h-screen bg-sky-50 dark:bg-slate-950 text-gray-800 dark:text-gray-200">
      <Header />
      <main className="flex-grow">
        <HeroIllustrationDisplay
          imageUrl="https://doraemon.pages.dev/images/hero/doraemon-group-eating.jpg"
          altText="Doraemon and friends joyfully gathering around a table full of food"
          title="Welcome to Doraemon's Pocket Diner!"
          description="Step into a world of wonder and delicious food, served with a side of adventure and a sprinkle of magic from the future!"
          ctaText="Explore the Menu!"
          ctaLink="/menu" // Path from App.tsx
        />

        <FeaturedProductHighlight
          title="Doraemon's Favorites!"
          items={featuredItemsData}
        />

        {/* Additional Call to Action Section using the Button component */}
        <section className="py-10 md:py-16 bg-white dark:bg-slate-800 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 
              className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-sky-400 mb-4 drop-shadow-sm"
              style={playfulFontStyle}
            >
              Ready for a Culinary Adventure?
            </h2>
            <p className="text-md sm:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto" style={playfulFontStyle}>
              Our full menu is packed with amazing dishes inspired by Doraemon's fantastic gadgets and timeless adventures. Find your new favorite treat today!
            </p>
            <Button
              asChild
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full shadow-xl transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-700"
              style={playfulFontStyle}
            >
              <Link to="/menu">View Full Menu & Order Now!</Link> {/* Path from App.tsx */}
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;