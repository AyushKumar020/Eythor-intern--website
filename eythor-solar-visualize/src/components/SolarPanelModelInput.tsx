import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Search, 
  Camera, 
  CheckCircle, 
  Loader2, 
  ScanLine,
  FileImage,
  X,
  Edit3,
  ArrowRight
} from 'lucide-react';
import type { SolarPanel } from '@/data/solarPanelsSearch';
import { searchPanelsByModel, preloadDatabase } from '@/data/solarPanelsSearch';

interface SolarPanelModelInputProps {
  onSelect: (panel: SolarPanel) => void;
  selectedPanel?: SolarPanel | null;
}

interface ManualPanelInput {
  model: string;
  ratedPower: string;
  length: string;
  width: string;
}

const SolarPanelModelInput: React.FC<SolarPanelModelInputProps> = ({ onSelect, selectedPanel }) => {
  const { toast } = useToast();
  const [manualModel, setManualModel] = useState('');
  const [searchResults, setSearchResults] = useState<SolarPanel[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [stickerImage, setStickerImage] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [isOcrMode, setIsOcrMode] = useState(true);
  const [showManualInput, setShowManualInput] = useState(false);
  const [noDbMatch, setNoDbMatch] = useState(false);
  const [manualInput, setManualInput] = useState<ManualPanelInput>({
    model: '',
    ratedPower: '',
    length: '',
    width: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Preload database when component mounts
  useEffect(() => {
    preloadDatabase();
  }, []);

  // Handle sticker image upload
  const handleStickerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload an image file (JPEG, PNG, etc.).',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    const preview = URL.createObjectURL(file);
    setStickerImage(preview);
    await runOcr(file);
  };

  // Run OCR on the sticker image
  const runOcr = async (file: File) => {
    setOcrProcessing(true);
    setOcrText('');
    setNoDbMatch(false);

    try {
      toast({
        title: 'Processing Sticker',
        description: 'Extracting text from the sticker image...',
      });

      const Tesseract = await import('tesseract.js');
      const result = await Tesseract.recognize(file, 'eng');

      const text = result.data.text.trim();
      setOcrText(text);
      
      if (text) {
        toast({
          title: 'Text Extracted',
          description: `Found text from sticker image`,
        });
        
        const extractModelFromText = (ocrText: string): string => {
          const lines = ocrText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          const knownPrefixes = ['AB', 'ASB', 'ASM', 'AE', 'CMD', 'M10', 'M12', 'G12R'];
          
          for (const line of lines) {
            const cleaned = line.replace(/[^A-Za-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
            const modelMatch = cleaned.match(/([A-Za-z]{2,}[\s-]?[A-Za-z0-9]+[\s-]?\d+[\s-]?\d+)/);
            if (modelMatch) {
              let model = modelMatch[1].trim();
              model = model.replace(/\s+/g, '-');
              if (model.length >= 5) return model.toUpperCase();
            }
          }
          
          for (const line of lines) {
            const upper = line.toUpperCase();
            for (const prefix of knownPrefixes) {
              if (upper.includes(prefix)) {
                const idx = upper.indexOf(prefix);
                const relevant = line.substring(idx).trim();
                const cleaned = relevant.replace(/[^A-Za-z0-9\s-]/g, '').trim();
                const parts = cleaned.split(/\s+/);
                if (parts.length > 0 && parts[0].length >= 3) {
                  return parts[0].toUpperCase();
                }
              }
            }
          }
          
          for (const line of lines) {
            const cleaned = line.replace(/[^A-Za-z0-9-]/g, '').trim();
            if (cleaned.length >= 5 && cleaned.includes('-') && /[A-Za-z]/.test(cleaned) && /\d/.test(cleaned)) {
              return cleaned.toUpperCase();
            }
          }
          
          for (const line of lines) {
            const cleaned = line.replace(/[^A-Za-z0-9]/g, '').trim();
            if (cleaned.length >= 5 && /[A-Za-z]{2,}\d+/.test(cleaned)) {
              return cleaned.toUpperCase();
            }
          }
          
          return '';
        };

        const modelSearch = extractModelFromText(text);
        
        if (modelSearch) {
          toast({
            title: 'Model Extracted',
            description: `Found: "${modelSearch}"`,
          });
          setManualModel(modelSearch);
          
          setIsSearching(true);
          try {
            const results = await searchPanelsByModel(modelSearch);
            setSearchResults(results);
            setShowResults(results.length > 0);
            
            if (results.length === 1) {
              setShowResults(false);
              setNoDbMatch(false);
              onSelect(results[0]);
              toast({
                title: 'Panel Identified!',
                description: `Auto-detected: ${results[0].model}`,
              });
            } else if (results.length > 1) {
              setShowResults(true);
              setNoDbMatch(false);
              toast({
                title: 'Multiple Matches',
                description: `Found ${results.length} panels. Please select the correct one.`,
              });
            } else {
              setShowResults(false);
              setNoDbMatch(true);
              toast({
                title: 'Model Not Found in Database',
                description: `"${modelSearch}" not found. Switch to manual entry to enter details.`,
              });
            }
          } catch (err) {
            console.error('Search error after OCR:', err);
            setSearchResults([]);
            setShowResults(false);
          } finally {
            setIsSearching(false);
          }
        } else {
          setNoDbMatch(true);
          toast({
            title: 'Could Not Extract Model',
            description: 'Please switch to manual entry and enter the panel details.',
            variant: 'destructive',
          });
        }
      } else {
        setNoDbMatch(true);
        toast({
          title: 'No Text Found',
          description: 'Could not extract any text. Try a clearer image or switch to manual entry.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('OCR error:', error);
      setNoDbMatch(true);
      toast({
        title: 'OCR Failed',
        description: 'Failed to process the image. Please switch to manual entry.',
        variant: 'destructive',
      });
    } finally {
      setOcrProcessing(false);
    }
  };

  // Clear sticker
  const clearSticker = () => {
    if (stickerImage) URL.revokeObjectURL(stickerImage);
    setStickerImage(null);
    setOcrText('');
    setManualModel('');
    setSearchResults([]);
    setShowResults(false);
    setNoDbMatch(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Switch to manual entry mode with pre-filled model
  const switchToManualEntry = (modelName?: string) => {
    setIsOcrMode(false);
    setShowManualInput(true);
    if (modelName) {
      setManualInput(prev => ({ ...prev, model: modelName }));
    }
  };

  // Handle selecting a panel from search results (OCR mode)
  const handleSelectPanel = (panel: SolarPanel) => {
    setShowResults(false);
    setNoDbMatch(false);
    onSelect(panel);
  };

  // Handle manual form input change
  const handleManualInputChange = (field: keyof ManualPanelInput, value: string) => {
    setManualInput(prev => ({ ...prev, [field]: value }));
  };

  // Submit manual panel
  const handleManualSubmit = () => {
    if (!manualInput.model.trim()) {
      toast({
        title: 'Model Required',
        description: 'Please enter the model name.',
        variant: 'destructive',
      });
      return;
    }

    const manualPanel: SolarPanel = {
      model: manualInput.model.trim(),
      manufacturer: null,
      ratedPower: manualInput.ratedPower ? parseFloat(manualInput.ratedPower) : null,
      length: manualInput.length ? parseFloat(manualInput.length) : null,
      width: manualInput.width ? parseFloat(manualInput.width) : null,
      thickness: null,
      weight: null,
      powerDensity: null,
      tempCoeff: null,
      degradation: null,
      sourceUrl: null,
    };

    onSelect(manualPanel);
    
    toast({
      title: 'Panel Details Saved',
      description: 'Manual panel details have been saved.',
    });
  };

  // Debounced search for manual model input in scan sticker mode
  const handleManualSearchInput = useCallback((value: string) => {
    setManualModel(value);
    setNoDbMatch(false);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchPanelsByModel(value);
        setSearchResults(results);
        setShowResults(results.length > 0);
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  // Click outside to close search results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup sticker URL
  useEffect(() => {
    return () => {
      if (stickerImage) URL.revokeObjectURL(stickerImage);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/10 rounded-lg w-fit mx-auto">
        <button
          type="button"
          onClick={() => {
            setIsOcrMode(true);
            setShowManualInput(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
            isOcrMode 
              ? 'bg-eythor-blue/20 text-eythor-blue shadow-[0_0_10px_rgba(59,130,246,0.15)]' 
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          <Camera className="w-4 h-4" />
          Scan Sticker
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOcrMode(false);
            setShowManualInput(true);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
            !isOcrMode 
              ? 'bg-eythor-blue/20 text-eythor-blue shadow-[0_0_10px_rgba(59,130,246,0.15)]' 
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          Manual Entry
        </button>
      </div>

      {/* ===== SCAN STICKER MODE ===== */}
      {isOcrMode && !showManualInput && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full mb-3">
              <ScanLine className="w-3.5 h-3.5 text-eythor-blue" />
              <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Upload Sticker or Type Model</span>
            </div>
            <p className="text-white/60 text-sm">
              Upload a sticker photo to auto-detect, or type the model number to search the database
            </p>
          </div>

          {/* Sticker Upload Area */}
          {!stickerImage ? (
            <div 
              className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-eythor-blue/40 transition-all duration-300 group"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleStickerUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-eythor-blue/10 flex items-center justify-center group-hover:bg-eythor-blue/20 transition-all duration-300">
                  <FileImage className="w-7 h-7 text-eythor-blue" />
                </div>
                <div>
                  <p className="text-white/70 font-medium">Upload Sticker Image</p>
                  <p className="text-white/40 text-sm mt-1">JPEG or PNG • Max 5MB</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-white/10">
              <img 
                src={stickerImage} 
                alt="Sticker" 
                className="w-full max-h-48 object-contain bg-black/40"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Re-upload
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={clearSticker}
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleStickerUpload}
                className="hidden"
              />
            </div>
          )}

          {/* OCR Processing Indicator */}
          {ocrProcessing && (
            <div className="flex items-center justify-center gap-3 p-4 bg-eythor-blue/5 border border-eythor-blue/10 rounded-lg">
              <Loader2 className="w-5 h-5 text-eythor-blue animate-spin" />
              <div>
                <p className="text-sm text-white/80 font-medium">Processing sticker with OCR...</p>
                <p className="text-xs text-white/40">Extracting text and searching database</p>
              </div>
            </div>
          )}

          {/* Search Input (always visible) */}
          <div className="relative" ref={resultsRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                type="text"
                placeholder="Or type model number to search database..."
                value={manualModel}
                onChange={(e) => handleManualSearchInput(e.target.value)}
                className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 
                           focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                           transition-all duration-300 rounded-lg h-11 pl-10 hover:border-white/20"
              />
              {(isSearching) && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-eythor-blue animate-spin" />
              )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                <div className="p-2">
                  <p className="text-xs text-white/40 px-2 py-1.5">
                    {searchResults.length} panel{searchResults.length !== 1 ? 's' : ''} found
                  </p>
                  {searchResults.map((panel, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleSelectPanel(panel);
                        setManualModel(panel.model);
                        setShowResults(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-white/5 border border-transparent"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm text-white font-medium truncate">{panel.model}</p>
                          <p className="text-xs text-white/50 mt-0.5">{panel.manufacturer || 'Unknown'}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-eythor-blue font-semibold">
                            {panel.ratedPower ? `${panel.ratedPower}W` : 'N/A'}
                          </p>
                          {panel.length && panel.width && (
                            <p className="text-[10px] text-white/40">{panel.length}×{panel.width}mm</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Entry Suggestion when no DB match from typing */}
            {!isSearching && manualModel.trim().length >= 2 && searchResults.length === 0 && !showResults && !stickerImage && (
              <div className="absolute z-50 mt-1 w-full bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 text-center">
                <p className="text-white/50 text-sm">No panels found matching "{manualModel}"</p>
                <p className="text-white/30 text-xs mt-1">Try a different search term or switch to manual entry</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => switchToManualEntry(manualModel)}
                  className="mt-3 border-eythor-blue/30 text-eythor-blue hover:bg-eythor-blue/10"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                  Enter Panel Details Manually
                </Button>
              </div>
            )}
          </div>

          {/* Search Results (when OCR finds multiple matches) */}
          {showResults && searchResults.length > 0 && stickerImage && (
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-xs text-white/40">
                  Found {searchResults.length} matching panels from the sticker scan. Select the correct one:
                </span>
              </div>
              <div 
                className="bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-80 overflow-y-auto"
              >
                <div className="p-2">
                  {searchResults.map((panel, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPanel(panel)}
                      className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-white/5 border border-transparent"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm text-white font-medium truncate">{panel.model}</p>
                          <p className="text-xs text-white/50 mt-0.5">{panel.manufacturer || 'Unknown'}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-eythor-blue font-semibold">
                            {panel.ratedPower ? `${panel.ratedPower}W` : 'N/A'}
                          </p>
                          {panel.length && panel.width && (
                            <p className="text-[10px] text-white/40">{panel.length}×{panel.width}mm</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No DB match from OCR - suggest switching to manual */}
          {!ocrProcessing && noDbMatch && stickerImage && (
            <div className="bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
              <p className="text-white/60 text-sm mb-1">
                {manualModel 
                  ? `"${manualModel}" was not found in the database.`
                  : 'Could not read the sticker clearly.'}
              </p>
              <p className="text-white/40 text-xs mb-4">
                Switch to manual entry to enter the panel details from the sticker.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => switchToManualEntry(manualModel || undefined)}
                className="border-eythor-blue/30 text-eythor-blue hover:bg-eythor-blue/10"
              >
                <Edit3 className="w-4 h-4 mr-1.5" />
                Switch to Manual Entry
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ===== MANUAL ENTRY MODE ===== */}
      {showManualInput && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full mb-3">
              <Edit3 className="w-3.5 h-3.5 text-eythor-blue" />
              <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Manual Panel Entry</span>
            </div>
            <p className="text-white/60 text-sm">
              Enter the panel details from the sticker label
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80 text-sm font-medium">
                Model Number <span className="text-red-400">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g., AB-G12R-132-605"
                value={manualInput.model}
                onChange={(e) => handleManualInputChange('model', e.target.value)}
                className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 
                           focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                           transition-all duration-300 rounded-lg h-11 hover:border-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 text-sm font-medium">
                Rated Power (W)
              </Label>
              <Input
                type="number"
                placeholder="e.g., 605"
                value={manualInput.ratedPower}
                onChange={(e) => handleManualInputChange('ratedPower', e.target.value)}
                className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 
                           focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                           transition-all duration-300 rounded-lg h-11 hover:border-white/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80 text-sm font-medium">
                  Length (mm)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 2278"
                  value={manualInput.length}
                  onChange={(e) => handleManualInputChange('length', e.target.value)}
                  className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 
                             focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                             transition-all duration-300 rounded-lg h-11 hover:border-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-sm font-medium">
                  Width (mm)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 1134"
                  value={manualInput.width}
                  onChange={(e) => handleManualInputChange('width', e.target.value)}
                  className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 
                             focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                             transition-all duration-300 rounded-lg h-11 hover:border-white/20"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleManualSubmit}
              className="cta-button w-full"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Save Panel Details
            </Button>
          </div>

          {/* Back to Scan Sticker link */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setShowManualInput(false);
                setIsOcrMode(true);
              }}
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              ← Back to Scan Sticker
            </button>
          </div>
        </div>
      )}

      {/* ===== SELECTED PANEL DISPLAY ===== */}
      {selectedPanel && (
        <div className="bg-eythor-blue/5 border border-eythor-blue/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm font-medium">
              {selectedPanel.manufacturer ? 'Panel Identified Successfully' : 'Panel Details Saved (Manual Entry)'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {selectedPanel.manufacturer && (
              <InfoTile label="Manufacturer" value={selectedPanel.manufacturer} />
            )}
            <InfoTile label="Model" value={selectedPanel.model} highlight />
            <InfoTile label="Rated Power" value={selectedPanel.ratedPower ? `${selectedPanel.ratedPower} Wp` : '-'} />
            <InfoTile label="Length" value={selectedPanel.length ? `${selectedPanel.length} mm` : '-'} />
            <InfoTile label="Width" value={selectedPanel.width ? `${selectedPanel.width} mm` : '-'} />
            {selectedPanel.thickness && (
              <InfoTile label="Thickness" value={`${selectedPanel.thickness} mm`} />
            )}
            {selectedPanel.weight && (
              <InfoTile label="Weight" value={`${selectedPanel.weight} kg`} />
            )}
          </div>

          {selectedPanel.sourceUrl && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <a
                href={selectedPanel.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-eythor-blue hover:text-eythor-blue/80 transition-colors"
              >
                View on ComparePV →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InfoTile: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-sm font-medium ${highlight ? 'text-eythor-blue' : 'text-white/80'}`}>{value}</p>
  </div>
);

export default SolarPanelModelInput;