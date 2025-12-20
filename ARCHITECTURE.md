# Architecture Documentation

## Project Goals

Build a modern, accessible digital prayer book that:
1. Preserves the traditional Orthodox content from the Jordanville Prayer Book
2. Enhances readability with proper typography and formatting
3. Makes Orthodox terminology accessible through interactive glossaries
4. Supports both light and dark modes for comfortable reading
5. Works on all devices (desktop, tablet, mobile)

## Key Architecture Decisions

### 1. Data Format: Enhanced JSON

**Decision**: Use JSON with annotations instead of JSX/MDX for prayer content

**Rationale**:
- Content remains separate from code
- Human-readable and editable
- Searchable and query-able
- Can generate multiple outputs (web, PDF, audio)
- Easy to version control

**Format**:
```typescript
interface PrayerBlock {
  type: 'title' | 'instruction' | 'heading' | 'prayer' | 'response' | 'psalm'
  content: string
  dropCap?: boolean
  annotations?: Annotation[]
}

interface Annotation {
  term: string
  type: 'glossary' | 'link' | 'saint' | 'scripture'
  definition?: string
  href?: string
  saintId?: string
  scriptureRef?: string
}
```

### 2. Content Processing Pipeline

**Source → Parsed → Cleaned → Annotated**

1. **Source**: `jordanville_prayerbook.txt` (OCR from PDF)
2. **Parsed**: Extract sections using TOC
3. **Cleaned**: Fix OCR errors, parse into structured blocks
4. **Annotated**: Add glossary terms and metadata

**Scripts**:
- `parse-prayerbook.ts` - Extract sections from source
- `clean-prayers.ts` - Clean and structure content
- `add-annotations.ts` - Add glossary annotations

### 3. Component Architecture

**Core Components**:

```
AppLayout (provides sidebar navigation)
├── PrayerList (home page, browse by category)
└── PrayerViewer
    ├── PrayerText (renders blocks)
    │   └── AnnotatedText (handles glossary tooltips)
```

**Design Principles**:
- Use shadcn/ui components exclusively (no custom UI)
- Pure Tailwind CSS (no custom CSS except when absolutely necessary)
- Component composition over complex props
- TypeScript for all components

### 4. Styling Approach

**Tailwind-first**:
- All styling uses Tailwind utility classes
- Dark mode handled via Tailwind's dark: variant
- Typography uses Tailwind's font utilities
- Drop caps: `first-letter:` pseudo-class utilities

**Theme System**:
- shadcn/ui color tokens (--background, --foreground, --primary, etc.)
- System/light/dark mode support
- Colors use OKLCH color space for better perceptual uniformity

### 5. Type System

**Key Types**:
- `PrayerBlock` - Content structure
- `Annotation` - Glossary/reference metadata
- `PrayerCategory` - Prayer categorization
- `PrayerSection` - Section metadata

**Philosophy**:
- Strict TypeScript for all code
- Shared types in `src/types/`
- Component-specific types inline
- No `any` types

## Content Strategy

### Prayer Block Types

1. **title** - Major section headings (MORNING PRAYERS)
2. **psalm** - Psalm headings (PSALM 50)
3. **heading** - Prayer names (Prayer of Saint Basil)
4. **instruction** - Italicized directions ("Then pause a moment...")
5. **prayer** - The actual prayer text
6. **response** - Liturgical responses ("Glory to the Father...")

### Annotation Types

1. **glossary** - Orthodox terminology (Theotokos, Trisagion)
2. **saint** - References to saints (Saint Basil the Great)
3. **scripture** - Biblical references (Psalm 50, Lord's Prayer)
4. **link** - Internal cross-references (future feature)

### Glossary System

**Current**: Central glossary in `src/data/glossary.ts`

**Future Considerations**:
- Could expand to separate glossary page
- Add search/browse functionality
- Link to saint biographies
- Cross-reference between prayers

## Data Flow

```
User selects prayer
    ↓
PrayerViewer loads content
    ↓
Try: section-X-annotated.json (with glossary)
    ↓ (fallback)
Try: section-X-cleaned.json (structured, no glossary)
    ↓ (fallback)
Load: section-X.txt (plain text)
    ↓
PrayerText renders blocks
    ↓
AnnotatedText adds tooltips
```

## Future Extensibility

### Planned Enhancements

1. **Search** - Full-text search across all prayers
2. **Bookmarks** - Save favorite prayers
3. **Daily Readings** - Show appropriate prayers for date
4. **Audio** - Text-to-speech or recordings
5. **Cross-references** - Link related prayers
6. **Personal Notes** - User annotations
7. **Print-friendly** - Generate PDF versions

### Architecture Supports

- **Search**: JSON content is easily searchable
- **Bookmarks**: Can store prayer IDs in localStorage
- **Daily Readings**: Can add calendar metadata to sections
- **Cross-references**: Link annotation type already defined
- **Notes**: Can extend annotation system

## Performance Considerations

1. **Bundle Size**:
   - Lazy load prayer content (not bundled)
   - shadcn/ui tree-shakeable
   - Code splitting by route (if we add routing)

2. **Load Time**:
   - Content loaded on-demand
   - Fallback cascade (annotated → cleaned → raw)
   - Static JSON files (fast)

3. **Runtime**:
   - React re-render optimization
   - Tooltip lazy rendering
   - Efficient annotation matching

## Testing Strategy

**Current**: Manual testing

**Future**:
- Unit tests for annotation matching
- Component tests for PrayerText rendering
- E2E tests for navigation flow
- Accessibility testing (WCAG compliance)

## Accessibility

**Current**:
- Semantic HTML (h1, h2, p tags)
- ARIA labels in tooltips
- Keyboard navigation (sidebar, tooltips)
- Color contrast (meets WCAG AA)
- Focus indicators

**Future**:
- Screen reader optimization
- Font size controls
- High contrast mode
- Skip links

## Browser Support

**Target**: Modern evergreen browsers
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

**Features Used**:
- CSS custom properties (--variables)
- CSS pseudo-selectors (::first-letter)
- ES2022 JavaScript
- Fetch API
- LocalStorage (theme persistence)
