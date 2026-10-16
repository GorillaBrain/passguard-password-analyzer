import '@testing-library/jest-dom/vitest';
import { beforeEach, afterEach, vi } from 'vitest';

// Ensure crypto.getRandomValues is available in the test environment
if (typeof window !== 'undefined') {
  if (!window.crypto) {
    (window as any).crypto = {};
  }
  if (!window.crypto.getRandomValues) {
    window.crypto.getRandomValues = (arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * (arr instanceof Uint32Array ? 4294967296 : 256));
      }
      return arr;
    };
  }

  // Mock navigator.clipboard
  if (!navigator.clipboard) {
    (navigator as any).clipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(''),
    };
  } else {
    navigator.clipboard.writeText = vi.fn().mockResolvedValue(undefined);
  }
}

beforeEach(() => {
  // Clear storage before each test
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {}
});

afterEach(() => {
  vi.restoreAllMocks();
});
