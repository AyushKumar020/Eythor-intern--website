import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, Sun, Grid3X3, Upload, Image, CheckCircle, Calculator, Table, MousePointer, Camera, Smartphone, Zap, Sparkles, Plus, ScanLine } from 'lucide-react';
import Navbar from '@/components/Navbar';
import VideoBackground from '@/components/VideoBackground';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

interface StepData {
  id: number;
  title: string;
  description: string;
  icon: any;
  animation: string;
}

const steps: StepData[] = [
  {
    id: 1,
    title: 'Configure Your Table',
    description: 'Enter the dimensions of your solar panel table. Specify the number of rows (max 5) and columns (max 40). The grid preview shows your table layout in real-time with each cell representing one solar panel.',
    icon: Grid3X3,
    animation: 'step1',
  },
  {
    id: 2,
    title: 'Upload Solar Panel Photos',
    description: 'Upload photos from 4 different angles: Top View, Front View, Side View, and Back View. You can upload up to 4 photos total. Clear images help us accurately identify your panel model.',
    icon: Camera,
    animation: 'step2',
  },
  {
    id: 3,
    title: 'OCR Panel Identification',
    description: 'After uploading photos, our advanced OCR (Optical Character Recognition) technology automatically extracts the model number and specifications from your solar panel label. You can also enter the model name manually if needed. The system matches it with our database to get accurate dimensions and rated power.',
    icon: ScanLine,
    animation: 'step3',
  },
  {
    id: 4,
    title: 'View Summary & Submit',
    description: 'Review your complete summary showing all configured tables, panel counts, and specifications. You can add more tables or submit your details. Our team will contact you with a customized quote.',
    icon: Calculator,
    animation: 'step4',
  },
];

const SolarPanelGuide = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animProgress, setAnimProgress] = useState(0);
  const [showGridHighlight, setShowGridHighlight] = useState(false);
  const [showUploadDemo, setShowUploadDemo] = useState(false);
  const [showPhotoDrop, setShowPhotoDrop] = useState(false);
  const [photosUploaded, setPhotosUploaded] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const progressRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now();
      const duration = 3000; // 3 seconds per step
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setAnimProgress(progress);
        progressRef.current = progress;
        
        // Trigger visual cues based on progress
        if (currentStep === 0) {
          setShowGridHighlight(progress > 0.3);
        } else if (currentStep === 1) {
          setShowUploadDemo(progress > 0.2);
          setShowPhotoDrop(progress > 0.5);
          if (progress > 0.6) setPhotosUploaded(3);
          else if (progress > 0.4) setPhotosUploaded(2);
          else if (progress > 0.2) setPhotosUploaded(1);
        } else if (currentStep === 2) {
          setShowSummary(progress > 0.5);
        }
        
        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          setIsPlaying(false);
        }
      };
      
      animFrameRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, currentStep]);

  const handlePlayStep = (index: number) => {
    setCurrentStep(index);
    setAnimProgress(0);
    setShowGridHighlight(false);
    setShowUploadDemo(false);
    setShowPhotoDrop(false);
    setPhotosUploaded(0);
    setShowSummary(false);
    setIsPlaying(true);
  };

  const handleAutoPlay = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setAnimProgress(0);
      setShowGridHighlight(false);
      setShowUploadDemo(false);
      setShowPhotoDrop(false);
      setPhotosUploaded(0);
      setShowSummary(false);
      setIsPlaying(true);
    } else {
      // Reset
      setCurrentStep(0);
      setAnimProgress(0);
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnimProgress(0);
    setShowGridHighlight(false);
    setShowUploadDemo(false);
    setShowPhotoDrop(false);
    setPhotosUploaded(0);
    setShowSummary(false);
    setIsPlaying(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  };

  const renderVisualDemo = () => {
    const step = steps[currentStep];
    
    return (
      <div className="bg-black/80 border border-white/10 rounded-2xl overflow-hidden min-h-[320px] relative">
        {/* Step indicator */}
        <div className="absolute top-3 left-3 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-eythor-blue/20 border border-eythor-blue/30 rounded-full">
            <step.icon className="w-3 h-3 text-eythor-blue" />
            <span className="text-[10px] text-eythor-blue font-medium">Step {step.id}/4</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-10">
          <div 
            className="h-full bg-eythor-blue transition-all duration-200 rounded-full"
            style={{ width: `${animProgress * 100}%` }}
          />
        </div>

        {/* Demo content based on step */}
        <div className="p-8 pt-12 min-h-[320px] flex flex-col items-center justify-center">
          {/* STEP 1: Configure Table - Grid Demo */}
          {currentStep === 0 && (
            <div className="w-full max-w-lg space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-center mb-3">
                  <Grid3X3 className="w-5 h-5 text-eythor-blue mx-auto mb-1" />
                  <div className="text-xs text-white/40">Configure Your Table - Enter rows & columns</div>
                </div>
                
                {/* Animated grid */}
                <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(30, 1fr)' }}>
                  {Array.from({ length: 5 }, (_, ri) =>
                    Array.from({ length: 30 }, (_, ci) => {
                      const isHighlighted = showGridHighlight && ri < 3 && ci < 20;
                      return (
                        <div
                          key={`${ri}-${ci}`}
                          className={`aspect-square rounded-[1px] border transition-all duration-300 ${
                            isHighlighted
                              ? 'bg-eythor-blue/40 border-eythor-blue/60 shadow-[0_0_4px_rgba(59,130,246,0.3)]'
                              : 'bg-white/[0.03] border-white/5'
                          }`}
                        />
                      );
                    })
                  )}
                </div>

                {/* Input fields animation */}
                <div className={`flex justify-center gap-4 mt-4 transition-all duration-700 ${animProgress > 0.2 ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <span className="text-[10px] text-white/40">Rows:</span>
                    <div className="w-8 h-5 bg-eythor-blue/30 rounded text-[10px] text-white flex items-center justify-center font-bold border border-eythor-blue/50">3</div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <span className="text-[10px] text-white/40">Cols:</span>
                    <div className="w-8 h-5 bg-eythor-blue/30 rounded text-[10px] text-white flex items-center justify-center font-bold border border-eythor-blue/50">20</div>
                  </div>
                </div>

                {/* Pointer hand */}
                <div className={`flex justify-center mt-3 transition-all duration-500 ${animProgress > 0.1 && !showGridHighlight ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="animate-pulse">
                    <MousePointer className="w-4 h-4 text-eythor-blue" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Photo Upload */}
          {currentStep === 1 && (
            <div className="w-full max-w-md space-y-3">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-center mb-3">
                  <Camera className="w-5 h-5 text-eythor-blue mx-auto mb-1" />
                  <div className="text-xs text-white/40">Upload Photos - Front, Back, Top, Side views</div>
                </div>

                {/* Camera/phone animation */}
                <div className={`flex justify-center mb-3 transition-all duration-700 ${showUploadDemo ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                  <div className="relative">
                    <Smartphone className="w-16 h-16 text-eythor-blue/40" />
                    <div className="absolute -top-1 -right-1">
                      <Camera className="w-5 h-5 text-eythor-blue animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Upload area animation */}
                <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-700 ${showUploadDemo ? 'border-eythor-blue/40 bg-eythor-blue/5 opacity-100' : 'border-white/10 opacity-50'}`}>
                  <Upload className="w-6 h-6 text-eythor-blue/60 mx-auto mb-1" />
                  <div className="text-[10px] text-white/40">Click to upload photos</div>
                </div>

                {/* Photos falling into place */}
                <div className="flex justify-center gap-2 mt-3 min-h-[60px]">
                  {[1, 2, 3, 4].map((num) => (
                    <div
                      key={num}
                      className={`w-14 h-14 rounded-lg border overflow-hidden transition-all duration-500 ${photosUploaded >= num ? 'opacity-100 scale-100 border-eythor-blue/30' : 'opacity-0 scale-0 border-white/10'}`}
                      style={{ transitionDelay: `${(num - 1) * 300}ms` }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-eythor-blue/20 to-eythor-blue/5 flex items-center justify-center">
                        <div className="text-center">
                          <Image className="w-4 h-4 text-eythor-blue/60 mx-auto" />
                          <div className="text-[8px] text-white/40 mt-0.5">
                            {['Front', 'Back', 'Top', 'Side'][num - 1]}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Angle labels */}
                <div className={`flex justify-center gap-2 mt-2 transition-all duration-500 ${photosUploaded >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                  {['Front View', 'Back View', 'Top View', 'Side View'].map((label) => (
                    <span key={label} className="text-[8px] text-green-400/70">{label} ✓</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: OCR Identification */}
          {currentStep === 2 && (
            <div className="w-full max-w-md space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <div className="text-center mb-4">
                  <ScanLine className="w-5 h-5 text-eythor-blue mx-auto mb-1" />
                  <div className="text-xs text-white/40">OCR Panel Identification</div>
                </div>

                {/* Scanning animation */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-lg"></div>
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                      <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-eythor-blue/30 to-transparent transition-all duration-1000 ${showSummary ? 'translate-y-full' : 'translate-y-0'}`} style={{ animation: showSummary ? 'none' : 'scan 2s ease-in-out infinite' }}></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Image className="w-8 h-8 text-white/40 mx-auto mb-1" />
                        <div className="text-[8px] text-white/40">Panel Label</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* OCR result animation */}
                <div className={`space-y-2 transition-all duration-700 ${showSummary ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="bg-eythor-blue/10 border border-eythor-blue/30 rounded-lg p-3">
                    <div className="text-[10px] text-eythor-blue font-medium mb-1">✓ Model Detected</div>
                    <div className="text-sm text-white font-medium">SolarTech Pro-X200</div>
                    <div className="text-[10px] text-white/50">400W | Monocrystalline</div>
                  </div>
                </div>

                {/* Manual input option */}
                <div className={`mt-3 p-3 border border-dashed border-white/10 rounded-lg text-center transition-all duration-500 ${animProgress > 0.5 ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="text-[10px] text-white/40">Or enter manually</div>
                  <div className="mt-1 h-6 bg-white/5 rounded border border-white/10 w-full"></div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Summary & Actions */}
          {currentStep === 3 && (
            <div className="w-full max-w-md space-y-3">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-center mb-3">
                  <Calculator className="w-5 h-5 text-eythor-blue mx-auto mb-1" />
                  <div className="text-xs text-white/40">Your Solar Panel Summary</div>
                </div>

                {/* Table cards */}
                <div className="space-y-2">
                  {[
                    { num: 1, rows: 3, cols: 20, panels: 60 },
                  ].map((table, idx) => (
                    <div
                      key={table.num}
                      className={`bg-white/[0.03] border border-white/10 rounded-lg p-3 transition-all duration-500 ${showSummary ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ transitionDelay: `${idx * 300}ms` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Table className="w-3 h-3 text-eythor-blue" />
                          <span className="text-xs text-white font-medium">Table #{table.num}</span>
                        </div>
                        <span className="text-xs text-eythor-blue font-bold">{table.panels} panels</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-white/50">
                        <span>{table.rows} rows × {table.cols} cols</span>
                        <span className="flex items-center gap-1">
                          <Image className="w-2.5 h-2.5" />
                          4 photos
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className={`mt-3 p-3 bg-eythor-blue/10 border border-eythor-blue/30 rounded-lg text-center transition-all duration-700 ${showSummary ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                  <div className="text-2xl font-bold text-eythor-blue">60</div>
                  <div className="text-[10px] text-white/50">Total Solar Panels</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
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
          <div className="container mx-auto max-w-4xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full mb-4">
                <Camera className="w-3.5 h-3.5 text-eythor-blue" />
                <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Interactive Guide</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3">
                <span className="text-gradient-blue">How to Upload Your Solar Panel Details</span>
              </h1>
              <p className="text-white/50 text-sm max-w-xl mx-auto">
                Watch this step-by-step guide to learn how to configure your solar panel tables, upload photos, and get your total panel count.
              </p>
            </div>

            {/* Main demo area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Step selector sidebar */}
              <div className="lg:col-span-1 space-y-2">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-3 font-medium">Steps</div>
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      setCurrentStep(index);
                      setAnimProgress(0);
                      setShowGridHighlight(false);
                      setShowUploadDemo(false);
                      setShowPhotoDrop(false);
                      setPhotosUploaded(0);
                      setShowSummary(false);
                      setIsPlaying(false);
                      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-300 group ${currentStep === index ? 'bg-eythor-blue/10 border-eythor-blue/40 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === index ? 'bg-eythor-blue text-white' : 'bg-white/10 text-white/50'}`}>
                        {step.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium truncate ${currentStep === index ? 'text-eythor-blue' : 'text-white/70'}`}>
                          {step.title}
                        </div>
                        <div className="text-[10px] text-white/40 truncate">
                          {step.description.slice(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                {/* Controls */}
                <div className="flex gap-2 pt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCurrentStep(0);
                      setAnimProgress(0);
                      setShowGridHighlight(false);
                      setShowUploadDemo(false);
                      setShowPhotoDrop(false);
                      setPhotosUploaded(0);
                      setShowSummary(false);
                      setIsPlaying(false);
                      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
                    }}
                    className="flex-1 border-white/10 text-white/60 hover:text-white hover:bg-white/5 h-8 text-[11px] gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAutoPlay}
                    className="flex-1 cta-button h-8 text-[11px] gap-1"
                  >
                    <Play className="w-3 h-3" />
                    {currentStep === steps.length - 1 ? 'Replay All' : 'Next Step'}
                  </Button>
                </div>
              </div>

              {/* Visual demo */}
              <div className="lg:col-span-2">
                {renderVisualDemo()}
                
                {/* Step description */}
                <div className="mt-4 bg-white/[0.02] border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-eythor-blue/10 flex items-center justify-center flex-shrink-0">
                      {React.createElement(steps[currentStep].icon, { className: 'w-4 h-4 text-eythor-blue' })}
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm mb-1">{steps[currentStep].title}</h3>
                      <p className="text-white/50 text-xs leading-relaxed">{steps[currentStep].description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick tips */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-eythor-blue" />
                <span className="text-white text-sm font-medium">Quick Tips</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  <Camera className="w-4 h-4 text-eythor-blue mb-1" />
                  <div className="text-xs text-white/70 font-medium mb-0.5">Good Lighting</div>
                  <div className="text-[10px] text-white/40">Take photos in bright daylight for best clarity</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  <Grid3X3 className="w-4 h-4 text-eythor-blue mb-1" />
                  <div className="text-xs text-white/70 font-medium mb-0.5">Measure Correctly</div>
                  <div className="text-[10px] text-white/40">Count rows and columns accurately in each table</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  <Image className="w-4 h-4 text-eythor-blue mb-1" />
                  <div className="text-xs text-white/70 font-medium mb-0.5">Multiple Angles</div>
                  <div className="text-[10px] text-white/40">Front, back, side and top views give us complete info</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-8">
              <Button
                onClick={() => navigate('/solar-panel-setup')}
                className="cta-button gap-2"
                size="lg"
              >
                <span>Try It Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/quote')}
                className="ml-3 border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-2"
                size="lg"
              >
                Back to Quote
              </Button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default SolarPanelGuide;