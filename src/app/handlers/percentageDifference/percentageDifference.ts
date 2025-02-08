export function percentageDifference(newPrice: number, oldPrice: number): number {
  if (newPrice === 0) return 1
  return (Math.abs(oldPrice - newPrice) / Math.abs(newPrice)) * 100;
}
