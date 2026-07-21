
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <img 
                  src="/lovable-uploads/952b9631-14d4-4399-813e-c5d8792e457c.png" 
                  alt="Eythor Logo"
                  className="w-7 h-7"
                />
              </div>
              <span className="text-xl font-heading font-bold text-white">EYTHOR</span>
            </Link>
            <p className="text-white/70 mb-6 text-sm">
              Revolutionary solar panel cleaning & monitoring robots powered by advanced AI technology.
            </p>
            <div className="flex space-x-4">
              {/* <a href="https://facebook.com" className="text-white/60 hover:text-eythor-blue transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" className="text-white/60 hover:text-eythor-blue transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a> */}
              <a href="https://www.linkedin.com/in/eythor-private-limited-1446a3338/" className="text-white/60 hover:text-eythor-blue transition-colors" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              {/* <a href="https://instagram.com" className="text-white/60 hover:text-eythor-blue transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/70 hover:text-eythor-blue transition-colors text-sm">Home</Link></li>
              <li><Link to="/about" className="text-white/70 hover:text-eythor-blue transition-colors text-sm">About Us</Link></li>
              <li><Link to="/product" className="text-white/70 hover:text-eythor-blue transition-colors text-sm">Products</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-eythor-blue transition-colors text-sm">Contact</Link></li>
              <li><a href="https://forms.gle/exampleGoogleFormLink" className="text-white/70 hover:text-eythor-blue transition-colors text-sm">Careers</a></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-medium mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link to="/product" className="text-white/70 hover:text-eythor-blue transition-colors text-sm">Eyto Standard</Link></li>
              <li><Link to="/product" className="text-white/70 hover:text-eythor-blue transition-colors text-sm">Eyto Pro</Link></li>
              {/* <li><Link to="/product" className="text-white/70 hover:text-eythor-blue transition-colors text-sm">Eyto Enterprise</Link></li> */}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-medium mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-eythor-blue mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">IIF Delhi Technological University, Bawana Road, Delhi-110042, India</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="text-eythor-blue mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">Perth Office , Riff , 45 St George's Terrace , Perth , WA , Australia </span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-eythor-blue mr-2 flex-shrink-0" />
                <a href="mailto:info@eythor.com" className="text-white/70 hover:text-eythor-blue transition-colors text-sm">info@eythor.com</a>
              </li>
              {/* <li className="flex items-center">
                <Phone size={18} className="text-eythor-blue mr-2 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-white/70 hover:text-eythor-blue transition-colors text-sm">+1 (234) 567-890</a>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 mt-8 text-center">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Eythor Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
