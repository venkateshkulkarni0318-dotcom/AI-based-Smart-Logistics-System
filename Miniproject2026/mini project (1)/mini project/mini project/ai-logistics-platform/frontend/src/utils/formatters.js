/**
 * AI-LOGIX Shared Formatters & Unit Standards
 * Enforces standard units and Indian Standard Time (IST - UTC+05:30) across all views.
 * Part of Phase 1 Data Consistency (Fixes Issue A7).
 */

/**
 * Format a Date or ISO timestamp into Indian Standard Time (IST)
 * @param {string|Date|number} dateInput
 * @param {boolean} includeSeconds
 * @returns {string} Formatted IST string, e.g. "21 Oct 2026, 11:30 IST"
 */
export function formatIST(dateInput, includeSeconds = false) {
  if (!dateInput) return 'N/A';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);

    // Format using Asia/Kolkata timezone
    const options = {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };

    if (includeSeconds) {
      options.second = '2-digit';
    }

    const formatted = new Intl.DateTimeFormat('en-IN', options).format(d);
    return `${formatted} IST`;
  } catch {
    return String(dateInput);
  }
}

/**
 * Format Currency in Indian Rupees (₹)
 * @param {number} amount
 * @returns {string} Formatted INR string, e.g. "₹1,250"
 */
export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

/**
 * Standard Distance Formatter (km)
 */
export function formatKm(val) {
  if (val == null || isNaN(val)) return '0 km';
  return `${Number(val).toLocaleString('en-IN')} km`;
}

/**
 * Standard Elevation Formatter (m)
 */
export function formatElevation(val) {
  if (val == null || isNaN(val)) return '0 m';
  return `${Number(val).toLocaleString('en-IN')} m`;
}

/**
 * Standard Slope Formatter (degrees)
 */
export function formatSlope(val) {
  if (val == null || isNaN(val)) return '0°';
  return `${Number(val).toFixed(1)}°`;
}

/**
 * Standard Rainfall Formatter (mm/h)
 */
export function formatRainfall(val) {
  if (val == null || isNaN(val)) return '0 mm/h';
  return `${Number(val).toFixed(1)} mm/h`;
}

/**
 * Standard Speed Formatter (km/h)
 */
export function formatSpeed(val) {
  if (val == null || isNaN(val)) return '0 km/h';
  return `${Math.round(Number(val))} km/h`;
}

/**
 * Standard Payload Mass Formatter (kg or tonnes)
 */
export function formatMass(kg) {
  if (kg == null || isNaN(kg)) return '0 kg';
  const num = Number(kg);
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} tonnes`;
  }
  return `${num.toLocaleString('en-IN')} kg`;
}

/**
 * Standard Freight Work Formatter (tonne-km)
 */
export function formatFreightWork(tonneKm) {
  if (tonneKm == null || isNaN(tonneKm)) return '0 t-km';
  return `${Number(tonneKm).toLocaleString('en-IN')} t-km`;
}

/**
 * Format Signed SHAP values (+18.4% or -6.2%)
 */
export function formatSignedShap(val) {
  if (val == null || isNaN(val)) return '0.0%';
  const num = Number(val);
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
}
