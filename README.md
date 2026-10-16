# PassGuard — Privacy-First Password Strength Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-0%25%20Zero-emerald.svg)](#privacy-first-threat-model)
[![NIST SP 800-63B Aligned](https://img.shields.io/badge/Standard-NIST%20SP%20800--63B-cyan.svg)](#nist-sp-800-63b-alignment)
[![Tests Passing](https://img.shields.io/badge/Tests-27%20Passed-brightgreen.svg)](#automated-testing)
[![Built with Vite + React](https://img.shields.io/badge/Stack-React%2019%20%7C%20TypeScript%20%7C%20Vite%20%7C%20Tailwind-blueviolet.svg)](#technology-stack)

> **PassGuard** is a high-performance, privacy-first cybersecurity web application engineered to evaluate password resilience, uncover heuristic patterns, and generate cryptographically secure Diceware passphrases. Designed as a **Computer System Security undergraduate portfolio project**, it bridges practical software engineering with information-theoretic authentication defense.

---

## Live Deployment & Repository

- **Live Web Application:** [https://passguard-password-analyzer-iota.vercel.app](https://passguard-password-analyzer-iota.vercel.app)
- **GitHub Repository:** [https://github.com/GorillaBrain/passguard-password-analyzer](https://github.com/GorillaBrain/passguard-password-analyzer)

---

## Key Features

### 1. Heuristic Password Strength Analyzer
- **Real-Time Evaluation:** Analyzes passwords instantaneously in browser memory as you type.
- **Cognitive Rating:** Categorizes strength from **Very Weak (0)** to **Very Strong (4)** with visual segmented meters and high-contrast color coding.
- **Pattern & Vulnerability Detection:**
  - Common leaked password matches (RockYou / leak databases).
  - Standard English dictionary words and surnames.
  - Spatial keyboard walks (QWERTY / QWERTZ / Dvorak / keypad paths).
  - Repeated character sequences (e.g., `aaaaaa`).
  - Predictable numerical sequences (e.g., `123456`, `fedcba`).
  - Leetspeak and character substitution mutations (e.g., `@` for `a`, `0` for `o`).
- **Mathematical Guessing Difficulty Models:**
  - Online (Throttled): 100 guesses/hour (rate-limited web endpoints with lockouts).
  - Online (Unthrottled): 10 guesses/sec (unprotected APIs).
  - Offline (Slow Hash): 10,000 guesses/sec (Argon2id, bcrypt cost 12, PBKDF2).
  - Offline (Fast Hash): 10,000,000,000 guesses/sec (MD5, SHA-256, NTLM on modern GPU rigs).
- **The "Entropy Reality Gap":** Directly compares naive character-pool entropy ($L \times \log_2(|R|)$) against dictionary-aware guessing entropy ($\log_2(G)$), educating users on why complex-looking strings like `P@ssword1!` fail against modern attackers.

### 2. Cryptographically Secure Diceware Passphrase Generator
- **WebCrypto PRNG:** Utilizes `window.crypto.getRandomValues()` exclusively; strictly avoids biased pseudo-random functions like `Math.random()`.
- **Zero-Modulo-Bias Rejection Sampling:** Employs mathematically rigorous 32-bit rejection sampling ($2^{32} \pmod{7776}$) to ensure every dictionary word has an identical, uniform probability of selection ($\frac{1}{7776}$).
- **Bundled Wordlist:** Pre-packaged with the **Electronic Frontier Foundation (EFF) Large Wordlist** (7,776 curated, phonetically distinct English words).
- **Customizable Entropy:**
  - Word count selector (3 to 8 words, producing 38.7 to 103.3 bits of true entropy).
  - Separator options: Hyphen (`-`), Underscore (`_`), Period (`.`), Space (` `), Slash (`/`), or Random Digit.
  - Case formatting: lowercase, Title Case, or UPPERCASE.
  - Optional inclusion of random digits and symbols.
- **One-Click Analysis Handoff:** "Analyze in Password Meter" button sends generated passphrases directly to the analyzer for instant verification.

### 3. Personal Security Hygiene Checklist
- Interactive audit of essential account defenses:
  - Zero password reuse.
  - Length-over-complexity discipline (NIST SP 800-63B).
  - Multi-Factor Authentication hierarchy (TOTP / FIDO2 WebAuthn).
  - Password manager adoption (Bitwarden, KeePassXC).
  - OSINT vulnerability mitigation for security questions.
  - Emergency MFA recovery code preservation.

### 4. Cybersecurity Educational Center
- **NIST SP 800-63B vs. Legacy Composition Rules:** Why arbitrary symbol requirements and periodic 90-day resets reduce actual security.
- **The Mathematics of Password Cracking:** Shannon entropy, combinatorial search spaces, and GPU cluster throughput.
- **Credential Stuffing & Password Reuse:** How single-site breaches cascade across unrelated services via automated botnets.
- **Multi-Factor Authentication Hierarchy:** Risk comparison between SMS/Voice OTP, TOTP Authenticator apps, and phishing-resistant FIDO2/WebAuthn hardware keys.
- **Modern Key Derivation Functions (KDFs):** Why fast hashes (MD5, SHA-256) are disastrous for passwords and how memory-hard algorithms (Argon2id, bcrypt) protect breached databases.

---

## Privacy-First Threat Model & Architecture

PassGuard is architected from the ground up under the principle of **Zero Knowledge & Zero Telemetry**:

| Security Dimension | PassGuard Implementation |
| :--- | :--- |
| **Network Requests** | **0 Requests.** No external API calls, no cloud telemetry, no analytics. |
| **Storage Persistence** | **0 Bytes.** Passwords are never written to `localStorage`, `sessionStorage`, `IndexedDB`, or cookies. |
| **Memory Isolation** | Credentials exist strictly in ephemeral React component state and are wiped upon clicking **Reset**. |
| **Content Security Policy** | Enforced via `<meta http-equiv="Content-Security-Policy">` restricting network connections to `'self'`. |
| **Offline Capability** | 100% functional without an active internet connection after initial asset load. |

### How to Audit Isolation Yourself
1. Press <kbd>F12</kbd> (or right-click &rarr; *Inspect*) to open Developer Tools.
2. Select the **Network** tab and filter by **Fetch/XHR**.
3. Type any password into PassGuard or generate passphrases.
4. Verify that **zero network requests** are dispatched.
5. In the console, inspect `localStorage.length` and `sessionStorage.length`; observe both return `0`.

---

## Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler & Build Tool:** Vite 8 (Rolldown)
- **Styling:** Tailwind CSS v4 (Custom dark navy cybersecurity palette)
- **Estimation Engine:** `@zxcvbn-ts/core`, `@zxcvbn-ts/language-common`, `@zxcvbn-ts/language-en`
- **Iconography:** Lucide Icons & inline SVGs
- **Test Runner:** Vitest + `@testing-library/react` + `@testing-library/jest-dom`
- **Hosting:** Vercel (Hobby Free Tier)

All dependencies are **100% free and open-source**. No paid APIs, proprietary fonts, or third-party tracking services are included.

---

## Installation & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GorillaBrain/passguard-password-analyzer.git
   cd passguard-password-analyzer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

---

## Automated Testing

PassGuard includes an automated test suite executed with **Vitest**:

```bash
npm test
```

### Test Coverage Highlights
- `src/test/analyzer.test.ts`:
  - Empty string handling and default states.
  - Top common password detection (RockYou / leak list).
  - Spatial keyboard walk detection (QWERTZ / QWERTY).
  - Repeated character sequences (`aaaaaaaaa`).
  - Sequential character series (`fedcba`).
  - Diceware multi-word passphrase scoring ($Score = 4$).
  - Leetspeak mutation detection (`P@ssw0rd`).
  - Character metrics and NIST suggestion generation.
- `src/test/generator.test.ts`:
  - WebCrypto integer generation within exact bounds $[0, N-1]$.
  - Rejection of invalid parameter inputs ($\le 0$).
  - Word count bounds (clamping between 3 and 8).
  - Separator insertion (`-`, `_`, `.`, ` `, `/`).
  - Capitalization transformations (`lowercase`, `capitalize`, `uppercase`).
  - Digit and symbol inclusion.
  - Information-theoretic entropy calculation ($N \times \log_2(7776)$).
- `src/test/privacy.test.ts`:
  - Storage cleanliness verification (`localStorage`, `sessionStorage`, `document.cookie`).
  - Network isolation assertion (`window.fetch` and `XMLHttpRequest` call count $= 0$).
  - Zero sensitive console logging (`console.log`, `info`, `debug`).
  - State reset completeness.
- `src/test/components.test.tsx`:
  - Component rendering and DOM tree stability.
  - Password visibility toggle (`password` &harr; `text`).
  - Reset button clearing behavior.
  - Clipboard write interaction and copied feedback.
  - Checklist item toggling and score counter calculation.

---

## Security Limitations & Threat Model

While PassGuard provides realistic strength estimation, no password strength estimator can predict every attack scenario:

1. **Compromised Client Devices:** If a user's machine is infected with kernel-level rootkits, keyloggers, or malicious browser extensions with broad DOM access, entered credentials can be intercepted before analysis.
2. **Targeted OSINT Attacks:** Dictionary estimators evaluate general wordlists. Targeted attackers who research a victim's family names, pet names, anniversaries, and hobbies can generate specialized wordlists (e.g. using `Cewl` or `Cupp`) that crack personalized passwords faster than generalized models estimate.
3. **Approximation of Cracking Times:** Hardware capabilities evolve rapidly. Cracking time estimates assume standardized reference speeds (e.g., 10 GH/s for fast hashes). State-sponsored adversaries or multi-million-dollar ASIC clusters may achieve significantly higher rates.
4. **Offline Breach Resilience:** Even a 20-character password is vulnerable to offline cracking if a service stores passwords in unsalted, single-iteration MD5 or SHA-1. Modern password resistance depends on both user passphrase length *and* server-side KDF configuration (Argon2id, bcrypt).

---

## Wordlist & Dependency Attribution

- **EFF Large Wordlist for Passphrases:**
  - Published by the [Electronic Frontier Foundation (EFF)](https://www.eff.org/dice).
  - Licensed under the [Creative Commons Attribution 3.0 United States (CC BY 3.0 US)](https://creativecommons.org/licenses/by/3.0/us/).
  - Total Words: 7,776 curated words ($\approx 12.92$ bits of entropy per word).
- **@zxcvbn-ts Engine:**
  - TypeScript rewrite of Dropbox's `zxcvbn` library.
  - Licensed under the MIT License.
  - Dictionaries: Common passwords, US/UK census surnames, English dictionary, and spatial keyboard graphs.
- **Lucide Icons:**
  - Community-maintained fork of Feather Icons.
  - Licensed under the ISC License.

---

## Future Improvements

- [ ] Web Workers for asynchronous off-thread calculation of long passphrases on ultra-low-power mobile devices.
- [ ] Exportable, printable offline emergency recovery sheets (PDF/HTML formatted with zero external scripts).
- [ ] Multi-language Diceware wordlist support (Spanish, French, German, Japanese).
- [ ] Local k-Anonymity bloom filter support for offline breach comparison without API connectivity.

---

## Author & License

Developed by **WAN HAZMAN BIN WAN NOH** ([@GorillaBrain](https://github.com/GorillaBrain)) as a Computer System Security undergraduate portfolio project.

This project is open-source software licensed under the **[MIT License](LICENSE)**.
