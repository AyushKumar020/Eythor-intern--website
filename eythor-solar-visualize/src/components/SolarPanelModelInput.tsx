import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Search, 
  Camera, 
  CheckCircle, 
  Loader2, 
  ScanLine,
  FileImage,
  X
} from 'lucide-react';
import type { SolarPanel } from '@/data/solarPanelsSearch';
import { searchPanelsByModel, preloadDatabase } from '@/data/solarPanelsSearch';

interface SolarPanelModelInputProps {
  onSelect: (panel: SolarPanel) => void;
  selectedPanel?: SolarPanel | null;
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
  const [dbLoading, setDbLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Preload database when component mounts
  useEffect(() => {
    preloadDatabase();
  }, []);

  // Debounced search
  const handleSearchInput = useCallback((value: string) => {
    setManualModel(value);
    
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

  // Handle sticker image upload
  const handleStickerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload an image file (JPEG, PNG, etc.).',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
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

    // Run OCR
    await runOcr(file);
  };

  // Run OCR on the sticker image
  const runOcr = async (file: File) => {
    setOcrProcessing(true);
    setOcrText('');

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
        
        // Extract model name from OCR text using regex pattern matching
        const extractModelFromText = (ocrText: string): string => {
          // Split into lines and clean each
          const lines = ocrText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          
          // Known manufacturer/model prefixes to look for (case-insensitive)
          const knownPrefixes = ['AB', 'ASB', 'ASM', 'AE', 'CMD', 'M10', 'M12', 'G12R'];
          
          // Step 1: Try to match the exact model pattern: PREFIX-DIGITS-LETTERS-DIGITS-DIGITS
          // Examples: AB-G12R-132-605, ASB-M10-144-540, AE CMD-108-420
          for (const line of lines) {
            // Remove common OCR noise
            const cleaned = line.replace(/[^A-Za-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
            
            // Try to match model pattern: letters/numbers separated by hyphens or spaces
            // Pattern: at least 2 alpha chars + optional dash + alphanumeric + dash + digits + dash + digits
            const modelMatch = cleaned.match(/([A-Za-z]{2,}[\s-]?[A-Za-z0-9]+[\s-]?\d+[\s-]?\d+)/);
            if (modelMatch) {
              let model = modelMatch[1].trim();
              // Replace spaces with hyphens for consistency (e.g., "AE CMD" -> "AE-CMD")
              model = model.replace(/\s+/g, '-');
              // Remove any trailing noise after the last digit
              model = model.replace(/([A-Za-z0-9-]+)/, '$1');
              if (model.length >= 5) return model.toUpperCase();
            }
          }
          
          // Step 2: Look for lines containing known prefixes
          for (const line of lines) {
            const upper = line.toUpperCase();
            for (const prefix of knownPrefixes) {
              if (upper.includes(prefix)) {
                // Extract from this line - take everything from known prefix onwards
                const idx = upper.indexOf(prefix);
                const relevant = line.substring(idx).trim();
                // Clean up: keep only alphanumeric, hyphens, and spaces
                const cleaned = relevant.replace(/[^A-Za-z0-9\s-]/g, '').trim();
                // Split and take the first meaningful part
                const parts = cleaned.split(/\s+/);
                if (parts.length > 0 && parts[0].length >= 3) {
                  return parts[0].toUpperCase();
                }
              }
            }
          }
          
          // Step 3: Fallback - look for alphanumeric strings with dashes
          for (const line of lines) {
            const cleaned = line.replace(/[^A-Za-z0-9-]/g, '').trim();
            if (cleaned.length >= 5 && cleaned.includes('-') && /[A-Za-z]/.test(cleaned) && /\d/.test(cleaned)) {
              return cleaned.toUpperCase();
            }
          }
          
          // Step 4: Last resort - any alphanumeric string with letters followed by digits
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
          handleSearchInput(modelSearch);
        } else {
          toast({
            title: 'Could Not Extract Model',
            description: 'Please enter the model name manually from the sticker.',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'No Text Found',
          description: 'Could not extract any text. Try a clearer image or enter the model manually.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('OCR error:', error);
      toast({
        title: 'OCR Failed',
        description: 'Failed to process the image. Please enter the model name manually.',
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle selecting a panel from search results
  const handleSelectPanel = (panel: SolarPanel) => {
    setManualModel(panel.model);
    setShowResults(false);
    onSelect(panel);
  };

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
          onClick={() => setIsOcrMode(true)}
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
          onClick={() => setIsOcrMode(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
            !isOcrMode 
              ? 'bg-eythor-blue/20 text-eythor-blue shadow-[0_0_10px_rgba(59,130,246,0.15)]' 
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          <Search className="w-4 h-4" />
          Manual Entry
        </button>
      </div>

      {isOcrMode ? (
        /* OCR Mode: Upload sticker image */
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full mb-3">
              <ScanLine className="w-3.5 h-3.5 text-eythor-blue" />
              <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Step 1: Upload Sticker</span>
            </div>
            <p className="text-white/60 text-sm">
              Upload a clear photo of the sticker label on your solar panel
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
            /* Sticker Preview */
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
                <p className="text-sm text-white/80 font-medium">Processing sticker...</p>
                <p className="text-xs text-white/40">Extracting text with OCR</p>
              </div>
            </div>
          )}

          {/* After OCR, show hint only when model is not yet found */}
          {!ocrProcessing && stickerImage && !manualModel && (
            <div className="p-3 bg-eythor-blue/5 border border-eythor-blue/10 rounded-lg">
              <p className="text-xs text-white/50 text-center">
                Model number auto-detected and populated in the search below.
              </p>
            </div>
          )}
        </div>
      ) : null}

      {/* Model Search (common to both modes) */}
      <div className="space-y-3">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full mb-3">
            <Search className="w-3.5 h-3.5 text-eythor-blue" />
            <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">
              {isOcrMode ? 'Step 2: Confirm Model' : 'Enter Model Name'}
            </span>
          </div>
          <p className="text-white/60 text-sm">
            {isOcrMode 
              ? 'The model name is auto-filled from the sticker. Confirm or type a different model.'
              : 'Type the model name from your solar panel sticker'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative" ref={resultsRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              type="text"
              placeholder="e.g., AB-G12R-132-605, ASB-7-350..."
              value={manualModel}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 
                         focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                         transition-all duration-300 rounded-lg h-11 pl-10 hover:border-white/20"
            />
            {(isSearching || dbLoading) && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-eythor-blue animate-spin" />
            )}
          </div>

          {/* Database loading indicator */}
          {!isSearching && !searchResults.length && manualModel.trim().length >= 2 && (
            <div className="text-center mt-2">
              <p className="text-xs text-white/30">Searching database of 12,211 panels...</p>
            </div>
          )}

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
                    onClick={() => handleSelectPanel(panel)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      selectedPanel?.model === panel.model
                        ? 'bg-eythor-blue/15 border border-eythor-blue/30'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
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

          {/* No Results */}
          {showResults && searchResults.length === 0 && manualModel.trim().length >= 2 && !isSearching && (
            <div className="absolute z-50 mt-1 w-full bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 text-center">
              <p className="text-white/50 text-sm">No panels found matching "{manualModel}"</p>
              <p className="text-white/30 text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Panel Display */}
      {selectedPanel && (
        <div className="bg-eythor-blue/5 border border-eythor-blue/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Panel Identified Successfully</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoTile label="Manufacturer" value={selectedPanel.manufacturer || '-'} />
            <InfoTile label="Model" value={selectedPanel.model} highlight />
            <InfoTile label="Rated Power" value={selectedPanel.ratedPower ? `${selectedPanel.ratedPower} Wp` : '-'} />
            <InfoTile label="Length" value={selectedPanel.length ? `${selectedPanel.length} mm` : '-'} />
            <InfoTile label="Width" value={selectedPanel.width ? `${selectedPanel.width} mm` : '-'} />
            <InfoTile label="Thickness" value={selectedPanel.thickness ? `${selectedPanel.thickness} mm` : '-'} />
            <InfoTile label="Weight" value={selectedPanel.weight ? `${selectedPanel.weight} kg` : '-'} />
            <InfoTile label="Power Density" value={selectedPanel.powerDensity ? `${selectedPanel.powerDensity} Wp/m²` : '-'} />
            <InfoTile label="Temp. Coefficient" value={selectedPanel.tempCoeff || '-'} />
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

// Small info tile component
const InfoTile: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-sm font-medium ${highlight ? 'text-eythor-blue' : 'text-white/80'}`}>{value}</p>
  </div>
);

export default SolarPanelModelInput;