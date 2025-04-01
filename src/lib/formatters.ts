
/**
 * Format a number as currency
 * @param amount The number to format
 * @returns The formatted number
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
