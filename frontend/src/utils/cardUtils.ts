/**
 * Utility functions for formatting and manipulating card data.
 */

// Converts ISO timestamp string ("2026-07-31 19:04:21") -> "07/26"
export const formatExpiryDate = (rawExpiry: string | undefined): string => {
    if (!rawExpiry) return '12/29';

    const dateObj = new Date(rawExpiry.replace(' ', 'T'));
    if (isNaN(dateObj.getTime())) return rawExpiry;

    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = String(dateObj.getFullYear()).slice(-2);
    return `${month}/${year}`;
};

// Formats card number into 4-digit chunks ("8049720185610454" -> "8049 7201 8561 0454")
export const formatCardNumber = (cardNumber: number | string): string => {
    const str = String(cardNumber);
    return str.match(/.{1,4}/g)?.join(' ') || str;
};

// Formats last 4 digits ("8049720185610454" -> "•••• •••• •••• 0454")
export const formatMaskedCardNumber = (cardNumber: number | string): string => {
    const str = String(cardNumber);
    return `•••• •••• •••• ${str.slice(-4)}`;
};