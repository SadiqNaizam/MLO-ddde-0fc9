import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder icon, actual themed icons could be used.
import { ShieldCheck, FileText, HelpCircle, Info, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  console.log('Footer loaded');
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: '/terms', text: 'Terms & Conditions', icon: <FileText className="w-4 h-4 mr-1" /> },
    { href: '/privacy', text: 'Privacy Policy', icon: <ShieldCheck className="w-4 h-4 mr-1" /> },
    { href: '/allergy-info', text: 'Allergy Information', icon: <Info className="w-4 h-4 mr-1" /> },
    { href: '/faq', text: 'FAQs', icon: <HelpCircle className="w-4 h-4 mr-1" /> },
    { href: '/contact', text: 'Contact Us', icon: <Phone className="w-4 h-4 mr-1" /> },
  ];

  return (
    <footer className="bg-blue-100 border-t border-blue-200 text-blue-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center md:items-start">
            {/* Placeholder for a small themed logo or text */}
            <Link to="/" className="mb-2">
              <span className="text-xl font-bold text-blue-700">Doraemon's Eatery</span>
            </Link>
            <p className="text-sm text-center md:text-left">Bringing joy, one bite at a time!</p>
          </div>

          <nav className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Quick Links</h3>
            {footerLinks.map((link) => (
              <Link
                key={link.text}
                to={link.href}
                className="text-sm hover:text-red-500 hover:underline flex items-center transition-colors rounded-md px-2 py-1"
              >
                {link.icon}
                {link.text}
              </Link>
            ))}
          </nav>
          
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
             <h3 className="text-lg font-semibold mb-2 text-blue-700">Stay Connected</h3>
             {/* Placeholder for social media icons */}
             <div className="flex space-x-3 mb-3">
                {/* Example: <Link to="#" className="hover:text-red-500"><FacebookIcon /></Link> */}
             </div>
             <p className="text-xs">
                123 Anywhere Street, Future City
             </p>
             <p className="text-xs">
                Email: info@doraemonseatery.com
             </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-blue-300 text-center">
          <p className="text-sm">
            &copy; {currentYear} Doraemon's Eatery. All rights reserved.
          </p>
          <p className="text-xs mt-1">
            Doraemon & Fujiko-Pro. This is a fan-concept project.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;