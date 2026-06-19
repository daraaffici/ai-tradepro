export function calculateRiskReward(
  entry: number,
  takeProfit: number,
  stopLoss: number
) {
  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(takeProfit - entry);

  if (risk === 0) {
    return {
      risk,
      reward,
      ratio: 0,
    };
  }

  return {
    risk,
    reward,
    ratio: Number((reward / risk).toFixed(2)),
  };
}