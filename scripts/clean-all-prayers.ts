import * as fs from "fs";
import * as path from "path";

interface PrayerBlock {
  type: "title" | "instruction" | "heading" | "prayer" | "response" | "psalm";
  content: string;
  dropCap?: boolean;
}

function cleanText(text: string): string {
  let cleaned = text;

  // Remove page numbers (e.g., "-8-", "-34-")
  cleaned = cleaned.replace(/^-\d+-$/gm, "");

  // Fix common OCR errors
  // Replace 0 with O at start of words (common prayer beginning)
  cleaned = cleaned.replace(/\b0\s/g, "O ");

  // Fix specific known errors
  cleaned = cleaned.replace(/sl,eep/g, "sleep");
  cleaned = cleaned.replace(/Hims\.elf/g, "Himself");
  cleaned = cleaned.replace(/he\.art/g, "heart");
  cleaned = cleaned.replace(/grac~/g, "grace");
  cleaned = cleaned.replace(/g~tes/g, "gates");
  cleaned = cleaned.replace(/N aine/g, "Name");
  cleaned = cleaned.replace(/Christ_/g, "Christ");

  // Fix drop cap artifacts - more comprehensive
  cleaned = cleaned.replace(/J\\s\s+I\s+/g, "As I ");
  cleaned = cleaned.replace(/J-\\\.\.?\s+0\s+/gm, "O ");
  cleaned = cleaned.replace(/J-\\\.\.\s+O\s+/gm, "O ");
  cleaned = cleaned.replace(/^H\s+ave\s+/gm, "Have ");
  cleaned = cleaned.replace(/^R\s+emember\s+/gm, "Remember ");

  // Fix split words after drop caps
  cleaned = cleaned.replace(/\nJ-\\\.\.\s+/gm, "");

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+$/gm, ""); // trailing spaces
  cleaned = cleaned.replace(/\n\n\n+/g, "\n\n"); // multiple blank lines

  return cleaned;
}

function parseIntoBlocks(text: string, sectionTitle: string): PrayerBlock[] {
  const lines = text.split("\n");
  const blocks: PrayerBlock[] = [];
  let currentBlock: PrayerBlock | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      // Empty line - finish current block
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    // Detect block types
    if (line === sectionTitle.toUpperCase() || line.match(/^PSALM \d+$/)) {
      // Title or Psalm heading
      if (currentBlock) blocks.push(currentBlock);
      blocks.push({
        type: line.startsWith("PSALM") ? "psalm" : "title",
        content: line,
      });
      currentBlock = null;
    } else if (
      line.match(
        /^(Prayer|Troparia|Song|Troparion|Prayerful Invocation|For the Living|For the Departed|Final Prayer|The Prayer of|The Beginning Prayer|The Symbol of)/,
      )
    ) {
      // Prayer heading
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        type: "heading",
        content: line,
      };
    } else if (line.match(/^(Having risen|Then |And if)/)) {
      // Instruction
      if (currentBlock && currentBlock.type === "instruction") {
        currentBlock.content += " " + line;
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = {
          type: "instruction",
          content: line,
        };
      }
    } else if (line.match(/^(Glory to the Father|Lord, have mercy|O come let us worship|Bow\.?)/)) {
      // Liturgical response
      if (currentBlock) blocks.push(currentBlock);
      blocks.push({
        type: "response",
        content: line,
      });
      currentBlock = null;
    } else {
      // Regular prayer text
      const isDropCap = i > 0 && blocks[blocks.length - 1]?.type === "heading";

      if (currentBlock && currentBlock.type === "prayer") {
        currentBlock.content += "\n" + line;
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = {
          type: "prayer",
          content: line,
          dropCap: isDropCap,
        };
      }
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
}

function processFile(inputPath: string, sectionTitle: string) {
  const fileName = path.basename(inputPath, ".txt");
  const outputDir = path.dirname(inputPath);

  console.log(`\nProcessing: ${fileName}`);

  // Read the file
  const rawText = fs.readFileSync(inputPath, "utf-8");

  // Clean text
  const cleanedText = cleanText(rawText);

  // Parse into structured blocks
  const blocks = parseIntoBlocks(cleanedText, sectionTitle);

  console.log(`  Found ${blocks.length} blocks`);

  // Save structured data
  const jsonPath = path.join(outputDir, `${fileName}-cleaned.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(blocks, null, 2));

  // Save cleaned plain text
  const cleanedPath = path.join(outputDir, `${fileName}-cleaned.txt`);
  fs.writeFileSync(cleanedPath, cleanedText);

  console.log(`  ✓ Saved cleaned files`);
}

function main() {
  const dataDir = path.join(process.cwd(), "src/data");

  // Find all section txt files (excluding already cleaned ones)
  const files = fs
    .readdirSync(dataDir)
    .filter((f) => f.startsWith("section-") && f.endsWith(".txt") && !f.includes("-cleaned"))
    .sort();

  console.log(`Found ${files.length} section files to process\n`);

  // Section titles mapping (you may need to adjust these)
  const sectionTitles: Record<string, string> = {
    "section-1-morning-prayers.txt": "MORNING PRAYERS",
    "section-2-prayers-during-the-day.txt": "PRAYERS DURING THE DAY",
    "section-3-prayers-before-sleep.txt": "PRAYERS BEFORE SLEEP",
    "section-4-selections-from-vespers.txt": "SELECTIONS FROM VESPERS",
    "section-5-selections-from-matins.txt": "SELECTIONS FROM MATINS",
    "section-6-the-divine-liturgy.txt": "THE DIVINE LITURGY",
    "section-7-sunday-troparia-and-kontakia.txt": "SUNDAY TROPARIA AND KONTAKIA",
    "section-8-daily-troparia-and-kontakia.txt": "DAILY TROPARIA AND KONTAKIA",
    "section-9-passion-week-troparia.txt": "PASSION WEEK TROPARIA",
    "section-10-pascha.txt": "PASCHA",
    "section-11-canon-to-the-guardian-angel.txt": "CANON TO THE GUARDIAN ANGEL",
    "section-12-concerning-the-jesus-prayer.txt": "CONCERNING THE JESUS PRAYER",
  };

  files.forEach((file) => {
    const filePath = path.join(dataDir, file);
    const title = sectionTitles[file] || file.replace(/\.txt$/, "").toUpperCase();
    processFile(filePath, title);
  });

  console.log("\n✅ All sections processed!");
}

main();
