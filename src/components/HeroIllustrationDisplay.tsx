import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react'; // Example icon, could be themed

interface HeroIllustrationDisplayProps {
  imageUrl?: string;
  altText?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

const HeroIllustrationDisplay: React.FC<HeroIllustrationDisplayProps> = ({
  imageUrl = 'https://cdn.pixabay.com/photo/2023/04/20/17/04/cat-7940600_1280.png', // Placeholder Doraemon-like image
  altText = 'Playful illustration of Doraemon and friends',
  title = "Welcome to Doraemon's Restaurant!",
  description = 'Experience a world of culinary delights and adventure with your favorite characters.',
  ctaText = 'Explore Our Menu',
  ctaLink = '/menu',
}) => {
  console.log('HeroIllustrationDisplay loaded');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 to-sky-200 p-4 sm:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Image */}
      <motion.img
        src={imageUrl}
        alt={altText}
        className="absolute inset-0 w-full h-full object-contain object-center z-0 opacity-60 md:opacity-80" // object-contain to show full characters
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* Overlay Content */}
      <motion.div
        className="relative z-10 text-center max-w-3xl bg-white/30 backdrop-blur-sm p-6 sm:p-10 rounded-xl shadow-2xl"
        variants={itemVariants} // This div animates as one block after container
      >
        {title && (
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800 mb-4 drop-shadow-md"
            style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'cursive'" }} // Playful font
            variants={itemVariants}
          >
            {title}
          </motion.h1>
        )}

        {description && (
          <motion.p
            className="text-md sm:text-lg md:text-xl text-gray-700 mb-8 drop-shadow-sm"
            style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'cursive'" }} // Playful font
            variants={itemVariants}
          >
            {description}
          </motion.p>
        )}

        {ctaText && ctaLink && (
          <motion.div variants={itemVariants}>
            <Button
              asChild
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
              style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'cursive'" }} // Playful font
            >
              <Link to={ctaLink}>
                {ctaText}
                <Send className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HeroIllustrationDisplay;