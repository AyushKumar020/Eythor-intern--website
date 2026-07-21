import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Zap, BarChart, ChevronRight, Sparkles, LayoutGrid, Bolt } from 'lucide-react';
import Navbar from '@/components/Navbar';
import VideoBackground from '@/components/VideoBackground';
import FeatureCard from '@/components/FeatureCard';
import ComparisonTable from '@/components/ComparisonTable';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';

// Sample robot image (replace with actual image path)
const robotImage = '/lovable-uploads/eyto.png';
// Update video path to use the correct path format
const heroVideo = "/lovable-uploads/landing.mp4";

const comparisonData = [
  { feature: 'Efficiency', eythor: '95-98%', manual: '60-75%' },
  { feature: 'Water Usage', eythor: 'Low or None (Dry cleaning robots)', manual: 'High (10000-20000 L per cycle)' },
  { feature: 'Time Required', eythor: '5-10 hours per cycle', manual: '2-3 days per cycle' },
  { feature: 'Worker Safety', eythor: "Low Risk (automated process)", manual: "High Risk (manual labour , heights)" },
  { feature: 'Automation', eythor: "Yes", manual: "No" },
  { feature: 'Environmental Impact', eythor: "Low(Less water, reduced carbon footprint)", manual: "High(water-waste,chemicals)" },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section with Video Background */}
      <VideoBackground src={heroVideo} className="h-screen">
        <div className="relative container mx-auto px-4 h-full flex items-center z-10">
          {/* Tech shapes for background effect */}
          <div className="tech-shape top-20 left-10 animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="tech-shape-white bottom-20 right-10 animate-float" style={{ animationDelay: '1s' }}></div>
          
          <div className="max-w-2xl text-left mt-16">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 animate-fade-in">
              Solar Panel Cleaning & <br className="hidden md:block" />
              <span className="text-gradient-blue">Monitoring Robot</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Revolutionizing solar panel maintenance with AI-driven automation
            </p>
            <div className="flex flex-col sm:flex-row justify-start gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/product" className="cta-button group">
                Learn More
                <ChevronRight className="inline-block ml-1 transition-transform group-hover:translate-x-1" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </VideoBackground>
      
      {/* Solution Section */}
      <section className="py-24 relative overflow-hidden" id="solution">
        <div className="tech-shape top-20 right-20 animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="tech-shape-white bottom-20 left-20 animate-float" style={{ animationDelay: '1.5s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="px-3 py-1 text-sm font-medium bg-eythor-blue/10 text-eythor-blue rounded-full mb-4 inline-block">Introducing</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-gradient-blue">Eyto</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
            The Intelligent Solar Panel Cleaning Robot Redefining Maintenance With AI-Powered Precision And Automation.            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-lg overflow-hidden shadow-xl tech-card p-2">
              <img src={robotImage} alt="Eythor Robot" className="w-full h-auto rounded-lg" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-semibold mb-4 text-gradient-blue">What is Eyto?
              </h3>
              <p className="text-white/70 mb-6">
              A fully automated solar panel cleaning and monitoring robot designed to maximize energy efficiency and system performance.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start group">
                  <span className="bg-eythor-blue/10 p-1.5 rounded-lg mr-3 mt-1 group-hover:bg-eythor-blue/20 transition-all duration-300">
                    <Bolt size={16} className="text-eythor-blue" />
                  </span>
                  <span className="group-hover:text-white transition-all duration-300">Technology & Innovation: Equipped with LoRa WAN connectivity, panel temperature sensing, dust detection, and vacuum cleaning technology for precise and efficient maintenance.
                  </span>
                </li>
                <li className="flex items-start group">
                  <span className="bg-eythor-blue/10 p-1.5 rounded-lg mr-3 mt-1 group-hover:bg-eythor-blue/20 transition-all duration-300">
                    <Bolt size={16} className="text-eythor-blue" />
                  </span>
                  <span className="group-hover:text-white transition-all duration-300">Applications: Ideal for solar farms, commercial installations, and industrial setups, ensuring optimal power generation with minimal manual intervention.
                  </span>
                </li>
                <li className="flex items-start group">
                  <span className="bg-eythor-blue/10 p-1.5 rounded-lg mr-3 mt-1 group-hover:bg-eythor-blue/20 transition-all duration-300">
                    <Bolt size={16} className="text-eythor-blue" />
                  </span>
                  <span className="group-hover:text-white transition-all duration-300">Key Features: Dry-cleaning automation, self-alignment, Hilex brush design, smart self-charging dock, and battery & motor temperature monitoring for seamless operation.</span>
                </li>
                
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Comparison Section */}
      <section className="py-24 bg-black/50 relative" id="comparison">
        <div className="tech-shape top-20 left-20 animate-float" style={{ animationDelay: '0.2s' }}></div>
        <div className="tech-shape-white bottom-20 right-20 animate-float" style={{ animationDelay: '1.2s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="px-3 py-1 text-sm font-medium bg-eythor-blue/10 text-eythor-blue rounded-full mb-4 inline-block">Comparison</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Why We're Better Than <span className="text-gradient-blue">Manual Cleaning</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              See how Eythor outperforms traditional manual cleaning methods across key metrics.
            </p>
          </div>
          
          <div className="tech-card p-1 rounded-xl">
            <ComparisonTable items={comparisonData} />
          </div>
        </div>
      </section>
      
      {/* Key Benefits Section */}
      <section className="py-24 relative" id="benefits">
        <div className="tech-shape-white top-20 right-20 animate-float" style={{ animationDelay: '0.7s' }}></div>
        <div className="tech-shape bottom-20 left-20 animate-float" style={{ animationDelay: '1.7s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="px-3 py-1 text-sm font-medium bg-eythor-blue/10 text-eythor-blue rounded-full mb-4 inline-block">Features</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Key <span className="text-gradient-blue">Benefits</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Why industry leaders choose Eythor for their solar panel maintenance needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Maximized Energy Efficiency"
              description="Boosts solar panel performance by up to 30%, ensuring higher energy output and improved system longevity.  
"
              highlightColor="blue"
            />
            <FeatureCard
              icon={Cloud}
              title="Time & Labor Optimization"
              description="Completes cleaning cycles in just 5-10 hours, significantly reducing manual effort while enhancing worker safety through automation."
              highlightColor="white"
            />
            <FeatureCard
              icon={BarChart}
              title="Eco-Friendly & Sustainable"
              description="Minimizes environmental impact with reduced water usage and a lower carbon footprint, promoting greener energy solutions."
              highlightColor="gradient"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-eythor-blue/10 to-white/5"></div>
        <div className="tech-shape top-10 left-10 animate-float" style={{ animationDelay: '0.3s' }}></div>
        <div className="tech-shape-white top-10 right-10 animate-float" style={{ animationDelay: '1.3s' }}></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to <span className="text-gradient-blue">Revolutionize</span> Your Solar Panel Maintenance?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Join the growing number of businesses and solar farms that trust Eythor for efficient, AI-powered panel cleaning.
          </p>
          <Link to="/contact" className="cta-button inline-block group">
          Contact Us
          
                      <ChevronRight className="inline-block ml-1 transition-transform group-hover:translate-x-1" size={18} />
          </Link>
        </div>
      </section>
      
      <WhatsAppButton phoneNumber="+917015138654" />
      
      <Footer />
    </div>
  );
};

export default HomePage;
