import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Upload, Sun, Grid3X3, Image, CheckCircle, Trash2, Plus, Calculator, Table, PlayCircle, ScanLine, Cpu } from 'lucide-react';
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
const MAX_GRID_COLS = 30;

const SolarPanelSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [completedTables, setCompletedTables] = useState<TableEntry[]>([]);
  const [tableCounter, setTableCounter] = useState(1);
  const [rows, setRows] = useState('');
  const [columns, setColumns] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
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

    setStep(2);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: UploadedImage[] = [];
    const labels = ['Front View', 'Back View', 'Top View', 'Side View', 'Additional Angle'];

    Array.from(files).forEach((file, index) => {
      if (uploadedImages.length + newImages.length >= 6) {
        toast({
          title: 'Max Images Reached',
          description: 'You can upload up to 6 images.',
          variant: 'destructive',
        });
        return;
      }

      const preview = URL.createObjectURL(file);
      newImages.push({
        id: `img-${Date.now()}-${index}`,
        file,
        preview,
        label: labels[uploadedImages.length + newImages.length - 1] || 'Additional View',
      });
    });

    setUploadedImages(prev => [...prev, ...newImages]);
    
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
    setStep(3);
  };

  const handleBackFromModelLookup = () => {
    setStep(2);
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
    setStep(4);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else {
      navigate('/quote');
    }
  };

  const renderGrid = (grid: boolean[][], label?: string) => (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
      {label && (
        <div className="text-center mb-3">
          <span className="text-xs text-white/40">{label}</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <div 
          className="grid gap-[2px] mx-auto min-w-fit"
          style={{
            gridTemplateColumns: `repeat(${MAX_GRID_COLS}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row, ri) =>
            row.map((cell, ci) => (
              <div
                key={`${ri}-${ci}`}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm border transition-all duration-200 ${
                  cell
                    ? 'bg-eythor-blue/40 border-eythor-blue/60 shadow-[0_0_6px_rgba(59,130,246,0.4)]'
                    : 'bg-white/[0.03] border-white/5'
                }`}
                title={`Row ${ri + 1}, Col ${ci + 1}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderTableBadge = () => (
    <div className="flex items-center justify-center gap-2 mb-4">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-eythor-blue/10 border border-eythor-blue/20 rounded-full">
        <Table className="w-4 h-4 text-eythor-blue" />
        <span className="text-sm font-medium text-eythor-blue">
          Table #{tableCounter}
        </span>
      </div>
      <button
        type="button"
        onClick={() => navigate('/solar-panel-guide')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
      >
        <PlayCircle className="w-3.5 h-3.5 text-white/50 group-hover:text-eythor-blue transition-colors" />
        <span className="text-[11px] text-white/50 group-hover:text-eythor-blue transition-colors">How to use?</span>
      </button>
    </div>
  );

  const renderStep1 = () => (
    <form onSubmit={handleTableConfigSubmit} className="space-y-6">
      {renderTableBadge()}
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full mb-4">
          <Grid3X3 className="w-3.5 h-3.5 text-eythor-blue" />
          <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Table Setup</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-gradient-blue">Configure Your Table</span>
        </h2>
        <p className="text-white/50 text-sm max-w-md mx-auto">
          Enter the dimensions of your solar panel table
        </p>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
      </div>

      {renderGrid(gridPreview, 
        rows || columns 
          ? `Preview: ${parsedRows} × ${parsedCols} (highlighted area)` 
          : `Max grid: ${MAX_GRID_ROWS} rows × ${MAX_GRID_COLS} columns`
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-white/80 text-sm font-medium flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-eythor-blue" />
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
          <p className="text-xs text-white/40">Maximum {MAX_GRID_ROWS} rows per table</p>
        </div>

        <div className="space-y-2">
          <Label className="text-white/80 text-sm font-medium flex items-center gap-2">
            <Grid3X3 className="w-3.5 h-3.5 text-eythor-blue" />
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
          <p className="text-xs text-white/40">Maximum {MAX_GRID_COLS} columns</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-eythor-blue/5 border border-eythor-blue/10 rounded-lg">
        <Grid3X3 className="w-4 h-4 text-eythor-blue flex-shrink-0" />
        <p className="text-xs text-white/50">
          Each cell in the grid represents one solar panel. The grid shows a maximum of {MAX_GRID_ROWS} rows × {MAX_GRID_COLS} columns. Enter your dimensions above to see the preview.
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
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {renderTableBadge()}
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full mb-4">
          <Image className="w-3.5 h-3.5 text-eythor-blue" />
          <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Photos</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-gradient-blue">Upload Solar Panel Photos</span>
        </h2>
        <p className="text-white/50 text-sm max-w-md mx-auto">
          Upload at least 3 photos from different angles
        </p>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
      </div>

      <div 
        className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-eythor-blue/40 transition-all duration-300 group"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-eythor-blue/10 flex items-center justify-center group-hover:bg-eythor-blue/20 transition-all duration-300">
            <Upload className="w-7 h-7 text-eythor-blue" />
          </div>
          <div>
            <p className="text-white/70 font-medium">Click to upload photos</p>
            <p className="text-white/40 text-sm mt-1">At least 3 photos required (Front, Back, Top views)</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {['Front View', 'Back View', 'Top View', 'Side View'].map((label) => (
              <span key={label} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/50">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white/80 text-sm font-medium">
              Uploaded Photos ({uploadedImages.length})
            </Label>
            {uploadedImages.length < 3 ? (
              <span className="text-xs text-yellow-400">
                {3 - uploadedImages.length} more required
              </span>
            ) : (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Minimum met
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {uploadedImages.map((img) => (
              <div key={img.id} className="relative group/image rounded-lg overflow-hidden border border-white/10">
                <img
                  src={img.preview}
                  alt={img.label}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="w-8 h-8 rounded-full"
                    onClick={() => removeImage(img.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <span className="text-xs text-white/80">{img.label}</span>
                </div>
              </div>
            ))}
          </div>
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
  );

  // Get unique previously used panels for quick selection
  const previousPanels = React.useMemo(() => {
    const uniquePanels = new Map<string, SolarPanel>();
    completedTables.forEach(table => {
      if (table.solarPanel?.model) {
        uniquePanels.set(table.solarPanel.model, table.solarPanel);
      }
    });
    return Array.from(uniquePanels.values());
  }, [completedTables]);

  // Quick-select a previous panel
  const handleSelectPreviousPanel = (panel: SolarPanel) => {
    setSelectedPanel(panel);
    toast({
      title: 'Panel Selected',
      description: `Using ${panel.model} from previous table`,
    });
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      {renderTableBadge()}
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full mb-4">
          <Cpu className="w-3.5 h-3.5 text-eythor-blue" />
          <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Solar Panel Model Identification</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-gradient-blue">Identify Your Solar Panel</span>
        </h2>
        <p className="text-white/50 text-sm max-w-md mx-auto">
          Upload a photo of the sticker label on your panel (JPEG) or enter the model name manually
        </p>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 p-3 bg-white/[0.02] border border-white/10 rounded-lg">
        <div className="text-center">
          <p className="text-xs text-white/40">Rows</p>
          <p className="text-lg font-bold text-white">{rows}</p>
        </div>
        <div className="text-white/20 text-lg">×</div>
        <div className="text-center">
          <p className="text-xs text-white/40">Columns</p>
          <p className="text-lg font-bold text-white">{columns}</p>
        </div>
        <div className="text-white/20 text-lg">=</div>
        <div className="text-center">
          <p className="text-xs text-white/40">Panels</p>
          <p className="text-lg font-bold text-eythor-blue">{parseInt(rows) * parseInt(columns)}</p>
        </div>
      </div>

      {/* Quick Select Previous Panel */}
      {previousPanels.length > 0 && (
        <div className="bg-eythor-blue/5 border border-eythor-blue/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white/80 font-medium">Quick Select Previous Panel</span>
          </div>
          <p className="text-xs text-white/50 mb-3">
            This table uses the same panel model as a previous table? Select it below to skip OCR scanning.
          </p>
          <div className="flex flex-wrap gap-2">
            {previousPanels.map((panel, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreviousPanel(panel)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  selectedPanel?.model === panel.model
                    ? 'bg-eythor-blue/20 border-eythor-blue/50 text-eythor-blue'
                    : 'bg-white/[0.03] border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                }`}
              >
                <span className="block font-semibold">{panel.model}</span>
                <span className="block text-[10px] text-white/40 mt-0.5">{panel.manufacturer || ''} | {panel.ratedPower ? `${panel.ratedPower}W` : ''}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              Or scan a new sticker below if this table uses a different panel model
            </p>
          </div>
        </div>
      )}

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
              onClick={() => {
                handleAddTable();
              }}
              className="border-eythor-blue/30 text-eythor-blue hover:bg-eythor-blue/10 hover:text-eythor-blue gap-2 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Upload More Tables
            </Button>
            <Button
              type="button"
              onClick={handleNextToSummary}
              disabled={!selectedPanel}
              className="cta-button group gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Total</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
        {!selectedPanel && (
          <p className="text-xs text-yellow-400/70 text-center">
            Please select a solar panel model before calculating
          </p>
        )}
      </div>
    </div>
  );

  const calcTableDimensions = (table: TableEntry) => {
    if (!table.solarPanel?.length || !table.solarPanel?.width) return null;
    const gap = 20;
    const totalWidth = (table.solarPanel.width * table.columns) + ((table.columns + 1) * gap);
    const totalLength = (table.solarPanel.length * table.rows) + ((table.rows + 1) * gap);
    return { totalWidth, totalLength };
  };

  const calcGrandTotalDimensions = () => {
    let maxTotalWidth = 0;
    let totalLengthAcrossTables = 0;
    let hasDimensions = false;

    completedTables.forEach(table => {
      const dims = calcTableDimensions(table);
      if (dims) {
        hasDimensions = true;
        maxTotalWidth = Math.max(maxTotalWidth, dims.totalWidth);
        totalLengthAcrossTables += dims.totalLength;
      }
    });

    return hasDimensions ? { maxTotalWidth, totalLengthAcrossTables } : null;
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

  const renderStep4 = () => {
    const grandTotal = calcGrandTotalDimensions();
    return (
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
          <span className="text-gradient-blue">Your Panel Summary</span>
        </h2>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
      </div>

      <div className="space-y-4">
        {completedTables.map((table, index) => {
          const dims = calcTableDimensions(table);
          return (
          <div key={table.id} className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
            <div className="bg-eythor-blue/5 px-4 py-3 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-eythor-blue" />
                  <span className="text-white font-medium">Table #{table.tableNumber}</span>
                </div>
                <span className="text-sm text-eythor-blue font-semibold">
                  {table.panels} panels
                </span>
              </div>
            </div>
            
            <div className="px-4 py-3">
              <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                <span>Rows: <strong className="text-white/80">{table.rows}</strong></span>
                <span>Columns: <strong className="text-white/80">{table.columns}</strong></span>
                <span>Grid: <strong className="text-white/80">{table.rows} × {table.columns}</strong></span>
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
                          <p className="text-[9px] text-white/30 mt-0.5">
                            {table.solarPanel.width}mm × {table.columns} cols + {table.columns + 1} edge gaps × 2cm
                          </p>
                        </div>
                        <div className="bg-white/[0.03] rounded p-2">
                          <p className="text-[9px] text-white/40 uppercase">Total Length (incl. gaps)</p>
                          <p className="text-sm text-white font-medium">
                            {dims.totalLength} mm <span className="text-[10px] text-white/40">({(dims.totalLength / 1000).toFixed(2)} m)</span>
                          </p>
                          <p className="text-[9px] text-white/30 mt-0.5">
                            {table.solarPanel.length}mm × {table.rows} rows + {table.rows + 1} edge gaps × 2cm
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {table.images.length > 0 && (
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Image className="w-3.5 h-3.5 text-white/40" />
                    <span className="text-xs text-white/40">Photos</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {table.images.map((img) => (
                      <div key={img.id} className="relative rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={img.preview}
                          alt={img.label}
                          className="w-full h-20 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                          <span className="text-[10px] text-white/70">{img.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-eythor-blue/5 border border-eythor-blue/20 rounded-xl p-5 text-center">
          <div className="text-4xl font-bold text-eythor-blue mb-1">
            {totalPanels}
          </div>
          <p className="text-white/60 text-sm">Total Solar Panels</p>
        </div>
        {grandTotal && (
          <>
            <div className="bg-eythor-blue/5 border border-eythor-blue/20 rounded-xl p-5 text-center">
              <div className="text-2xl font-bold text-eythor-blue mb-1">
                {grandTotal.maxTotalWidth} mm
              </div>
              <p className="text-white/60 text-sm">Max Total Width (incl. gaps)</p>
              <p className="text-[10px] text-white/30 mt-1">{(grandTotal.maxTotalWidth / 1000).toFixed(2)} meters</p>
            </div>
            <div className="bg-eythor-blue/5 border border-eythor-blue/20 rounded-xl p-5 text-center">
              <div className="text-2xl font-bold text-eythor-blue mb-1">
                {grandTotal.totalLengthAcrossTables} mm
              </div>
              <p className="text-white/60 text-sm">Total Length Across All Tables (incl. gaps)</p>
              <p className="text-[10px] text-white/30 mt-1">{(grandTotal.totalLengthAcrossTables / 1000).toFixed(2)} meters</p>
            </div>
          </>
        )}
      </div>

      <div className="bg-eythor-blue/5 border border-eythor-blue/10 rounded-xl p-4">
        <p className="text-white/70 text-sm leading-relaxed text-center">
          Please review your solar panel details above. Click "Confirm & Submit" to submit your information 
          to our team. You will receive a customized quote for your Eyto solar panel cleaning robot.
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
  );
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <VideoBackground src="/lovable-uploads/landing.mp4" className="h-full" />
        </div>
        
        <div className="absolute top-40 left-10 w-72 h-72 bg-eythor-blue/5 rounded-full blur-[100px] animate-pulse pointer-events-none z-[1]"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-white/[0.02] rounded-full blur-[120px] animate-pulse pointer-events-none z-[1]" style={{ animationDelay: '1s' }}></div>
        
        <main className="relative z-10 pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-2xl">
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
              <div className="absolute -inset-1 bg-gradient-to-r from-eythor-blue/20 via-transparent to-eythor-blue/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl hover:border-white/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-eythor-blue/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
                
                <div className="relative z-10" style={{ minHeight: '400px' }}>
                  {/* Step 1 */}
                  <div 
                    className={`transition-all duration-500 ease-in-out ${
                      step === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 absolute inset-0 pointer-events-none'
                    }`}
                  >
                    {step === 1 && renderStep1()}
                  </div>
                  
                  {/* Step 2 */}
                  <div 
                    className={`transition-all duration-500 ease-in-out ${
                      step === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 absolute inset-0 pointer-events-none'
                    }`}
                  >
                    {step === 2 && renderStep2()}
                  </div>
                  
                  {/* Step 3 */}
                  <div 
                    className={`transition-all duration-500 ease-in-out ${
                      step === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 absolute inset-0 pointer-events-none'
                    }`}
                  >
                    {step === 3 && renderStep3()}
                  </div>
                  
                  {/* Step 4 */}
                  <div 
                    className={`transition-all duration-500 ease-in-out ${
                      step === 4 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 absolute inset-0 pointer-events-none'
                    }`}
                  >
                    {step === 4 && renderStep4()}
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

export default SolarPanelSetup;