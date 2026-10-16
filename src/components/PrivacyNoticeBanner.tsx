import React from 'react';
import { Lock, CheckCircle } from 'lucide-react';

interface PrivacyNoticeBannerProps {
  onOpenPrivacyModal: () => void;
}

export const PrivacyNoticeBanner: React.FC<PrivacyNoticeBannerProps> = ({
  onOpenPrivacyModal,
}) => {
  return (
    <div
      role="region"
      aria-label="Privacy Guarantee"
      className="mb-6 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-blue-950/30 p-4 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Lock className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-100">
                100% Client-Side Privacy Architecture
              </h2>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-500/20">
                <CheckCircle className="h-3 w-3" /> No Remote APIs
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Your password never leaves this device. All pattern matching, entropy estimation, and cracking time metrics execute strictly inside local browser memory via bundled WebAssembly/JavaScript. No analytics, tracking, or network requests are ever triggered.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPrivacyModal}
          className="shrink-0 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Verify Security Isolation
        </button>
      </div>
    </div>
  );
};
