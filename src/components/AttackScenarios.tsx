import React from 'react';
import type { PasswordAnalysis } from '../types';
import { Shield, Cpu, Globe, Server, AlertCircle } from 'lucide-react';

interface AttackScenariosProps {
  analysis: PasswordAnalysis;
}

export const AttackScenarios: React.FC<AttackScenariosProps> = ({ analysis }) => {
  const { crackTimesDisplay, length } = analysis;
  const isBlank = length === 0;

  const scenarios = [
    {
      id: 'online-throttled',
      title: 'Online (Throttled)',
      subtitle: '100 guesses/hour',
      icon: <Globe className="h-4 w-4 text-emerald-400" />,
      time: isBlank ? '—' : crackTimesDisplay.onlineThrottled,
      description: 'Web services with strict rate-limiting, CAPTCHA, and account lockouts.',
      resilience: 'Highest',
    },
    {
      id: 'online-unthrottled',
      title: 'Online (Unthrottled)',
      subtitle: '10 guesses/sec',
      icon: <Server className="h-4 w-4 text-blue-400" />,
      time: isBlank ? '—' : crackTimesDisplay.onlineUnthrottled,
      description: 'Unprotected APIs or legacy web endpoints without automated bot prevention.',
      resilience: 'Moderate',
    },
    {
      id: 'offline-slow',
      title: 'Offline (Slow Hash)',
      subtitle: '10,000 guesses/sec',
      icon: <Shield className="h-4 w-4 text-indigo-400" />,
      time: isBlank ? '—' : crackTimesDisplay.offlineSlowHash,
      description: 'Stolen database hashed with modern KDFs (bcrypt, Argon2, scrypt, PBKDF2).',
      resilience: 'High',
    },
    {
      id: 'offline-fast',
      title: 'Offline (Fast Hash)',
      subtitle: '10 Billion guesses/sec',
      icon: <Cpu className="h-4 w-4 text-rose-400" />,
      time: isBlank ? '—' : crackTimesDisplay.offlineFastHash,
      description: 'Stolen database hashed with weak/fast algorithms (MD5, SHA-256, NTLM) on GPU rigs.',
      resilience: 'Low',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Estimated Cracking Resistance Across Attack Vectors
        </h3>
        <span className="text-[11px] text-slate-500">
          zxcvbn Mathematical Benchmark Models
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition-all hover:border-slate-700 hover:bg-slate-900"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-slate-800/80 p-1.5 border border-slate-700/60">
                    {scenario.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">
                      {scenario.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {scenario.subtitle}
                    </span>
                  </div>
                </div>
              </div>

              <div className="my-2">
                <span className="text-lg font-bold tracking-tight text-white capitalize">
                  {scenario.time}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              {scenario.description}
            </p>
          </div>
        ))}
      </div>

      {/* Approximate nature disclaimer as required by prompt */}
      <div className="flex items-start gap-2 rounded-lg border border-slate-800/80 bg-slate-950/40 p-2.5 text-xs text-slate-400">
        <AlertCircle className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Disclaimer: </strong>
          Cracking time estimates are mathematical approximations based on standardized attacker hardware models. Real-world resilience depends heavily on the target service's hashing algorithm, cost/work factors (e.g. Argon2 memory cost), salting strategy, and whether attacker clusters utilize specialized ASICs or distributed botnets.
        </p>
      </div>
    </div>
  );
};
