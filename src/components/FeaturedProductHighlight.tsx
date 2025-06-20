import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ThemedFoodItemCard from '@/components/ThemedFoodItemCard'; // Assumed path based on conventions
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Interface for the items to be displayed
// This structure should align with the props expected by ThemedFoodItemCard
export interface FeaturedItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  slug: string; // For ThemedFoodItemCard, e.g., to open a detail dialog or link
}

// Props for the FeaturedProductHighlight component
interface FeaturedProductHighlightProps {
  title: string;
  items: FeaturedItem[];
}

const FeaturedProductHighlight: React.FC<FeaturedProductHighlightProps> = ({ title, items }) => {
  console.log('FeaturedProductHighlight loaded');

  if (!items || items.length === 0) {
    return (
      <section aria-labelledby="featured-title" className="py-8 md:py-12 bg-blue-50 rounded-lg my-8">
        <div className="container mx-auto px-4">
          <h2 
            id="featured-title" 
            className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-8"
            style={{ fontFamily: "var(--font-doraemon-display, 'Arial Rounded MT Bold', 'Comic Sans MS', sans-serif)" }} // Playful font suggestion
          >
            {title}
          </h2>
          <p className="text-center text-gray-600">No featured items to display at the moment. Check back soon!</p>
        </div>
      </section>
    );
  }

  // Determine number of slides for loop logic; assumes 3 items visible on larger screens.
  const visibleSlidesLargeScreen = 3;

  return (
    <section aria-labelledby="featured-title" className="py-8 md:py-12 bg-sky-100 dark:bg-sky-800/30 rounded-xl shadow-lg my-8 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 
          id="featured-title" 
          className="text-3xl md:text-4xl font-bold text-center text-blue-700 dark:text-sky-400 mb-10 drop-shadow-sm"
          style={{ fontFamily: "var(--font-doraemon-display, 'Arial Rounded MT Bold', 'Comic Sans MS', sans-serif)" }} // Playful font suggestion
        >
          {title}
        </h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: items.length > visibleSlidesLargeScreen, // Loop if more items than typically visible
          }}
          className="w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto relative" // Added relative for positioning buttons if needed within this div
        >
          <CarouselContent className="-ml-4">
            {items.map((item) => (
              <CarouselItem key={item.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full flex"> {/* Added flex to ensure card takes full height if needed */}
                  <ThemedFoodItemCard
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    imageUrl={item.imageUrl}
                    description={item.description}
                    slug={item.slug}
                    // Assuming ThemedFoodItemCard is designed to be responsive and fill its container
                    // It should also handle its own hover animations as per its description
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Show nav buttons only if there are enough items to scroll */}
          {items.length > 1 && (
            <>
              <CarouselPrevious 
                className="absolute left-0 sm:-left-12 top-1/2 -translate-y-1/2 z-10
                           h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700
                           text-blue-600 dark:text-sky-400 hover:text-blue-800 dark:hover:text-sky-300 
                           border-2 border-blue-500 dark:border-sky-600 shadow-md
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">Previous slide</span>
              </CarouselPrevious>
              <CarouselNext 
                className="absolute right-0 sm:-right-12 top-1/2 -translate-y-1/2 z-10
                           h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700
                           text-blue-600 dark:text-sky-400 hover:text-blue-800 dark:hover:text-sky-300 
                           border-2 border-blue-500 dark:border-sky-600 shadow-md
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">Next slide</span>
              </CarouselNext>
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedProductHighlight;