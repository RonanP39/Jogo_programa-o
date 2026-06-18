# Terras do Código — AI Agent Onboarding Guide

**Terras do Código** ("Lands of Code") is an interactive narrative RPG that teaches programming concepts through story-driven gameplay, choices, quizzes, and code challenges.

## Quick Start

```bash
npm install
npm run dev      # Local dev server on http://localhost:5173
npm run build    # Production build for GitHub Pages
npm run preview  # Preview production build
```

Deployment is automatic to GitHub Pages via CI/CD. Live at: https://RonanP39.github.io/Jogo_programa-o

## Architecture Overview

⚠️ **Single-file monolithic architecture**: The entire application is in `src/App.jsx` (~2042 lines). This is intentional for rapid development and GitHub Pages deployment.

### Core Structure

```
src/
├── App.jsx          # Monolithic app component with all game logic + UI
├── main.jsx         # React entry point (11 lines)
└── index.css        # Global styles (27 lines, minimal)
```

### Component Organization (within App.jsx)

The component is internally organized as a **phase-based router** with dozens of sub-components:

- **Phase Functions** (UI screens):
  - `WelcomeScreen()` — Initial onboarding
  - `Intro()` — Main menu & settings
  - `SkillPath()` — Chapter selection (skill tree)
  - `Reading()` — Narrative scenes
  - `Chosen()` — Choice results & consequences
  - `ConceptCard()` — Concept teaching
  - `FixBug()` — Code debugging challenges
  - `Sandbox()` — Code execution environment
  - `Quiz()` — Quizzes (AI-generated via Anthropic Claude)
  - `BossChallenge()` — Mini-boss battles
  - `ProfileScreen()` — Player stats & achievements
  - `LeaguesScreen()` — Competitive rankings
  - `MapScreen()` — Chapter map visualization
  - `CertificateScreen()` — Achievement certificates

- **Top-level state** (in `AppInner()`):
  - Game phase, current chapter/scene
  - Player progress (XP, hearts, gems, streaks, inventory)
  - Settings (language, theme)
  - Achievements, leaderboard scores

### Styling Approach

**No CSS classes.** All styling is inline via `style={{}}` objects with a centralized theme object:

```javascript
const TH = {
  dark: { bg: "#1a1810", am: "#EF9F27", tx: "#e0d4b4", ... },
  light: { bg: "#f0e8d0", ... },
  cyber: { bg: "#04040e", ... }
}
```

Apply theme with: `style={{...TH[themeName], ...additionalStyles}}`

## Code Conventions

### Naming Patterns

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `Reading`, `Quiz`, `ProfileScreen` |
| Functions | camelCase | `handleChoice`, `updateStreak`, `achieve` |
| Constants | SCREAMING_SNAKE_CASE | `SCENES`, `BOSSES`, `MAX_HEARTS` |
| Theme abbr. | Single letter `T` | `T[themeName].bg` |
| Strings abbr. | Function `S()` | `S(uiLabel)` → selects based on language |

### Bilingual Implementation

The game supports Portuguese (PT) and English (EN). Use the `S()` helper function or object property access:

```javascript
const obj = {
  ptLabel: "Começar",
  enLabel: "Start"
}
const text = S(obj)  // Returns ptLabel or enLabel based on settings.lang

// For settings selection:
if (settings.lang === "pt") { ... }
```

### Data Organization

All game data is hardcoded as module-level objects in App.jsx:

- **`SCENES`** — 22+ chapter definitions (narrative text, choices, XP rewards)
- **`BOSSES`** — Mini-boss challenge definitions
- **`BUGS`** — Code debugging challenges
- **`XP_LEVELS`** — Progression system (20 levels with cumulative XP thresholds)
- **`CAREER_PATHS`** — 4 specializations (all, frontend, backend, data)
- **`LEAGUES`** — 6 competitive tiers
- **`ACH_IDS`** & **`ACH_ICONS`** — 17 achievement definitions
- **`ANIM_STEPS`** — Code execution animations for sandbox
- **`UI`** — Bilingual UI strings and labels

### Key Game Mechanics

- **XP System**: 20 levels with cumulative thresholds. `updateXp()` handles progression.
- **Hearts (Lives)**: 5-heart system. Regenerates 1 heart every 4 hours. Can buy with gems.
- **Gems**: In-game currency. Earned from achievements, can buy hearts.
- **Daily Goals**: 3 difficulty tiers. Streak tracking across days.
- **Leagues**: Weekly XP-based ranking system (6 tiers).
- **Achievements**: 17 badges with unlock conditions. Tracked via `ACH_IDS`.
- **Inventory**: Collects items per chapter. Visual inventory display in `ProfileScreen`.
- **Multiplayer**: Local hot-seat mode for same-screen play.

### Local Storage Keys

```javascript
"tdc_save"       // User settings (theme, language, difficulty)
"tdc_inv"        // Inventory (collected items)
"tdc_ach"        // Achievements unlocked
"tdc_xp"         // Total XP
"tdc_daily_xp"   // Daily progress tracking
"tdc_hearts"     // Hearts system state + regeneration timer
"tdc_lb"         // Leaderboard scores
"tdc_tourney"    // Tournament records
```

## Adding Content

### Adding a New Chapter

1. Add entry to `SCENES` array with structure:
   ```javascript
   {
     id: "chapter_X",
     title: { ptTitle: "...", enTitle: "..." },
     concept: { ptConcept: "...", enConcept: "..." },
     scene_text: [{ ptText: "...", enText: "..." }, ...],
     choices: [{ ptText: "...", enText: "...", xp: 10 }, ...],
     quiz: { question: "...", options: [...], correct: 0 },
     rewards: { xp: 50, hearts: 1, gem: 2, item: "..." }
   }
   ```

2. Update `SkillPath()` to include chapter in the skill tree UI.

3. Add quiz questions to `BONUS_QUIZ` for AI-generated variant.

### Adding a New Achievement

1. Add ID to `ACH_IDS` array.
2. Add icon mapping to `ACH_ICONS` object.
3. Add unlock condition logic in relevant phase function (e.g., `handleChoice()`, `PassQuiz()`).
4. Call `achieve(id)` when condition is met.

### Adding a New Theme

1. Add theme object to `TH` with color definitions.
2. Update theme selector in `Intro()` component.
3. Test responsiveness across all components.

## Important Gotchas

1. **Monolithic size**: App.jsx is 2042 lines. Refactoring into separate files is out of scope for this guide — keep all changes within the single file for now.

2. **No test infrastructure**: There are no automated tests. Manually verify gameplay flow, choice consequences, and XP calculations before commit.

3. **External API dependency**: Quiz generation uses Anthropic Claude API. Requests require valid API key in environment. If API fails, quizzes degrade gracefully.

4. **localStorage-only persistence**: No backend. Game state lives in localStorage. Clear cache to reset player progress.

5. **GitHub Pages deployment**: App base path is `/Jogo_programa-o/`. Relative URLs must account for subpath routing.

6. **Bilingual strings scattered**: Search for `ptLabel`/`ptText` + `enLabel`/`enText` to find all user-facing strings. Update both when changing UI text.

7. **Theme applied inline**: To change default theme colors, edit `TH` object at module level. No CSS classes to override.

## Build & Deployment

- **Vite config** (`vite.config.js`): Simple setup with React plugin and GitHub Pages base path.
- **GitHub Actions**: Automatic deployment on `main` branch push.
- **Build output**: Vite generates `dist/` folder. Committed to `gh-pages` branch via CI/CD.

## Technologies

- **React 18.3.1** — UI framework
- **Vite 5.4.2** — Bundler & dev server
- **@vitejs/plugin-react 4.3.1** — Fast Refresh + JSX transpilation
- **Anthropic Claude API** — AI-generated quiz questions
- **Tabler Icons** — Icon font for UI
- **GitHub Pages** — Static hosting

## Resources

- [README.md](README.md) — Game overview, features, and how to play
- [SECURITY.md](SECURITY.md) — Security policy
- [Vite Docs](https://vitejs.dev) — Build configuration
- [React Docs](https://react.dev) — Framework documentation

---

**Last Updated**: June 2026  
**For questions**: Check the README or open an issue on GitHub.
