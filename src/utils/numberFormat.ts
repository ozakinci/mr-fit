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

  let tier = Math.min(
    Math.floor(Math.log10(abs) / 3),
    SUFFIXES.length - 1,
  )
  let scaled = abs / Math.pow(1000, tier)

  // 2 decimal places below 10, 1 decimal place at 10 and above (matches the
  // "1.23K" / "1.5M" examples), trimming any trailing zeros.
  let decimals = scaled < 10 ? 2 : 1
  let formatted = parseFloat(scaled.toFixed(decimals))

  // Rounding can push the scaled value up to (or past) 1000 for this tier
  // (e.g. 999950 rounds to "1000.0" at the K tier) — bump to the next tier
  // so we never display e.g. "1000K" instead of "1M".
  if (formatted >= 1000 && tier < SUFFIXES.length - 1) {
    tier += 1
    scaled = abs / Math.pow(1000, tier)
    decimals = scaled < 10 ? 2 : 1
    formatted = parseFloat(scaled.toFixed(decimals))
  }

  return `${sign}${formatted.toString()}${SUFFIXES[tier]}`
}
