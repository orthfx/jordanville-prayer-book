import { useState } from 'react'
import { AppLayout } from './components/AppLayout'
import { PrayerList } from './components/PrayerList'
import { PrayerViewer } from './components/PrayerViewer'
import { Button } from './components/ui/button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './components/ui/breadcrumb'
import type { PrayerSection } from './data/prayer-index'
import { ArrowLeft } from 'lucide-react'

function App() {
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerSection | null>(null)

  return (
    <AppLayout
      onSelectPrayer={setSelectedPrayer}
      onHome={() => setSelectedPrayer(null)}
    >
      <div className="max-w-6xl">
        {selectedPrayer ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPrayer(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Prayers
              </Button>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => setSelectedPrayer(null)} className="cursor-pointer">
                      Prayer Book
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{selectedPrayer.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <PrayerViewer
              sectionId={selectedPrayer.id}
              title={selectedPrayer.title}
              fileName={selectedPrayer.fileName}
              description={selectedPrayer.description}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Jordanville Prayer Book</h1>
              <p className="text-muted-foreground">
                A digital collection of Orthodox Christian prayers and liturgical services
              </p>
            </div>
            <PrayerList onSelectPrayer={setSelectedPrayer} />
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default App
