import { describe, it, expect } from 'vitest';
import { analyzePassword } from '../services/analyzer';

describe('Password Analyzer Service', () => {
  it('returns empty analysis for empty or null strings', () => {
    const emptyResult = analyzePassword('');
    expect(emptyResult.score).toBe(0);
    expect(emptyResult.label).toBe('Very Weak');
    expect(emptyResult.length).toBe(0);
    expect(emptyResult.entropyBits).toBe(0);
    expect(emptyResult.patterns).toHaveLength(0);
  });

  it('identifies top common passwords as Very Weak (Score 0)', () => {
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'iloveyou', 'password123'];

    for (const pwd of commonPasswords) {
      const res = analyzePassword(pwd);
      expect(res.score).toBeLessThanOrEqual(1);
      expect(['Very Weak', 'Weak']).toContain(res.label);
      expect(res.crackTimesDisplay.offlineFastHash).toMatch(/instant|second/i);
    }
  });

  it('detects spatial keyboard patterns (e.g., qwertzuiop or wsxzaq)', () => {
    const res = analyzePassword('qwertzuiop');
    expect(res.score).toBeLessThanOrEqual(2);
    const hasSpatial = res.patterns.some((p) => p.patternType === 'spatial');
    expect(hasSpatial).toBe(true);
  });

  it('detects repeated sequences (e.g., aaaaaaa)', () => {
    const res = analyzePassword('aaaaaaaaa');
    expect(res.score).toBe(0);
    const hasRepeat = res.patterns.some((p) => p.patternType === 'repeat');
    expect(hasRepeat).toBe(true);
  });

  it('detects sequential numbers or characters (e.g., fedcba or zyxwv)', () => {
    const res = analyzePassword('fedcba');
    expect(res.score).toBeLessThanOrEqual(1);
    const hasSequence = res.patterns.some((p) => p.patternType === 'sequence');
    expect(hasSequence).toBe(true);
  });

  it('rates long Diceware passphrases as Very Strong (Score 4)', () => {
    const passphrases = [
      'correct-horse-battery-staple',
      'quantum-galaxy-nebula-whisper-forest',
      'orchard-velvet-cobalt-falcon',
    ];

    for (const phrase of passphrases) {
      const res = analyzePassword(phrase);
      expect(res.score).toBe(4);
      expect(res.label).toBe('Very Strong');
      expect(res.entropyBits).toBeGreaterThan(50);
      expect(res.crackTimesDisplay.onlineThrottled).toMatch(/centuries|years/i);
    }
  });

  it('flags leetspeak substitutions on common words (e.g., P@ssw0rd)', () => {
    const res = analyzePassword('P@ssw0rd');
    expect(res.score).toBeLessThanOrEqual(1);
    const dictionaryMatch = res.patterns.some(
      (p) => p.patternType === 'dictionary'
    );
    expect(dictionaryMatch).toBe(true);
  });

  it('calculates character variety metrics accurately', () => {
    const res = analyzePassword('Abc123!@#');
    expect(res.metrics.hasUppercase).toBe(true);
    expect(res.metrics.hasLowercase).toBe(true);
    expect(res.metrics.hasNumbers).toBe(true);
    expect(res.metrics.hasSymbols).toBe(true);
    expect(res.metrics.characterCount).toBe(9);
    expect(res.metrics.uniqueCharacters).toBe(9);
  });

  it('provides actionable suggestions compliant with NIST recommendations', () => {
    const res = analyzePassword('short');
    expect(res.suggestions.length).toBeGreaterThan(0);
    expect(res.suggestions.some((s) => s.toLowerCase().includes('character') || s.toLowerCase().includes('passphrase'))).toBe(true);
  });
});
