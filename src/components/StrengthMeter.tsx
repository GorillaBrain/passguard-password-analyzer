import React from 'react';
import type { PasswordAnalysis } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';

interface StrengthMeterProps {
  analysis: PasswordAnalysis;
  passwordLength: number;
}

export const StrengthMeter: React.FC<StrengthMeterProps> = ({
  analysis,
  passwordLength,
}) => {
  const { score, label, scoreStyle, entropyBits, naiveEntropyBits, guessesLog10 } = analysis;

  const scoreIcons = [
    <ShieldAlert className="h-5 w-5 text-rose-400" key="0" />,
    <AlertTriangle className="h-5 w-5 text-orange-400" key="1" />,
    <AlertTriangle className="h-5 w-5 text-amber-400" key="2" />,
    <CheckCircle2 className="h-5 w-5 text-emerald-400" key="3" />,
    <ShieldCheck className="h-5 w-5 text-cyan-400" key="4" />,
  ];

  const emptyState = passwordLength === 0;

  return (
    <div className="space-y-4">
      {/* Label and Score Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Strength Assessment:
          </span>
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-1.5"
          >
            {!emptyState && scoreIcons[score]}
            <span
              className={`text-base font-bold ${
                emptyState ? 'text-slate-500' : scoreStyle.textColor
              }`}
            >
              {emptyState ? 'Enter a password' : label}
            </span>
          </div>
        </div>

        {/* Guesses and Entropy Pill */}
        {!emptyState && (
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-md border border-slate-700/80 bg-slate-800/80 px-2 py-0.5 text-slate-300">
              Guesses: ~10<sup>{guessesLog10}</sup>
            </span>
            <span className="rounded-md border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 font-medium text-cyan-300">
              Entropy: {entropyBits} bits
            </span>
          </div>
        )}
      </div>

      {/* Visual Segmented Progress Bar */}
      <div
        className="grid grid-cols-4 gap-2"
        role="progressbar"
        aria-valuenow={emptyState ? 0 : score + 1}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label={`Password strength rating: ${emptyState ? 'None' : label}`}
      >
        {[0, 1, 2, 3].map((segmentIndex) => {
          const isFilled = !emptyState && score >= segmentIndex + 1;
          const isFirstSegmentVeryWeak = !emptyState && score === 0 && segmentIndex === 0;

          let segmentColor = 'bg-slate-800';
          if (isFirstSegmentVeryWeak) {
            segmentColor = 'bg-rose-500';
          } else if (isFilled) {
            segmentColor = scoreStyle.barColor;
          }

          return (
            <div
              key={segmentIndex}
              className={`h-2.5 rounded-full transition-all duration-300 ${segmentColor}`}
            />
          );
        })}
      </div>

      {/* Evaluation summary explanation */}
      <p className="text-xs text-slate-400 leading-relaxed">
        {emptyState
          ? 'Type or paste a password above to inspect pattern vulnerabilities, estimate attack difficulty, and measure cracking resistance.'
          : scoreStyle.description}
      </p>

      {/* Naive vs Realistic Entropy Comparison Insight (Cybersecurity Teaching Point) */}
      {!emptyState && naiveEntropyBits > entropyBits && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-200/90 flex items-start gap-2">
          <Zap className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">Entropy Reality Gap: </span>
            Naive character-pool calculation assumes random character distribution ({naiveEntropyBits} bits), but detected patterns and dictionary words drop real-world attack resistance to <strong className="text-amber-100">{entropyBits} bits</strong>. Attackers test patterns, not purely random characters!
          </div>
        </div>
      )}
    </div>
  );
};
