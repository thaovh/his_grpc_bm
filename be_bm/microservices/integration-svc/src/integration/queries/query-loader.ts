import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export class QueryLoader {
  private static cache: Map<string, string> = new Map();
  
  /**
   * Get base path for SQL queries
   * Try dist folder first (production), then src folder (development)
   */
  private static getBasePath(): string {
    // Try dist folder first (when running compiled code)
    const distPath = join(__dirname, 'external-db');
    if (existsSync(distPath)) {
      return distPath;
    }
    
    // Fallback to src folder (when running in development or if dist doesn't have the files)
    // __dirname in compiled code: dist/integration/queries
    // Go up 2 levels to get to src, then back to queries/external-db
    const srcPath = join(__dirname, '../../src/integration/queries/external-db');
    if (existsSync(srcPath)) {
      return srcPath;
    }
    
    // Last resort: try relative to process.cwd()
    const cwdPath = join(process.cwd(), 'src/integration/queries/external-db');
    if (existsSync(cwdPath)) {
      return cwdPath;
    }
    
    // Default to dist (will throw error if file doesn't exist)
    return distPath;
  }

  /**
   * Load SQL query from file
   */
  static load(queryName: string): string {
    // Check cache first
    if (this.cache.has(queryName)) {
      return this.cache.get(queryName)!;
    }

    // Load from file - handle both with and without .sql extension
    const fileName = queryName.endsWith('.sql') ? queryName : `${queryName}.sql`;
    const basePath = this.getBasePath();
    const filePath = join(basePath, fileName);
    
    try {
      if (!existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      
      const query = readFileSync(filePath, 'utf-8');
      
      // Cache it
      this.cache.set(queryName, query);
      
      return query;
    } catch (error: any) {
      throw new Error(`Failed to load query file: ${fileName} from ${filePath} (basePath: ${basePath}) - ${error.message}`);
    }
  }

  /**
   * Load SQL query and replace placeholders (for simple cases)
   * Note: For bind parameters, use load() and pass bindParams to executeQuery
   */
  static loadWithParams(
    queryName: string,
    params: Record<string, any>
  ): string {
    let query = this.load(queryName);

    // Replace placeholders (simple string replacement)
    // Note: This is for simple cases. For security, always use bind parameters.
    Object.entries(params).forEach(([key, value]) => {
      const placeholder = `:${key}`;
      if (query.includes(placeholder)) {
        // Only replace if value is not null/undefined
        if (value !== null && value !== undefined) {
          query = query.replace(new RegExp(placeholder, 'g'), String(value));
        }
      }
    });

    return query;
  }

  /**
   * Clear cache (useful for testing or hot-reload)
   */
  static clearCache(): void {
    this.cache.clear();
  }
}

