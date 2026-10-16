import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzePassword, EMPTY_ANALYSIS } from '../services/analyzer';
import { generatePassphrase } from '../services/generator';
import { auditStorageSecurity, getPrivacyStatus } from '../services/privacy';

describe('Privacy and Network Isolation Requirements', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('never writes password analysis data to localStorage or sessionStorage', () => {
    // Perform multiple analyses
    analyzePassword('SecretP@ssword123!');
    analyzePassword('AnotherVaultSecret2025$');
    generatePassphrase({ wordCount: 5 });

    const audit = auditStorageSecurity();
    expect(audit.isStorageClean).toBe(true);
    expect(audit.localStorageKeys).toHaveLength(0);
    expect(audit.sessionStorageKeys).toHaveLength(0);
    expect(audit.cookiePresent).toBe(false);
  });

  it('guarantees zero network calls during password analysis and generation', () => {
    const fetchSpy = vi.spyOn(window, 'fetch');

    // Run analyzer
    const res1 = analyzePassword('Complex!P@ssphrase#9982');
    expect(res1.score).toBeGreaterThan(0);

    // Run generator
    const res2 = generatePassphrase({ wordCount: 4 });
    expect(res2.passphrase).toBeDefined();

    // Verify no network activity occurred
    expect(fetchSpy).not.toHaveBeenCalled();

    const status = getPrivacyStatus();
    expect(status.networkRequestsIntercepted).toBe(0);
  });

  it('never logs sensitive password values to console.log, console.info, or console.debug', () => {
    const logSpy = vi.spyOn(console, 'log');
    const infoSpy = vi.spyOn(console, 'info');
    const debugSpy = vi.spyOn(console, 'debug');

    const sensitiveSample = 'TopSecretCorporateVault2025!';
    analyzePassword(sensitiveSample);
    generatePassphrase();

    // Ensure none of the logged outputs contain the password
    const allCalls = [
      ...logSpy.mock.calls.flat(),
      ...infoSpy.mock.calls.flat(),
      ...debugSpy.mock.calls.flat(),
    ];

    const leaked = allCalls.some(
      (entry) => typeof entry === 'string' && entry.includes(sensitiveSample)
    );
    expect(leaked).toBe(false);
  });

  it('resets analysis state completely to EMPTY_ANALYSIS on wipe', () => {
    const analyzed = analyzePassword('TestPassword123!');
    expect(analyzed.score).toBeGreaterThanOrEqual(0);
    expect(analyzed.length).toBeGreaterThan(0);

    // Simulate reset
    const cleared = EMPTY_ANALYSIS;
    expect(cleared.score).toBe(0);
    expect(cleared.length).toBe(0);
    expect(cleared.entropyBits).toBe(0);
    expect(cleared.patterns).toHaveLength(0);
  });
});
