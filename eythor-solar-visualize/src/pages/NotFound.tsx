
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-eythor-dark">
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-effect p-10 rounded-xl max-w-md w-full text-center">
          <h1 className="text-9xl font-heading font-bold text-gradient">404</h1>
          <h2 className="text-2xl font-heading font-semibold mt-4 mb-6">Page Not Found</h2>
          <p className="text-white/70 mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="cta-button inline-block">
            Return to Home
          </Link>
        </div>
      </div>
      
      <WhatsAppButton phoneNumber="+917015138654" />
    </div>
  );
};

export default NotFound;
