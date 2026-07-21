// Solar panel data type
export interface SolarPanel {
  model: string;
  manufacturer: string | null;
  ratedPower: number | null;
  length: number | null;
  width: number | null;
  thickness: number | null;
  weight: number | null;
  powerDensity: number | null;
  tempCoeff: string | null;
  degradation: string | null;
  sourceUrl: string | null;
}

// Cache for the panel data
let _panels: SolarPanel[] | null = null;
let _loadPromise: Promise<SolarPanel[]> | null = null;
let _loadError: string | null = null;

/**
 * Load panel data from the generated JSON database
 */
async function loadPanels(): Promise<SolarPanel[]> {
  if (_panels) return _panels;

  if (!_loadPromise) {
    _loadPromise = (async () => {
      try {
        console.log('Loading solar panel database...');
        // Dynamic import of the generated JSON
        const module = await import('./solarPanels_detailed.json');
        const raw = (module as any).default || (module as any);
        console.log('JSON module loaded, type:', typeof raw, Array.isArray(raw) ? `array of ${raw.length} items` : '');

        // Transform to our interface
        _panels = (raw as any[]).map((p: any) => ({
          model: String(p.model || p.Model || ''),
          manufacturer: p.manufacturer || p.Manufacturer || null,
          ratedPower: p.ratedPower ?? p.RatedPower ?? p.rated_power ?? null,
          length: p.length ?? p.Length ?? p.length_mm ?? null,
          width: p.width ?? p.Width ?? p.width_mm ?? null,
          thickness: p.thickness ?? p.Thickness ?? p.thickness_mm ?? null,
          weight: p.weight ?? p.Weight ?? p.weight_kg ?? null,
          powerDensity: p.powerDensity ?? p.PowerDensity ?? p.power_density ?? null,
          tempCoeff: p.tempCoeff || p.TempCoeff || p.temp_coeff || null,
          degradation: p.annualDegradation || p.Degradation || p.annual_degradation || null,
          sourceUrl: p.sourceUrl || p.SourceUrl || p.source_url || null,
        }));

        console.log(`Loaded ${_panels.length} solar panels from database`);
        _loadError = null;
        return _panels;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        _loadError = msg;
        console.error('Failed to load solar panel database:', msg);
        return [];
      }
    })();
  }

  return _loadPromise;
}

/**
 * Search solar panels by model name using efficient string matching
 */
export async function searchPanelsByModel(query: string): Promise<SolarPanel[]> {
  if (!query || query.trim().length < 2) return [];

  const panels = await loadPanels();
  if (!panels.length) {
    if (_loadError) {
      console.error('Search unavailable - database load error:', _loadError);
    }
    return [];
  }

  const q = query.trim().toLowerCase();

  // Score and filter panels
  const scored = panels
    .map((panel: any) => {
      const modelLower = String(panel.model || '').toLowerCase();
      const mfrLower = String(panel.manufacturer || '').toLowerCase();

      // Exact match
      if (modelLower === q) return { panel, score: 0 };
      // Starts with
      if (modelLower.startsWith(q)) return { panel, score: 1 };
      // Manufacturer match
      if (mfrLower.startsWith(q)) return { panel, score: 2 };
      // Contains in model
      if (modelLower.includes(q)) return { panel, score: 3 };
      // Contains in manufacturer
      if (mfrLower.includes(q)) return { panel, score: 4 };

      return null;
    })
    .filter((r): r is { panel: SolarPanel; score: number } => r !== null)
    .sort((a, b) => a.score - b.score)
    .slice(0, 50)
    .map(r => r.panel);

  return scored;
}

/**
 * Search for a single panel by exact model name
 */
export async function searchPanelsByExactModel(model: string): Promise<SolarPanel | undefined> {
  const panels = await loadPanels();
  if (!panels.length) return undefined;

  const q = model.trim();
  return panels.find((p: any) => p.model.toLowerCase() === q.toLowerCase());
}

/**
 * Pre-load the database
 */
export function preloadDatabase(): void {
  if (!_loadPromise) {
    _loadPromise = loadPanels();
  }
}