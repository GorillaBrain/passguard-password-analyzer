import React, { useState, useCallback } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Info,
  Sliders,
  RefreshCw,
} from 'lucide-react';
import { generatePassphrase } from '../services/generator';
import { EFF_WORDLIST_METADATA } from '../data/eff-wordlist';
import type { PassphraseOptions, PassphraseResult } from '../types';

interface PassphraseGeneratorProps {
  onTestInAnalyzer: (passphrase: string) => void;
}

export const PassphraseGenerator: React.FC<PassphraseGeneratorProps> = ({
  onTestInAnalyzer,
}) => {
  const [options, setOptions] = useState<PassphraseOptions>({
    wordCount: 4,
    separator: '-',
    separatorType: 'hyphen',
    capitalization: 'lowercase',
    includeNumber: true,
    includeSymbol: false,
  });

  const [result, setResult] = useState<PassphraseResult>(() =>
    generatePassphrase({
      wordCount: 4,
      separator: '-',
      separatorType: 'hyphen',
      capitalization: 'lowercase',
      includeNumber: true,
      includeSymbol: false,
    })
  );

  const [copied, setCopied] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // Regenerate with current options
  const handleRegenerate = useCallback(() => {
    setIsRotating(true);
    const next = generatePassphrase(options);
    setResult(next);
    setCopied(false);
    setTimeout(() => setIsRotating(false), 300);
  }, [options]);

  // Update options and regenerate
  const updateOption = useCallback(
    <K extends keyof PassphraseOptions>(key: K, value: PassphraseOptions[K]) => {
      setOptions((prev) => {
        const next = { ...prev, [key]: value };
        // Immediately regenerate with updated setting
        setResult(generatePassphrase(next));
        setCopied(false);
        return next;
      });
    },
    []
  );

  // Handle separator preset changes
  const handleSeparatorChange = (type: PassphraseOptions['separatorType']) => {
    let sep = '-';
    if (type === 'underscore') sep = '_';
    else if (type === 'period') sep = '.';
    else if (type === 'space') sep = ' ';
    else if (type === 'slash') sep = '/';
    else if (type === 'digit') sep = ''; // Will generate random digit dynamically

    setOptions((prev) => {
      const next = { ...prev, separatorType: type, separator: sep };
      setResult(generatePassphrase(next));
      setCopied(false);
      return next;
    });
  };

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    if (!result.passphrase) return;
    try {
      await navigator.clipboard.writeText(result.passphrase);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  }, [result.passphrase]);

  return (
    <div className="space-y-6">
      {/* Educational Banner for Passphrases */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Diceware Passphrase Cryptography
            </h2>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Passphrases combine multiple dictionary words picked uniformly at random using the browser’s cryptographically secure PRNG (<code className="text-cyan-300 font-mono">crypto.getRandomValues</code>) with rejection sampling to eliminate modulo bias. They provide massive search spaces while remaining human-memorable.
            </p>
          </div>
        </div>
      </div>

      {/* Main Generator Display Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        {/* Passphrase Output Container */}
        <div className="relative rounded-2xl border border-slate-700/80 bg-slate-950/90 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-cyan-400">
              Generated Passphrase Example
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-300 border border-emerald-500/20">
                ~{result.entropyBits} bits entropy
              </span>
              <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-medium text-cyan-300 border border-cyan-500/20">
                {result.strengthLabel}
              </span>
            </div>
          </div>

          <div
            className="my-3 font-mono text-lg sm:text-2xl font-bold tracking-wide text-white select-all break-all"
            aria-live="polite"
          >
            {result.passphrase}
          </div>

          {/* Action Toolbar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRegenerate}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 text-cyan-400 ${
                    isRotating ? 'animate-spin' : ''
                  }`}
                />
                Regenerate
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Passphrase
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onTestInAnalyzer(result.passphrase)}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Analyze in Password Meter
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Security Notice Label */}
        <div className="mt-3 text-xs text-slate-400">
          <p>
            <strong className="text-slate-300">Important: </strong>
            Generated passphrases are displayed strictly as ephemeral examples. PassGuard does not save, cache, or log generated passphrases. Generate a distinct passphrase for each account and save it into your password manager.
          </p>
        </div>

        {/* Generator Customization Settings */}
        <div className="mt-6 border-t border-slate-800/80 pt-6 space-y-5">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">
              Passphrase Configuration
            </h3>
          </div>

          {/* Word Count Slider */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="word-count-slider"
                className="text-xs font-medium text-slate-200"
              >
                Number of Words: <span className="font-bold text-cyan-400 text-sm">{options.wordCount} words</span>
              </label>
              <span className="text-xs text-slate-400">
                {(options.wordCount * EFF_WORDLIST_METADATA.entropyPerWord).toFixed(1)} bits raw word entropy
              </span>
            </div>
            <input
              id="word-count-slider"
              type="range"
              min="3"
              max="8"
              step="1"
              value={options.wordCount}
              onChange={(e) => updateOption('wordCount', parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>3 (Fast)</span>
              <span>4 (Recommended)</span>
              <span>5 (High Security)</span>
              <span>6 (Paranoid)</span>
              <span>8 (Maximum)</span>
            </div>
          </div>

          {/* Separator Selection */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <label className="text-xs font-medium text-slate-200 block mb-2">
              Word Separator
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { type: 'hyphen', label: 'Hyphen (-)' },
                { type: 'underscore', label: 'Underscore (_)' },
                { type: 'period', label: 'Period (.)' },
                { type: 'space', label: 'Space ( )' },
                { type: 'slash', label: 'Slash (/)' },
                { type: 'digit', label: 'Random Digit' },
              ].map((sep) => (
                <button
                  key={sep.type}
                  type="button"
                  onClick={() => handleSeparatorChange(sep.type as any)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                    options.separatorType === sep.type
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sep.label}
                </button>
              ))}
            </div>
          </div>

          {/* Capitalization & Additions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Capitalization */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <label className="text-xs font-medium text-slate-200 block mb-2">
                Capitalization Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'lowercase', label: 'lower' },
                  { id: 'capitalize', label: 'Title Case' },
                  { id: 'uppercase', label: 'UPPER' },
                ].map((cap) => (
                  <button
                    key={cap.id}
                    type="button"
                    onClick={() => updateOption('capitalization', cap.id as any)}
                    className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-all ${
                      options.capitalization === cap.id
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cap.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 flex flex-col justify-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={options.includeNumber}
                  onChange={(e) => updateOption('includeNumber', e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400"
                />
                <span>Append Random Digit (+3.32 bits entropy)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={options.includeSymbol}
                  onChange={(e) => updateOption('includeSymbol', e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400"
                />
                <span>Append Random Symbol (+3.58 bits entropy)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Wordlist Attribution & Cryptographic PRNG Details */}
        <div className="mt-6 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
            <Info className="h-4 w-4 text-cyan-400" />
            <span>Wordlist Attribution &amp; Mathematical Rigor</span>
          </div>
          <p className="leading-relaxed">
            Words are drawn from the{' '}
            <a
              href={EFF_WORDLIST_METADATA.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              {EFF_WORDLIST_METADATA.name}
            </a>{' '}
            published by the {EFF_WORDLIST_METADATA.author} under {EFF_WORDLIST_METADATA.license}. The list contains {EFF_WORDLIST_METADATA.wordCount.toLocaleString()} curated English words ($6^5$ combinations), yielding ~12.92 bits of entropy per word selected. PassGuard implements 32-bit rejection sampling over <code className="text-cyan-300 font-mono">window.crypto.getRandomValues()</code> to mathematically eliminate modulo bias.
          </p>
        </div>
      </div>
    </div>
  );
};
