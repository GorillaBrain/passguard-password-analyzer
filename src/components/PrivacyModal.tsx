import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, Lock, HardDrive, WifiOff, FileCheck } from 'lucide-react';
import { getPrivacyStatus, PrivacyStatusReport } from '../services/privacy';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<PrivacyStatusReport | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStatus(getPrivacyStatus());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-base font-semibold text-white">
                Privacy Architecture &amp; Security Verification
              </h2>
              <p className="text-xs text-slate-400">Zero-Telemetry, Client-Side Threat Model</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live System Audit Badges */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Live Runtime Isolation Audit
            </span>
            <span className="text-[11px] text-slate-500">
              Audited: {status ? new Date(status.timestamp).toLocaleTimeString() : 'Active'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <WifiOff className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px]">Network Calls</span>
              </div>
              <span className="text-sm font-bold text-emerald-400">
                {status?.networkRequestsIntercepted ?? 0}
              </span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <HardDrive className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px]">localStorage</span>
              </div>
              <span className="text-sm font-bold text-emerald-400">
                {status?.localStorageEntries ?? 0} Keys
              </span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px]">sessionStorage</span>
              </div>
              <span className="text-sm font-bold text-emerald-400">
                {status?.sessionStorageEntries ?? 0} Keys
              </span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px]">Cookies</span>
              </div>
              <span className="text-sm font-bold text-emerald-400">
                {status?.cookiesFound ?? 0} Found
              </span>
            </div>
          </div>
        </div>

        {/* Security Principles */}
        <div className="mt-4 space-y-3 text-xs text-slate-300 leading-relaxed max-h-[48vh] overflow-y-auto pr-1">
          <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
            <h3 className="font-semibold text-white mb-1">1. Memory-Only Lifecycle</h3>
            <p className="text-slate-400">
              Passwords entered into PassGuard reside strictly in ephemeral component state. Clicking <strong className="text-cyan-300">Reset</strong> immediately overwrites the state with an empty string, allowing JavaScript garbage collection to free memory references.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
            <h3 className="font-semibold text-white mb-1">2. Offline-First Verification &amp; No Third-Party Pings</h3>
            <p className="text-slate-400">
              Unlike many online tools that send SHA-1 hashes to breach APIs, PassGuard refuses all outbound requests. The wordlists, keyboard spatial graphs, and estimation heuristics are pre-bundled in the initial download. Once loaded, you can disconnect your Wi-Fi or turn on Airplane Mode and PassGuard operates at 100% capacity.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
            <h3 className="font-semibold text-white mb-1">3. How to Independently Audit Network Isolation</h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 mt-1">
              <li>Press <kbd className="rounded bg-slate-800 px-1 py-0.5 text-slate-300 font-mono">F12</kbd> to open Developer Tools.</li>
              <li>Navigate to the <strong className="text-slate-200">Network</strong> tab and click <strong className="text-slate-200">Fetch/XHR</strong>.</li>
              <li>Type or generate any password in the application.</li>
              <li>Observe that exactly zero network requests are dispatched.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
