// π to n decimal places via Machin's formula with BigInt — computed, not pasted, so every digit is real.
export function piDigits(n = 500) {
  const guard = 12n;
  const scale = 10n ** (BigInt(n) + guard);
  const arctanInv = (x) => {
    let sum = 0n;
    let term = scale / x;
    let k = 1n;
    let sign = 1n;
    const x2 = x * x;
    while (term !== 0n) {
      sum += (sign * term) / k;
      term /= x2;
      k += 2n;
      sign = -sign;
    }
    return sum;
  };
  const pi = 4n * (4n * arctanInv(5n) - arctanInv(239n));
  const s = pi.toString();
  return `${s[0]}.${s.slice(1, n + 1)}`;
}

export const PI_DIGITS = piDigits(1000);

// z(θ) = e^{iθ} + e^{iωθ}. With ω = π the curve never closes.
export function curvePoint(theta, omega, r1 = 0.5, r2 = 0.5) {
  return [
    r1 * Math.cos(theta) + r2 * Math.cos(omega * theta),
    r1 * Math.sin(theta) + r2 * Math.sin(omega * theta),
  ];
}

// Smallest q ≤ maxQ with |ω·q − round(ω·q)| tiny, i.e. how many turns until a rational ratio closes.
export function closingTurns(omega, maxQ = 64) {
  for (let q = 1; q <= maxQ; q++) {
    const p = omega * q;
    if (Math.abs(p - Math.round(p)) < 1e-9) return q;
  }
  return null;
}
