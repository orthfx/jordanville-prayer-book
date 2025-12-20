export interface GlossaryTerm {
  term: string
  definition: string
  category?: 'person' | 'theological' | 'liturgical' | 'scriptural'
  aliases?: string[]
}

export const glossary: Record<string, GlossaryTerm> = {
  theotokos: {
    term: 'Theotokos',
    definition: 'Greek: "God-bearer" or "Birth-giver of God". The title given to the Virgin Mary as the Mother of God.',
    category: 'theological',
    aliases: ['Mother of God', 'Virgin Mary', 'Most Holy Theotokos']
  },
  trisagion: {
    term: 'Trisagion',
    definition: 'Greek: "Thrice-Holy". The prayer "Holy God, Holy Mighty, Holy Immortal, have mercy on us."',
    category: 'liturgical',
    aliases: ['Holy God']
  },
  troparia: {
    term: 'Troparia',
    definition: 'Short hymns or verses sung or recited in Orthodox services. Plural of troparion.',
    category: 'liturgical',
    aliases: ['Troparion']
  },
  kontakia: {
    term: 'Kontakia',
    definition: 'Short hymns that summarize the feast or saint being celebrated. Plural of kontakion.',
    category: 'liturgical',
    aliases: ['Kontakion']
  },
  'saint-basil': {
    term: 'Saint Basil the Great',
    definition: 'One of the three Cappadocian Fathers (329-379 AD). Bishop, theologian, and monastic founder. Author of the Divine Liturgy of Saint Basil.',
    category: 'person'
  },
  'saint-macarius': {
    term: 'Saint Macarius the Great',
    definition: 'Egyptian desert father (c. 300-391 AD), one of the great monastics and spiritual teachers of early Christianity.',
    category: 'person'
  },
  'guardian-angel': {
    term: 'Guardian Angel',
    definition: 'In Orthodox tradition, each person is believed to have an angel assigned by God to watch over and guide them through life.',
    category: 'theological'
  },
  'symbol-of-faith': {
    term: 'Symbol of the Orthodox Faith',
    definition: 'The Nicene-Constantinopolitan Creed, the statement of Christian faith formulated at the Councils of Nicaea (325) and Constantinople (381).',
    category: 'theological',
    aliases: ['Nicene Creed', 'Creed']
  },
  'psalm-50': {
    term: 'Psalm 50',
    definition: 'A penitential psalm attributed to King David, written after his sin with Bathsheba. Also known as Psalm 51 in Western numbering.',
    category: 'scriptural',
    aliases: ['Psalm 51']
  },
  'lords-prayer': {
    term: "Lord's Prayer",
    definition: 'The prayer taught by Jesus Christ to His disciples, beginning "Our Father, Who art in the heavens..."',
    category: 'scriptural',
    aliases: ['Our Father', 'Pater Noster']
  },
  publican: {
    term: 'Publican',
    definition: 'A tax collector in the time of Christ. The Prayer of the Publican ("O God, be merciful to me a sinner") comes from the parable in Luke 18:9-14.',
    category: 'scriptural'
  },
  'holy-trinity': {
    term: 'Holy Trinity',
    definition: 'The central mystery of Christian faith: One God in three Persons - Father, Son, and Holy Spirit.',
    category: 'theological',
    aliases: ['Trinity', 'Most Holy Trinity']
  },
  'holy-spirit': {
    term: 'Holy Spirit',
    definition: 'The third Person of the Holy Trinity, the Comforter promised by Christ, Who proceeds from the Father.',
    category: 'theological',
    aliases: ['Spirit of Truth', 'Comforter', 'Heavenly King']
  }
}

export function getGlossaryTerm(term: string): GlossaryTerm | undefined {
  const normalized = term.toLowerCase().trim()

  // Direct match
  if (glossary[normalized]) {
    return glossary[normalized]
  }

  // Check aliases
  for (const key in glossary) {
    const entry = glossary[key]
    if (entry.aliases?.some(alias => alias.toLowerCase() === normalized)) {
      return entry
    }
    if (entry.term.toLowerCase() === normalized) {
      return entry
    }
  }

  return undefined
}
