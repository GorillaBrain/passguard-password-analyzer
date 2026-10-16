import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Key, Lock, Cpu, Users } from 'lucide-react';

export const EducationalSection: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string>('nist');

  const topics = [
    {
      id: 'nist',
      title: 'NIST SP 800-63B Modern Guidelines',
      icon: <ShieldCheck className="h-4 w-4 text-cyan-400" />,
      tag: 'Standards',
    },
    {
      id: 'math',
      title: 'Entropy & Cracking Mathematics',
      icon: <Cpu className="h-4 w-4 text-indigo-400" />,
      tag: 'Theory',
    },
    {
      id: 'stuffing',
      title: 'Password Reuse & Credential Stuffing',
      icon: <Users className="h-4 w-4 text-rose-400" />,
      tag: 'Threat Vector',
    },
    {
      id: 'mfa',
      title: 'Multi-Factor Authentication Hierarchy',
      icon: <Key className="h-4 w-4 text-emerald-400" />,
      tag: 'Defense',
    },
    {
      id: 'hashing',
      title: 'Cryptographic Hashing & KDFs',
      icon: <Lock className="h-4 w-4 text-amber-400" />,
      tag: 'Engineering',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400 border border-cyan-500/30">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Cybersecurity Knowledge &amp; Cryptographic Foundations
            </h2>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Curated reference architecture and educational concepts for modern authentication security, identity protection, and defensive system design.
            </p>
          </div>
        </div>

        {/* Topic navigation pills */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
          {topics.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTopic(t.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTopic === t.id
                  ? 'border border-cyan-500/40 bg-cyan-500/20 text-cyan-300 shadow-sm'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {t.icon}
              <span>{t.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Panes */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        {activeTopic === 'nist' && (
          <article className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                NIST Special Publication 800-63B: Digital Identity Guidelines
              </h3>
              <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-500/20">
                Official Standard
              </span>
            </div>

            <p>
              For decades, enterprise security policies enforced legacy composition rules: requiring users to include at least one uppercase letter, one digit, and one special symbol, while forcing password changes every 60 or 90 days.
            </p>

            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5">
              <h4 className="font-semibold text-rose-300 mb-1">
                The Failure of Legacy Composition Rules
              </h4>
              <p className="text-slate-400">
                Extensive empirical research demonstrated that arbitrary composition rules do not increase entropy; instead, they force human users into predictable behavioral patterns. Users predictably capitalize the first letter, append a single digit or current year, and end with an exclamation mark (e.g., <code className="text-rose-200 font-mono">Password1!</code> or <code className="text-rose-200 font-mono">Summer2024!</code>). Forced periodic rotation also encourages trivial single-character increments (<code className="text-rose-200 font-mono">Pass1!</code> &rarr; <code className="text-rose-200 font-mono">Pass2!</code>).
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5">
              <h4 className="font-semibold text-emerald-300 mb-1">
                Modern NIST SP 800-63B Recommendations
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><strong className="text-white">Length Over Complexity:</strong> Support passwords up to 64+ characters, allowing spaces so users can adopt multi-word passphrases.</li>
                <li><strong className="text-white">Blacklist Checking:</strong> Verify new credentials against databases of breached and commonly compromised passwords (e.g., dictionary lists).</li>
                <li><strong className="text-white">No Arbitrary Rotation:</strong> Passwords should only be forced to change when there is credible evidence of compromise.</li>
                <li><strong className="text-white">No Knowledge-Based Security Questions:</strong> Eliminate answers to maternal maiden names or high schools, which are readily discoverable via open-source intelligence (OSINT).</li>
              </ul>
            </div>
          </article>
        )}

        {activeTopic === 'math' && (
          <article className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                Information Theory, Combinatorics, and Password Entropy
              </h3>
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20">
                Mathematical Foundations
              </span>
            </div>

            <p>
              In information theory, <strong>entropy</strong> measures the unpredictability or information content of a secret, expressed in bits. An entropy of <em>H</em> bits implies an attacker must test an average of 2<sup>H-1</sup> attempts (and at most 2<sup>H</sup>) to locate the password through exhaustive enumeration.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                <h4 className="font-semibold text-cyan-300 mb-1">Character-Pool Entropy (Naive)</h4>
                <div className="font-mono text-cyan-400 my-1">H = L &times; log<sub>2</sub>(|R|)</div>
                <p className="text-slate-400">
                  Where $L$ is password length and $|R|$ is the alphabet size (e.g. 95 printable ASCII chars). This formula naively assumes every character was chosen uniformly at random. In reality, human passwords almost never exhibit uniform randomness.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                <h4 className="font-semibold text-emerald-300 mb-1">Diceware Passphrase Entropy</h4>
                <div className="font-mono text-emerald-400 my-1">H = W &times; log<sub>2</sub>(N)</div>
                <p className="text-slate-400">
                  Where $W$ is the number of words and $N$ is the dictionary size (7,776 words for EFF wordlists). Because each word is selected with genuine cryptographic uniform randomness, each word guarantees:
                  <br />
                  <code className="text-emerald-300 font-mono">log<sub>2</sub>(7776) &asymp; 12.92 bits</code> of true entropy.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3.5">
              <h4 className="font-semibold text-white mb-1">Why 5 Words Beat 10 Random Characters</h4>
              <p className="text-slate-400">
                A 5-word Diceware passphrase guarantees ~64.6 bits of entropy. To crack it offline at 10 billion guesses/second requires:
                <br />
                <code className="text-cyan-300 font-mono">2<sup>64.6</sup> / (10<sup>10</sup> guesses/sec &times; 31,536,000 sec/yr) &asymp; 78 years</code> of continuous computing power, while being effortless for humans to type and remember!
              </p>
            </div>
          </article>
        )}

        {activeTopic === 'stuffing' && (
          <article className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                Credential Stuffing &amp; The Threat of Password Reuse
              </h3>
              <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-300 border border-rose-500/20">
                Real-World Threat
              </span>
            </div>

            <p>
              Even the strongest 30-character cryptographic password becomes worthless if it is reused across multiple platforms.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <h4 className="font-semibold text-rose-400 mb-1">How Credential Stuffing Works</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 mt-2">
                <li><strong className="text-white">Breach Occurrence:</strong> A poorly protected forum or e-commerce shop gets breached. Its user database containing email and password pairs is leaked or sold on dark web forums.</li>
                <li><strong className="text-white">Compilation &amp; Normalization:</strong> Threat actors aggregate billions of compromised pairs into large comb databases (e.g. Collection #1-5, RockYou2024).</li>
                <li><strong className="text-white">Automated Bot Swarms:</strong> Attackers load the credentials into automated credential-stuffing suites (OpenBullet, SilverBullet) routed through residential proxy networks.</li>
                <li><strong className="text-white">Account Takeover (ATO):</strong> Because ~65% of users reuse passwords across accounts, bots successfully authenticate into high-value targets (banking, crypto exchanges, cloud consoles, primary email accounts).</li>
              </ol>
            </div>

            <p className="text-slate-400">
              <strong className="text-cyan-300">Defense Mandate: </strong>
              Every account must possess a unique credential. A password manager is an absolute requirement for modern digital hygiene.
            </p>
          </article>
        )}

        {activeTopic === 'mfa' && (
          <article className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                Multi-Factor Authentication (MFA) Security Hierarchy
              </h3>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/20">
                Defense In Depth
              </span>
            </div>

            <p>
              MFA requires two or more distinct authentication factors: something you know (password), something you have (security key/phone), or something you are (biometrics). Not all MFA mechanisms are equally secure:
            </p>

            <div className="space-y-2.5">
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-rose-300">Tier 3 (Weakest): SMS &amp; Voice OTP</h4>
                  <span className="text-[10px] text-rose-400 font-mono">Vulnerable to Interception</span>
                </div>
                <p className="text-slate-400">
                  Susceptible to SIM swapping attacks, SS7 cellular protocol interception, and social engineering at cellular carrier retail stores. Better than no MFA, but inadequate for high-value targets.
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-amber-300">Tier 2: TOTP Authenticator Apps (RFC 6238)</h4>
                  <span className="text-[10px] text-amber-400 font-mono">Strong &amp; Local</span>
                </div>
                <p className="text-slate-400">
                  Time-based One-Time Passwords generated locally using shared HMAC secrets (Aegis, 2FAS, Bitwarden). Works 100% offline without cellular dependency. Vulnerable only to real-time reverse-proxy phishing (e.g., Evilginx2).
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-emerald-300">Tier 1 (Gold Standard): FIDO2 / WebAuthn &amp; Passkeys</h4>
                  <span className="text-[10px] text-emerald-400 font-mono">Phishing-Resistant</span>
                </div>
                <p className="text-slate-400">
                  Hardware tokens (YubiKey, Titan) and platform Passkeys. Cryptographically binds authentication challenges to the browser's TLS origin URL. Even if a user enters credentials on a fake phishing replica, the hardware key refuses to sign the challenge for the spoofed domain. Completely defeats adversary-in-the-middle phishing!
                </p>
              </div>
            </div>
          </article>
        )}

        {activeTopic === 'hashing' && (
          <article className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                Cryptographic Hashing Algorithms &amp; Key Derivation Functions
              </h3>
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/20">
                Backend Architecture
              </span>
            </div>

            <p>
              When a backend database is breached, the attacker gains access to stored password hashes. The algorithm chosen by system architects determines whether the hashes are broken in seconds or survive for centuries.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl border border-rose-500/30 bg-slate-950/60 p-3.5">
                <h4 className="font-semibold text-rose-400 mb-1">
                  Fast Hashes (NEVER use for passwords)
                </h4>
                <div className="text-[11px] text-slate-400 mb-1">MD5, SHA-1, SHA-256, NTLM</div>
                <p className="text-slate-400">
                  Designed to verify file integrity and calculate signatures at gigabytes per second. A standard multi-GPU cracking rig (8x NVIDIA RTX 4090) calculates over <strong className="text-rose-300">200 billion NTLM hashes per second</strong>. Unsalted or single-round fast hashes offer virtually zero protection.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-slate-950/60 p-3.5">
                <h4 className="font-semibold text-emerald-400 mb-1">
                  Slow Adaptive KDFs (Industry Standard)
                </h4>
                <div className="text-[11px] text-slate-400 mb-1">Argon2id, bcrypt, scrypt, PBKDF2</div>
                <p className="text-slate-400">
                  Purpose-built to be computationally expensive and memory-hard. Argon2id (winner of the Password Hashing Competition) forces an attacker to dedicate substantial physical RAM per guess, neutralizing massively parallel GPU and ASIC attack acceleration.
                </p>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};
