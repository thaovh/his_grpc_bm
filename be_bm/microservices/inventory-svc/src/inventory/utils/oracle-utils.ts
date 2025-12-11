/**
 * Utility functions for Oracle database operations
 */

/**
 * Convert Long object (from Oracle NUMBER(19,0)) to number
 * Also handles null/undefined and regular numbers
 * 
 * @param value - Value to convert (can be Long object, number, null, undefined, or string)
 * @returns Converted number or null if value is null/undefined/invalid
 */
export function convertLongToNumber(value: any): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  // Check if it's a Long object (from Oracle/TypeORM)
  if (typeof value === 'object' && 'low' in value && 'high' in value) {
    const longValue = value as { low: number; high: number };
    return longValue.low + (longValue.high * 0x100000000);
  }

  // Already a number
  if (typeof value === 'number') {
    return value;
  }

  // Try to convert string to number
  const num = Number(value);
  return isNaN(num) ? null : num;
}

/**
 * Convert Long object to number and throw error if invalid
 * Use this when the value is required (not nullable)
 * 
 * @param value - Value to convert
 * @param fieldName - Name of the field (for error message)
 * @returns Converted number
 * @throws Error if value is null/undefined/invalid
 */
export function convertLongToNumberRequired(value: any, fieldName: string = 'value'): number {
  if (value === null || value === undefined) {
    throw new Error(`Invalid ${fieldName}: ${value} (null or undefined)`);
  }

  const result = convertLongToNumber(value);
  
  if (result === null) {
    throw new Error(`Invalid ${fieldName}: ${value} (cannot convert to number)`);
  }

  return result;
}
