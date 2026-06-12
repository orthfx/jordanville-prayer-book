import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { PrayerText } from "./PrayerText";

interface PrayerBlock {
  type: "title" | "instruction" | "heading" | "prayer" | "response" | "psalm";
  content: string;
  dropCap?: boolean;
}

interface PrayerViewerProps {
  sectionId: string;
  title: string;
  fileName: string;
  description?: string;
}

export function PrayerViewer({ title, fileName, description }: PrayerViewerProps) {
  const [content, setContent] = useState<string | PrayerBlock[]>("");
  const [loading, setLoading] = useState(true);
  const [isStructured, setIsStructured] = useState(false);

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);

        // Try to load annotated JSON first
        const annotatedJsonPath = `/src/data/${fileName}-annotated.json`;
        try {
          const jsonResponse = await fetch(annotatedJsonPath);
          if (jsonResponse.ok) {
            const blocks = await jsonResponse.json();
            setContent(blocks);
            setIsStructured(true);
            return;
          }
        } catch {
          // Fall through to cleaned JSON
        }

        // Try to load cleaned JSON
        const cleanedJsonPath = `/src/data/${fileName}-cleaned.json`;
        try {
          const jsonResponse = await fetch(cleanedJsonPath);
          if (jsonResponse.ok) {
            const blocks = await jsonResponse.json();
            setContent(blocks);
            setIsStructured(true);
            return;
          }
        } catch {
          // Fall through to plain text
        }

        // Fall back to plain text
        const response = await fetch(`/src/data/${fileName}.txt`);
        const text = await response.text();
        setContent(text);
        setIsStructured(false);
      } catch (error) {
        console.error("Error loading prayer content:", error);
        setContent("Error loading content");
        setIsStructured(false);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [fileName]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-250px)] w-full">
          {isStructured && Array.isArray(content) ? (
            <PrayerText blocks={content} />
          ) : typeof content === "string" ? (
            <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed p-4">
              {content}
            </pre>
          ) : null}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
