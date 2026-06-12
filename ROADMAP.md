# Project Roadmap

## Current Status (v0.1)

✅ **Foundation Complete**

- React + Vite + TypeScript setup
- shadcn/ui component system
- Dark/light mode theming
- Content extraction pipeline
- 12 prayer sections parsed and cleaned
- Morning Prayers fully annotated with glossary
- Interactive tooltip system

## Short-term Goals (v0.2)

### Content Enhancement

- [ ] Add annotations to all 12 extracted sections
- [ ] Expand glossary to 50+ terms
- [ ] Extract remaining sections from source PDF
  - [ ] Akathist to Jesus (section 13)
  - [ ] Akathist to Theotokos (section 14)
  - [ ] Canon of Repentance (section 15)
  - [ ] Communion Prayers (section 16)
  - [ ] Other missing sections

### Glossary Improvements

- [ ] Add saint biographies (brief)
- [ ] Add scripture context for references
- [ ] Include pronunciation guides for Greek/Slavonic terms
- [ ] Add related terms links

### User Experience

- [ ] Font size controls
- [ ] Line spacing controls
- [ ] Serif/sans-serif toggle
- [ ] Text-to-speech option
- [ ] Print-friendly CSS

## Medium-term Goals (v0.3)

### Search & Discovery

- [ ] Full-text search across all prayers
- [ ] Filter by category
- [ ] Filter by feast day/occasion
- [ ] "Random prayer" feature
- [ ] Recently viewed prayers

### Personalization

- [ ] Bookmark favorite prayers
- [ ] Personal prayer collections
- [ ] Reading history
- [ ] User notes on prayers
- [ ] Export bookmarks/notes

### Navigation

- [ ] Breadcrumb navigation improvements
- [ ] Table of contents view
- [ ] Jump to section within prayer
- [ ] Previous/Next prayer buttons
- [ ] Keyboard shortcuts

## Long-term Goals (v1.0)

### Liturgical Calendar

- [ ] Daily readings based on Orthodox calendar
- [ ] Show appropriate troparia/kontakia for date
- [ ] Feast day notifications
- [ ] Moveable feasts calculation (Pascha)
- [ ] Fasting calendar integration

### Audio Features

- [ ] Professional prayer recordings
- [ ] Follow-along highlighting
- [ ] Adjustable speed
- [ ] Download for offline

### Additional Content

- [ ] Lives of Saints
- [ ] Biblical commentary
- [ ] Icon gallery
- [ ] Church Slavonic parallel text
- [ ] Greek text for selected prayers
- [ ] Historical notes on prayers

### Community Features

- [ ] Share prayers (links)
- [ ] Prayer requests board
- [ ] Discussion/reflection notes
- [ ] Shared collections

### App Distribution

- [x] Tauri v2 desktop/mobile scaffold
- [x] macOS desktop build target
- [x] iOS build target
- [x] Android build target
- [ ] Progressive Web App (PWA)
- [ ] Offline mode
- [ ] Push notifications for prayer times

## Future Possibilities (v2.0+)

### Advanced Features

- [ ] Multiple prayer book versions (Greek, Slavonic, etc.)
- [ ] Comparison view (different translations)
- [ ] Chant notation for sung prayers
- [ ] Video tutorials on prayer practice
- [ ] AI-powered prayer recommendations

### Accessibility

- [ ] Screen reader optimizations
- [ ] High contrast mode
- [ ] Dyslexia-friendly fonts
- [ ] Multiple language support
- [ ] Sign language videos

### Integration

- [ ] Parish calendar integration
- [ ] Liturgical book references
- [ ] Bible cross-references with inline text
- [ ] Sync across devices
- [ ] API for third-party apps

## Technical Debt

### Code Quality

- [ ] Add unit tests (Vitest)
- [ ] Add component tests (React Testing Library)
- [ ] Add E2E tests (Playwright)
- [ ] Improve TypeScript strictness
- [ ] Add ESLint rules

### Performance

- [ ] Code splitting by route
- [ ] Image optimization
- [ ] Bundle size analysis
- [ ] Lazy loading improvements
- [ ] Service worker for offline

### Documentation

- [ ] API documentation (if we add one)
- [ ] Component storybook
- [ ] Contribution guidelines
- [ ] Content formatting guide

## Non-Goals

What we're **not** planning:

- ❌ User authentication/accounts (keep it simple)
- ❌ Social media features
- ❌ Monetization/ads
- ❌ Proprietary content paywalls
- ❌ Complex CMS for content editing

## Contributing

Want to help? Priority areas:

1. **Content**: Add more annotations and glossary terms
2. **Accessibility**: Test with screen readers
3. **Translation**: Church Slavonic, Greek texts
4. **Design**: Improve typography and layout
5. **Testing**: Write tests for components

See [DEVELOPMENT.md](./DEVELOPMENT.md) for development guidelines.

## Release Schedule

**v0.2** - End of Q1 2025

- All sections annotated
- Enhanced glossary
- Basic search

**v0.3** - End of Q2 2025

- Liturgical calendar
- Bookmarks
- Audio recordings

**v1.0** - End of 2025

- Mobile apps
- Offline mode
- Full feature set

## Feedback

This roadmap is a living document. Features may be:

- Added based on user feedback
- Reprioritized based on impact
- Removed if not feasible

Have suggestions? Open an issue or discussion on GitHub.
