/**
 * Entropy calculations for PassGuard
 * 
 * Demonstrates cybersecurity concept: Naive Character-Pool Entropy vs Dictionary-Aware Guessing Entropy.
 * Many traditional meters use naive pool entropy (L * log2(R)), which gives a false sense of security
 * for passwords like 'P@ssword123!' (high naive entropy, but trivial dictionary attack).
 */

export function calculateNaivePoolEntropy(password: string): number {
  if (!password) return 0;

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33; // Standard ASCII symbols

  if (poolSize === 0) return 0;
  const entropy = password.length * Math.log2(poolSize);
  return Math.round(entropy * 10) / 10;
}

export function calculateGuessEntropy(guesses: number): number {
  if (!guesses || guesses <= 1) return 0;
  // E = log2(guesses)
  const entropy = Math.log2(guesses);
  return Math.round(entropy * 10) / 10;
}

export function calculatePassphraseEntropy(
  wordCount: number,
  wordlistSize = 7776,
  includeNumber = false,
  includeSymbol = false
): number {
  if (wordCount <= 0) return 0;

  // Base entropy: N * log2(wordlistSize)
  let entropy = wordCount * Math.log2(wordlistSize);

  // If a random digit is appended (0-9) => + log2(10) ≈ 3.32 bits
  if (includeNumber) {
    entropy += Math.log2(10);
  }

  // If a random symbol is appended (e.g. from 12 symbols) => + log2(12) ≈ 3.58 bits
  if (includeSymbol) {
    entropy += Math.log2(12);
  }

  return Math.round(entropy * 10) / 10;
}

export function getEntropyRating(bits: number): {
  rating: 'Very Low' | 'Low' | 'Moderate' | 'Strong' | 'Very Strong';
  color: string;
  summary: string;
} {
  if (bits < 28) {
    return {
      rating: 'Very Low',
      color: 'text-red-400',
      summary: 'Vulnerable to instantaneous automated attacks.',
    };
  }
  if (bits < 40) {
    return {
      rating: 'Low',
      color: 'text-orange-400',
      summary: 'Vulnerable to fast offline dictionary and rule-based attacks.',
    };
  }
  if (bits < 60) {
    return {
      rating: 'Moderate',
      color: 'text-yellow-400',
      summary: 'Reasonable against untargeted online attacks, but weak against modern GPU rigs.',
    };
  }
  if (bits < 80) {
    return {
      rating: 'Strong',
      color: 'text-emerald-400',
      summary: 'Resistant to offline attacks with slow hashes (bcrypt, Argon2).',
    };
  }
  return {
    rating: 'Very Strong',
    color: 'text-cyan-400',
    summary: 'Practically infeasible to crack even with distributed supercomputer clusters.',
  };
}
