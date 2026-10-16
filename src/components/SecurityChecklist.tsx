import React, { useState } from 'react';
import { CheckSquare, Square, ShieldCheck, RotateCcw } from 'lucide-react';
import { SECURITY_CHECKLIST } from '../data/security-checklist';

export const SecurityChecklist: React.FC = () => {
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(['length-over-complexity', 'enable-mfa'])
  );
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'password' | 'account' | 'tooling'>('all');

  const toggleItem = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleReset = () => {
    setCompletedIds(new Set());
  };

  const filteredItems = SECURITY_CHECKLIST.filter((item) => {
    if (categoryFilter === 'all') return true;
    return item.category === categoryFilter;
  });

  const completionPercent = Math.round(
    (completedIds.size / SECURITY_CHECKLIST.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header card with progress */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white">
                Personal Security Hygiene Checklist
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Actionable NIST SP 800-63B and cybersecurity guidelines for robust credential defense.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400">Security Score</span>
              <div className="text-lg font-bold text-cyan-400 font-mono">
                {completedIds.size} / {SECURITY_CHECKLIST.length} ({completionPercent}%)
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Reset checklist"
              aria-label="Reset checklist"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        {/* Filter categories */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'password', label: 'Password Discipline' },
            { id: 'account', label: 'Account Protections' },
            { id: 'tooling', label: 'Security Tooling' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id as any)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                categoryFilter === cat.id
                  ? 'border border-cyan-500/40 bg-cyan-500/20 text-cyan-300'
                  : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist items list */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isDone = completedIds.has(item.id);

          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all ${
                isDone
                  ? 'border-emerald-500/30 bg-slate-900/40 opacity-90'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  aria-checked={isDone}
                  role="checkbox"
                  className="mt-0.5 shrink-0 text-cyan-400 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(item.id);
                  }}
                >
                  {isDone ? (
                    <CheckSquare className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-500 hover:text-slate-300" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`text-sm font-semibold ${
                        isDone ? 'text-slate-400 line-through' : 'text-white'
                      }`}
                    >
                      {item.title}
                    </h3>
                    {item.isImportant && (
                      <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-300 border border-rose-500/20">
                        Critical
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.explanation}
                  </p>

                  <div className="mt-2 rounded-lg bg-slate-950/60 p-2.5 text-xs text-cyan-300/90 border border-slate-800/80">
                    <strong className="text-cyan-200">Recommended Action: </strong>
                    {item.recommendation}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
