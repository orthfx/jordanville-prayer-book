import * as fs from "fs";
import * as path from "path";

interface Section {
  title: string;
  pageNumber: number;
  content: string[];
}

interface ParsedContent {
  tableOfContents: Array<{ title: string; page: number }>;
  sections: Section[];
}

function parseTableOfContents(lines: string[]): Array<{ title: string; page: number }> {
  const toc: Array<{ title: string; page: number }> = [];
  let inTOC = false;
  let pendingTitle = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === "CONTENTS") {
      inTOC = true;
      continue;
    }

    // Stop when we hit the first major section (MORNING PRAYERS in all caps at start of line)
    if (inTOC && line.trim() === "MORNING PRAYERS") {
      break;
    }

    if (inTOC && line.trim()) {
      // Check if this line has a page number
      const pageMatch = line.match(/\s*\.+\s*(\d+)\s*$/);

      if (pageMatch) {
        // This line has a page number - extract title and page
        const titlePart = line.substring(0, pageMatch.index).trim();
        const fullTitle = pendingTitle ? `${pendingTitle} ${titlePart}` : titlePart;
        const page = parseInt(pageMatch[1]);

        toc.push({ title: fullTitle, page });
        pendingTitle = "";
      } else {
        // This line doesn't have a page number - it's part of a multi-line title
        pendingTitle = pendingTitle ? `${pendingTitle} ${line.trim()}` : line.trim();
      }
    }
  }

  return toc;
}

function normalizeTitle(title: string): string {
  return title
    .toUpperCase()
    .replace(/\s+/g, " ")
    .replace(/[.,\s]+$/g, "")
    .trim();
}

function extractSections(lines: string[], toc: Array<{ title: string; page: number }>): Section[] {
  const sections: Section[] = [];

  // Find where actual content starts (after TOC)
  let contentStartIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "MORNING PRAYERS") {
      contentStartIdx = i;
      break;
    }
  }

  // For each TOC entry, find its content
  for (let i = 0; i < toc.length; i++) {
    const currentEntry = toc[i];
    const nextEntry = toc[i + 1];

    const section: Section = {
      title: currentEntry.title,
      pageNumber: currentEntry.page,
      content: [],
    };

    // Normalize the current title for matching
    const normalizedCurrent = normalizeTitle(currentEntry.title);

    // Find where this section starts
    let sectionStart = -1;
    for (let j = contentStartIdx; j < lines.length; j++) {
      const line = lines[j].trim();
      const normalizedLine = normalizeTitle(line);

      // Check for exact match or if normalized line equals normalized title
      if (normalizedLine === normalizedCurrent || normalizedLine.startsWith(normalizedCurrent)) {
        sectionStart = j;
        break;
      }
    }

    if (sectionStart === -1) {
      console.log(`  ⚠ Could not find section: ${currentEntry.title}`);
      continue;
    }

    // Extract content until next section or end of file
    let sectionEnd = lines.length;
    if (nextEntry) {
      const normalizedNext = normalizeTitle(nextEntry.title);

      for (let j = sectionStart + 1; j < lines.length; j++) {
        const line = lines[j].trim();
        const normalizedLine = normalizeTitle(line);

        if (normalizedLine === normalizedNext || normalizedLine.startsWith(normalizedNext)) {
          sectionEnd = j;
          break;
        }
      }
    }

    // Collect content lines
    for (let j = sectionStart; j < sectionEnd; j++) {
      section.content.push(lines[j]);
    }

    console.log(`  ✓ Extracted ${currentEntry.title} (${section.content.length} lines)`);
    sections.push(section);
  }

  return sections;
}

function main() {
  const inputPath = path.join(process.cwd(), "jordanville_prayerbook.txt");
  const outputDir = path.join(process.cwd(), "src", "data");

  // Read the file
  const content = fs.readFileSync(inputPath, "utf-8");
  const lines = content.split("\n");

  console.log(`Read ${lines.length} lines from prayer book`);

  // Parse table of contents
  const toc = parseTableOfContents(lines);
  console.log(`\nFound ${toc.length} sections in table of contents:`);
  toc.forEach((entry) => {
    console.log(`  - ${entry.title} (page ${entry.page})`);
  });

  // Extract sections
  const sections = extractSections(lines, toc);
  console.log(`\nExtracted ${sections.length} sections`);

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save parsed content
  const parsed: ParsedContent = {
    tableOfContents: toc,
    sections: sections,
  };

  fs.writeFileSync(path.join(outputDir, "parsed-prayerbook.json"), JSON.stringify(parsed, null, 2));

  console.log(`\nSaved parsed content to ${path.join(outputDir, "parsed-prayerbook.json")}`);

  // Also save individual section files for easier management
  sections.forEach((section, idx) => {
    const filename = section.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    fs.writeFileSync(
      path.join(outputDir, `section-${idx + 1}-${filename}.txt`),
      section.content.join("\n"),
    );
  });

  console.log(`Saved ${sections.length} individual section files`);
}

main();
