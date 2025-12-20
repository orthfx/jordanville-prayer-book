import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { BookOpen, User, Link as LinkIcon, Book } from 'lucide-react'

interface Annotation {
  term: string
  type: 'glossary' | 'link' | 'saint' | 'scripture'
  definition?: string
  href?: string
  saintId?: string
  scriptureRef?: string
}

interface AnnotatedTextProps {
  text: string
  annotations?: Annotation[]
}

export function AnnotatedText({ text, annotations }: AnnotatedTextProps) {
  if (!annotations || annotations.length === 0) {
    return <>{text}</>
  }

  // Sort annotations by term length (longest first) to handle overlapping terms
  const sortedAnnotations = [...annotations].sort((a, b) => b.term.length - a.term.length)

  // Build segments with annotations
  let remainingText = text
  const segments: Array<{ text: string; annotation?: Annotation }> = []

  while (remainingText.length > 0) {
    let foundMatch = false

    for (const annotation of sortedAnnotations) {
      const index = remainingText.indexOf(annotation.term)

      if (index === 0) {
        // Found an annotated term at the start
        segments.push({ text: annotation.term, annotation })
        remainingText = remainingText.slice(annotation.term.length)
        foundMatch = true
        break
      } else if (index > 0) {
        // Found an annotated term later in the text
        segments.push({ text: remainingText.slice(0, index) })
        segments.push({ text: annotation.term, annotation })
        remainingText = remainingText.slice(index + annotation.term.length)
        foundMatch = true
        break
      }
    }

    if (!foundMatch) {
      // No more annotations found
      segments.push({ text: remainingText })
      break
    }
  }

  return (
    <TooltipProvider>
      {segments.map((segment, index) => {
        if (!segment.annotation) {
          return <span key={index}>{segment.text}</span>
        }

        const { annotation } = segment
        const icon = getAnnotationIcon(annotation.type)

        return (
          <Tooltip key={index} delayDuration={300}>
            <TooltipTrigger asChild>
              <span className="underline decoration-dotted underline-offset-4 cursor-help text-primary hover:text-primary/80 transition-colors">
                {segment.text}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm p-4">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">{icon}</div>
                <div>
                  <div className="font-semibold text-sm mb-1">
                    {annotation.term}
                    {annotation.scriptureRef && (
                      <span className="ml-2 text-xs opacity-70">
                        ({annotation.scriptureRef})
                      </span>
                    )}
                  </div>
                  {annotation.definition && (
                    <div className="text-sm opacity-90">
                      {annotation.definition}
                    </div>
                  )}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        )
      })}
    </TooltipProvider>
  )
}

function getAnnotationIcon(type: Annotation['type']) {
  switch (type) {
    case 'glossary':
      return <BookOpen className="h-4 w-4" />
    case 'saint':
      return <User className="h-4 w-4" />
    case 'scripture':
      return <Book className="h-4 w-4" />
    case 'link':
      return <LinkIcon className="h-4 w-4" />
    default:
      return null
  }
}
