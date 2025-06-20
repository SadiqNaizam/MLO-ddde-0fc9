import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils'; // Assuming utils.ts for cn exists

interface AnimatedShoppingCartIconProps {
  cartItemCount?: number;
  className?: string;
}

const AnimatedShoppingCartIcon: React.FC<AnimatedShoppingCartIconProps> = ({
  cartItemCount = 0,
  className,
}) => {
  console.log('AnimatedShoppingCartIcon loaded');

  return (
    <Link to="/cart" className={cn('relative', className)} aria-label={`Shopping cart with ${cartItemCount} items`}>
      <motion.div
        className="relative flex items-center justify-center w-12 h-12 bg-white rounded-full border-2 border-red-500 cursor-pointer"
        whileHover={{
          scale: 1.15,
          rotate: 7,
          boxShadow: "0px 0px 15px rgba(239, 68, 68, 0.8)", // Tailwind red-500 glow
        }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        aria-hidden="true" // Decorative element, Link has aria-label
      >
        <ShoppingCart className="w-6 h-6 text-blue-600" />
        {cartItemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-6 h-6 p-0 text-xs rounded-full"
          >
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </Badge>
        )}
      </motion.div>
    </Link>
  );
};

export default AnimatedShoppingCartIcon;