import fs from 'fs';
import path from 'path';

async function main() {
  console.log('Fetching EFF large wordlist...');
  const res = await fetch('https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt');
  if (!res.ok) {
    throw new Error(`Failed to fetch EFF wordlist: ${res.statusText}`);
  }
  const text = await res.text();
  const words = text
    .trim()
    .split('\n')
    .map(line => {
      const parts = line.split('\t');
      return parts[1] ? parts[1].trim() : parts[0].trim();
    })
    .filter(Boolean);

  console.log(`Fetched ${words.length} words.`);
  if (words.length !== 7776) {
    console.warn(`Warning: expected 7776 words, got ${words.length}`);
  }

  const outDir = path.resolve('src/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outContent = `/**
 * Electronic Frontier Foundation (EFF) Large Wordlist for Diceware Passphrases
 * Source: https://www.eff.org/dice
 * License: Creative Commons Attribution 3.0 United States (CC BY 3.0 US)
 * Copyright (c) 2016 Electronic Frontier Foundation
 * Total Words: ${words.length} (approx 12.92 bits of entropy per word)
 */

export interface WordlistMetadata {
  name: string;
  author: string;
  sourceUrl: string;
  license: string;
  wordCount: number;
  entropyPerWord: number;
}

export const EFF_WORDLIST_METADATA: WordlistMetadata = {
  name: 'EFF Large Wordlist for Passphrases',
  author: 'Electronic Frontier Foundation (EFF)',
  sourceUrl: 'https://www.eff.org/dice',
  license: 'Creative Commons Attribution 3.0 United States (CC BY 3.0 US)',
  wordCount: ${words.length},
  entropyPerWord: Math.log2(${words.length}),
};

export const EFF_WORDLIST: readonly string[] = ${JSON.stringify(words, null, 2)} as const;
`;

  const targetPath = path.join(outDir, 'eff-wordlist.ts');
  fs.writeFileSync(targetPath, outContent, 'utf8');
  console.log(`Saved to ${targetPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
