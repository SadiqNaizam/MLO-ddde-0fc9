import React from 'react';
import { motion } from 'framer-motion';
import { Link, LinkProps } from 'react-router-dom';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  DoorOpen,
  Gift,
  Wind,
  Languages,
  Lightbulb,
  Bell, // Using Bell as a default Doraemon-esque icon (e.g., Doraemon's bell)
  HelpCircle, // Fallback
  Icon as LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming 'cn' utility is in 'src/lib/utils.ts'

/**
 * Defines the types of Doraemon gadgets that can be represented by the icon.
 * - `anywhereDoor`: For navigation, e.g., to menu, home.
 * - `timeFuroshiki`: For special offers, promotions, or versioning.
 * - `bambooCopter`: For quick actions, scrolling, or 'go' functions.
 * - `translationJelly`: For language options or information display.
 * - `smallLight`: For highlighting, info, or perhaps 'shrinking/detail' view.
 * - `defaultGadget`: A generic Doraemon-themed icon, like Doraemon's bell.
 */
export type GadgetIconType =
  | 'anywhereDoor'
  | 'timeFuroshiki'
  | 'bambooCopter'
  | 'translationJelly'
  | 'smallLight'
  | 'defaultGadget';

interface GadgetIconButtonProps extends Omit<ButtonProps, 'asChild' | 'onClick'> {
  /** Specifies the Doraemon gadget icon to display. */
  gadget: GadgetIconType;
  /** Accessible label for the button, crucial for icon-only buttons. */
  ariaLabel: string;
  /** Optional visible label text (e.g., for tooltips or if design allows). If provided, often used as sr-only. */
  label?: string;
  /** If provided, the button will render as a react-router-dom Link. */
  to?: LinkProps['to'];
  /** Click handler. Works for both button and Link types. */
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  /** Additional CSS classes for the main button/link element. */
  className?: string;
  /** Additional CSS classes for the icon element. */
  iconClassName?: string;
}

const GadgetVisual: React.FC<{ gadgetName: GadgetIconType; className?: string }> = ({ gadgetName, className }) => {
  const iconProps = { className: cn("h-5 w-5 sm:h-6 sm:w-6", className) }; // Default icon size, responsive

  switch (gadgetName) {
    case 'anywhereDoor':
      return <DoorOpen {...iconProps} />; // Suggests navigation
    case 'timeFuroshiki':
      return <Gift {...iconProps} />; // Suggests offers or something special
    case 'bambooCopter':
      return <Wind {...iconProps} />; // Suggests speed, movement
    case 'translationJelly':
      return <Languages {...iconProps} />; // Suggests language or communication
    case 'smallLight':
      return <Lightbulb {...iconProps} />; // Suggests ideas, info, or 'shrinking'
    case 'defaultGadget':
      return <Bell {...iconProps} />; // Doraemon's bell as a default thematic icon
    default:
      return <HelpCircle {...iconProps} />; // Fallback
  }
};

const MotionButton = motion(Button);

const GadgetIconButton: React.FC<GadgetIconButtonProps> = ({
  gadget,
  ariaLabel,
  label,
  to,
  onClick,
  className,
  iconClassName,
  variant = 'ghost', // Default shadcn Button variant
  size = 'icon',     // Default shadcn Button size
  ...restButtonProps
}) => {
  console.log('GadgetIconButton loaded - Gadget:', gadget, 'Label:', label || ariaLabel);

  const buttonContent = (
    <>
      <GadgetVisual gadgetName={gadget} className={iconClassName} />
      {label && <span className="sr-only">{label}</span>}
    </>
  );

  const motionAnimProps = {
    whileHover: { y: -3, scale: 1.15, transition: { type: "spring", stiffness: 350, damping: 10 } },
    whileTap: { scale: 0.9, transition: { type: "spring", stiffness: 350, damping: 15 } },
    // transition: { type: "spring", stiffness: 500, damping: 20 } // Optional: default transition for initial appearance
  };
  
  const commonProps = {
    variant,
    size,
    'aria-label': ariaLabel,
    className: cn("rounded-full p-2.5 sm:p-3 transition-colors duration-150 ease-in-out", className), // Base styling, merged with passed className
    ...restButtonProps,
  };

  if (to) {
    return (
      <MotionButton
        {...commonProps}
        {...motionAnimProps}
        asChild
      >
        <Link to={to} onClick={onClick}>
          {buttonContent}
        </Link>
      </MotionButton>
    );
  }

  return (
    <MotionButton
      {...commonProps}
      {...motionAnimProps}
      onClick={onClick}
    >
      {buttonContent}
    </MotionButton>
  );
};

export default GadgetIconButton;