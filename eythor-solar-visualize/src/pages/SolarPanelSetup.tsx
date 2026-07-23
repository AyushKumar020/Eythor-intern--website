import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Upload, Sun, Grid3X3, Image, CheckCircle, Trash2, Plus, Calculator, Table, PlayCircle, ScanLine, Cpu, Home, Columns2, Rows2, Eye, EyeOff, ArrowUpFromLine, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import VideoBackground from '@/components/VideoBackground';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import SolarPanelModelInput from '@/components/SolarPanelModelInput';
import type { SolarPanel } from '@/data/solarPanelsSearch';

interface TableEntry {
  id: string;
  tableNumber: number;
  rows: number;
  columns: number;
  panels: number;
  images: UploadedImage[];
  solarPanel?: SolarPanel | null;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  label: string;
}

const MAX_GRID_ROWS = 5;
const MAX_GRID_COLS = 40;

const SolarPanelSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [completedTables, setCompletedTables] = useState<TableEntry[]>([]);
  const [tableCounter, setTableCounter] = useState(1);
  const [rows, setRows] = useState('');
  const [columns, setColumns] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const selectedAngleRef = useRef<string>('Top View');
  const [totalPanels, setTotalPanels] = useState(0);
  const [selectedPanel, setSelectedPanel] = useState<SolarPanel | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateGridPreview = (r: number, c: number): boolean[][] => {
    const grid: boolean[][] = [];
    for (let row = 0; row < MAX_GRID_ROWS; row++) {
      const rowData: boolean[] = [];
      for (let col = 0; col < MAX_GRID_COLS; col++) {
        rowData.push(row < r && col < c);
      }
      grid.push(rowData);
    }
    return grid;
  };

  const parsedRows = Math.min(Math.max(parseInt(rows) || 0, 0), MAX_GRID_ROWS);
  const parsedCols = Math.min(Math.max(parseInt(columns) || 0, 0), MAX_GRID_COLS);
  const gridPreview = generateGridPreview(parsedRows, parsedCols);

  const handleTableConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = parseInt(rows);
    const c = parseInt(columns);

    if (!r || !c || r < 1 || c < 1) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter valid rows and columns.',
        variant: 'destructive',
      });
      return;
    }

    if (r > MAX_GRID_ROWS) {
      toast({
        title: 'Max Rows Exceeded',
        description: `Maximum ${MAX_GRID_ROWS} rows allowed per table.`,
        variant: 'destructive',
      });
      return;
    }

    if (c > MAX_GRID_COLS) {
      toast({
        title: 'Max Columns Exceeded',
        description: `Maximum ${MAX_GRID_COLS} columns allowed.`,
        variant: 'destructive',
      });
      return;
    }

    goToStep(2);
  };

  const handleAngleUploadClick = (angleLabel: string) => {
    selectedAngleRef.current = angleLabel;
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const preview = URL.createObjectURL(file);

    const angle = selectedAngleRef.current;
    // Remove any existing image for this angle
    const filtered = uploadedImages.filter(img => img.label !== angle);
    
    const newImage: UploadedImage = {
      id: `img-${Date.now()}`,
      file,
      preview,
      label: angle,
    };

    setUploadedImages([...filtered, newImage]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const handleAddTable = () => {
    const r = parseInt(rows);
    const c = parseInt(columns);
    
    const entry: TableEntry = {
      id: `table-${Date.now()}`,
      tableNumber: tableCounter,
      rows: r,
      columns: c,
      panels: r * c,
      images: [...uploadedImages],
      solarPanel: selectedPanel,
    };

    setCompletedTables(prev => [...prev, entry]);
    setTableCounter(prev => prev + 1);
    
    setRows('');
    setColumns('');
    setUploadedImages([]);
    setSelectedPanel(null);
    setStep(1);
  };

  const handleNextToModelLookup = () => {
    goToStep(3);
  };

  const handleBackFromModelLookup = () => {
    goToStep(2);
  };

  const handleNextToSummary = () => {
    if (!selectedPanel) {
      toast({
        title: 'No Panel Selected',
        description: 'Please identify your solar panel model before proceeding.',
        variant: 'destructive',
      });
      return;
    }
    const r = parseInt(rows);
    const c = parseInt(columns);
    
    const entry: TableEntry = {
      id: `table-${Date.now()}`,
      tableNumber: tableCounter,
      rows: r,
      columns: c,
      panels: r * c,
      images: [...uploadedImages],
      solarPanel: selectedPanel,
    };

    const allTables = [...completedTables, entry];
    
    let total = 0;
    allTables.forEach(table => {
      total += table.panels;
    });

    setCompletedTables(allTables);
    setTotalPanels(total);
    goToStep(4);
  };

  const handleBack = () => {
    if (step === 2) {
      goToStep(1);
    } else if (step === 3) {
      goToStep(2);
    } else {
      navigate('/buynow');
    }
  };

  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const goToStep = (newStep: number) => {
    setSlideDirection(newStep > step ? 'right' : 'left');
    setStep(newStep);
  };

  const handleConfirmAndSubmit = () => {
    toast({
      title: 'Information Submitted!',
      description: 'Thank you! Our team will review your details and contact you shortly with a customized quote.',
    });
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const renderTableBadge = () => (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-eythor-blue/10 border border-eythor-blue/20 rounded-full">
      <Table className="w-4 h-4 text-eythor-blue" />
      <span className="text-sm font-medium text-eythor-blue">
        Table #{tableCounter}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <VideoBackground src="/lovable-uploads/landing.mp4" className="h-full" />
        </div>
        
        {/* Decorative tech shapes */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-eythor-blue/5 rounded-full blur-[100px] animate-pulse pointer-events-none z-[1]"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-white/[0.02] rounded-full blur-[120px] animate-pulse pointer-events-none z-[1]" style={{ animationDelay: '1s' }}></div>
        
        {/* Side Navigation Arrows */}
        <button 
          onClick={handleBack}
          disabled={step === 1}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <main className="relative z-10 pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="mb-8">
              <div className="flex items-center justify-center gap-0">
                {[
                  { num: 1, label: 'Table Setup', key: 1 },
                  { num: 2, label: 'Photos', key: 2 },
                  { num: 3, label: 'Identify Panel', key: 3 },
                  { num: 4, label: 'Result', key: 4 },
                ].map((item, index) => {
                  const isActive = step >= item.num;
                  const isCompleted = step > item.num;

                  return (
                    <React.Fragment key={item.key}>
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                          isCompleted 
                            ? 'bg-eythor-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                            : isActive
                              ? 'bg-eythor-blue/20 border-2 border-eythor-blue/50 text-eythor-blue shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                              : 'bg-white/5 border border-white/10 text-white/40'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            item.num
                          )}
                        </div>
                        <span className={`text-xs mt-1.5 font-medium transition-colors duration-300 ${
                          isActive ? 'text-eythor-blue' : 'text-white/40'
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

            <div className="relative group">
              {/* Glow effect behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-eythor-blue/20 via-transparent to-eythor-blue/10 rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              
                <div className="relative bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-eythor-blue/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
                 
                <div className="relative z-10">
                  <div className={slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'}>
                    {step === 1 && (
                      <form onSubmit={handleTableConfigSubmit} className="space-y-6">
                        {/* Top row: Heading left, How to use button right */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h2 className="text-3xl md:text-4xl font-bold">
                              <span className="text-gradient-blue">Configure Your Table</span>
                            </h2>
                            <p className="text-white/50 text-sm mt-1">
                              Enter the dimensions of your solar panel table
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => navigate('/solar-panel-guide')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 group flex-shrink-0"
                          >
                            <PlayCircle className="w-3.5 h-3.5 text-white/50 group-hover:text-eythor-blue transition-colors" />
                            <span className="text-[11px] text-white/50 group-hover:text-eythor-blue transition-colors">How to use?</span>
                          </button>
                        </div>

                        {/* Table badge and Table Setup icon just below heading */}
                        <div className="flex items-center gap-2">
                          {renderTableBadge()}
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full">
                            <Grid3X3 className="w-3.5 h-3.5 text-eythor-blue" />
                            <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Table Setup</span>
                          </div>
                        </div>

                        <div className="relative py-2">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                          </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                          <div className="text-center mb-3">
                              <span className="text-xs text-white/40">Max Grid: 5 rows × 40 columns</span>
                          </div>
                          <div className="overflow-x-auto">
                            <div 
                              className="grid gap-1 mx-auto min-w-fit"
                              style={{
                                gridTemplateColumns: `repeat(${MAX_GRID_COLS}, minmax(0, 1fr))`,
                              }}
                            >
                              {gridPreview.map((row, ri) =>
                                row.map((cell, ci) => (
                                  <div
                                    key={`${ri}-${ci}`}
                                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm transition-all duration-200 ${
                                      cell
                                        ? 'bg-eythor-blue/60 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                                        : 'bg-white/[0.04]'
                                    }`}
                                    title={`Row ${ri + 1}, Col ${ci + 1}`}
                                  />
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-white/80 text-sm font-medium flex items-center gap-2">
                              <Rows2 className="w-5 h-5 text-eythor-blue" />
                              Number of Rows *
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              max={MAX_GRID_ROWS}
                              placeholder={`Max ${MAX_GRID_ROWS} rows`}
                              value={rows}
                              onChange={(e) => setRows(e.target.value)}
                              className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 
                                         focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                                         transition-all duration-300 rounded-lg h-11 hover:border-white/20"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-white/80 text-sm font-medium flex items-center gap-2">
                              <Columns2 className="w-5 h-5 text-eythor-blue" />
                              Number of Columns *
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              max={MAX_GRID_COLS}
                               placeholder={`Max ${MAX_GRID_COLS} columns`}
                              value={columns}
                              onChange={(e) => setColumns(e.target.value)}
                              className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 
                                         focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                                         transition-all duration-300 rounded-lg h-11 hover:border-white/20"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-eythor-blue/5 border border-eythor-blue/10 rounded-lg">
                          <Grid3X3 className="w-4 h-4 text-eythor-blue flex-shrink-0" />
                          <p className="text-xs text-white/50">
                            Each cell in the grid represents one solar panel. Enter your dimensions above to see the preview.
                          </p>
                        </div>

                        <div className="flex justify-between pt-2">
                          <Button type="button" variant="outline" onClick={handleBack}
                            className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-2 transition-all duration-300">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                          </Button>
                          <Button type="submit" className="cta-button group gap-2">
                            <span>Next: Upload Photos</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </form>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        {/* Top row: Heading left, How to use button right */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h2 className="text-3xl md:text-4xl font-bold">
                              <span className="text-gradient-blue">Upload Solar Panel Photos</span>
                            </h2>
                            <p className="text-white/50 text-sm mt-1">
                              Upload photos from of 4 different angles
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => navigate('/solar-panel-guide')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 group flex-shrink-0"
                          >
                            <PlayCircle className="w-3.5 h-3.5 text-white/50 group-hover:text-eythor-blue transition-colors" />
                            <span className="text-[11px] text-white/50 group-hover:text-eythor-blue transition-colors">How to use?</span>
                          </button>
                        </div>

                        {/* Table badge and Photos icon just below heading */}
                        <div className="flex items-center gap-2">
                          {renderTableBadge()}
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full">
                            <Image className="w-3.5 h-3.5 text-eythor-blue" />
                            <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Photos</span>
                          </div>
                        </div>

                        <div className="relative py-2">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                          </div>
                        </div>

                        {/* 4 Upload Boxes - matching screenshot format */}
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { 
                              key: 'top', label: 'Upload top view', 
                              Icon: ({ className }: { className?: string }) => (
                                <svg
    className={className}
    viewBox="0 0 120 80"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="15" y="10" width="90" height="60" rx="8" />

    <line x1="37.5" y1="10" x2="37.5" y2="70" />
    <line x1="60" y1="10" x2="60" y2="70" />
    <line x1="82.5" y1="10" x2="82.5" y2="70" />

    <line x1="15" y1="30" x2="105" y2="30" />
    <line x1="15" y1="50" x2="105" y2="50" />
  </svg>
                              )
                            },
                            { 
                              key: 'front', label: 'Upload front view', 
                              Icon: ({ className }: { className?: string }) => (
                                 <svg
    className={className}
    viewBox="0 0 140 90"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M25 70 L115 70 L105 25 L35 25 Z" />

    <line x1="47" y1="25" x2="43" y2="70" />
    <line x1="70" y1="25" x2="70" y2="70" />
    <line x1="93" y1="25" x2="97" y2="70" />

    <line x1="31" y1="40" x2="109" y2="40" />
    <line x1="28" y1="55" x2="112" y2="55" />
  </svg>
                              )
                            },
                            { 
                              key: 'side', label: 'Upload side view', 
                              Icon: ({ className }: { className?: string }) => (
                               <svg
    className={className}
    viewBox="0 0 120 90"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 15 L100 22 L100 78 L20 72 Z" />

    <line x1="40" y1="17" x2="40" y2="74" />
    <line x1="60" y1="19" x2="60" y2="76" />
    <line x1="80" y1="21" x2="80" y2="77" />

    <line x1="20" y1="34" x2="100" y2="39" />
    <line x1="20" y1="53" x2="100" y2="58" />
  </svg>
                              )
                            },
                            { 
                              key: 'back', label: 'Upload back view', 
                              Icon: ({ className }: { className?: string }) => (
                                <svg
    className={className}
    viewBox="0 0 120 90"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="15" y="12" width="90" height="66" rx="8" />

    <line x1="30" y1="12" x2="30" y2="78" />
    <line x1="45" y1="12" x2="45" y2="78" />
    <line x1="60" y1="12" x2="60" y2="78" />
    <line x1="75" y1="12" x2="75" y2="78" />
    <line x1="90" y1="12" x2="90" y2="78" />

    <rect x="20" y="40" width="80" height="10" />
  </svg>
                              )
                            },
                          ].map((angle) => {
                            const uploadedForAngle = uploadedImages.filter(img => img.label === angle.label.replace('Upload ', ''));
                            const hasImage = uploadedForAngle.length > 0;

                            return (
                              <div key={angle.key}>
                                <div 
                                  onClick={() => handleAngleUploadClick(angle.label.replace('Upload ', ''))}
                                  className="border border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-white/20 transition-all duration-300 group min-h-[200px] flex flex-col items-center justify-center"
                                >
                                  <div className="mb-4">
                              <angle.Icon className="w-24 h-24 text-white/80" />
                                  </div>
                                  
                                  {!hasImage ? (
                                    <>
                                      <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center mb-3 group-hover:border-white/50 transition-all duration-300">
                                        <Plus className="w-4 h-4 text-white/70" />
                                      </div>
                                      <p className="text-xs text-white/70 font-medium">
                                        {angle.label}
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <div className="relative w-full mb-3">
                                        <img
                                          src={uploadedForAngle[0].preview}
                                          alt={angle.label}
                                          className="w-full h-24 object-cover rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 rounded-lg">
                                          <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="w-8 h-8 rounded-full"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              removeImage(uploadedForAngle[0].id);
                                            }}
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="w-8 h-8 rounded-full border-white/30 text-white hover:bg-white/10"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              fileInputRef.current?.click();
                                            }}
                                          >
                                            <Upload className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>
                                      <p className="text-xs text-white/70 font-medium">
                                        {angle.label}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Hidden file input for all uploads */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />

                        {/* Uploaded photos count summary */}
                        {uploadedImages.length > 0 && (
                          <div className="flex items-center justify-between px-1">
                            <span className="text-xs text-white/50">{uploadedImages.length} photo(s) uploaded</span>
                            {uploadedImages.length < 3 ? (
                              <span className="text-xs text-yellow-400">{3 - uploadedImages.length} more required</span>
                            ) : (
                              <span className="text-xs text-green-400 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Minimum met
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex flex-col gap-3 pt-4">
                          <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={handleBack}
                              className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-2 transition-all duration-300">
                              <ArrowLeft className="w-4 h-4" />
                              Back
                            </Button>
                            <Button
                              type="button"
                              onClick={handleNextToModelLookup}
                              disabled={uploadedImages.length < 3}
                              className="cta-button group gap-2"
                            >
                              <ScanLine className="w-4 h-4" />
                              <span>Next: Identify Panel</span>
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </div>
                          {uploadedImages.length < 3 && (
                            <p className="text-xs text-yellow-400/70 text-center">
                              Please upload at least 3 photos before proceeding
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        {/* Top row: Heading left, How to use button right */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h2 className="text-3xl md:text-4xl font-bold">
                              <span className="text-gradient-blue">Identify Your Solar Panel</span>
                            </h2>
                            <p className="text-white/50 text-sm mt-1">
                              Upload a photo of the sticker label on your panel (JPEG) or enter the model name manually
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => navigate('/solar-panel-guide')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 group flex-shrink-0"
                          >
                            <PlayCircle className="w-3.5 h-3.5 text-white/50 group-hover:text-eythor-blue transition-colors" />
                            <span className="text-[11px] text-white/50 group-hover:text-eythor-blue transition-colors">How to use?</span>
                          </button>
                        </div>

                        {/* Table badge and Model Identification icon just below heading */}
                        <div className="flex items-center gap-2">
                          {renderTableBadge()}
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full">
                            <Cpu className="w-3.5 h-3.5 text-eythor-blue" />
                            <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Solar Panel Model Identification</span>
                          </div>
                        </div>

                        <div className="relative py-2">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-xl mb-6">
                          <div className="text-center">
                            <p className="text-xs text-white/40 mb-1">Rows</p>
                            <p className="text-2xl font-bold text-white">{rows}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-white/40 mb-1">Columns</p>
                            <p className="text-2xl font-bold text-white">{columns}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-white/40 mb-1">Grid</p>
                            <p className="text-2xl font-bold text-white">{rows} × {columns}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-white/40 mb-1">Panels</p>
                            <p className="text-2xl font-bold text-eythor-blue">{parseInt(rows) * parseInt(columns)}</p>
                          </div>
                        </div>

                        <SolarPanelModelInput
                          selectedPanel={selectedPanel}
                          onSelect={(panel) => setSelectedPanel(panel)}
                        />

                        <div className="flex flex-col gap-3 pt-4">
                          <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={handleBackFromModelLookup}
                              className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-2 transition-all duration-300">
                              <ArrowLeft className="w-4 h-4" />
                              Back to Photos
                            </Button>
                            <div className="flex gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddTable}
                                className="border-eythor-blue/30 text-eythor-blue hover:bg-eythor-blue/10 hover:text-eythor-blue gap-2 transition-all duration-300"
                              >
                                <Plus className="w-4 h-4" />
                                Add another table
                              </Button>
                              <Button
                                type="button"
                                onClick={handleNextToSummary}
                                disabled={!selectedPanel}
                                className="cta-button group gap-2"
                              >
                                <Calculator className="w-4 h-4" />
                                <span>View Summary</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                              </Button>
                            </div>
                          </div>
                          {!selectedPanel && (
                            <p className="text-xs text-yellow-400/70 text-center">
                              Please select a solar panel model before viewing summary
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-6">
                        <div className="text-center mb-4">
                          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-eythor-blue/20 to-eythor-blue/5 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-eythor-blue" />
                          </div>
                          
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full mb-4">
                            <Calculator className="w-3.5 h-3.5 text-eythor-blue" />
                            <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Summary</span>
                          </div>
                          
                          <h2 className="text-3xl md:text-4xl font-bold mb-2">
                            <span className="text-gradient-blue">Your Table Summary</span>
                          </h2>
                        </div>

                        <div className="relative py-2">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {completedTables.map((table, index) => {
                            const dims = table.solarPanel ? {
                              totalWidth: (table.solarPanel.width * table.columns) + ((table.columns + 1) * 20),
                              totalLength: (table.solarPanel.length * table.rows) + ((table.rows + 1) * 20)
                            } : null;
                            return (
                            <div key={table.id} className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
                              <div className="bg-eythor-blue/5 px-4 py-3 border-b border-white/10">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Table className="w-4 h-4 text-eythor-blue" />
                                    <span className="text-white font-medium">Table {table.tableNumber}</span>
                                  </div>
                                  <span className="text-sm text-eythor-blue font-semibold">
                                    {table.panels} panels
                                  </span>
                                </div>
                              </div>
                              
                              <div className="px-4 py-3">
                                <div className="grid grid-cols-3 gap-4 text-sm text-white/60 mb-3">
                                  <div>Rows: <strong className="text-white/80">{table.rows}</strong></div>
                                  <div>Columns: <strong className="text-white/80">{table.columns}</strong></div>
                                  <div>Grid: <strong className="text-white/80">{table.rows} × {table.columns}</strong></div>
                                </div>

                                {table.solarPanel && (
                                  <div className="mb-3 p-3 bg-eythor-blue/5 border border-eythor-blue/10 rounded-lg">
                                    <div className="flex items-center gap-1.5 mb-2">
                                      <Cpu className="w-3.5 h-3.5 text-eythor-blue" />
                                      <span className="text-xs text-eythor-blue font-medium uppercase tracking-wider">Solar Panel Specs</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                      <div className="bg-white/[0.03] rounded p-2">
                                        <p className="text-[9px] text-white/40 uppercase">Manufacturer</p>
                                        <p className="text-xs text-white/80 font-medium truncate">{table.solarPanel.manufacturer || '-'}</p>
                                      </div>
                                      <div className="bg-white/[0.03] rounded p-2">
                                        <p className="text-[9px] text-white/40 uppercase">Model</p>
                                        <p className="text-xs text-eythor-blue font-medium truncate">{table.solarPanel.model}</p>
                                      </div>
                                      <div className="bg-white/[0.03] rounded p-2">
                                        <p className="text-[9px] text-white/40 uppercase">Rated Power</p>
                                        <p className="text-xs text-white/80 font-medium">{table.solarPanel.ratedPower ? `${table.solarPanel.ratedPower} W` : '-'}</p>
                                      </div>
                                      <div className="bg-white/[0.03] rounded p-2">
                                        <p className="text-[9px] text-white/40 uppercase">Panel Dims</p>
                                        <p className="text-xs text-white/80 font-medium">
                                          {table.solarPanel.length && table.solarPanel.width 
                                            ? `${table.solarPanel.length}×${table.solarPanel.width} mm` 
                                            : '-'}
                                        </p>
                                      </div>
                                    </div>

                                    {dims && (
                                      <div className="mt-2 pt-2 border-t border-white/10">
                                        <div className="grid grid-cols-2 gap-2">
                                          <div className="bg-white/[0.03] rounded p-2">
                                            <p className="text-[9px] text-white/40 uppercase">Total Width (incl. gaps)</p>
                                            <p className="text-sm text-white font-medium">
                                              {dims.totalWidth} mm <span className="text-[10px] text-white/40">({(dims.totalWidth / 1000).toFixed(2)} m)</span>
                                            </p>
                                          </div>
                                          <div className="bg-white/[0.03] rounded p-2">
                                            <p className="text-[9px] text-white/40 uppercase">Total Length (incl. gaps)</p>
                                            <p className="text-sm text-white font-medium">
                                              {dims.totalLength} mm <span className="text-[10px] text-white/40">({(dims.totalLength / 1000).toFixed(2)} m)</span>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            );
                          })}
                          
                          {completedTables.length === 0 && (
                            <div className="text-center py-6 text-white/40">
                              No tables configured yet.
                            </div>
                          )}
                        </div>

                        <div className="flex justify-center">
                          <div className="bg-eythor-blue/5 border border-eythor-blue/20 rounded-xl p-8 text-center max-w-sm w-full">
                            <div className="text-6xl font-bold text-eythor-blue mb-2">
                              {totalPanels}
                            </div>
                            <p className="text-white/60 text-base">Total Solar Panels</p>
                          </div>
                        </div>

                        <div className="bg-eythor-blue/5 border border-eythor-blue/10 rounded-xl p-4">
                          <p className="text-white/70 text-sm leading-relaxed text-center">
                            Please confirm your final selection. Our team will contact you shortly with a customized quote.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setCompletedTables([]);
                              setTableCounter(1);
                              setRows('');
                              setColumns('');
                              setUploadedImages([]);
                              setSelectedPanel(null);
                              setStep(1);
                            }}
                            className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-2 transition-all duration-300"
                          >
                            <Plus className="w-4 h-4" />
                            Start Fresh
                          </Button>
                          <Button
                            type="button"
                            onClick={handleConfirmAndSubmit}
                            className="cta-button group gap-2 relative overflow-hidden"
                          >
                            <span className="relative z-10">Confirm & Submit</span>
                            <CheckCircle className="w-4 h-4 relative z-10" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Right Navigation Arrow */}
        {step < 4 && (
          <button 
            onClick={() => {
              if (step === 1) {
                const r = parseInt(rows);
                const c = parseInt(columns);
                if (r && c && r >= 1 && c >= 1) {
                  goToStep(2);
                } else {
                  toast({
                    title: 'Invalid Input',
                    description: 'Please enter valid rows and columns.',
                    variant: 'destructive',
                  });
                }
              } else if (step === 2) {
                goToStep(3);
              } else if (step === 3) {
                goToStep(4);
              }
            }}
            disabled={step === 1 ? (!rows || !columns) : false}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-eythor-blue/10 border border-eythor-blue/30 rounded-full flex items-center justify-center text-eythor-blue hover:bg-eythor-blue/20 hover:border-eythor-blue/50 transition-all duration-300 backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SolarPanelSetup;