import React, { useState, useTransition, useCallback } from 'react';
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  RotateCcw,
  KeyRound,
} from 'lucide-react';
import type { PasswordAnalysis } from '../types';
import { analyzePassword, EMPTY_ANALYSIS } from '../services/analyzer';
import { StrengthMeter } from './StrengthMeter';
import { AttackScenarios } from './AttackScenarios';
import { PatternInspector } from './PatternInspector';
import { SuggestionsList } from './SuggestionsList';
import { PrivacyNoticeBanner } from './PrivacyNoticeBanner';

interface PasswordAnalyzerProps {
  onOpenPrivacyModal: () => void;
  onNavigateToGenerator: () => void;
  initialPassword?: string;
}

export const PasswordAnalyzer: React.FC<PasswordAnalyzerProps> = ({
  onOpenPrivacyModal,
  onNavigateToGenerator,
  initialPassword = '',
}) => {
  const [password, setPassword] = useState<string>(initialPassword);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis>(() =>
    initialPassword ? analyzePassword(initialPassword) : EMPTY_ANALYSIS
  );
  const [, startTransition] = useTransition();

  // Handle password input changes
  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    startTransition(() => {
      if (!newPassword) {
        setAnalysis(EMPTY_ANALYSIS);
      } else {
        setAnalysis(analyzePassword(newPassword));
      }
    });
  }, []);

  // Reset button: securely wipes input and analysis state
  const handleReset = useCallback(() => {
    setPassword('');
    setAnalysis(EMPTY_ANALYSIS);
    setCopied(false);
  }, []);

  // Copy to clipboard with clear feedback
  const handleCopy = useCallback(async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  }, [password]);

  return (
    <div className="space-y-6">
      {/* Privacy Notice Banner */}
      <PrivacyNoticeBanner onOpenPrivacyModal={onOpenPrivacyModal} />

      {/* Main Analyzer Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        {/* Input Header & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <label
            htmlFor="password-input"
            className="flex items-center gap-2 text-sm font-semibold text-slate-200"
          >
            <KeyRound className="h-4 w-4 text-cyan-400" />
            <span>Enter Password to Analyze</span>
          </label>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            {password.length > 0 && (
              <>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">
                  {password.length} chars
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-cyan-400">
                  {analysis.calcTimeMs} ms latency
                </span>
              </>
            )}
          </div>
        </div>

        {/* Input Field Container */}
        <div className="relative mt-2">
          <input
            id="password-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Type or paste a password (evaluated locally in browser)..."
            autoComplete="off"
            spellCheck="false"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3.5 pr-32 font-mono text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />

          {/* Action buttons inside input */}
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {password.length > 0 && (
              <>
                {/* Reset button */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  title="Clear password from memory (Reset)"
                  aria-label="Clear password"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                {/* Copy button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  title={copied ? 'Copied to clipboard!' : 'Copy to clipboard'}
                  aria-label="Copy password to clipboard"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </>
            )}

            {/* Show/Hide password toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-cyan-400" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Character Variety Matrix */}
        {password.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span
              className={`rounded-md px-2 py-0.5 border ${
                analysis.metrics.hasUppercase
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/50 text-slate-500'
              }`}
            >
              Uppercase (A-Z)
            </span>
            <span
              className={`rounded-md px-2 py-0.5 border ${
                analysis.metrics.hasLowercase
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/50 text-slate-500'
              }`}
            >
              Lowercase (a-z)
            </span>
            <span
              className={`rounded-md px-2 py-0.5 border ${
                analysis.metrics.hasNumbers
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/50 text-slate-500'
              }`}
            >
              Numbers (0-9)
            </span>
            <span
              className={`rounded-md px-2 py-0.5 border ${
                analysis.metrics.hasSymbols
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/50 text-slate-500'
              }`}
            >
              Symbols (!@#$)
            </span>
            <span className="rounded-md border border-slate-800 bg-slate-900/50 px-2 py-0.5 text-slate-400">
              {analysis.metrics.uniqueCharacters} Unique
            </span>
          </div>
        )}

        {/* Strength Meter Section */}
        <div className="mt-6 border-t border-slate-800/80 pt-6">
          <StrengthMeter
            analysis={analysis}
            passwordLength={password.length}
          />
        </div>
      </div>

      {/* Cracking Scenarios Breakdown */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        <AttackScenarios analysis={analysis} />
      </div>

      {/* Pattern Inspector */}
      {password.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-sm">
          <PatternInspector analysis={analysis} />
        </div>
      )}

      {/* Improvement Suggestions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        <SuggestionsList
          analysis={analysis}
          onUseGenerator={onNavigateToGenerator}
        />
      </div>
    </div>
  );
};
