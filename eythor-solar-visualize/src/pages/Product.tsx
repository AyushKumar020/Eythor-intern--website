import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Cloud, BarChart, Check, Cpu, Shield, Droplet, Timer, Bolt, Rabbit, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import VideoBackground from '@/components/VideoBackground';
import FeatureCard from '@/components/FeatureCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ImageViewer from '@/components/ImageViewer';
import Footer from '@/components/Footer';

const robotImages = {
  main: '/lovable-uploads/eyto.png',
  side: '/lovable-uploads/Thermal.png',
  top: '/lovable-uploads/anti_falling_2.png',
  closeup: '/lovable-uploads/bg_white.png',
  angle: '/lovable-uploads/max_45.jpg',
  newBanner: '/lovable-uploads/eyto.png',
  docking: '/lovable-uploads/docking_Station.png',
};

const referenceImage = 'public/lovable-uploads/a2b7261a-07ad-4ea6-92e0-a85218ab9285.png';

const productVideo = '/lovable-uploads/landing.mp4';

const productFeatures = [
  {
    icon: Bolt,
    title: "8000Pa Powerful Suction",
    description: "Removes dirt and dust from solar panels with powerful suction technology"
  },
  {
    icon: Timer,
    title: "Maximum Runtime",
    description: "Highest run time of 300+ minutes to cover 5000+ sq.ft. area in a single charge"
  },
  {
    icon: Zap,
    title: "OZMO™ Pro 2.0 Vibrating",
    description: "Utilizing high-frequency vibration to swiftly eliminate stubborn stains"
  },
  {
    icon: Rabbit,
    title: "Anti-Tangle Technology",
    description: "A newly designed roller brush effectively prevents hair tangling"
  }
];

const overviewFeatures = [
  {
    image: robotImages.side,
    title: "Hotspot Detection",
    description: "Identifies overheating areas on panels, preventing damage and optimizing performance."
  },
  {
    image: robotImages.angle,
    title: "Incline Adaptability (Up to 45°)",
    description: "Seamlessly operates on inclined solar panels, ensuring effective cleaning across various installations."
  },
  {
    image: robotImages.top,
    title: "Anti-Fall Protection",
    description: "Intelligent edge detection prevents the robot from falling off the panel edges, ensuring safety and durability."
  },
  {
    image: robotImages.closeup,
    title: "Seamless Panel Transition",
    description: "Eyto is designed to move freely between solar panels without manual intervention, ensuring uninterrupted cleaning across large installations."
  }
];

const products = [
  {
    id: 'eyto-standard',
    name: 'Eyto Standard',
    description: 'Advanced Robotic Solar Panel Cleaner',
    image: robotImages.main,
    features: [
      'Semi-Automatic & Manual Control – Lightweight & Easy to Handle – Designed for easy pick-and-place on solar panels',
      'Long Battery Backup',
      'Wi-Fi & IoT Connectivity',
      'Dry Cleaning System –Bristle and microfiber cloth',
      'Weather & Dust Resistant'
    ],
    specs: [
      { specification: 'Weight', details: '25-40 kg' },
      { specification: 'Dimensions', details: '4m × 60cm × 30cm' },
      { specification: 'Battery Backup', details: '4-6 hours per charge' },
      { specification: 'Charging Time', details: '90-120 minutes' },
      { specification: 'Connectivity', details: 'Wi-Fi, 4G & IoT-based remote control' },
      { specification: 'Cleaning Mechanism', details: 'Dual-action rotating dry brushes + microfiber cloth system' },
      { specification: 'Navigation System', details: 'Smart traction + edge detection sensors' },
      { specification: 'Material', details: 'High-strength aluminum alloy with dust-resistant coating' },
      { specification: 'Safety Features', details: 'Edge detection, obstacle sensors, emergency stop' }
    ]
  },
  {
    id: 'eyto-pro',
    name: 'Eyto Pro',
    description: 'Fully Automatic Robotic Solar Panel Cleaner',
    image: robotImages.main,
    features: [
      'Thermal sensor for hotspot detection',
      'Fully Automatic Operation – Operates independently without manual intervention',
      'Smart Software Integration – Connected to an advanced software system for remote monitoring and control',
      'Auto Docking – Automatically returns to the docking station for charging when battery is low',
      'Long Battery Backup – Optimized power usage for extended cleaning cycles',
      'LoRa, 4G, WiFi & IoT Connectivity – Long-range, low-power communication for seamless operation',
      'Dry Cleaning System – Uses high-efficiency rotating brushes and microfiber cloth for dust removal without water',
      'Adaptive Movement – Smart traction system ensures smooth movement across panel surfaces',
      'Weather & Dust Resistant – Built with durable, weatherproof materials for long-term outdoor operation',
      'Safety Sensors – Equipped with edge detection, obstacle avoidance, and emergency stop features',
      'Available for Purchase – Commercially available for industrial solar panel cleaning solutions'
    ],
    specs: [
      { specification: 'Weight', details: '35-40 kg' },
      { specification: 'Dimensions', details: '4m × 60cm × 30cm' },
      { specification: 'Battery Backup', details: '2-6 hours per charge' },
      { specification: 'Charging Time', details: '90-120 minutes' },
      { specification: 'Connectivity', details: 'LORA & IoT-based remote control' },
      { specification: 'Cleaning Mechanism', details: 'Dual-action rotating dry brushes + microfiber cloth system' },
      { specification: 'Navigation System', details: 'Smart traction + edge detection sensors' },
      { specification: 'Material', details: 'High-strength aluminum alloy with dust-resistant coating' },
      { specification: 'Safety Features', details: 'Edge detection, obstacle sensors, emergency stop' },
      { specification: 'Docking System', details: 'Auto return to docking station for charging' }
    ]
  }
];

const ProductPage = () => {
  const [viewImageSrc, setViewImageSrc] = useState<string | null>(null);
  const [viewImageAlt, setViewImageAlt] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState(products[1]); // Default to Pro version
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const openImageViewer = (src: string, alt: string) => {
    setViewImageSrc(src);
    setViewImageAlt(alt);
  };

  const closeImageViewer = () => {
    setViewImageSrc(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <VideoBackground src={productVideo} className="h-screen">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 animate-fade-in">
            Meet <span className="text-eythor-blue">Eyto</span> Family
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            The most advanced solar panel cleaning and monitoring robots on the market
          </p>
        </div>
      </VideoBackground>
      
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Product <span className="text-eythor-blue">Overview</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Introducing the revolutionary solar panel cleaning and monitoring robot
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            {overviewFeatures.map((feature, index) => (
              <div key={index} className="bg-black/30 border border-white/10 p-6 rounded-lg hover:border-eythor-blue/30 transition-all overflow-hidden">
                <div className="mb-6 rounded-lg overflow-hidden shadow-glow-blue">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                      onClick={() => openImageViewer(feature.image, feature.title)}
                    />
                  </AspectRatio>
                </div>
                <h3 className="text-xl font-medium mb-3 text-eythor-blue">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/contact" className="cta-button inline-block">
              Learn More
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Product <span className="text-eythor-blue">Range</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Select the perfect Eyto model for your solar panel maintenance needs.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {products.map(product => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`px-6 py-3 rounded-md transition-all duration-300 ${
                  selectedProduct.id === product.id 
                    ? 'bg-eythor-blue text-white' 
                    : 'bg-black/30 text-white/70 border border-white/10 hover:bg-eythor-blue/10'
                }`}
              >
                {product.name}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="rounded-lg overflow-hidden shadow-xl neon-glow mb-6">
                <AspectRatio ratio={16/9}>
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </AspectRatio>
              </div>
            </div>
            
            <div>
              <h3 className="text-3xl font-heading font-semibold mb-2 text-eythor-blue">{selectedProduct.name}</h3>
              <p className="text-xl text-white/80 mb-6">{selectedProduct.description}</p>
              
              <h4 className="text-xl font-heading font-medium mb-4">Key Features</h4>
              <ul className="space-y-4 mb-8">
                {selectedProduct.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="bg-eythor-blue/20 p-1 rounded-full mr-3 mt-1">
                      <Check size={16} className="text-eythor-blue" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <h4 className="text-xl font-heading font-medium mb-4">Technical Specifications</h4>
              <div className="bg-black/30 border border-white/10 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-eythor-blue font-medium">Specification</TableHead>
                      <TableHead className="text-eythor-blue font-medium">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProduct.specs.map((spec, idx) => (
                      <TableRow key={idx} className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-white">{spec.specification}</TableCell>
                        <TableCell className="text-white/80">{spec.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-8">
                <Link to="/contact" className="cta-button inline-block">
                  Request a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Key <span className="text-eythor-blue">Features</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Discover what makes Eythor's robots the top choice for solar maintenance professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Advanced Technologies Integrated"
              description="LoRa WAN Connectivity – Enables long-range, low-power communication for remote monitoring and control."
              highlightColor="blue"
            />
            <FeatureCard
              icon={Cloud}
              title="Panel Temperature & Dust Sensing"
              description="Tracks temperature fluctuations and dust accumulation for optimized cleaning schedules."
              highlightColor="purple"
            />
            <FeatureCard
              icon={BarChart}
              title="Vacuum-Assisted Cleaning"
              description="Enhances dust and debris removal efficiency without excessive water usage."
              highlightColor="gradient"
            />
            <FeatureCard
              icon={Cpu}
              title="Hilex Brush Technology"
              description="Designed for non-abrasive yet effective cleaning, prolonging panel lifespan."
              highlightColor="blue"
            />
            <FeatureCard
              icon={Droplet}
              title="Self-Alignment Mechanism"
              description="Ensures precise positioning and movement across panels for uniform cleaning."
              highlightColor="purple"
            />
            <FeatureCard
              icon={Shield}
              title="Remote Monitoring & Performance Analytics"
              description="Seamlessly track cleaning cycles, monitor real-time performance metrics, detect panel inefficiencies,—all through an intuitive mobile app for complete control from anywhere."
              highlightColor="gradient"
            />
          </div>
        </div>
      </section>
      
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="glass-card p-8 rounded-xl">
              <h3 className="text-2xl font-heading font-semibold mb-6 flex items-center">
                <span className="bg-eythor-blue/10 p-2 rounded-full mr-3">
                  <Cloud size={20} className="text-eythor-blue" />
                </span>
                Advanced Docking System
              </h3>
              
              <div className="mb-6 rounded-lg overflow-hidden">
                <AspectRatio ratio={16/9}>
                  <img src={robotImages.docking} alt="Eythor Docking System" className="w-full h-full object-cover" />
                </AspectRatio>
              </div>
              
              <p className="text-white/80 mb-6">
                Our intelligent docking station serves as both a charging hub and a maintenance center for the Eyto robot.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-eythor-blue/20 p-1 rounded-full mr-3 mt-1">
                    <Check size={16} className="text-eythor-blue" />
                  </span>
                  <span>Automatic wireless charging</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-eythor-blue/20 p-1 rounded-full mr-3 mt-1">
                    <Check size={16} className="text-eythor-blue" />
                  </span>
                  <span>Water refill and filter cleaning system</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-eythor-blue/20 p-1 rounded-full mr-3 mt-1">
                    <Check size={16} className="text-eythor-blue" />
                  </span>
                  <span>Weather protection with auto-retraction</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-eythor-blue/20 p-1 rounded-full mr-3 mt-1">
                    <Check size={16} className="text-eythor-blue" />
                  </span>
                  <span>Central hub for data transmission to cloud</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-eythor-blue/20 p-1 rounded-full mr-3 mt-1">
                    <Check size={16} className="text-eythor-blue" />
                  </span>
                  <span>Automatic system diagnostics and updates</span>
                </li>
              </ul>
            </div>
            
            <div className="glass-card p-8 rounded-xl">
              <h3 className="text-2xl font-heading font-semibold mb-6 flex items-center">
                <span className="bg-eythor-blue/10 p-2 rounded-full mr-3">
                  <Cpu size={20} className="text-eythor-blue" />
                </span>
                Intelligent Software
              </h3>
              
              <div className="mb-6 rounded-lg overflow-hidden">
                <AspectRatio ratio={16/9}>
                  <img src="/lovable-uploads/image.png" alt="Software Dashboard" className="w-full h-full object-cover" />
                </AspectRatio>
              </div>
              
              <p className="text-white/80 mb-6">
                Our cloud-based software platform provides comprehensive control and monitoring capabilities.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-eythor-blue/20 p-1 rounded-full mr-3 mt-1">
                    <Check size={16} className="text-eythor-blue" />
                  </span>
                  <span>User-friendly mobile and web dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-eythor-blue/20 p-1 rounded-full mr-3 mt-1">
                    <Check size={16} className="text-eythor-blue" />
                  </span>
                  <span>AI-powered scheduling based on weather forecasts</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-eythor-blue/20 p-1 rounded-full mr-3 mt-1">
                    <Check size={16} className="text-eythor-blue" />
                  </span>
                  <span>Panel efficiency monitoring and hotspot detection</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-eythor-blue/20 p-1 rounded-full mr-3 mt-1">
                    <Check size={16} className="text-eythor-blue" />
                  </span>
                  <span>Predictive maintenance alerts</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-eythor-blue/20 p-1 rounded-full mr-3 mt-1">
                    <Check size={16} className="text-eythor-blue" />
                  </span>
                  <span>Integration with major solar monitoring platforms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gradient-to-r from-eythor-blue/20 to-eythor-blue/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Upgrade Your Solar Maintenance?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Contact our team to learn how Eythor can transform your solar panel cleaning and monitoring.
          </p>
          <a href="/contact" className="cta-button inline-block">
            Request a Demo
          </a>
        </div>
      </section>
      
      <WhatsAppButton phoneNumber="+917015138654" />
      
      {viewImageSrc && (
        <ImageViewer 
          isOpen={!!viewImageSrc} 
          onClose={closeImageViewer} 
          imageSrc={viewImageSrc} 
          altText={viewImageAlt} 
        />
      )}
      
      <Footer />
    </div>
  );
};

export default ProductPage;
