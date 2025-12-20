import * as fs from 'fs'
import * as path from 'path'

interface Annotation {
  term: string
  type: 'glossary' | 'link' | 'saint' | 'scripture'
  definition?: string
  href?: string
  saintId?: string
  scriptureRef?: string
}

interface PrayerBlock {
  type: 'title' | 'instruction' | 'heading' | 'prayer' | 'response' | 'psalm'
  content: string
  dropCap?: boolean
  annotations?: Annotation[]
}

// Key terms to annotate
const annotationRules: Array<{
  pattern: RegExp
  annotation: Omit<Annotation, 'term'>
}> = [
  {
    pattern: /Theotokos/gi,
    annotation: {
      type: 'glossary',
      definition: 'Greek: "God-bearer" or "Birth-giver of God". The title given to the Virgin Mary as the Mother of God.'
    }
  },
  {
    pattern: /Holy God, Holy Mighty, Holy Immortal/gi,
    annotation: {
      type: 'glossary',
      definition: 'The Trisagion (Thrice-Holy) prayer, one of the most ancient prayers in Orthodox worship.'
    }
  },
  {
    pattern: /Saint Basil the Great/gi,
    annotation: {
      type: 'saint',
      definition: 'One of the three Cappadocian Fathers (329-379 AD). Bishop, theologian, and monastic founder.',
      saintId: 'basil-the-great'
    }
  },
  {
    pattern: /St\. Macarius the Great|Saint Macarius the Great/gi,
    annotation: {
      type: 'saint',
      definition: 'Egyptian desert father (c. 300-391 AD), one of the great monastics and spiritual teachers of early Christianity.',
      saintId: 'macarius-the-great'
    }
  },
  {
    pattern: /Guardian Angel/gi,
    annotation: {
      type: 'glossary',
      definition: 'In Orthodox tradition, each person is believed to have an angel assigned by God to watch over and guide them through life.'
    }
  },
  {
    pattern: /Symbol of the Orthodox Faith/gi,
    annotation: {
      type: 'glossary',
      definition: 'The Nicene-Constantinopolitan Creed, the statement of Christian faith formulated at the Councils of Nicaea (325) and Constantinople (381).'
    }
  },
  {
    pattern: /PSALM 50/gi,
    annotation: {
      type: 'scripture',
      definition: 'A penitential psalm attributed to King David, written after his sin with Bathsheba. Also known as Psalm 51 in Western numbering.',
      scriptureRef: 'Psalm 50 (51)'
    }
  },
  {
    pattern: /Our Father, Who art in the heavens/gi,
    annotation: {
      type: 'scripture',
      definition: "The Lord's Prayer, taught by Jesus Christ to His disciples (Matthew 6:9-13, Luke 11:2-4).",
      scriptureRef: 'Matthew 6:9-13'
    }
  },
  {
    pattern: /Prayer of the Publican/gi,
    annotation: {
      type: 'scripture',
      definition: 'From the parable of the Pharisee and the Publican (Luke 18:9-14), a model of humble repentance.',
      scriptureRef: 'Luke 18:13'
    }
  },
  {
    pattern: /Holy Trinity/gi,
    annotation: {
      type: 'glossary',
      definition: 'The central mystery of Christian faith: One God in three Persons - Father, Son, and Holy Spirit.'
    }
  },
  {
    pattern: /Heavenly King/gi,
    annotation: {
      type: 'glossary',
      definition: 'A title for the Holy Spirit, the third Person of the Holy Trinity, invoked as the Comforter.'
    }
  },
  {
    pattern: /Troparia/gi,
    annotation: {
      type: 'glossary',
      definition: 'Short hymns or verses sung or recited in Orthodox services. Plural of troparion.'
    }
  }
]

function addAnnotations(block: PrayerBlock): PrayerBlock {
  if (typeof block.content !== 'string') {
    return block
  }

  const annotations: Annotation[] = []
  const content = block.content

  // Find all matching terms
  for (const rule of annotationRules) {
    const matches = content.matchAll(rule.pattern)
    for (const match of matches) {
      if (match[0]) {
        // Check if this term is already annotated
        const existing = annotations.find(a => a.term === match[0])
        if (!existing) {
          annotations.push({
            term: match[0],
            ...rule.annotation
          })
        }
      }
    }
  }

  if (annotations.length > 0) {
    return {
      ...block,
      annotations
    }
  }

  return block
}

function main() {
  const inputPath = path.join(process.cwd(), 'src/data/section-1-morning-prayers-cleaned.json')
  const outputPath = path.join(process.cwd(), 'src/data/section-1-morning-prayers-annotated.json')

  console.log('Reading morning prayers...')
  const blocks: PrayerBlock[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))

  console.log(`Processing ${blocks.length} blocks...`)
  const annotatedBlocks = blocks.map(addAnnotations)

  // Count annotations
  const totalAnnotations = annotatedBlocks.reduce((sum, block) => {
    return sum + (block.annotations?.length || 0)
  }, 0)

  console.log(`Added ${totalAnnotations} annotations`)

  // Show breakdown by type
  const byType: Record<string, number> = {}
  annotatedBlocks.forEach(block => {
    block.annotations?.forEach(ann => {
      byType[ann.type] = (byType[ann.type] || 0) + 1
    })
  })

  console.log('\nAnnotations by type:')
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count}`)
  })

  // Save annotated version
  fs.writeFileSync(outputPath, JSON.stringify(annotatedBlocks, null, 2))
  console.log(`\nSaved annotated version to ${outputPath}`)

  // Show some examples
  console.log('\nExample annotations:')
  const examples = annotatedBlocks
    .filter(b => b.annotations && b.annotations.length > 0)
    .slice(0, 3)

  examples.forEach(block => {
    console.log(`\n  Block type: ${block.type}`)
    block.annotations?.forEach(ann => {
      console.log(`    "${ann.term}" (${ann.type})`)
    })
  })
}

main()
