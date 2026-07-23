import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, Sun, Building2, CheckCircle, Phone, User, Mail, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import VideoBackground from '@/components/VideoBackground';
import Footer from '@/components/Footer';

const BuyNowPage = () => {
  const navigate = useNavigate();
  const [selectedPurpose, setSelectedPurpose] = React.useState<string | null>(null);
  const [showHouseholdActions, setShowHouseholdActions] = React.useState(false);
  const [showContactMessage, setShowContactMessage] = React.useState(false);
  const [contactType, setContactType] = React.useState<'engineer' | 'self' | null>(null);

  const purposeOptions = [
    { value: 'household', label: 'Household', icon: Home },
    { value: 'solar-farm', label: 'Solar Parks', icon: Sun },
    { value: 'warehouse', label: 'Commercial Spaces / Warehouses', icon: Building2 },
  ];

  const handleContinue = () => {
    if (!selectedPurpose) return;

    if (selectedPurpose === 'household') {
      setShowHouseholdActions(true);
      setShowContactMessage(false);
    } else {
      setShowContactMessage(true);
      setShowHouseholdActions(false);
    }
  };

  const handleBack = () => {
    if (showHouseholdActions) {
      setShowHouseholdActions(false);
      setContactType(null);
    } else if (showContactMessage) {
      setShowContactMessage(false);
    } else {
      navigate(-1);
    }
  };

  const handleEngineerCall = () => {
    setContactType('engineer');
  };

  const handleSelfSetup = () => {
    setContactType('self');
    navigate('/solar-panel-setup');
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
            
            {/* 4-Step Progress Indicator */}
            <div className="mb-10">
              <div className="flex items-center justify-center">
                {[
                  { num: 1, label: 'Details', key: 1 },
                  { num: 2, label: 'Purpose', key: 2 },
                  { num: 3, label: 'Configure', key: 3 },
                  { num: 4, label: 'Summary', key: 4 },
                ].map((item, index) => {
                  const isActive = item.num === 2;
                  const isCompleted = item.num === 1;

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
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            item.num
                          )}
                        </div>
                        <span className={`text-xs mt-1.5 font-medium transition-colors duration-300 ${
                          isActive ? 'text-white' : isCompleted ? 'text-eythor-blue' : 'text-white/40'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                      {index < 3 && (
                        <div className={`w-16 h-0.5 mx-2 mt-[-1.25rem] rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-eythor-blue shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'bg-white/10'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Main Content Card */}
            <div className="relative group max-w-3xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-eythor-blue/20 via-transparent to-eythor-blue/10 rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
                
                <div className="relative z-10">
                  {/* Purpose Selection - Show when no action taken yet */}
                  {!showHouseholdActions && !showContactMessage && (
                    <>
                      {/* Header */}
                      <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                          <span className="text-gradient-blue">What's your Purpose?</span>
                        </h1>
                        <p className="text-white/70 text-base">
                          Choose the use case scenario for your solar panel table
                        </p>
                      </div>

                      {/* Purpose Selection Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        {purposeOptions.map((option) => {
                          const Icon = option.icon;
                          const isSelected = selectedPurpose === option.value;
                          
                          return (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSelectedPurpose(option.value);
                                setShowHouseholdActions(false);
                                setShowContactMessage(false);
                                setContactType(null);
                              }}
                              className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-center ${
                                isSelected
                                  ? 'bg-white/10 border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.2)]'
                                  : 'bg-white/[0.02] border-white/10 hover:border-white/30'
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute top-3 right-3">
                                  <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                              )}
                              
                              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                                isSelected
                                  ? 'bg-white/10'
                                  : 'bg-white/5'
                              }`}>
                                <Icon className={`w-8 h-8 ${
                                  isSelected ? 'text-white' : 'text-white/70'
                                }`} />
                              </div>
                              
                              <h3 className="text-white font-semibold text-base">
                                {option.label}
                              </h3>
                            </button>
                          );
                        })}
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex justify-between items-center">
                        <Button 
                          onClick={handleBack}
                          variant="outline"
                          className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-2 transition-all duration-300"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </Button>
                        
                        <Button 
                          onClick={handleContinue}
                          disabled={!selectedPurpose}
                          className="cta-button group gap-2"
                        >
                          <span>Continue</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Household Actions - Ask if user wants to call engineer or self-setup */}
                  {showHouseholdActions && (
                    <div className="animate-slide-in-right">
                      <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-eythor-blue/20 to-eythor-blue/5 rounded-full flex items-center justify-center mb-4">
                          <Home className="h-8 w-8 text-eythor-blue" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">
                          <span className="text-gradient-blue">Household Setup</span>
                        </h1>
                        <p className="text-white/60 text-sm max-w-md mx-auto">
                          How would you like to proceed with your solar panel installation?
                        </p>
                      </div>

                      <div className="space-y-4 mb-8">
                        {/* Option 1: Call an Engineer */}
                        <button
                          onClick={handleEngineerCall}
                          className="w-full p-6 rounded-xl border-2 border-white/10 bg-white/[0.02] hover:border-eythor-blue/40 hover:bg-eythor-blue/5 transition-all duration-300 text-left group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-xl bg-eythor-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-eythor-blue/20 transition-all duration-300">
                              <Phone className="w-7 h-7 text-eythor-blue" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-lg mb-1">Call an Engineer</h3>
                              <p className="text-white/50 text-sm">
                                Our expert engineer will visit your location, assess the site, and help you configure the perfect solar panel setup
                              </p>
                            </div>
                          </div>
                        </button>

                        {/* Option 2: Enter Details Myself */}
                        <button
                          onClick={handleSelfSetup}
                          className="w-full p-6 rounded-xl border-2 border-white/10 bg-white/[0.02] hover:border-eythor-blue/40 hover:bg-eythor-blue/5 transition-all duration-300 text-left group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-xl bg-eythor-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-eythor-blue/20 transition-all duration-300">
                              <User className="w-7 h-7 text-eythor-blue" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-lg mb-1">Enter Details Myself</h3>
                              <p className="text-white/50 text-sm">
                                I know my solar panel specifications and would like to enter the details manually
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Engineer Call Confirmation */}
                      {contactType === 'engineer' && (
                        <div className="mb-6 p-6 bg-eythor-blue/5 border border-eythor-blue/10 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-eythor-blue/10 flex items-center justify-center">
                              <Clock className="w-5 h-5 text-eythor-blue" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">Engineer Request Sent!</h3>
                              <p className="text-white/50 text-sm">Our team will contact you shortly</p>
                            </div>
                          </div>
                          <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                              <CheckCircle className="w-4 h-4 text-eythor-blue" />
                              <span>An expert engineer will be assigned to your location</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                              <CheckCircle className="w-4 h-4 text-eythor-blue" />
                              <span>We'll reach out within 24 hours to schedule a visit</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                              <CheckCircle className="w-4 h-4 text-eythor-blue" />
                              <span>The engineer will help measure and configure everything</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <Button 
                          onClick={handleBack}
                          variant="outline"
                          className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-2 transition-all duration-300"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          {contactType === 'engineer' ? 'Back' : 'Change Purpose'}
                        </Button>
                        
                        {contactType === 'engineer' && (
                          <Button 
                            onClick={() => navigate('/')}
                            className="cta-button group gap-2"
                          >
                            <span>Return Home</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Message for Warehouse / Solar Parks */}
                  {showContactMessage && (
                    <div className="animate-slide-in-right">
                      <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-eythor-blue/20 to-eythor-blue/5 rounded-full flex items-center justify-center mb-4">
                          {selectedPurpose === 'warehouse' ? (
                            <Building2 className="h-8 w-8 text-eythor-blue" />
                          ) : (
                            <Sun className="h-8 w-8 text-eythor-blue" />
                          )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">
                          <span className="text-gradient-blue">
                            {selectedPurpose === 'warehouse' ? 'Commercial Space' : 'Solar Park'}
                          </span>
                        </h1>
                        <p className="text-white/60 text-sm max-w-md mx-auto">
                          Thank you for your interest! Our team specializes in large-scale installations.
                        </p>
                      </div>

                      <div className="mb-8 p-6 bg-eythor-blue/5 border border-eythor-blue/10 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-eythor-blue/10 flex items-center justify-center">
                            <Mail className="w-6 h-6 text-eythor-blue" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">We'll Contact You Shortly!</h3>
                            <p className="text-white/50 text-sm">Our team will reach out with a customized solution</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <CheckCircle className="w-4 h-4 text-eythor-blue" />
                            <span>A dedicated project manager will be assigned to you</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <CheckCircle className="w-4 h-4 text-eythor-blue" />
                            <span>We'll provide a tailored quote based on your requirements</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <CheckCircle className="w-4 h-4 text-eythor-blue" />
                            <span>Our team will reach out within 24 hours</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <Button 
                          onClick={handleBack}
                          variant="outline"
                          className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-2 transition-all duration-300"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Change Purpose
                        </Button>
                        
                        <Button 
                          onClick={() => navigate('/')}
                          className="cta-button group gap-2"
                        >
                          <span>Return Home</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  )}
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

export default BuyNowPage;