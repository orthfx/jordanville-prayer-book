import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { prayerSections, type PrayerSection } from "../data/prayer-index";
import { Button } from "./ui/button";
import { Sun, Moon, Church, Book, Calendar, FileText } from "lucide-react";

interface PrayerListProps {
  onSelectPrayer: (section: PrayerSection) => void;
}

export function PrayerList({ onSelectPrayer }: PrayerListProps) {
  const categories = [
    { id: "morning", title: "Morning Prayers", icon: Sun },
    { id: "evening", title: "Evening Prayers", icon: Moon },
    { id: "liturgical", title: "Liturgical Services", icon: Church },
    { id: "canon", title: "Canons", icon: Book },
    { id: "occasional", title: "Occasional Prayers", icon: Calendar },
    { id: "other", title: "Other", icon: FileText },
  ] as const;

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const sections = prayerSections.filter((s) => s.category === category.id);
        if (sections.length === 0) return null;

        return (
          <div key={category.id}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <category.icon className="h-6 w-6" />
              <span>{category.title}</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sections.map((section) => (
                <Card key={section.id} className="hover:bg-accent/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    {section.description && (
                      <CardDescription>{section.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => onSelectPrayer(section)}
                      variant="outline"
                      className="w-full"
                    >
                      View Prayer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
