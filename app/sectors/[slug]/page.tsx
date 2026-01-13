import { notFound } from 'next/navigation'
import SectionContainer from "@/components/UI/SectionContainer"
import QuickNavigation from "@/components/QuickNavigation"
import PartnersSection from "@/components/section/PartnersSection"
import Image from 'next/image'
import Link from 'next/link'

// Database of all sectors with their specific content
const sectorDatabase = {
  // TransRussia Sectors
  'complex-logistics': {
    title: 'Complex Logistics Services & Freight Forwarding',
    description: 'Comprehensive logistics solutions including freight forwarding, customs clearance, and supply chain management services.',
    heroImage: '/images/image.png',
    stats: {
      visitors: '30,400+',
      exhibitors: '590+',
      countries: '50+'
    },
    whyExhibit: [
      {
        title: "Connect with Major Shippers & Importers",
        icon: "🤝",
        description: "Meet decision-makers from manufacturing, retail, and trade sectors seeking end-to-end logistics partners."
      },
      {
        title: "Showcase Integrated Supply Chain Solutions",
        icon: "🔗",
        description: "Present your capabilities in multi-modal transport, warehousing, customs brokerage, and last-mile delivery."
      },
      {
        title: "Capitalize on Growing Cross-Border Trade",
        icon: "🌍",
        description: "With Eurasian trade corridors expanding, demand for sophisticated logistics services is at an all-time high."
      }
    ],
    services: [
      "Freight Forwarding Services",
      "Customs Clearance & Documentation",
      "Supply Chain Consulting",
      "Inventory Management",
      "Multi-modal Transportation",
      "Cross-border Logistics",
      "Distribution Network Design",
      "Logistics Outsourcing",
      "Risk Management",
      "Compliance & Regulatory Services"
    ],
    faqs: [
      {
        question: "What types of companies exhibit in this sector?",
        answer: "Global freight forwarders, 3PL/4PL providers, customs brokers, supply chain consultants, and integrated logistics service providers."
      },
      {
        question: "Who visits this sector?",
        answer: "Manufacturers, retailers, import/export managers, supply chain directors, and businesses seeking comprehensive logistics solutions."
      },
      {
        question: "What are the key trends in complex logistics?",
        answer: "Digital transformation, sustainability, nearshoring, supply chain resilience, and integrated technology platforms."
      }
    ]
  },
  
  'maritime-and-inland-waterway-transport': {
    title: 'Maritime & Inland Waterway Transport',
    description: 'Ocean and river transport services, shipping lines, and inland waterway logistics solutions.',
    heroImage: '/images/image.png',
    stats: {
      visitors: '30,400+',
      exhibitors: '590+',
      countries: '50+'
    },
    whyExhibit: [
      {
        title: "Connect with Major Shippers & Exporters",
        icon: "🚢",
        description: "Meet cargo owners moving bulk, containerized, and project cargo across global shipping lanes."
      },
      {
        title: "Showcase Port-to-Port & Door-to-Door Solutions",
        icon: "⚓",
        description: "Present your shipping routes, vessel capabilities, intermodal connections, and value-added services."
      },
      {
        title: "Tap into Growing Container & Bulk Trade",
        icon: "📈",
        description: "With new port infrastructure and trade agreements, maritime transport demand continues to expand across Eurasia."
      }
    ],
    services: [
      "Container Shipping Services",
      "Bulk Carrier Operations",
      "Liner & Tramper Services",
      "Inland Waterway Transport",
      "Chartering & Brokerage",
      "Port Agency Services",
      "Marine Insurance",
      "Bunker Fuel Supply",
      "Vessel Operations Management",
      "Shipping Documentation"
    ],
    faqs: [
      {
        question: "What shipping services are featured?",
        answer: "Container lines, bulk carriers, ro-ro services, specialized vessels, and inland waterway operators."
      },
      {
        question: "Who are the key visitors?",
        answer: "Exporters, importers, freight forwarders, port operators, and supply chain managers sourcing ocean transport."
      },
      {
        question: "What are the market opportunities?",
        answer: "Growth in containerized trade, new shipping routes, Arctic shipping development, and sustainable shipping initiatives."
      }
    ]
  },
  
  'air-freight': {
    title: 'Air Freight',
    description: 'Air cargo services, express logistics, and aviation freight solutions.',
    heroImage: '/images/image.png',
    stats: {
      visitors: '30,400+',
      exhibitors: '590+',
      countries: '50+'
    },
    whyExhibit: [
      {
        title: "Connect with Time-Sensitive Shippers",
        icon: "✈️",
        description: "Meet pharmaceutical, e-commerce, automotive, and high-tech companies requiring urgent air cargo solutions."
      },
      {
        title: "Showcase Specialized Air Logistics",
        icon: "📦",
        description: "Present your capabilities in perishables, dangerous goods, live animals, and oversized cargo handling."
      },
      {
        title: "Capitalize on E-commerce & Pharma Growth",
        icon: "💊",
        description: "With rapid growth in online retail and temperature-sensitive shipments, air freight demand continues to soar."
      }
    ],
    services: [
      "Air Cargo Charter Services",
      "Scheduled Freight Services",
      "Express & Courier Logistics",
      "Perishables Handling",
      "Dangerous Goods Transport",
      "Oversized & Heavy Cargo",
      "Airport Ground Handling",
      "Customs Clearance at Airports",
      "Temperature-controlled Transport",
      "Air Freight Consolidation"
    ],
    faqs: [
      {
        question: "What types of air freight services are featured?",
        answer: "Cargo airlines, freight forwarders, charter brokers, ground handlers, and specialized air logistics providers."
      },
      {
        question: "Who visits the air freight sector?",
        answer: "Manufacturers, e-commerce platforms, pharmaceutical companies, and businesses requiring fast, reliable transport."
      },
      {
        question: "What are the key market drivers?",
        answer: "E-commerce growth, pharmaceutical supply chains, just-in-time manufacturing, and global emergency logistics."
      }
    ]
  },
  
  'ports-and-terminals-freight-handling-services-in-ports': {
    title: 'Ports & Terminals, Freight Handling Services In Ports',
    description: 'Discover expert stevedoring, logistics, and storage solutions for seamless port operations at TransRussia.',
    heroImage: '/images/image.png',
    stats: {
      visitors: '30,400+',
      exhibitors: '590+',
      countries: '50+'
    },
    whyExhibit: [
      {
        title: "Meet Buyers Managing Complex Seaborne Cargo Operations",
        icon: "🔧",
        description: "Engage with shippers, forwarders, and manufacturers sourcing reliable port services for smooth cross-border logistics."
      },
      {
        title: "Showcase Expertise in Cargo Handling, Transshipment & Storage",
        icon: "⚓",
        description: "Present port operations, container unloading/loading, warehousing, and support services to decision-makers in global supply chains."
      },
      {
        title: "Capitalise on Investment in Eurasia's Coastal & Inland Port Infrastructure",
        icon: "💰",
        description: "With modernisation efforts and new trade routes emerging, demand is growing for agile, full-service port logistics solutions."
      }
    ],
    services: [
      "Stevedoring & Vessel Docking Services",
      "Container Handling & Transshipment",
      "Port-Based Warehousing & Temporary Storage",
      "Cargo Consolidation & Deconsolidation",
      "Breakbulk & Project Cargo Handling",
      "Refrigerated & Hazardous Goods Management",
      "Port Infrastructure Development & Modernization",
      "Terminal Automation & Tracking Systems",
      "Customs Clearance & Port Documentation Support",
      "Inland Waterway & River Port Logistics"
    ],
    faqs: [
      {
        question: "Who exhibits at TransRussia?",
        answer: "Logistics companies, freight forwarders, carriers (road, rail, sea, air), 3PLs, terminals, IT and customs service providers."
      },
      {
        question: "Who visits the show?",
        answer: "Logistics and supply chain managers, manufacturers, retailers, wholesalers, import/export professionals, and infrastructure developers."
      },
      {
        question: "What sectors can I exhibit under?",
        answer: "Air, road, rail, and sea transport; freight forwarding; IT & automation; warehousing; customs and insurance. Please check out our sectors page for more details."
      }
    ]
  },

  // Add more sectors following the same pattern...
  
  // SkladTech Sectors
  'warehousing-systems': {
    title: 'Warehousing Systems',
    description: 'Storage systems, racking, and warehouse infrastructure solutions.',
    heroImage: '/images/image.png',
    stats: {
      visitors: '15,200+',
      exhibitors: '280+',
      countries: '35+'
    },
    whyExhibit: [
      {
        title: "Meet Warehouse Operators & 3PLs",
        icon: "🏭",
        description: "Connect with distribution centers, logistics hubs, and storage facility managers seeking modern storage solutions."
      },
      {
        title: "Showcase Advanced Storage Technologies",
        icon: "📊",
        description: "Present your racking systems, automated storage, mezzanine floors, and warehouse design services."
      }
    ],
    services: [
      "Pallet Racking Systems",
      "Shelving & Storage Solutions",
      "Mezzanine Floors",
      "Warehouse Design & Layout",
      "Storage Optimization",
      "Inventory Management Systems"
    ],
    faqs: [
      {
        question: "What products are featured?",
        answer: "Storage systems, warehouse equipment, racking solutions, and space optimization technologies."
      }
    ]
  }
  // Add all other sectors...
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function SectorPage({ params }: PageProps) {
  const { slug } = await params
  const sectorData = sectorDatabase[slug as keyof typeof sectorDatabase]

  if (!sectorData) {
    notFound()
  }

  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="pt-20 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[40px] md:text-[52px] leading-tight font-bold text-black max-w-4xl mt-10">
            {sectorData.title}
          </h1>

          <p className="mt-4 text-lg text-gray-600 max-w-3xl">
            {sectorData.description}
          </p>

          <div className="mt-10 relative w-full h-[420px] rounded-lg overflow-hidden">
            <Image
              src={sectorData.heroImage}
              alt={sectorData.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* DESCRIPTION + FORM */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          
          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {slug === 'ports-and-terminals-freight-handling-services-in-ports' 
                ? "Power Seamless Cargo Movement with Eurasia's Port & Terminal Logistics"
                : `Power Your Business with ${sectorData.title.split(' ')[0]} Solutions`}
            </h2>

            <div className="space-y-6 text-gray-700 leading-relaxed text-[17px]">
              <p>
                {slug === 'ports-and-terminals-freight-handling-services-in-ports' 
                  ? `As Eurasia expands its role in global trade, ports and maritime terminals are becoming strategic logistics hubs—facilitating efficient import/export flows across Eurasia. The country's port logistics market is projected to surpass <strong>$61 billion USD by 2028</strong>.`
                  : `The ${sectorData.title} sector is experiencing rapid growth across Eurasia, with increasing demand for specialized solutions. The market is projected to grow significantly in the coming years.`}
              </p>

              <p>
                {slug === 'ports-and-terminals-freight-handling-services-in-ports'
                  ? `At <strong>TransRussia</strong>, the ports & maritime terminals sector brings together leading stevedores, port operators, and cargo handling specialists showcasing vessel docking, transshipment, storage, and customs support.`
                  : `At <strong>TransRussia</strong>, the ${sectorData.title} sector brings together industry leaders showcasing innovative solutions, technologies, and services.`}
              </p>

              <p>
                {slug === 'ports-and-terminals-freight-handling-services-in-ports'
                  ? `Whether managing bulk, container, or project cargo, this sector connects you to the infrastructure, technology, and services powering modern port logistics.`
                  : `Whether you're looking for cutting-edge technology or reliable service providers, this sector connects you with the expertise needed to optimize your operations.`}
              </p>
            </div>

            {/* STATS */}
            <div className="flex gap-14 mt-14">
              <div>
                <p className="text-4xl text-gray-500 font-bold">{sectorData.stats.visitors}</p>
                <p className="text-gray-600 mt-1">Visitors</p>
              </div>
              <div>
                <p className="text-4xl text-gray-500 font-bold">{sectorData.stats.exhibitors}</p>
                <p className="text-gray-600 mt-1">Exhibitors</p>
              </div>
              <div>
                <p className="text-4xl text-gray-500 font-bold">{sectorData.stats.countries}</p>
                <p className="text-gray-600 mt-1">Countries Represented</p>
              </div>
            </div>
            
            <div className="mt-10">
              <Image src={sectorData.heroImage} alt={sectorData.title} width={800} height={400} className="rounded-lg" />
            </div>
          </div>

          {/* ENQUIRY FORM */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 h-fit">
            <h3 className="text-3xl font-bold text-blue-600 mb-4">Enquiry to Exhibit</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-gray-900 font-bold mb-3">Your level of interest</label>
                <div className="space-y-3">
                  {[
                    "Ready to book my stand",
                    "Looking for more information",
                    "Looking for sponsorship opportunities",
                  ].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input type="radio" name="interest" className="w-4 h-4 text-blue-600" />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-bold mb-2">First Name*</label>
                  <input
                    type="text"
                    placeholder="Type your first name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-bold mb-2">Last Name*</label>
                  <input
                    type="text"
                    placeholder="Type your last name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2">Company Name*</label>
                <input
                  type="text"
                  placeholder="Type your Company Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2">Company Website*</label>
                <input
                  type="url"
                  placeholder="Company Website"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2">Job Title*</label>
                <input
                  type="text"
                  placeholder="Type your Job Title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2">Country*</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option>Select a country</option>
                  <option>Russia</option>
                  <option>Kazakhstan</option>
                  <option>Uzbekistan</option>
                  <option>China</option>
                  <option>Germany</option>
                  <option>Turkey</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2">Phone*</label>
                <input
                  type="tel"
                  placeholder="Type your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2">Work Email*</label>
                <input
                  type="email"
                  placeholder="Type your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Why Exhibit Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-gray-50">
        <SectionContainer>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">
            Why Exhibit in {sectorData.title.split(' ')[0]} Sector?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {sectorData.whyExhibit.map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href='/exhibiting-enquiry'>
              <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition">
              Enquire to Exhibit
            </button>
            </Link>
          
          </div>
        </SectionContainer>
      </section>

      {/* Key Services Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-gray-50">
        <SectionContainer>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">Key Services on Display:</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {sectorData.services.map((service, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-white rounded-lg hover:bg-blue-50 transition border border-gray-200"
              >
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-lg">{service}</span>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-white">
        <SectionContainer>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">FAQs for {sectorData.title.split(' ')[0]} Sector</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {sectorData.faqs.slice(0, 6).map((faq, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{faq.question}</h3>
                <p className="text-gray-600 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* READY TO EXHIBIT CTA */}
      <section className="px-4 md:px-8 py-20">
        <div className="relative max-w-7xl mx-auto h-[180px] rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-[#111827]">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="absolute left-0 top-0 h-full w-[160px] bg-blue-500 clip-arrow" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full gap-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Exhibit in {sectorData.title.split(' ')[0]}?
            </h2>
            <Link href='/visitor-registration'>
            <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 transition text-white font-semibold px-8 py-3 rounded-md">
              Book Your Stand
              <span className="text-xl">→</span>
            </button>
            </Link>
            
          </div>
        </div>
      </section>

      <QuickNavigation />
      <PartnersSection />
    </main>
  )
}

// Add this to your global CSS
const styles = `
  .clip-arrow {
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }
`

export async function generateStaticParams() {
  // Return all possible slugs for static generation
  const slugs = [
    'complex-logistics',
    'maritime-and-inland-waterway-transport', 
    'air-freight',
    'rail-freight',
    'road-freight-transportation',
    'ports-and-terminals-freight-handling-services-in-ports',
    'warehouse-technology',
    'it-solutions',
    'ecommerce-logistics',
    'heavy-lift-carriage',
    'warehousing-systems',
    'material-handling',
    'automation-robotics',
    'packaging-systems',
    'inventory-management'
  ]
  
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const sectorData = sectorDatabase[slug as keyof typeof sectorDatabase]
  
  if (!sectorData) {
    return {
      title: 'Sector Not Found',
      description: 'The requested sector page does not exist.'
    }
  }
  
  return {
    title: `${sectorData.title} | TransRussia 2026`,
    description: sectorData.description,
    openGraph: {
      title: `${sectorData.title} | TransRussia 2026`,
      description: sectorData.description,
      images: [sectorData.heroImage]
    }
  }
}