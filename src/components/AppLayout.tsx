import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Book, Moon, Sun, Cross, Church, Calendar, Home } from "lucide-react";
import { prayerSections, type PrayerSection } from "../data/prayer-index";
import { ModeToggle } from "./mode-toggle";

interface AppLayoutProps {
  children: ReactNode;
  onSelectPrayer?: (section: PrayerSection) => void;
  onHome?: () => void;
}

export function AppLayout({ children, onSelectPrayer, onHome }: AppLayoutProps) {
  const categories = [
    { id: "morning", title: "Morning Prayers", icon: Sun },
    { id: "evening", title: "Evening Prayers", icon: Moon },
    { id: "communion", title: "Holy Communion", icon: Cross },
    { id: "liturgical", title: "Liturgical Services", icon: Church },
    { id: "canon", title: "Canons", icon: Book },
    { id: "occasional", title: "Occasional Prayers", icon: Calendar },
  ] as const;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Jordanville Prayer Book</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={onHome}>
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {categories.map((category) => {
              const sections = prayerSections.filter((s) => s.category === category.id);
              if (sections.length === 0) return null;

              return (
                <SidebarGroup key={category.id}>
                  <SidebarGroupLabel className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    {category.title}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {sections.map((section) => (
                        <SidebarMenuItem key={section.id}>
                          <SidebarMenuButton onClick={() => onSelectPrayer?.(section)}>
                            <span className="text-sm">{section.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}
          </SidebarContent>
        </Sidebar>
        <div className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background">
            <div className="flex h-16 items-center gap-4 px-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Jordanville Prayer Book</h1>
              <div className="ml-auto">
                <ModeToggle />
              </div>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
