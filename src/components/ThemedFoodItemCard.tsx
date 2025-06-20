import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ShoppingCart } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Props definition for ThemedFoodItemCard
interface ThemedFoodItemCardProps {
  id: string | number;
  imageUrl: string;
  name: string;
  price: number;
  description: string;
  // Callback function when 'Add to Cart' is clicked
  onAddToCart: (item: { id: string | number; name: string; price: number }) => void;
  // Callback function when the card is clicked to view details
  onViewDetails: (itemId: string | number) => void;
}

const ThemedFoodItemCard: React.FC<ThemedFoodItemCardProps> = ({
  id,
  imageUrl,
  name,
  price,
  description,
  onAddToCart,
  onViewDetails,
}) => {
  console.log(`ThemedFoodItemCard loaded for item ID: ${id}, Name: ${name}`);
  const { toast } = useToast();

  const handleAddToCartClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent the card's onClick from firing
    onAddToCart({ id, name, price });
    toast({
      title: "Added to 4D Pocket!",
      description: `${name} has been added to your cart.`,
      // Consider adding a Doraemon-themed icon to the toast component if customizable
    });
  };

  const handleCardClick = () => {
    onViewDetails(id);
  };

  return (
    <Card 
      className="w-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.03] rounded-xl group border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer flex flex-col h-full bg-white dark:bg-gray-900"
      onClick={handleCardClick}
      role="button" // Accessibility: indicate the card is clickable
      tabIndex={0} // Accessibility: make it focusable
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(); } }} // Accessibility: allow activation with keyboard
      aria-label={`View details for ${name}`}
    >
      <CardHeader className="p-0 relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || 'https://doraemon.pages.dev/images/placeholder-food.jpg'} 
            alt={`Image of ${name}`}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 rounded-t-lg"
          />
        </AspectRatio>
        {/* 
          Placeholder for a subtle Doraemon motif. 
          Example: A small bell icon or a themed badge.
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs p-1.5 rounded-full shadow-md transform group-hover:rotate-12 transition-transform">鈴</div>
        */}
      </CardHeader>

      <CardContent className="p-4 space-y-2 flex-grow">
        <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">
          {/* Typography: Ensure global styles apply a playful, rounded font if desired for the Doraemon theme */}
          {name}
        </CardTitle>
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 min-h-[4.5rem]">
          {description}
        </p>
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 pt-1">
          ¥{price.toLocaleString()}
        </p>
      </CardContent>

      <CardFooter className="p-3 mt-auto border-t border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/50 rounded-b-lg">
        <Button 
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-700 dark:text-blue-800 font-semibold text-base py-2.5 px-4 rounded-lg shadow hover:shadow-md transition-all duration-200 ease-in-out"
          onClick={handleAddToCartClick}
          aria-label={`Add ${name} to 4D Pocket`}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to 4D Pocket
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ThemedFoodItemCard;