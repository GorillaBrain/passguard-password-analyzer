import React from 'react';
import { Shield, Lock } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { EFF_WORDLIST_METADATA } from '../data/eff-wordlist';

interface FooterProps {
  onOpenPrivacyModal: () => void;
  repoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacyModal,
  repoUrl = 'https://github.com/GorillaBrain/passguard-password-analyzer',
}) => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span className="font-bold text-white tracking-tight">PassGuard</span>
              <span className="text-slate-500">— Computer System Security Portfolio Project</span>
            </div>
            <p className="text-slate-500 max-w-xl">
              Engineered with a strict zero-telemetry, client-side threat model. No user credentials, partial hashes, or telemetry pings ever cross the network.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenPrivacyModal}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              Privacy Audit
            </button>

            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              Source Code (MIT)
            </a>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            Built with React 19, TypeScript, Vite, Tailwind CSS, and @zxcvbn-ts. Released under the{' '}
            <span className="text-slate-400">MIT License</span>.
          </div>

          <div className="flex items-center gap-1">
            Wordlist courtesy of{' '}
            <a
              href={EFF_WORDLIST_METADATA.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              {EFF_WORDLIST_METADATA.author}
            </a>{' '}
            ({EFF_WORDLIST_METADATA.license})
          </div>
        </div>
      </div>
    </footer>
  );
};
