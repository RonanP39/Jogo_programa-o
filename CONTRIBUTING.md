# Contributing to Terras do Código

Thank you for your interest in contributing to **Terras do Código**! This guide will help you understand how to contribute effectively.

## Getting Started

1. **Fork** the repository and clone your fork locally.
2. **Install dependencies**: `npm install`
3. **Start the dev server**: `npm run dev`
4. Visit `http://localhost:5173` to see the game running locally.

## Before You Start

Please read [AGENTS.md](AGENTS.md) for a comprehensive overview of:
- Project architecture (monolithic App.jsx structure)
- Code conventions (naming patterns, bilingual strings)
- Game mechanics (XP, hearts, achievements, leagues)
- How to add chapters, achievements, and themes
- Important gotchas and development considerations

## Types of Contributions

### 🎮 Adding Game Content

**New Chapters**: Add educational programming concepts following the structure in [AGENTS.md](AGENTS.md#adding-a-new-chapter).

**New Achievements**: Expand the achievement system per [AGENTS.md](AGENTS.md#adding-a-new-achievement) guidelines.

**New Themes**: Add visual themes by updating the `TH` object and theme selector in the `Intro()` component.

**Quizzes**: Improve quiz questions in the `BONUS_QUIZ` object or refine AI-generated quiz logic.

### 🐛 Bug Fixes

- Check if the issue already exists.
- Describe the bug clearly: expected vs. actual behavior.
- Provide steps to reproduce.
- Test fixes locally before submitting a PR.

### 📝 Documentation

- Improve README, AGENTS.md, or contributing guides.
- Add inline code comments for complex game logic.
- Clarify unclear sections in existing documentation.

### 🎨 UI/UX Improvements

- Refine visual design (colors, spacing, animations).
- Improve accessibility (keyboard navigation, contrast, screen readers).
- Optimize responsiveness for mobile devices.

### ⚡ Performance & Code Quality

- Profile performance bottlenecks.
- Suggest refactoring patterns (if not major restructuring).
- Improve readability and maintainability.

## Submission Process

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix-name
```

### 2. Make Changes

- Follow the code conventions in [AGENTS.md](AGENTS.md#code-conventions).
- Keep changes focused and atomic (one feature per PR).
- Update bilingual strings if modifying UI text (Portuguese + English).
- Test thoroughly in both themes and languages.

### 3. Commit Messages

Use clear, descriptive commit messages:

```
feat: add chapter on recursion with tree traversal example
fix: correct XP calculation for boss challenge mode
docs: clarify achievement unlock conditions in AGENTS.md
style: improve readability of theme object definitions
```

### 4. Push & Create a Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a PR on GitHub. Include:
- **Description**: What does this PR do? Why?
- **Testing**: How did you test this? What browsers/devices?
- **Screenshots**: For UI changes, include before/after screenshots.
- **Checklist**: ✅ Tested locally | ✅ Bilingual strings updated | ✅ No breaking changes

## Testing Checklist

Before submitting your PR, verify:

- [ ] ✅ Game runs without console errors: `npm run dev`
- [ ] ✅ Feature works in both themes (dark, light, cyber)
- [ ] ✅ Feature works in both languages (Portuguese, English)
- [ ] ✅ Responsive on mobile (use DevTools)
- [ ] ✅ All bilingual strings updated (search for `ptLabel`/`enLabel`)
- [ ] ✅ No regression in existing chapters/achievements
- [ ] ✅ localStorage data persists correctly
- [ ] ✅ No console warnings or errors

## Important Guidelines

### Don't

- ❌ Split App.jsx into separate files (keep the monolithic structure).
- ❌ Add breaking changes to existing game mechanics without discussion.
- ❌ Forget bilingual strings (PT + EN required for all user-facing text).
- ❌ Commit to `main` directly; use feature branches and PRs.
- ❌ Add large external dependencies without consulting maintainers.

### Do

- ✅ Follow the naming conventions in [AGENTS.md](AGENTS.md#naming-patterns).
- ✅ Use the centralized theme object (`TH`) for all colors.
- ✅ Test in multiple browsers (Chrome, Firefox, Safari, Edge).
- ✅ Write clear commit messages and PR descriptions.
- ✅ Respond to PR review feedback promptly.

## Code Review Process

1. **Automated Checks**: GitHub Actions runs builds and deployment previews.
2. **Manual Review**: Maintainers review for code quality, game balance, and consistency.
3. **Feedback**: We'll suggest improvements or ask clarifying questions.
4. **Approval**: Once approved, your PR will be merged to `main`.
5. **Deployment**: Automatic deployment to GitHub Pages upon merge.

## Questions?

- 📖 Read [AGENTS.md](AGENTS.md) for technical deep-dives.
- 📖 Read [README.md](README.md) for game overview and features.
- 🐛 Open an issue to discuss features or report bugs.
- 💬 Comment on PRs to ask for clarification.

## Code of Conduct

This project is committed to providing a welcoming and inspiring community. Please be respectful, inclusive, and constructive in all interactions.

---

**Thank you for contributing to Terras do Código!** 🎮✨
