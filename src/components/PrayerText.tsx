import { AnnotatedText } from './AnnotatedText'

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

interface PrayerTextProps {
  blocks: PrayerBlock[]
}

export function PrayerText({ blocks }: PrayerTextProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-8 px-4 py-8">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'title':
            return (
              <h1
                key={index}
                className="text-4xl font-bold text-center mb-12"
              >
                <AnnotatedText text={block.content} annotations={block.annotations} />
              </h1>
            )

          case 'psalm':
            return (
              <h2
                key={index}
                className="text-2xl font-semibold text-center mt-12 mb-6"
              >
                <AnnotatedText text={block.content} annotations={block.annotations} />
              </h2>
            )

          case 'heading':
            return (
              <h3
                key={index}
                className="text-xl font-semibold mt-10 mb-4 text-primary"
              >
                <AnnotatedText text={block.content} annotations={block.annotations} />
              </h3>
            )

          case 'instruction':
            return (
              <p
                key={index}
                className="italic text-muted-foreground text-sm leading-relaxed mb-6"
              >
                <AnnotatedText text={block.content} annotations={block.annotations} />
              </p>
            )

          case 'response':
            return (
              <p
                key={index}
                className="text-sm text-muted-foreground italic pl-8 my-3"
              >
                <AnnotatedText text={block.content} annotations={block.annotations} />
              </p>
            )

          case 'prayer':
            const lines = block.content.split('\n')
            return (
              <div key={index} className="font-serif text-base leading-loose mb-6">
                {lines.map((line, lineIndex) => (
                  <p
                    key={lineIndex}
                    className={`mb-2 ${
                      block.dropCap && lineIndex === 0
                        ? 'first-letter:float-left first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:leading-[0.9] first-letter:text-primary'
                        : ''
                    }`}
                  >
                    <AnnotatedText text={line} annotations={block.annotations} />
                  </p>
                ))}
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
