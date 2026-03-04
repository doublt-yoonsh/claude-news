# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude News is an automated daily briefing system that collects, summarizes, and publishes Claude Code / Anthropic news in three languages (Korean, English, Japanese). It runs as an Astro static site hosted on GitHub Pages.

**Live site:** https://claude-news.today/

## Key Commands

```bash
# Local dev server
pnpm dev

# Build static site
pnpm build

# Preview built site
pnpm preview

# Publish: commit & push (GitHub Actions builds and deploys)
./publish.sh
```

## Architecture

### Automation Flow

```
runCLAUDErun (macOS, Sonnet) → WebSearch → Generate 3 briefings → publish.sh → GitHub Actions → GitHub Pages
```

1. **runCLAUDErun** triggers Claude Code daily with the prompt in `docs/briefing-prompt.md`
2. Claude Code searches web sources (hada.io, GitHub releases, Anthropic blog) for news from the last 7 days
3. Reads last 5 briefings for duplicate exclusion
4. Writes briefings to `src/content/ko/`, `src/content/en/`, `src/content/ja/` as `briefing-YYYY-MM-DD.md` (with frontmatter)
5. `publish.sh` commits and pushes to `main`
6. GitHub Actions runs `astro build` (generates HTML, sitemap, RSS, search index) and deploys to GitHub Pages

### Briefing Frontmatter Format

```yaml
---
title: "Claude Code 데일리 브리핑 - 2026-03-04"
date: 2026-03-04
lang: ko
---
```

### Content Structure (per briefing, ~140 lines)

Release summary table → New features with code examples → Workflow tips → Security/limitations → Ecosystem & plugins → Community news → Minor changes

### Multi-Language Strategy

Single research pass generates all 3 versions simultaneously (not literal translations):
- **Korean** (`src/content/ko/`): 합니다체, technical terms in English
- **English** (`src/content/en/`): Professional, accessible tone
- **Japanese** (`src/content/ja/`): です/ます体, katakana for technical terms

## Key Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro config: site URL, i18n, sitemap, pagefind |
| `src/content.config.ts` | Content Collections schema (ko, en, ja) |
| `src/layouts/BaseLayout.astro` | Shared layout: dark theme, GA4, sidebar |
| `src/pages/briefings/[slug].astro` | KO briefing dynamic route |
| `src/pages/en/briefings/[slug].astro` | EN briefing dynamic route |
| `src/pages/ja/briefings/[slug].astro` | JP briefing dynamic route |
| `src/pages/index.astro` | Cover page (landing) |
| `src/pages/rss.xml.ts` | KO RSS feed |
| `docs/briefing-prompt.md` | Prompt template for briefing generation |
| `publish.sh` | Git commit & push automation |
| `.github/workflows/deploy.yml` | Astro build → GitHub Pages deploy |

## GitHub Actions Workflows

- **`deploy.yml`**: On push to main — builds Astro site and deploys to GitHub Pages
- **`test-claude-oauth.yml`**: Manual trigger — validates Claude Code OAuth tokens in CI

## Git Conventions

- Briefing commit message format: `Add daily briefing for YYYY-MM-DD`
- **Co-Authored-By 절대 금지** — never include Co-Authored-By lines in commits
- Always push to `main` branch
