# Jordanville Prayer Book

A digital Orthodox Christian prayer book app based on the Jordanville Prayer Book published by Holy Trinity Monastery.

## Overview

This app provides an accessible, beautifully formatted digital version of traditional Orthodox prayers with modern enhancements like:
- **Dark/Light mode** support
- **Interactive glossary** - hover over Orthodox terms to see definitions
- **Rich typography** - proper formatting with drop caps, headings, and spacing
- **Structured content** - prayers organized by category with easy navigation
- **Mobile-friendly** responsive design

## Tech Stack

- **Vite** - Fast development and build tool
- **React + TypeScript** - UI framework with type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible UI primitives (tooltips, dropdowns, etc.)

## Project Structure

```
jpb/
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AppLayout.tsx  # Main layout with sidebar
│   │   ├── PrayerText.tsx # Prayer rendering with annotations
│   │   └── AnnotatedText.tsx # Glossary tooltip system
│   ├── data/              # Prayer content
│   │   ├── section-*.txt  # Original extracted text
│   │   ├── section-*-cleaned.json  # Parsed and cleaned
│   │   ├── section-*-annotated.json # With glossary annotations
│   │   ├── prayer-index.ts # Section metadata
│   │   └── glossary.ts    # Orthodox terminology definitions
│   └── types/             # TypeScript type definitions
├── scripts/               # Content processing scripts
│   ├── parse-prayerbook.ts    # Extract sections from source
│   ├── clean-prayers.ts       # Clean OCR errors, parse structure
│   ├── clean-all-prayers.ts   # Batch process all sections
│   └── add-annotations.ts     # Add glossary annotations
└── jordanville_prayerbook.txt # Source text from PDF
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Key Features

### Content Processing Pipeline

1. **Source**: PDF → Text extraction → `jordanville_prayerbook.txt`
2. **Parsing**: Extract sections → `section-*.txt`
3. **Cleaning**: Fix OCR errors, parse structure → `section-*-cleaned.json`
4. **Enhancement**: Add glossary annotations → `section-*-annotated.json`

### Data Format

Enhanced JSON with annotations:

```json
{
  "type": "prayer",
  "content": "O Lord Jesus Christ...",
  "dropCap": true,
  "annotations": [
    {
      "term": "Theotokos",
      "type": "glossary",
      "definition": "Greek: God-bearer, title of Mary"
    }
  ]
}
```

### Prayer Categories

- **Morning Prayers** - Daily morning devotions
- **Evening Prayers** - Prayers before sleep
- **Liturgical Services** - Vespers, Matins, Divine Liturgy
- **Canons** - Devotional canons to Christ, Theotokos, Guardian Angel
- **Occasional Prayers** - Prayers throughout the day
- **Special Feasts** - Pascha, Passion Week, etc.

## Current Status

✅ **Completed:**
- Vite + React + TypeScript setup
- shadcn/ui component library integration
- Dark/light mode theming
- Content extraction and parsing (12 sections)
- OCR error correction
- Structured JSON format with block types
- Interactive glossary with tooltips
- Beautiful typography with drop caps
- Morning Prayers fully annotated

🚧 **In Progress:**
- Adding annotations to remaining sections
- Expanding glossary definitions

📋 **Planned:**
See [ROADMAP.md](./ROADMAP.md) for future features

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical decisions and data formats
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development guidelines for contributors
- **[ROADMAP.md](./ROADMAP.md)** - Future features and improvements

## License

Content from the Jordanville Prayer Book is used under fair use for religious and educational purposes. Original content published by Holy Trinity Monastery, Jordanville, NY.

Code is MIT licensed.
