/**
 * General purpose display formatters
 */

export function formatGoalDifference(gd) {
  if (gd === null || gd === undefined || isNaN(gd)) return '0';
  const num = Number(gd);
  if (num > 0) return `+${num}`;
  return `${num}`;
}

export function formatPercentage(num, total, decimals = 1) {
  if (!total || total === 0 || isNaN(num)) return '0.0%';
  return `${((num / total) * 100).toFixed(decimals)}%`;
}

export function formatNumber(val, fallback = '0') {
  if (val === null || val === undefined || isNaN(val)) return fallback;
  return Number(val).toLocaleString();
}

export function formatMinutes(mins) {
  if (!mins && mins !== 0) return '0 min';
  return `${mins}'`;
}

export function calculateAge(dobStr) {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
