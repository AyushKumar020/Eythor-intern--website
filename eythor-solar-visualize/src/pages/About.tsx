import React from 'react';
import Navbar from '@/components/Navbar';
import PartnerLogos from '@/components/PartnerLogos';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from "@/components/Footer";

const founderImage = '/lovable-uploads/naveen.png';

const partners = [
  { name: 'Startup India', logo: '/lovable-uploads/startupindia.png' },
  { name: 'TiHAN', logo: '/lovable-uploads/tihan.png' },
  { name: 'DI', logo: '/lovable-uploads/perth.png' },
  { name: 'Partner 5', logo: '/lovable-uploads/wa.jpg' },
  { name: 'Partner 6', logo: '/lovable-uploads/dst.jpg' },
  { name: 'Partner 7', logo: '/lovable-uploads/space.jpg' },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-eythor-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            About <span className="text-gradient">Eythor</span>
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-eythor-purple to-eythor-blue mx-auto mb-8" />
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            We are redefining solar panel cleaning with advanced automation, ensuring maximum efficiency and sustainability.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="glass-effect p-8 md:p-12 rounded-xl max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold mb-6">Who We Are</h2>
            <p className="text-lg text-white/80 mb-4">
              Solar energy is a key player in the future of renewable power, but maintaining peak panel performance remains a challenge...
            </p>
            <p className="text-lg text-white/80">
              We envision a world where renewable energy operates at full potential without excessive maintenance efforts...
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-eythor-purple/20 to-eythor-blue/20 p-8 md:p-12 rounded-xl max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold mb-6">Mission & Vision</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-eythor-purple to-eythor-blue mx-auto mb-8" />
            <p className="text-xl text-white/90 italic mb-8">
              "Delivering the best solar panel cleaning solutions for residential & commercial sectors."
            </p>
            <p className="text-lg text-white/80">
              Eythor is committed to revolutionizing solar panel maintenance by providing intelligent, automated, and water-efficient solutions...
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold mb-12 text-center">The Man Behind the Robot</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            <div className="rounded-xl overflow-hidden">
              <img src={founderImage} alt="Naveen - Founder of Eythor" className="w-full h-auto" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-semibold mb-2">Naveen</h3>
              <p className="text-eythor-purple mb-4">Founder & CEO</p>
              <p className="text-white/80 mb-4">
                Naveen Kumar is a visionary entrepreneur with a strong background in robotics and renewable energy...
              </p>
              <p className="text-white/80 mb-4">
                Under his leadership, Eythor has introduced cutting-edge automation...
              </p>
              <p className="text-white/80">
                Committed to global renewable energy adoption, Naveen continues to push boundaries...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <PartnerLogos partners={partners} />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-eythor-purple/20 to-eythor-blue/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Join the Future of Solar Maintenance
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Partner with Eythor to enhance your solar panel performance and contribute to a more sustainable world.
          </p>
          <a href="/contact" className="cta-button inline-block">
            Contact Us
          </a>
        </div>
      </section>

      {/* WhatsApp Button */}
      <WhatsAppButton phoneNumber="+917015138654" />

      {/* ✅ Footer is correctly placed here */}
      <Footer />
    </div>
  );
};

export default AboutPage;
