import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Mail, Phone, MapPin, Zap, Home, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import VideoBackground from '@/components/VideoBackground';
import Footer from '@/components/Footer';

const SolarQuote = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    kilowatts: '',
    pinCode: '',
    houseNumber: '',
    streetAddress: '',
    city: '',
    state: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, phone: numericValue });
    } else if (name === 'kilowatts') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, kilowatts: numericValue });
    } else if (name === 'pinCode') {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData({ ...formData, pinCode: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const isFormValid = () => {
    return formData.name && formData.email && formData.phone && 
           formData.pinCode && formData.houseNumber && formData.streetAddress && formData.city && formData.state;
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <img src="/background image buy now page.jpeg" alt="Background" className="w-full h-full object-cover opacity-50" />
        </div>
        
        <div className="absolute top-40 left-10 w-72 h-72 bg-eythor-blue/5 rounded-full blur-[100px] animate-pulse pointer-events-none z-[1]"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-white/[0.02] rounded-full blur-[120px] animate-pulse pointer-events-none z-[1]" style={{ animationDelay: '1s' }}></div>
        
        
        <main className="relative z-10 pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl px-4">
            
            <div className="mb-12">
              <div className="flex items-center justify-center">
                {[
                  { num: 1, label: 'Details', key: 1 },
                  { num: 2, label: 'Purpose', key: 2 },
                  { num: 3, label: 'Configure', key: 3 },
                  { num: 4, label: 'Summary', key: 4 },
                ].map((item, index) => {
                  const isCompleted = item.num === 1;
                  const isActive = item.num === 1;

                  return (
                    <React.Fragment key={item.key}>
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                          isCompleted
                            ? 'bg-eythor-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                            : isActive
                              ? 'bg-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)] border-2 border-white/40'
                              : 'bg-white/5 border border-white/10 text-white/40'
                        }`}>
                          {isCompleted ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            item.num
                          )}
                        </div>
                        <span className={`text-xs mt-1.5 font-medium transition-colors duration-300 ${isCompleted ? 'text-eythor-blue' : isActive ? 'text-white' : 'text-white/40'}`}>
                          {item.label}
                        </span>
                      </div>
                      {index < 3 && (
                        <div className="w-20 h-0.5 mx-2 mt-[-1.25rem] rounded-full bg-white/10" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="relative group max-w-3xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-eythor-blue/20 via-transparent to-eythor-blue/10 rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                      <span className="text-gradient-blue">Your Custom Quote</span>
                    </h1>
                    <p className="text-white/70 text-base">
                      Please let us know a few details
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="group/input bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-eythor-blue/50 hover:bg-white/10 transition-all duration-300">
                        <User className="w-5 h-5 text-eythor-blue/70 group-hover/input:text-eythor-blue transition-colors" />
                        <input 
                          type="text" 
                          name="name" 
                          placeholder="Full Name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          className="bg-transparent text-white placeholder:text-white/40 text-base w-full outline-none"
                        />
                      </div>
                      <div className="group/input bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-eythor-blue/50 hover:bg-white/10 transition-all duration-300">
                        <Mail className="w-5 h-5 text-eythor-blue/70 group-hover/input:text-eythor-blue transition-colors" />
                        <input 
                          type="email" 
                          name="email" 
                          placeholder="Email ID" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          className="bg-transparent text-white placeholder:text-white/40 text-base w-full outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="group/input bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-eythor-blue/50 hover:bg-white/10 transition-all duration-300">
                        <Phone className="w-5 h-5 text-eythor-blue/70 group-hover/input:text-eythor-blue transition-colors" />
                        <input 
                          type="tel" 
                          name="phone" 
                          placeholder="Phone Number" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          className="bg-transparent text-white placeholder:text-white/40 text-base w-full outline-none" 
                        />
                      </div>
                      <div className="group/input bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-eythor-blue/50 hover:bg-white/10 transition-all duration-300">
                        <Zap className="w-5 h-5 text-eythor-blue/70 group-hover/input:text-eythor-blue transition-colors" />
                        <input 
                          type="text" 
                          name="kilowatts" 
                          placeholder="Kilowatts Required" 
                          value={formData.kilowatts} 
                          onChange={handleInputChange} 
                          className="bg-transparent text-white placeholder:text-white/40 text-base w-full outline-none"
                        />
                      </div>
                    </div>

                    <div className="text-white/70 text-xs uppercase tracking-wider mb-3 mt-6 font-medium">
                      Complete Installation Address
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="group/input bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-eythor-blue/50 hover:bg-white/10 transition-all duration-300">
                        <Home className="w-5 h-5 text-eythor-blue/70 group-hover/input:text-eythor-blue transition-colors" />
                        <input 
                          type="text" 
                          name="houseNumber" 
                          placeholder="House / Flat Number" 
                          value={formData.houseNumber} 
                          onChange={handleInputChange} 
                          className="bg-transparent text-white placeholder:text-white/40 text-sm w-full outline-none" 
                        />
                      </div>
                      <div className="group/input bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-eythor-blue/50 hover:bg-white/10 transition-all duration-300">
                        <MapPin className="w-5 h-5 text-eythor-blue/70 group-hover/input:text-eythor-blue transition-colors" />
                        <input 
                          type="text" 
                          name="pinCode" 
                          placeholder="6-Digit Pin Code" 
                          value={formData.pinCode} 
                          onChange={handleInputChange} 
                          maxLength={6} 
                          className="bg-transparent text-white placeholder:text-white/40 text-sm w-full outline-none" 
                        />
                      </div>
                    </div>

                    <div className="group/input bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-eythor-blue/50 hover:bg-white/10 transition-all duration-300">
                      <MapPin className="w-5 h-5 text-eythor-blue/70 group-hover/input:text-eythor-blue transition-colors" />
                      <input 
                        type="text" 
                        name="streetAddress" 
                        placeholder="Complete Street Address" 
                        value={formData.streetAddress} 
                        onChange={handleInputChange} 
                        className="bg-transparent text-white placeholder:text-white/40 text-sm w-full outline-none" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="group/input bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-eythor-blue/50 hover:bg-white/10 transition-all duration-300">
                        <MapPin className="w-5 h-5 text-eythor-blue/70 group-hover/input:text-eythor-blue transition-colors" />
                        <input 
                          type="text" 
                          name="city" 
                          placeholder="City / Town" 
                          value={formData.city} 
                          onChange={handleInputChange} 
                          className="bg-transparent text-white placeholder:text-white/40 text-sm w-full outline-none" 
                        />
                      </div>
                      <div className="group/input bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-eythor-blue/50 hover:bg-white/10 transition-all duration-300">
                        <MapPin className="w-5 h-5 text-eythor-blue/70 group-hover/input:text-eythor-blue transition-colors z-10" />
                        <input 
                          type="text" 
                          name="state" 
                          placeholder="State / Region" 
                          value={formData.state} 
                          onChange={handleInputChange} 
                          className="bg-transparent text-white placeholder:text-white/40 text-sm w-full outline-none relative z-10" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-eythor-blue/5 border border-eythor-blue/10 rounded-xl">
                    <p className="text-white/70 text-xs text-center">
                      Your information is secure and will only be used to provide you with the best quote.
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <Button 
                      onClick={() => navigate(-1)}
                      variant="outline"
                      className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-2 transition-all duration-300"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Button>
                    
                    <Button 
                      onClick={() => navigate('/buynow')}
                      disabled={!isFormValid()}
                      className="cta-button group gap-2"
                    >
                      <span>Next : Choose the Purpose</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

      </div>

      <Footer />
    </div>
  );
};

export default SolarQuote;