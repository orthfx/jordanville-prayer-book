# Development Guide

## For AI Assistants (Claude, etc.)

When working on this project, keep these principles in mind:

### Core Principles

1. **Tailwind-first**: Use Tailwind utilities exclusively. No custom CSS unless absolutely necessary.
2. **shadcn/ui only**: Use shadcn components, not custom UI components
3. **TypeScript strict**: No `any` types, proper typing for all code
4. **Content as data**: Keep prayer content in JSON, not JSX/code
5. **Accessibility**: Maintain semantic HTML, ARIA labels, keyboard navigation

### Content Processing

**Adding new prayer sections**:

1. Ensure source text is in `jordanville_prayerbook.txt`
2. Run parser: `npx tsx scripts/parse-prayerbook.ts`
3. Run cleaner: `npx tsx scripts/clean-all-prayers.ts`
4. Run annotator: `npx tsx scripts/add-annotations.ts`
5. Update `src/data/prayer-index.ts` with new section metadata

**Adding glossary terms**:

1. Add to `src/data/glossary.ts`:

```typescript
export const glossary: Record<string, GlossaryTerm> = {
  "term-key": {
    term: "Display Name",
    definition: "Definition here",
    category: "theological" | "liturgical" | "scriptural" | "person",
    aliases: ["Alternative Name"],
  },
};
```

2. Add annotation rule to `scripts/add-annotations.ts`:

```typescript
{
  pattern: /Term Name/gi,
  annotation: {
    type: 'glossary',
    definition: 'Definition here'
  }
}
```

3. Re-run annotator on affected sections

### Component Development

**Creating new components**:

1. Use TypeScript (.tsx)
2. Import shadcn/ui components from `@/components/ui/`
3. Use Tailwind for all styling
4. Add proper TypeScript interfaces
5. Keep components focused (single responsibility)

**Example**:

```typescript
import { Card } from '@/components/ui/card'

interface MyComponentProps {
  title: string
  content: string
}

export function MyComponent({ title, content }: MyComponentProps) {
  return (
    <Card className="p-4 space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground">{content}</p>
    </Card>
  )
}
```

### Styling Guidelines

**Color system** (use these Tailwind classes):

- `text-foreground` / `bg-background` - Primary colors
- `text-muted-foreground` / `bg-muted` - Secondary/disabled
- `text-primary` / `bg-primary` - Accent color
- `border-border` - Borders
- Dark mode: automatically handled via `dark:` variants

**Typography**:

- Headings: `text-4xl`, `text-2xl`, `text-xl`
- Body: `text-base`, `text-sm`
- Fonts: Use default (system fonts) or `font-serif` for prayer text
- Line height: `leading-relaxed`, `leading-loose`

**Spacing**:

- Container: `max-w-3xl mx-auto`
- Padding: `p-4`, `px-6 py-4`
- Margins: `mb-6`, `mt-10`
- Gaps: `space-y-8`, `gap-4`

### Common Tasks

**Adding a new shadcn component**:

```bash
npx shadcn@latest add component-name
```

**Processing prayer content**:

```bash
# Parse sections from source
npx tsx scripts/parse-prayerbook.ts

# Clean all sections
npx tsx scripts/clean-all-prayers.ts

# Add annotations to specific section
npx tsx scripts/add-annotations.ts
```

**Running the dev server**:

```bash
vp dev
```

### Code Patterns

**Loading prayer content** (with fallback):

```typescript
// Try annotated → cleaned → raw
const annotatedPath = `/src/data/${fileName}-annotated.json`;
const cleanedPath = `/src/data/${fileName}-cleaned.json`;
const rawPath = `/src/data/${fileName}.txt`;
```

**Rendering with annotations**:

```typescript
<AnnotatedText
  text={content}
  annotations={block.annotations}
/>
```

**Dark mode aware components**:

```typescript
// Colors automatically adjust
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">Secondary text</p>
</div>
```

### Testing

**Manual testing checklist**:

- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Responsive on mobile
- [ ] Tooltips display correctly
- [ ] Sidebar navigation works
- [ ] Keyboard navigation works
- [ ] All prayer sections load

### Common Pitfalls

❌ **Don't**:

- Add custom CSS (use Tailwind)
- Create custom UI components (use shadcn)
- Put prayer content in JSX/code
- Use `text-muted-foreground` inside tooltips (breaks dark mode)
- Hardcode colors (use theme tokens)

✅ **Do**:

- Use Tailwind utilities
- Use shadcn/ui components
- Keep content in JSON
- Use opacity for subtle text in tooltips
- Use CSS variables for colors

### File Conventions

**Naming**:

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `camelCase.ts` or inline
- Data: `kebab-case.json` or `camelCase.ts`

**Imports**:

```typescript
// Use @ alias for src/
import { Component } from "@/components/Component";
import { type } from "@/types/prayer";
import { util } from "@/lib/utils";
```

### Git Workflow

**Commits**:

- Use conventional commits
- Be descriptive
- Keep commits focused

**Branches**:

- `main` - production-ready code
- Feature branches for development

### Questions?

**Architecture decisions**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
**Future features**: See [ROADMAP.md](./ROADMAP.md)
**Project overview**: See [README.md](./README.md)

## Content Wishlist

When adding new content, prioritize:

1. **Annotations**: Add more glossary terms to existing prayers
2. **Missing prayers**: Extract remaining sections from source
3. **Cross-references**: Link related prayers
4. **Metadata**: Add feast day info, liturgical colors, etc.
5. **Translations**: Consider Church Slavonic alongside English

## Performance

**Keep bundle small**:

- Prayer content loaded on-demand (not bundled)
- Use code splitting if adding routing
- Lazy load heavy components

**Optimize rendering**:

- Avoid unnecessary re-renders
- Use React.memo() for expensive components
- Keep state minimal and local

## Deployment

**Build for production**:

```bash
vp build
```

**Desktop / macOS app**:

```bash
vp run tauri:desktop:build
```

**iOS app**:

```bash
vp run tauri:ios:build
```

**Android app**:

```bash
vp run tauri:android:build
```

**Deploy/distribute to**:

- Web hosting: Netlify, Vercel, GitHub Pages, or self-hosted
- Desktop/mobile: Tauri build artifacts for macOS, iOS, and Android

**Environment**:

- No backend needed (static site)
- No environment variables needed
- All data in public/ directory
