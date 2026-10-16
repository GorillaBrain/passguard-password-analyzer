import React from 'react';
import type { PasswordAnalysis } from '../types';
import { Search, CheckCircle, Hash, BookOpen, MoveHorizontal, Repeat, Calendar } from 'lucide-react';

interface PatternInspectorProps {
  analysis: PasswordAnalysis;
}

export const PatternInspector: React.FC<PatternInspectorProps> = ({ analysis }) => {
  const { patterns, length } = analysis;

  if (length === 0) return null;

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'dictionary':
        return <BookOpen className="h-4 w-4 text-orange-400" />;
      case 'spatial':
        return <MoveHorizontal className="h-4 w-4 text-rose-400" />;
      case 'repeat':
        return <Repeat className="h-4 w-4 text-yellow-400" />;
      case 'sequence':
        return <Hash className="h-4 w-4 text-amber-400" />;
      case 'date':
        return <Calendar className="h-4 w-4 text-purple-400" />;
      default:
        return <Search className="h-4 w-4 text-cyan-400" />;
    }
  };

  const getSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return (
          <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-rose-300 border border-rose-500/30">
            High Vulnerability
          </span>
        );
      case 'medium':
        return (
          <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
            Predictable Pattern
          </span>
        );
      default:
        return (
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-700">
            Low Vulnerability
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Pattern &amp; Vulnerability Detection
        </h3>
        <span className="text-[11px] text-slate-500">
          {patterns.length} Identified Sequence{patterns.length === 1 ? '' : 's'}
        </span>
      </div>

      {patterns.length === 0 ? (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-200">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            <strong>No Predictable Heuristic Patterns Detected.</strong> Your password does not contain obvious dictionary words, keyboard walks, or repeated series.
          </span>
        </div>
      ) : (
        <div className="space-y-2">
          {patterns.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 transition-colors hover:border-slate-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-slate-800/80 p-1 border border-slate-700/60">
                    {getPatternIcon(item.patternType)}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-950 px-2 py-0.5 font-mono text-xs text-cyan-300 border border-slate-800">
                    "{item.token}"
                  </span>
                  {getSeverityBadge(item.severity)}
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-7">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
