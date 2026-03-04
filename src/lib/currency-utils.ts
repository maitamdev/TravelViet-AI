export function vndToUsd(vnd: number, rate = 24000): number {
  return Math.round((vnd / rate) * 100) / 100;
}

export function usdToVnd(usd: number, rate = 24000): number {
  return Math.round(usd * rate);
}

export function formatCurrency(amount: number, currency = 'VND'): string {
  if (currency === 'VND') return amount.toLocaleString('vi-VN') + ' VND';
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2 });
}
