// Indian mobile number rules: 10 digits, first digit 6-9.

// Cleans what the user types/pastes: keeps digits, drops +91 / 91 / 0 prefixes, max 10 digits.
export function cleanIndianInput(raw) {
  let d = String(raw).replace(/\D/g, '');
  if (d.length > 10) {
    if (d.startsWith('91') && d.length >= 12) d = d.slice(2);
    else if (d.startsWith('0')) d = d.slice(1);
  }
  return d.slice(0, 10);
}

export function validateIndianMobile(digits) {
  if (!digits) return { valid: false, error: 'Enter the customer mobile number' };
  if (digits.length < 10) return { valid: false, error: 'Mobile number must be 10 digits' };
  if (!/^[6-9]/.test(digits)) {
    return { valid: false, error: 'Indian mobile numbers start with 6, 7, 8 or 9' };
  }
  if (/^(\d)\1{9}$/.test(digits)) return { valid: false, error: 'This number does not look valid' };
  return { valid: true, error: null };
}

export const formatMobile = (digits) =>
  digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
