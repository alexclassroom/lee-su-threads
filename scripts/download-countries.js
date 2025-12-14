#!/usr/bin/env node

/**
 * Downloads country data from world_countries_lists and merges into a single JSON file
 * Source: https://github.com/stefangabos/world_countries
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://cdn.jsdelivr.net/npm/world_countries_lists@latest/data/countries';

// Languages we support
const LANGUAGES = {
  en: 'en',
  zh_TW: 'zh-tw',
  zh_CN: 'zh',
  ja: 'ja',
  ko: 'ko'
};

// Download JSON from URL
function downloadJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log('📥 Downloading country data from world_countries_lists...\n');

  // Download all languages
  const countryData = {};

  for (const [key, code] of Object.entries(LANGUAGES)) {
    const url = `${BASE_URL}/${code}/countries.json`;
    console.log(`Downloading ${key} (${code})... ${url}`);

    try {
      const data = await downloadJSON(url);
      countryData[key] = data;
      console.log(`✓ Downloaded ${data.length} countries for ${key}\n`);
    } catch (err) {
      console.error(`✗ Failed to download ${key}:`, err.message);
      process.exit(1);
    }
  }

  // Merge into single structure: { "US": { en: "United States", zh_TW: "美國", ... }, ... }
  console.log('🔄 Merging country data...\n');

  const merged = {};

  // Use English as the base
  for (const country of countryData.en) {
    const alpha2 = country.alpha2.toUpperCase();
    merged[alpha2] = {
      en: country.name
    };
  }

  // Add other languages
  for (const [langKey, countries] of Object.entries(countryData)) {
    if (langKey === 'en') continue; // Already added

    for (const country of countries) {
      const alpha2 = country.alpha2.toUpperCase();
      if (merged[alpha2]) {
        merged[alpha2][langKey] = country.name;
      }
    }
  }

  // Save to data/countries.json
  const dataDir = path.join(__dirname, '..', 'data');
  const outputPath = path.join(dataDir, 'countries.json');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf-8');

  console.log(`✓ Saved ${Object.keys(merged).length} countries to data/countries.json`);
  console.log('\nSample entries:');
  console.log('TW:', merged.TW);
  console.log('JP:', merged.JP);
  console.log('US:', merged.US);
  console.log('CN:', merged.CN);
  console.log('\n✅ Done!');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
