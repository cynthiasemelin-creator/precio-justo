/** Pure pricing calculations, independent of UI or browser storage. */
export function calculatePrice(input) {
  const { materials, hours, hourlyRate, otherCosts, fixedCosts, feePercent, marginPercent } = input;
  const values = [hours, hourlyRate, otherCosts, fixedCosts, feePercent, marginPercent, ...materials.flatMap(m => [m.quantity, m.unitCost])];
  if (values.some(v => !Number.isFinite(v) || v < 0)) throw new Error('Ingresá valores numéricos mayores o iguales a cero.');
  if (feePercent >= 100 || marginPercent >= 100 || feePercent + marginPercent >= 100) {
    throw new Error('La suma de comisión y margen debe ser menor al 100%.');
  }
  const materialTotal = materials.reduce((sum, m) => sum + m.quantity * m.unitCost, 0);
  const laborTotal = hours * hourlyRate;
  const overheads = otherCosts + fixedCosts;
  const baseCost = materialTotal + laborTotal + overheads;
  // Margin and processing fee are both portions of sale price, not cost markups.
  const price = baseCost / (1 - feePercent / 100 - marginPercent / 100);
  const feeTotal = price * feePercent / 100;
  const profitTotal = price - feeTotal - baseCost;
  if (![baseCost, price, feeTotal, profitTotal].every(Number.isFinite)) throw new Error('Los valores son demasiado grandes.');
  return { materialTotal, laborTotal, overheads, baseCost, price, feeTotal, profitTotal };
}
