import type { ZxcvbnResult } from '@zxcvbn-ts/core';

export type StrengthScore = 0 | 1 | 2 | 3 | 4;

export type StrengthLabel = 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';

export interface ScoreStyle {
  label: StrengthLabel;
  textColor: string;
  bgColor: string;
  borderColor: string;
  barColor: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export interface CrackTimesDisplay {
  onlineThrottled: string;
  onlineUnthrottled: string;
  offlineSlowHash: string;
  offlineFastHash: string;
}

export interface CrackTimesSeconds {
  onlineThrottled: number;
  onlineUnthrottled: number;
  offlineSlowHash: number;
  offlineFastHash: number;
}

export interface PatternMatchDetail {
  id: string;
  patternType: 'dictionary' | 'spatial' | 'repeat' | 'sequence' | 'date' | 'regex' | 'bruteforce';
  title: string;
  token: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface PasswordAnalysis {
  score: StrengthScore;
  label: StrengthLabel;
  scoreStyle: ScoreStyle;
  entropyBits: number;
  naiveEntropyBits: number;
  guesses: number;
  guessesLog10: number;
  crackTimesDisplay: CrackTimesDisplay;
  crackTimesSeconds: CrackTimesSeconds;
  warning: string | null;
  suggestions: string[];
  patterns: PatternMatchDetail[];
  calcTimeMs: number;
  length: number;
  metrics: {
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSymbols: boolean;
    characterCount: number;
    uniqueCharacters: number;
  };
  rawZxcvbn?: ZxcvbnResult;
}

export interface PassphraseOptions {
  wordCount: number;
  separator: string;
  separatorType: 'hyphen' | 'underscore' | 'period' | 'space' | 'slash' | 'digit' | 'custom';
  capitalization: 'lowercase' | 'capitalize' | 'uppercase';
  includeNumber: boolean;
  includeSymbol: boolean;
}

export interface PassphraseResult {
  passphrase: string;
  words: string[];
  wordCount: number;
  entropyBits: number;
  strengthLabel: StrengthLabel;
  separatorUsed: string;
}

export interface SecurityChecklistItem {
  id: string;
  category: 'password' | 'account' | 'tooling';
  title: string;
  explanation: string;
  recommendation: string;
  isImportant: boolean;
}
