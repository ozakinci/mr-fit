// Formats numbers the way idle/incremental games do: plain integers below
// 1000, then suffixed (K/M/B/T/Qa/Qi/...) with 1-2 decimal places above that.

const SUFFIXES = [
  '', 'K', 'M', 'B', 'T',
  'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No',
  'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod',
] as const

/**
 * Formats a number for display, e.g.:
 *   999      -> "999"
 *   1234     -> "1.23K"
 *   1500000  -> "1.5M"
 *   -2500    -> "-2.5K"
 */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) {
    return n > 0 ? '∞' : n < 0 ? '-∞' : 'NaN'
  }

  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)

  if (abs < 1000) {
    return sign + (Number.isInteger(abs) ? abs.toString() : abs.toFixed(2))
  }

  const tier = Math.min(
    Math.floor(Math.log10(abs) / 3),
    SUFFIXES.length - 1,
  )
  const scaled = abs / Math.pow(1000, tier)
  const suffix = SUFFIXES[tier]

  // 2 decimal places below 10, 1 decimal place at 10 and above (matches the
  // "1.23K" / "1.5M" examples), trimming any trailing zeros.
  const decimals = scaled < 10 ? 2 : 1
  const formatted = parseFloat(scaled.toFixed(decimals)).toString()

  return `${sign}${formatted}${suffix}`
}
