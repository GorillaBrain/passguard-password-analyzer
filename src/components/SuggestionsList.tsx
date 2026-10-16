import React from 'react';
import type { PasswordAnalysis } from '../types';
import { AlertCircle, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';

interface SuggestionsListProps {
  analysis: PasswordAnalysis;
  onUseGenerator?: () => void;
}

export const SuggestionsList: React.FC<SuggestionsListProps> = ({
  analysis,
  onUseGenerator,
}) => {
  const { warning, suggestions, length, score } = analysis;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Actionable Improvement Recommendations
        </h3>
        <span className="text-[11px] text-slate-500">
          NIST SP 800-63B Best Practices
        </span>
      </div>

      {/* Critical warning if present */}
      {warning && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <strong className="font-semibold text-rose-200">Critical Warning: </strong>
            {warning}
          </div>
        </div>
      )}

      {/* Suggestions List */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-cyan-400" />
          <h4 className="text-xs font-semibold text-slate-200">
            {length === 0
              ? 'Fundamental Security Guidelines'
              : 'Targeted Recommendations for This Password'}
          </h4>
        </div>

        <ul className="space-y-2 text-xs text-slate-300">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{suggestion}</span>
            </li>
          ))}
        </ul>

        {/* Action suggestion if weak */}
        {score < 3 && onUseGenerator && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Want a mathematically superior alternative?
            </span>
            <button
              type="button"
              onClick={onUseGenerator}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Generate secure Diceware passphrase
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
