/**
 * Simple string table formatter - native replacement for string-table package
 * Creates ASCII table from array of objects
 */

type TableRow = Record<string, string | number>;

/**
 * Create formatted ASCII table from array of objects
 * @param data - Array of objects with same keys
 * @returns Formatted table string
 */
export function createTable(data: TableRow[]): string {
    if (data.length === 0) return '';

    // Get all column names from first row
    const columns = Object.keys(data[0]);

    // Calculate max width for each column
    const widths: Record<string, number> = {};
    for (const col of columns) {
        widths[col] = col.length;
        for (const row of data) {
            const value = String(row[col] ?? '');
            widths[col] = Math.max(widths[col], value.length);
        }
    }

    // Build header
    const header = columns.map(col => col.padEnd(widths[col])).join(' | ');
    const separator = columns.map(col => '-'.repeat(widths[col])).join('-+-');

    // Build rows
    const rows = data.map(row =>
        columns.map(col => String(row[col] ?? '').padEnd(widths[col])).join(' | ')
    );

    return [header, separator, ...rows].join('\n');
}
