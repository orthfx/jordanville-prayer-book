export interface Prayer {
  id: string;
  title: string;
  content: string;
  category: PrayerCategory;
  order?: number;
  metadata?: {
    source?: string;
    occasion?: string;
    notes?: string;
  };
}

export type PrayerCategory =
  | "morning"
  | "evening"
  | "communion"
  | "akathist"
  | "canon"
  | "occasional"
  | "liturgical"
  | "other";

export interface PrayerSection {
  id: string;
  title: string;
  category: PrayerCategory;
  prayers: Prayer[];
}

// Enhanced prayer content types
export type AnnotationType = "glossary" | "link" | "saint" | "scripture";

export interface Annotation {
  term: string;
  type: AnnotationType;
  definition?: string;
  href?: string;
  saintId?: string;
  scriptureRef?: string;
}

export interface TextSegment {
  text: string;
  annotation?: Annotation;
}

export interface EnhancedPrayerContent {
  text: string;
  segments?: TextSegment[];
}

export interface EnhancedPrayerBlock {
  type: "title" | "instruction" | "heading" | "prayer" | "response" | "psalm";
  content: string | EnhancedPrayerContent;
  dropCap?: boolean;
  annotations?: Annotation[];
}
