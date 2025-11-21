/**
 * Currency formatting utilities for Macedonian Denar (MKD)
 * Prices are stored directly in MKD in the database
 */

/**
 * Format MKD currency
 * @param mkdAmount - Amount in Macedonian Denars
 * @returns Formatted string like "6,000 ден"
 */
export function formatPrice(mkdAmount: number): string {
    return `${Math.round(mkdAmount).toLocaleString('mk-MK')} ден`;
}

/**
 * Parse price from formatted string (if needed)
 */
export function parsePrice(priceString: string): number {
    return parseFloat(priceString.replace(/[^\d.-]/g, ''));
}
