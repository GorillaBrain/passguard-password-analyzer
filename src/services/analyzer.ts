import { ZxcvbnFactory } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import type {
  PasswordAnalysis,
  StrengthScore,
  StrengthLabel,
  ScoreStyle,
  PatternMatchDetail,
} from '../types';
import { calculateGuessEntropy, calculateNaivePoolEntropy } from './entropy';

// Initialize zxcvbn engine with common and english dictionaries
const zxcvbnEngine = new ZxcvbnFactory({
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
});

export const SCORE_STYLES: Record<StrengthScore, ScoreStyle> = {
  0: {
    label: 'Very Weak',
    textColor: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    barColor: 'bg-rose-500',
    glowColor: 'shadow-rose-500/20',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300',
    description: 'Extremely vulnerable. Can be cracked almost instantaneously by automated tools.',
  },
  1: {
    label: 'Weak',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    barColor: 'bg-orange-500',
    glowColor: 'shadow-orange-500/20',
    badgeBg: 'bg-orange-500/20',
    badgeText: 'text-orange-300',
    description: 'Easily defeated by standard dictionary attacks and simple mutation rules.',
  },
  2: {
    label: 'Fair',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    barColor: 'bg-amber-500',
    glowColor: 'shadow-amber-500/20',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    description: 'Moderate resilience against basic attacks, but vulnerable to GPU-accelerated cracking.',
  },
  3: {
    label: 'Strong',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    barColor: 'bg-emerald-500',
    glowColor: 'shadow-emerald-500/20',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    description: 'Strong security. Resistant to online and offline attacks under standard hashing algorithms.',
  },
  4: {
    label: 'Very Strong',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    barColor: 'bg-cyan-400',
    glowColor: 'shadow-cyan-500/30',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-200',
    description: 'Exceptional cryptographic strength. Practically uncrackable with current compute capabilities.',
  },
};

export const EMPTY_ANALYSIS: PasswordAnalysis = {
  score: 0,
  label: 'Very Weak',
  scoreStyle: SCORE_STYLES[0],
  entropyBits: 0,
  naiveEntropyBits: 0,
  guesses: 0,
  guessesLog10: 0,
  crackTimesDisplay: {
    onlineThrottled: 'Instant',
    onlineUnthrottled: 'Instant',
    offlineSlowHash: 'Instant',
    offlineFastHash: 'Instant',
  },
  crackTimesSeconds: {
    onlineThrottled: 0,
    onlineUnthrottled: 0,
    offlineSlowHash: 0,
    offlineFastHash: 0,
  },
  warning: null,
  suggestions: [
    'Use at least 14-16 characters or a 4+ word passphrase.',
    'Avoid common words, names, dates, and keyboard sequences.',
    'Create unique passwords for every account to prevent credential stuffing.',
  ],
  patterns: [],
  calcTimeMs: 0,
  length: 0,
  metrics: {
    hasUppercase: false,
    hasLowercase: false,
    hasNumbers: false,
    hasSymbols: false,
    characterCount: 0,
    uniqueCharacters: 0,
  },
};

/**
 * Parses raw zxcvbn sequence matches into human-readable, educational pattern descriptions.
 */
function parsePatterns(sequence: any[]): PatternMatchDetail[] {
  if (!sequence || !Array.isArray(sequence)) return [];

  return sequence.map((match, idx) => {
    const token = match.token || '';
    const patternType = match.pattern || 'bruteforce';
    let title = 'Pattern Match';
    let description = `Identified pattern '${token}'.`;
    let severity: 'low' | 'medium' | 'high' = 'medium';

    switch (patternType) {
      case 'dictionary': {
        const dict = match.dictionaryName || 'dictionary';
        const isReversed = match.reversed ? ' (reversed)' : '';
        const isL33t = match.l33t ? ' (leetspeak substitution)' : '';

        if (dict.includes('password')) {
          title = 'Common Password Dictionary Match';
          description = `'${token}' is in a database of leaked/common passwords${isReversed}${isL33t}. Attackers test these first.`;
          severity = 'high';
        } else if (dict.includes('english') || dict.includes('words')) {
          title = 'Standard English Word';
          description = `'${token}' is a recognizable dictionary word${isReversed}${isL33t}. Dictionary attacks quickly enumerate these.`;
          severity = 'medium';
        } else if (dict.includes('name') || dict.includes('female') || dict.includes('male') || dict.includes('surname')) {
          title = 'Common Name or Surname';
          description = `'${token}' matches a common first or last name. Targeted social engineering attacks test known personal names.`;
          severity = 'high';
        } else {
          title = `Dictionary Word (${dict})`;
          description = `'${token}' matched a known word list${isReversed}${isL33t}.`;
          severity = 'medium';
        }
        break;
      }

      case 'spatial': {
        const graph = match.graph || 'keyboard';
        title = 'Keyboard Spatial Walk';
        description = `'${token}' forms a physical sequence across a ${graph} keyboard (like 'qwerty' or 'asdf'). Cracking tools test spatial paths automatically.`;
        severity = 'high';
        break;
      }

      case 'repeat': {
        const base = match.baseToken || match.repeatedChar || token;
        title = 'Repeated Character Pattern';
        description = `'${token}' consists of repeated character '${base}'. Repetition drastically shrinks the search space.`;
        severity = 'high';
        break;
      }

      case 'sequence': {
        title = 'Sequential Sequence';
        description = `'${token}' follows an obvious sequence (e.g., '12345' or 'abcde'). Predictable step sizes require minimal attack guesses.`;
        severity = 'high';
        break;
      }

      case 'date': {
        const year = match.year || token;
        title = 'Calendar Date or Year';
        description = `'${token}' matches a calendar year or date format (${year}). Attackers prioritize birthdays and milestone years.`;
        severity = 'high';
        break;
      }

      case 'regex': {
        title = 'Predictable Regular Expression Pattern';
        description = `'${token}' matches a common structural pattern (such as digits or formatted digits).`;
        severity = 'medium';
        break;
      }

      default:
        title = 'Brute-force Segment';
        description = `'${token}' requires brute-force character space enumeration.`;
        severity = 'low';
        break;
    }

    return {
      id: `pattern-${idx}-${patternType}`,
      patternType,
      title,
      token,
      description,
      severity,
    };
  });
}

/**
 * Generates tailored, cybersecurity-grounded improvement suggestions.
 */
function buildEnhancedSuggestions(
  password: string,
  score: StrengthScore,
  rawSuggestions: string[],
  patterns: PatternMatchDetail[]
): string[] {
  const suggestions: string[] = [];

  // Start with zxcvbn suggestions if present
  if (rawSuggestions && rawSuggestions.length > 0) {
    for (const sug of rawSuggestions) {
      if (sug && !suggestions.includes(sug)) {
        suggestions.push(sug);
      }
    }
  }

  // Length suggestions based on modern cybersecurity guidance (NIST SP 800-63B)
  if (password.length < 8) {
    suggestions.push('Minimum length warning: Passwords under 8 characters can be brute-forced in seconds regardless of complexity.');
  } else if (password.length < 12) {
    suggestions.push('Aim for at least 14-16 characters. Every added character increases search space exponentially.');
  }

  // Pattern-specific advice
  const hasCommonPass = patterns.some((p) => p.title.includes('Common Password'));
  if (hasCommonPass) {
    suggestions.push('Avoid strings from leaked password dumps. Attack tools prioritize these billions of known entries.');
  }

  const hasKeyboardWalk = patterns.some((p) => p.patternType === 'spatial');
  if (hasKeyboardWalk) {
    suggestions.push('Avoid keyboard layout walks (e.g. "qwerty", "zxcvb", keypad diagonals).');
  }

  const hasDates = patterns.some((p) => p.patternType === 'date');
  if (hasDates) {
    suggestions.push('Avoid personal dates, birth years, or current year suffixes (e.g. 2024, 2025).');
  }

  // Passphrase recommendation for higher security
  if (score < 3 && !suggestions.some((s) => s.toLowerCase().includes('passphrase'))) {
    suggestions.push('Consider a Diceware passphrase: 4 or 5 random, unrelated words (e.g. "correct-horse-battery-staple"). It is much easier to remember and significantly harder to crack.');
  }

  // General hygiene
  if (suggestions.length < 3) {
    suggestions.push('Never reuse this password across accounts. A compromise on one site puts all accounts at risk.');
  }

  return suggestions.slice(0, 5);
}

/**
 * Primary password analysis function.
 * Evaluates password strength locally using @zxcvbn-ts.
 */
export function analyzePassword(password: string): PasswordAnalysis {
  if (!password || password.length === 0) {
    return EMPTY_ANALYSIS;
  }

  const startTime = performance.now();

  // Run zxcvbn analysis locally in-memory
  const result = zxcvbnEngine.check(password);
  const calcTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

  const score = result.score as StrengthScore;
  const scoreStyle = SCORE_STYLES[score] || SCORE_STYLES[0];
  const entropyBits = calculateGuessEntropy(result.guesses);
  const naiveEntropyBits = calculateNaivePoolEntropy(password);

  // Extract crack times
  const ct = result.crackTimes;
  const crackTimesDisplay = {
    onlineThrottled: ct?.onlineThrottlingXPerHour?.display || 'Instant',
    onlineUnthrottled: ct?.onlineNoThrottlingXPerSecond?.display || 'Instant',
    offlineSlowHash: ct?.offlineSlowHashingXPerSecond?.display || 'Instant',
    offlineFastHash: ct?.offlineFastHashingXPerSecond?.display || 'Instant',
  };

  const crackTimesSeconds = {
    onlineThrottled: ct?.onlineThrottlingXPerHour?.seconds ?? 0,
    onlineUnthrottled: ct?.onlineNoThrottlingXPerSecond?.seconds ?? 0,
    offlineSlowHash: ct?.offlineSlowHashingXPerSecond?.seconds ?? 0,
    offlineFastHash: ct?.offlineFastHashingXPerSecond?.seconds ?? 0,
  };

  const patterns = parsePatterns(result.sequence);
  const suggestions = buildEnhancedSuggestions(
    password,
    score,
    result.feedback?.suggestions || [],
    patterns
  );

  const uniqueChars = new Set(password).size;

  return {
    score,
    label: scoreStyle.label as StrengthLabel,
    scoreStyle,
    entropyBits,
    naiveEntropyBits,
    guesses: result.guesses,
    guessesLog10: Math.round(result.guessesLog10 * 100) / 100,
    crackTimesDisplay,
    crackTimesSeconds,
    warning: result.feedback?.warning || null,
    suggestions,
    patterns,
    calcTimeMs,
    length: password.length,
    metrics: {
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSymbols: /[^a-zA-Z0-9]/.test(password),
      characterCount: password.length,
      uniqueCharacters: uniqueChars,
    },
    rawZxcvbn: result,
  };
}
