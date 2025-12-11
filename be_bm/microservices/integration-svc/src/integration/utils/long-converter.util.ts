/**
 * Utility class for converting Long objects (from gRPC/Protocol Buffers) to numbers
 */
export class LongConverter {
  /**
   * Convert a Long object or value to number
   */
  static convertToNumber(value: any): number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return value;
    if (typeof value === 'object' && 'low' in value && 'high' in value) {
      const longValue = value as { low: number; high: number };
      return longValue.low + (longValue.high * 0x100000000);
    }
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  /**
   * Convert an array of Long objects to numbers
   */
  static convertArray(values: any[] | undefined): number[] {
    if (!values || !Array.isArray(values)) return [];
    return values
      .map(item => this.convertToNumber(item))
      .filter((id): id is number => id !== null);
  }

  /**
   * Recursively convert all Long objects in an object/array to numbers
   */
  static convertLongRecursive(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    // If it's a Long object, convert it
    if (typeof obj === 'object' && 'low' in obj && 'high' in obj) {
      const longValue = obj as { low: number; high: number };
      return longValue.low + (longValue.high * 0x100000000);
    }

    // If it's an array, recursively convert each element
    if (Array.isArray(obj)) {
      return obj.map(item => this.convertLongRecursive(item));
    }

    // If it's an object (but not a Long), recursively convert each property
    if (typeof obj === 'object') {
      const converted: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          converted[key] = this.convertLongRecursive(obj[key]);
        }
      }
      return converted;
    }

    // For primitives, return as-is
    return obj;
  }
}

