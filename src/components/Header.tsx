import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

interface HeaderProps {
  activeTab: 'analyzer' | 'generator' | 'checklist' | 'education';
  setActiveTab: (tab: 'analyzer' | 'generator' | 'checklist' | 'education') => void;
  onOpenPrivacyModal: () => void;
  repoUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenPrivacyModal,
  repoUrl = 'https://github.com/GorillaBrain/passguard-password-analyzer',
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 shadow-sm shadow-cyan-500/20 text-cyan-400">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                Pass<span className="text-cyan-400">Guard</span>
              </span>
              <span className="hidden rounded-full border border-cyan-500/30 bg-cyan-950/50 px-2 py-0.5 text-xs font-medium text-cyan-300 sm:inline-block">
                v1.0 • Offline Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Privacy-First Password Strength &amp; Passphrase Suite
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800" aria-label="Main Navigation">
          <button
            type="button"
            onClick={() => setActiveTab('analyzer')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'analyzer'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Password Analyzer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('generator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'generator'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Passphrase Generator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'checklist'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Security Checklist
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('education')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'education'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Education &amp; NIST
          </button>
        </nav>

        {/* Actions & Badges */}
        <div className="flex items-center gap-2">
          {/* Privacy badge button */}
          <button
            type="button"
            onClick={onOpenPrivacyModal}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            title="Click to view full privacy audit and verification details"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">100% Local</span>
            <span className="sm:hidden">Zero-Network</span>
          </button>

          {/* GitHub link */}
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>

      {/* Mobile nav buttons */}
      <div className="flex md:hidden border-t border-slate-800/60 bg-slate-900/90 px-2 py-1.5 overflow-x-auto gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('analyzer')}
          className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${
            activeTab === 'analyzer' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Analyzer
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('generator')}
          className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${
            activeTab === 'generator' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Passphrase
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('checklist')}
          className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${
            activeTab === 'checklist' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Checklist
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('education')}
          className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${
            activeTab === 'education' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Education
        </button>
      </div>
    </header>
  );
};
