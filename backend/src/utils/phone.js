// Indian mobile number: 10 digits, first digit 6-9.
// Accepts separators and +91 / 91 / 0 prefixes. Returns the 10 digits, or null.
exports.normalizeIndianMobile = (input) => {
  if (typeof input !== 'string' && typeof input !== 'number') return null;
  let digits = String(input).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);

  if (!/^[6-9]\d{9}$/.test(digits)) return null;
  if (/^(\d)\1{9}$/.test(digits)) return null; // e.g. 9999999999
  return digits;
};
