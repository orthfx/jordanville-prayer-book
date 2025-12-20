import type { PrayerCategory } from '../types/prayer'

export interface PrayerSection {
  id: string
  title: string
  category: PrayerCategory
  fileName: string
  pageNumber: number
  description?: string
}

export const prayerSections: PrayerSection[] = [
  {
    id: 'morning-prayers',
    title: 'Morning Prayers',
    category: 'morning',
    fileName: 'section-1-morning-prayers',
    pageNumber: 7,
    description: 'Traditional Orthodox morning prayers to begin your day'
  },
  {
    id: 'prayers-during-day',
    title: 'Prayers during the Day',
    category: 'occasional',
    fileName: 'section-2-prayers-during-the-day',
    pageNumber: 35,
    description: 'Prayers for throughout the day'
  },
  {
    id: 'prayers-before-sleep',
    title: 'Prayers before Sleep',
    category: 'evening',
    fileName: 'section-3-prayers-before-sleep',
    pageNumber: 39,
    description: 'Evening prayers before retiring for the night'
  },
  {
    id: 'vespers',
    title: 'Selections from Vespers',
    category: 'liturgical',
    fileName: 'section-4-selections-from-vespers',
    pageNumber: 65,
    description: 'Selections from the evening liturgical service'
  },
  {
    id: 'matins',
    title: 'Selections from Matins',
    category: 'liturgical',
    fileName: 'section-5-selections-from-matins',
    pageNumber: 72,
    description: 'Selections from the morning liturgical service'
  },
  {
    id: 'divine-liturgy',
    title: 'The Divine Liturgy',
    category: 'liturgical',
    fileName: 'section-6-the-divine-liturgy',
    pageNumber: 97,
    description: 'The Divine Liturgy of St. John Chrysostom'
  },
  {
    id: 'sunday-troparia',
    title: 'Sunday Troparia and Kontakia',
    category: 'liturgical',
    fileName: 'section-7-sunday-troparia-and-kontakia',
    pageNumber: 144,
    description: 'Hymns for Sundays according to the tone'
  },
  {
    id: 'daily-troparia',
    title: 'Daily Troparia and Kontakia',
    category: 'liturgical',
    fileName: 'section-8-daily-troparia-and-kontakia',
    pageNumber: 151,
    description: 'Daily hymns and commemorations'
  },
  {
    id: 'passion-week',
    title: 'Passion Week Troparia',
    category: 'liturgical',
    fileName: 'section-9-passion-week-troparia',
    pageNumber: 182,
    description: 'Hymns for Holy Week'
  },
  {
    id: 'pascha',
    title: 'PASCHA',
    category: 'liturgical',
    fileName: 'section-10-pascha',
    pageNumber: 188,
    description: 'The Paschal service - the celebration of the Resurrection'
  },
  {
    id: 'guardian-angel',
    title: 'Canon to the Guardian Angel',
    category: 'canon',
    fileName: 'section-11-canon-to-the-guardian-angel',
    pageNumber: 250,
    description: 'Canon to your Guardian Angel'
  },
  {
    id: 'jesus-prayer',
    title: 'Concerning the Jesus Prayer',
    category: 'other',
    fileName: 'section-12-concerning-the-jesus-prayer',
    pageNumber: 400,
    description: 'Teaching on the Jesus Prayer'
  },
]

export function getSectionsByCategory(category: PrayerCategory): PrayerSection[] {
  return prayerSections.filter(section => section.category === category)
}

export function getSectionById(id: string): PrayerSection | undefined {
  return prayerSections.find(section => section.id === id)
}
