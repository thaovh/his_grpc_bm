/**
 * Recursively convert Date objects and date-looking strings to ISO 8601 strings
 * Handles objects, arrays, and nested structures
 */
export function convertDatesToISO(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    // If it's a Date object, convert to ISO string
    if (obj instanceof Date) {
        return obj.toISOString();
    }

    // If it's a string that looks like a date (from gRPC or database)
    // Check for common date patterns and convert to ISO
    if (typeof obj === 'string') {
        // Check if it's a date string (not already ISO format)
        // Patterns: "Thu Dec 11 2025 08:05:36 GMT+0700", "2025-12-11T...", etc.
        if (obj.includes('GMT') || obj.includes('GMT+') || obj.includes('GMT-')) {
            // It's a locale date string, convert to ISO
            const date = new Date(obj);
            if (!isNaN(date.getTime())) {
                return date.toISOString();
            }
        }
        // If already ISO format or other string, return as is
        return obj;
    }

    // If it's an array, map over each element
    if (Array.isArray(obj)) {
        return obj.map(item => convertDatesToISO(item));
    }

    // If it's an object (but not Date), recursively convert properties
    if (typeof obj === 'object') {
        const converted: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                converted[key] = convertDatesToISO(obj[key]);
            }
        }
        return converted;
    }

    // For primitives (number, boolean), return as is
    return obj;
}
