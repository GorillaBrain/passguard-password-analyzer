import { EFF_WORDLIST } from '../data/eff-wordlist';
import type { PassphraseOptions, PassphraseResult, StrengthLabel } from '../types';
import { calculatePassphraseEntropy } from './entropy';

const SYMBOLS = ['!', '@', '#', '$', '%', '^', '&', '*', '+', '=', '?', '~'];

/**
 * Cryptographically secure integer generation with rejection sampling.
 * Eliminates modulo bias completely.
 *
 * @param maxExclusive - Upper bound (exclusive).
 * @returns An unbiased integer in range [0, maxExclusive - 1].
 */
export function getSecureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) {
    throw new Error('maxExclusive must be greater than 0');
  }
  if (maxExclusive === 1) return 0;

  const cryptoObj =
    typeof window !== 'undefined' && window.crypto
      ? window.crypto
      : (globalThis as any).crypto;

  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    throw new Error('Cryptographically secure PRNG (window.crypto) is unavailable in this environment.');
  }

  // 32-bit unsigned integer range: 0 to 4,294,967,295 (2^32)
  const range = 4294967296;
  const remainder = range % maxExclusive;
  const limit = range - remainder;

  const buffer = new Uint32Array(1);

  // Loop until a value within the unbiased range is generated
  while (true) {
    cryptoObj.getRandomValues(buffer);
    const candidate = buffer[0];
    if (candidate < limit) {
      return candidate % maxExclusive;
    }
  }
}

/**
 * Selects a random word from the bundled EFF wordlist without bias.
 */
export function getSecureRandomWord(wordlist: readonly string[] = EFF_WORDLIST): string {
  const index = getSecureRandomInt(wordlist.length);
  return wordlist[index];
}

/**
 * Capitalizes a word (Title Case)
 */
function capitalizeWord(word: string): string {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Generates a cryptographically secure, high-entropy passphrase using EFF Diceware words.
 */
export function generatePassphrase(
  options: Partial<PassphraseOptions> = {},
  wordlist: readonly string[] = EFF_WORDLIST
): PassphraseResult {
  const count = Math.min(Math.max(options.wordCount ?? 4, 3), 8);
  const capitalization = options.capitalization ?? 'lowercase';
  const includeNumber = options.includeNumber ?? false;
  const includeSymbol = options.includeSymbol ?? false;

  let separator = options.separator ?? '-';
  if (options.separatorType === 'digit') {
    separator = String(getSecureRandomInt(10));
  }

  const selectedWords: string[] = [];

  for (let i = 0; i < count; i++) {
    const rawWord = getSecureRandomWord(wordlist);
    // Strip hyphens so that words don't conflict with hyphen separators
    const word = rawWord.replace(/-/g, '');
    let formatted = word.toLowerCase();

    if (capitalization === 'capitalize') {
      formatted = capitalizeWord(word);
    } else if (capitalization === 'uppercase') {
      formatted = word.toUpperCase();
    }

    selectedWords.push(formatted);
  }

  let finalPhrase = selectedWords.join(separator);

  // Optional number addition
  if (includeNumber) {
    const digit = getSecureRandomInt(10);
    finalPhrase += `${separator}${digit}`;
  }

  // Optional symbol addition
  if (includeSymbol) {
    const symIndex = getSecureRandomInt(SYMBOLS.length);
    const symbol = SYMBOLS[symIndex];
    finalPhrase += symbol;
  }

  const entropyBits = calculatePassphraseEntropy(
    count,
    wordlist.length,
    includeNumber,
    includeSymbol
  );

  let strengthLabel: StrengthLabel = 'Fair';
  if (entropyBits >= 75) {
    strengthLabel = 'Very Strong';
  } else if (entropyBits >= 50) {
    strengthLabel = 'Strong';
  }

  return {
    passphrase: finalPhrase,
    words: selectedWords,
    wordCount: count,
    entropyBits,
    strengthLabel,
    separatorUsed: separator,
  };
}
