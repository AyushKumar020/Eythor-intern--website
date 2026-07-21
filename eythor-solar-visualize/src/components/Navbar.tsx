import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLink {
  name: string;
  href: string;
  external?: boolean;
}

const navLinks: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Product', href: '/product' },
  { name: 'Buy Now', href: '/quote' },
  { name: 'Career', href: 'https://forms.gle/exampleGoogleFormLink', external: true },
  { name: 'Contact Us', href: '/contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        scrolled ? 'glass-card py-3 backdrop-blur-lg' : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <div className="h-16 w-16 md:h-20 md:w-20 flex items-center justify-center"> 
            <img 
              src="/lovable-uploads/logo6.png" 
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => 
            link.external ? (
              <a 
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link nav-link-hover"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "nav-link nav-link-hover",
                  location.pathname === link.href && "nav-link-active"
                )}
              >
                {link.name}
              </Link>
            )
          )}
        </nav>

        <button 
          className="md:hidden text-primary p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <div className="w-6 flex flex-col items-end justify-center gap-1.5">
            <span className={`block h-0.5 bg-primary transition-all duration-300 ${mobileMenuOpen ? 'w-6 -rotate-45 translate-y-2' : 'w-6'}`}></span>
            <span className={`block h-0.5 bg-primary transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'w-4'}`}></span>
            <span className={`block h-0.5 bg-primary transition-all duration-300 ${mobileMenuOpen ? 'w-6 rotate-45 -translate-y-2' : 'w-5'}`}></span>
          </div>
        </button>
      </div>

      <div className={`md:hidden glass-card absolute w-full transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0 overflow-hidden'}`}>
        <nav className="container mx-auto px-4 flex flex-col space-y-4">
          {navLinks.map((link) => 
            link.external ? (
              <a 
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "nav-link py-2",
                  location.pathname === link.href && "nav-link-active"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;