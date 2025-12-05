# CLAUDE.md

This file provides guidance for Claude Code when working on this project.

## Project Overview

**Lee-Su-Threads** is a browser extension (Chrome & Firefox) that automatically displays location info for Threads post authors without visiting each profile. It intercepts Threads API responses to extract and cache user profile data.

## Tech Stack

- **Browser Extension Manifest V3** (Chrome & Firefox)
- **Vanilla JavaScript** (no frameworks)
- **Vitest** for testing

## Project Structure

```
├── manifest.json          # Chrome extension manifest
├── manifest.firefox.json  # Firefox extension manifest
├── background.js          # Service worker
├── content.js             # Content script (injects injected.js)
├── injected.js            # Main logic (runs in page context)
├── popup.html/js          # Extension popup UI
├── styles.css             # Injected styles
├── lib/
│   └── profileParser.js   # Profile parsing logic (testable module)
├── test/
│   ├── profileParser.test.js
│   └── fixtures/          # Test fixtures (.txt files with API responses)
└── _locales/              # i18n translations
    ├── zh_TW/messages.json  # Traditional Chinese (default)
    ├── zh_CN/messages.json  # Simplified Chinese
    ├── en/messages.json     # English
    ├── ja/messages.json     # Japanese
    └── ko/messages.json     # Korean
```

## Cross-Browser Compatibility

**IMPORTANT:** Always use `browserAPI` instead of `chrome.*` or `browser.*` directly.

All JS files define a compatibility layer at the top:

```javascript
const browserAPI = typeof browser !== "undefined" ? browser : chrome;
```

Use `browserAPI.storage`, `browserAPI.runtime`, `browserAPI.i18n`, etc.

## Localization

- Default locale is `zh_TW` (Traditional Chinese)
- Use `browserAPI.i18n.getMessage("key")` in JavaScript
- Use `__MSG_key__` in manifest.json
- Message keys are defined in `_locales/{locale}/messages.json`

### Adding a new locale

1. Create `_locales/{locale_code}/messages.json`
2. Copy structure from existing locale file
3. Translate all message values

## Key Concepts

### Profile Parsing

- Profiles are extracted from Threads API responses
- Position-based parsing: Joined = 1st pair, Location = 2nd pair
- Supports multiple languages (EN, ZH, JA) with full-width parentheses

### Caching

- Profile data cached in `browserAPI.storage.local`
- Cache expires after 72 hours
- User ID → username mapping cached separately (30 days)

## Commands

```bash
npm test        # Run tests once
npm run test:watch  # Run tests in watch mode
```

## Code Style

- Use ES modules (`import`/`export`)
- Keep parsing logic in `lib/` for testability
- Duplicate critical logic in `injected.js` (runs in page context, can't import modules)
