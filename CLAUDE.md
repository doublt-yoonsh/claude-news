# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude News is an automated daily briefing system that collects, summarizes, and publishes Claude Code / Anthropic news in three languages (Korean, English, Japanese). It runs as a zero-build Docsify static site hosted on GitHub Pages.

**Live site:** https://doublt-yoonsh.github.io/claude-news/

## Key Commands

```bash
# Publish after generating briefings (regenerates sidebars, updates cover page, commits & pushes)
./publish.sh

# Trigger Slack notification manually via GitHub Actions
gh workflow run slack-briefing.yml
```

There is no build step — Docsify renders markdown client-side via CDN.

## Architecture

### Automation Flow

```
runCLAUDErun (macOS, Sonnet) → WebSearch → Generate 3 briefings → publish.sh → GitHub Pages
```

1. **runCLAUDErun** triggers Claude Code daily with the prompt in `docs/briefing-prompt.md`
2. Claude Code searches web sources (hada.io, GitHub releases, Anthropic blog) for news from the last 7 days
3. Reads last 5 briefings for duplicate exclusion
4. Writes briefings to `briefings/`, `en/briefings/`, `ja/briefings/` as `briefing-YYYY-MM-DD.md`
5. `publish.sh` regenerates `_sidebar.md` files (month-grouped, newest first), updates `_coverpage.md` with latest date, and pushes to `main`
6. GitHub Actions posts a Slack summary at 10:10 KST daily

### Content Structure (per briefing, ~140 lines)

Release summary table → New features with code examples → Workflow tips → Security/limitations → Ecosystem & plugins → Community news → Minor changes

### Multi-Language Strategy

Single research pass generates all 3 versions simultaneously (not literal translations):
- **Korean** (`briefings/`): 합니다체, technical terms in English
- **English** (`en/briefings/`): Professional, accessible tone
- **Japanese** (`ja/briefings/`): です/ます体, katakana for technical terms

## Key Files

| File | Purpose |
|------|---------|
| `docs/briefing-prompt.md` | Complete prompt template for briefing generation (collection rules, duplicate logic, formatting) |
| `docs/setup-history.md` | Architecture decisions and implementation timeline |
| `publish.sh` | Sidebar generation, cover page update, git push automation |
| `index.html` | Docsify config, dark theme CSS, pagination, GA4 tracking |
| `_coverpage.md` | Landing page (auto-updated by publish.sh) |
| `scripts/keytar-preload.js` | Mock keytar for Claude Code OAuth in CI/CD |

## GitHub Actions Workflows

- **`slack-briefing.yml`**: Daily cron (01:10 UTC / 10:10 KST) — extracts latest briefing, posts Slack block message via webhook
- **`test-claude-oauth.yml`**: Manual trigger — validates Claude Code OAuth tokens in CI using mock keytar

## Git Conventions

- Briefing commit message format: `Add daily briefing for YYYY-MM-DD`
- **Co-Authored-By 절대 금지** — never include Co-Authored-By lines in commits
- Always push to `main` branch
