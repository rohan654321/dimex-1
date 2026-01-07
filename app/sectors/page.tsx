import SectorGrid from '@/components/UI/SectorGrid'
import QuickNavigation from '@/components/QuickNavigation'
import PartnersCarousel from '@/components/PartnersCarousel'
import { transRussiaSectors, skladTechSectors } from '@/lib/data'

export default function SectorsPage() {
  return (
    <div className="w-full">
      {/* Hero Section - COMPACT */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
          <div className="h-full w-full bg-gradient-to-r from-blue-900 to-blue-700" />
        </div>
        
        <div className="container relative z-20 text-white pb-6 md:pb-10">
          <h1 className="title-72 text-white mb-3">Event Sectors</h1>
          <p className="text-responsive max-w-full">
            TransRussia and SkladTech showcase the full spectrum of logistics and warehouse innovation.
          </p>
        </div>
      </section>

      {/* TransRussia Sectors - COMPACT */}
      <section className="compact-section">
        <div className="container">
          <div className="mb-6 md:mb-8">
            <h2 className="title-72 text-black mb-3 w-full">TransRussia Event Sectors</h2>
            <p className="text-gray-600 text-responsive w-full">
              Covers freight forwarding, transport services, warehousing, and logistics IT.
            </p>
          </div>
          <SectorGrid sectors={transRussiaSectors} />
        </div>
      </section>

      {/* SkladTech Sectors - COMPACT */}
      <section className="compact-section bg-gray-50">
        <div className="container">
          <div className="mb-6 md:mb-8">
            <h2 className="title-72 text-black mb-3 w-full">SkladTech Event Sectors</h2>
            <p className="text-gray-600 text-responsive w-full">
              Showcases automation, robotics, IoT, and sustainable logistics solutions.
            </p>
          </div>
          <SectorGrid sectors={skladTechSectors} />
        </div>
      </section>

      {/* Quick Navigation - COMPACT */}
      <section className="compact-section">
        <QuickNavigation />
      </section>

      {/* Partners & Sponsors - COMPACT */}
      <section className="compact-section bg-gray-50">
        <PartnersCarousel />
      </section>
    </div>
  )
}