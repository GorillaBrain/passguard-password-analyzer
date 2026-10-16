import { describe, it, expect } from 'vitest';
import {
  getSecureRandomInt,
  getSecureRandomWord,
  generatePassphrase,
} from '../services/generator';
import { EFF_WORDLIST } from '../data/eff-wordlist';

describe('Passphrase Generator Service', () => {
  it('throws an error if maxExclusive is 0 or negative', () => {
    expect(() => getSecureRandomInt(0)).toThrow();
    expect(() => getSecureRandomInt(-5)).toThrow();
  });

  it('generates integers strictly within [0, maxExclusive - 1]', () => {
    for (let i = 0; i < 50; i++) {
      const val = getSecureRandomInt(10);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(10);
      expect(Number.isInteger(val)).toBe(true);
    }
  });

  it('selects valid words from the bundled EFF wordlist', () => {
    for (let i = 0; i < 10; i++) {
      const word = getSecureRandomWord();
      expect(EFF_WORDLIST).toContain(word);
    }
  });

  it('generates a passphrase with exact requested word count', () => {
    const counts = [3, 4, 5, 6, 7, 8];
    for (const count of counts) {
      const res = generatePassphrase({ wordCount: count, separator: '-' });
      expect(res.words).toHaveLength(count);
      expect(res.wordCount).toBe(count);
      expect(res.passphrase.split('-')).toHaveLength(count);
    }
  });

  it('clamps word count between 3 and 8', () => {
    const low = generatePassphrase({ wordCount: 1 });
    expect(low.wordCount).toBe(3);

    const high = generatePassphrase({ wordCount: 20 });
    expect(high.wordCount).toBe(8);
  });

  it('applies custom separators accurately', () => {
    const separators = ['_', '.', ' ', '/'];
    for (const sep of separators) {
      const res = generatePassphrase({
        wordCount: 4,
        separator: sep,
        includeNumber: false,
        includeSymbol: false,
      });
      expect(res.passphrase.split(sep)).toHaveLength(4);
    }
  });

  it('formats capitalization styles properly', () => {
    const lowerRes = generatePassphrase({
      wordCount: 3,
      capitalization: 'lowercase',
      includeNumber: false,
      includeSymbol: false,
    });
    for (const w of lowerRes.words) {
      expect(w).toBe(w.toLowerCase());
    }

    const titleRes = generatePassphrase({
      wordCount: 3,
      capitalization: 'capitalize',
      includeNumber: false,
      includeSymbol: false,
    });
    for (const w of titleRes.words) {
      expect(w[0]).toBe(w[0].toUpperCase());
    }

    const upperRes = generatePassphrase({
      wordCount: 3,
      capitalization: 'uppercase',
      includeNumber: false,
      includeSymbol: false,
    });
    for (const w of upperRes.words) {
      expect(w).toBe(w.toUpperCase());
    }
  });

  it('appends digits when includeNumber is enabled', () => {
    const res = generatePassphrase({
      wordCount: 4,
      separator: '-',
      includeNumber: true,
      includeSymbol: false,
    });
    const parts = res.passphrase.split('-');
    expect(parts.length).toBe(5);
    expect(/^\d+$/.test(parts[4])).toBe(true);
  });

  it('calculates mathematically sound entropy based on EFF dictionary size', () => {
    const res = generatePassphrase({
      wordCount: 4,
      includeNumber: false,
      includeSymbol: false,
    });
    // 4 * log2(7776) ≈ 51.67 bits
    expect(res.entropyBits).toBeCloseTo(51.7, 1);
    expect(res.strengthLabel).toBe('Strong');

    const res5 = generatePassphrase({
      wordCount: 6,
      includeNumber: true,
      includeSymbol: true,
    });
    expect(res5.entropyBits).toBeGreaterThan(75);
    expect(res5.strengthLabel).toBe('Very Strong');
  });
});
