// 249.5 -> ₹249.50, 749 -> ₹749, 378621 -> ₹3,78,621
export const formatMoney = (n) => {
  const x = Number(n);
  const digits = Number.isInteger(x) ? 0 : 2;
  return `₹${x.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: 2 })}`;
};
