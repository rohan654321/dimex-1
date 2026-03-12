import SectionContainer from "@/components/UI/SectionContainer"
import QuickNavigation from "@/components/QuickNavigation"
import PartnersSection from "@/components/section/PartnersSection"
import Link from "next/link"
import BackToTop from "../exhibitor-resource-center/component/BackToTop"

// Mock data - replace with actual data
const DiemexSectors = [
  { 
    id: 1, 
    title: 'Precision Die & Mould Solutions',

    slug: 'precision-moulds',
     image: '/images/precision.jpg',
     description: 'Comprehensive die & mould manufacturing, tooling systems, design engineering, and end-to-end production solutions supporting high-precision industrial applications.'
     },
  { 
    id: 2, 
     title: 'Tooling, Mould Bases & Standard Components',

                  slug: 'tooling-mould-base',
                  image: '/images/mouldbase.jpg',
                  description: 'High-quality mould bases, precision components, hot runner systems, and standard tooling elements supporting efficient and reliable die & mould production.'
                },
  { 
    id: 3, 
   title: 'Machining & Finishing Technologies',

                  slug: 'machining-finishing',
                  image: '/images/finishing.jpg',
                  description: 'High-precision CNC machining, EDM, wire-cut, surface finishing, and polishing solutions for toolroom operations.'
                },
  { 
    id: 4, 
     title: 'Automation & Industry 4.0 Solutions',

                  slug: 'automation-industry',
                  image: '/images/automation.jpg',
                  description: 'Smart automation, robotics, digital manufacturing, and smart factory technologies for modern die & mould production.'
                },
  { 
    id: 5, 
    title: 'Design, CAD/CAM & Engineering Software',
                  slug: 'cad-cam',
                  image: '/images/cad.jpg',
                  description: 'Advanced design, simulation, and manufacturing software enabling accurate tooling development and reduced time-to-market.'
                },
  { 
    id: 6, 
    title: 'Tool Steel & Advanced Materials',
                  slug: 'tool-steel',
                  image: '/images/toolsteel.jpg',
                  description: 'High-performance tool steels, alloy steels, special metals, and advanced materials engineered for durability, precision, and long tool life in die & mould applications.'
                },
  ]

const skladTechSectors = [
  { 
    id: 1, 
    title: 'Warehousing Systems', 
    slug: 'warehousing-systems', 
    image: '/images/image.png',
    description: 'Storage systems, racking, and warehouse infrastructure solutions.'
  },
  { 
    id: 2, 
    title: 'Material Handling', 
    slug: 'material-handling', 
    image: '/images/image.png',
    description: 'Forklifts, conveyors, and material handling equipment.'
  },
  { 
    id: 3, 
    title: 'Automation & Robotics', 
    slug: 'automation-robotics', 
    image: '/images/image.png',
    description: 'Automated storage, robotics, and smart warehouse solutions.'
  },
  { 
    id: 4, 
    title: 'Packaging Systems', 
    slug: 'packaging-systems', 
    image: '/images/image.png',
    description: 'Packaging equipment, labeling, and packing solutions.'
  },
  { 
    id: 5, 
    title: 'Inventory Management', 
    slug: 'inventory-management', 
    image: '/images/image.png',
    description: 'Inventory control, stock management, and tracking solutions.'
  },
]

export default function SectorsPage() {
  return (
    <>
    
    <div className="min-h-screen font-parabolica">
      {/* Hero Section - COMPACT */}
      <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-end">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/sectorheader.jpg)" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <SectionContainer>
          <div className="relative z-20 text-white pb-6 md:pb-10 pt-20">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-3">
              Event Sectors
            </h1>
            <p className="text-lg lg:text-xl max-w-full text-white/90">
  DIEMEX 2026 showcases the complete spectrum of die & mould manufacturing, tooling technologies, advanced machine tools, automation, additive manufacturing, and smart factory innovations.
</p>
          </div>
        </SectionContainer>
      </section>

      {/* TransRussia Sectors - COMPACT */}
      <section className="py-16 lg:py-24">
        <SectionContainer>
          <div className="mb-6 lg:mb-8">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-3 w-full">
  DIEMEX 2026 Event Sectors
</h2>

<p className="text-gray-600 text-lg lg:text-xl w-full">
  Covers die & mould manufacturing, tooling & cutting tools, machine tools, automation & robotics, additive manufacturing, metrology, smart manufacturing, surface engineering, raw materials, and industrial engineering solutions.
</p>
          </div>
          <SectorGrid sectors={DiemexSectors} />
        </SectionContainer>
      </section>

    
      
      <QuickNavigation/>
      <PartnersSection/>
    </div>
    <BackToTop/>
    </>
  )
}

// SectorGrid Component
function SectorGrid({ sectors }: { sectors: Array<{id: number, title: string, slug: string, image: string, description: string}> }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {sectors.map((sector) => (
        <Link
          key={sector.id}
          href={`/sectors/${sector.slug}`}
          className="group relative h-80 w-full overflow-hidden rounded-xl text-center shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
          <div 
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${sector.image})` }}
          ></div>
          <div className="absolute inset-0 z-20 flex items-end justify-center">
            <h3 className="w-full bg-white py-5 text-lg font-semibold transition-all duration-300 ease-in-out group-hover:bg-blue-50">
              {sector.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  )
}