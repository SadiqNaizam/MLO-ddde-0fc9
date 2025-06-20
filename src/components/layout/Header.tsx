import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, UserCircle2 } from 'lucide-react';
import AnimatedShoppingCartIcon from '@/components/AnimatedShoppingCartIcon'; // Assuming this path

const Header: React.FC = () => {
  console.log('Header loaded');

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-lg font-medium transition-colors hover:text-yellow-300 ${
      isActive ? 'text-yellow-300 font-bold' : 'text-white'
    }`;

  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-blue-700 hover:text-yellow-300 ${
      isActive ? 'bg-blue-700 text-yellow-300 font-bold' : 'text-gray-100'
    }`;
  
  const NavLinks: React.FC<{isMobile?: boolean}> = ({ isMobile = false }) => (
    <>
      <NavLink to="/" className={isMobile ? mobileNavLinkClasses : navLinkClasses}>
        Home
      </NavLink>
      <NavLink to="/menu" className={isMobile ? mobileNavLinkClasses : navLinkClasses}>
        Menu
      </NavLink>
      <NavLink to="/user-profile" className={isMobile ? mobileNavLinkClasses : navLinkClasses}>
        <div className="flex items-center gap-1">
          <UserCircle2 className={isMobile ? "h-5 w-5" : "h-6 w-6"} />
          Account
        </div>
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-700 bg-blue-600 shadow-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          {/* Placeholder for a Doraemon-themed logo. Using text for now. */}
          {/* <img src="/placeholder-doraemon-logo.png" alt="Doraemon's Eatery" className="h-10" /> */}
          <span className="text-2xl font-bold text-white tracking-tight">Doraemon's Eatery</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" aria-label="Shopping Cart">
            <AnimatedShoppingCartIcon />
          </Link>

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700 hover:text-yellow-300">
                  <Menu className="h-7 w-7" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs bg-blue-600 p-6 border-l-blue-700">
                <div className="flex flex-col gap-6">
                  <Link to="/" className="flex items-center gap-2 mb-6">
                     <span className="text-xl font-bold text-white">Doraemon's Eatery</span>
                  </Link>
                  <nav className="flex flex-col gap-4">
                    <SheetClose asChild>
                      <NavLinks isMobile={true} />
                    </SheetClose>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;