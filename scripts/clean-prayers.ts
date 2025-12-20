import * as fs from 'fs'
import * as path from 'path'

interface PrayerBlock {
  type: 'title' | 'instruction' | 'heading' | 'prayer' | 'response' | 'psalm'
  content: string
  dropCap?: boolean
}

function cleanText(text: string): string {
  let cleaned = text

  // Remove page numbers (e.g., "-8-", "-34-")
  cleaned = cleaned.replace(/^-\d+-$/gm, '')

  // Fix common OCR errors
  // Replace 0 with O at start of words (common prayer beginning)
  cleaned = cleaned.replace(/\b0\s/g, 'O ')

  // Fix specific known errors
  cleaned = cleaned.replace(/sl,eep/g, 'sleep')
  cleaned = cleaned.replace(/Hims\.elf/g, 'Himself')
  cleaned = cleaned.replace(/he\.art/g, 'heart')
  cleaned = cleaned.replace(/grac~/g, 'grace')
  cleaned = cleaned.replace(/g~tes/g, 'gates')
  cleaned = cleaned.replace(/N aine/g, 'Name')
  cleaned = cleaned.replace(/Christ_/g, 'Christ')

  // Fix drop cap artifacts - more comprehensive
  cleaned = cleaned.replace(/J\\s\s+I\s+/g, 'As I ')
  cleaned = cleaned.replace(/J-\\\.\.?\s+0\s+/gm, 'O ')
  cleaned = cleaned.replace(/J-\\\.\.\s+O\s+/gm, 'O ')
  cleaned = cleaned.replace(/^H\s+ave\s+/gm, 'Have ')
  cleaned = cleaned.replace(/^R\s+emember\s+/gm, 'Remember ')

  // Fix split words after drop caps
  cleaned = cleaned.replace(/\nJ-\\\.\.\s+/gm, '')

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+$/gm, '') // trailing spaces
  cleaned = cleaned.replace(/\n\n\n+/g, '\n\n') // multiple blank lines

  return cleaned
}

function parseIntoBlocks(text: string): PrayerBlock[] {
  const lines = text.split('\n')
  const blocks: PrayerBlock[] = []
  let currentBlock: PrayerBlock | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (!line) {
      // Empty line - finish current block
      if (currentBlock) {
        blocks.push(currentBlock)
        currentBlock = null
      }
      continue
    }

    // Detect block types
    if (line === 'MORNING PRAYERS' || line.match(/^PSALM \d+$/)) {
      // Title or Psalm heading
      if (currentBlock) blocks.push(currentBlock)
      blocks.push({
        type: line.startsWith('PSALM') ? 'psalm' : 'title',
        content: line
      })
      currentBlock = null
    } else if (line.match(/^(Prayer|Troparia|Song|Troparion|Prayerful Invocation|For the Living|For the Departed|Final Prayer|The Prayer of|The Beginning Prayer|The Symbol of)/)) {
      // Prayer heading
      if (currentBlock) blocks.push(currentBlock)
      currentBlock = {
        type: 'heading',
        content: line
      }
    } else if (line.match(/^(Having risen|Then |And if)/)) {
      // Instruction
      if (currentBlock && currentBlock.type === 'instruction') {
        currentBlock.content += ' ' + line
      } else {
        if (currentBlock) blocks.push(currentBlock)
        currentBlock = {
          type: 'instruction',
          content: line
        }
      }
    } else if (line.match(/^(Glory to the Father|Lord, have mercy|O come let us worship|Bow\.?)/)) {
      // Liturgical response
      if (currentBlock) blocks.push(currentBlock)
      blocks.push({
        type: 'response',
        content: line
      })
      currentBlock = null
    } else {
      // Regular prayer text
      const isDropCap = i > 0 && blocks[blocks.length - 1]?.type === 'heading'

      if (currentBlock && currentBlock.type === 'prayer') {
        currentBlock.content += '\n' + line
      } else {
        if (currentBlock) blocks.push(currentBlock)
        currentBlock = {
          type: 'prayer',
          content: line,
          dropCap: isDropCap
        }
      }
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock)
  }

  return blocks
}

function main() {
  const inputPath = path.join(process.cwd(), 'src/data/section-1-morning-prayers.txt')
  const outputPath = path.join(process.cwd(), 'src/data/section-1-morning-prayers-cleaned.json')

  console.log('Reading morning prayers...')
  const rawText = fs.readFileSync(inputPath, 'utf-8')

  console.log('Cleaning text...')
  const cleanedText = cleanText(rawText)

  console.log('Parsing into structured blocks...')
  const blocks = parseIntoBlocks(cleanedText)

  console.log(`Found ${blocks.length} blocks:`)
  const typeCounts = blocks.reduce((acc, block) => {
    acc[block.type] = (acc[block.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count}`)
  })

  // Save structured data
  fs.writeFileSync(outputPath, JSON.stringify(blocks, null, 2))
  console.log(`\nSaved structured data to ${outputPath}`)

  // Also save cleaned plain text
  const cleanedPath = path.join(process.cwd(), 'src/data/section-1-morning-prayers-cleaned.txt')
  fs.writeFileSync(cleanedPath, cleanedText)
  console.log(`Saved cleaned text to ${cleanedPath}`)
}

main()
