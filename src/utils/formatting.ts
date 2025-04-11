/**
 * Formats a currency rate for display, using exponential notation for very small values.
 */
export const formatRateDisplay = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return "N/A";
  if (value === 0) return "0.0000";
  if (Math.abs(value) < 0.0001) return value.toExponential(3);
  if (Math.abs(value) < 0.1) return value.toFixed(6);
  if (Math.abs(value) < 10) return value.toFixed(4);
  return value.toFixed(2); // For larger numbers, 2 decimal places is often enough
};

/**
 * Formats a date string (YYYY-MM-DD) into MM-DD for chart X-axis.
 */
export const formatChartXAxis = (tickItem: string): string => {
  try {
    const date = new Date(tickItem + "T00:00:00Z");
    if (isNaN(date.getTime())) return tickItem;
    // Use Intl for locale-aware formatting if needed, otherwise simple padStart
    return `${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
  } catch {
    return tickItem;
  }
};

/**
 * Formats a number for the chart Y-axis using the common rate display logic.
 */
export const formatChartYAxis = (tickItem: number): string =>
  formatRateDisplay(tickItem);

/**
 * Formats a date object into YYYY-MM-DD string suitable for API calls.
 */
export const formatDateForApi = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
