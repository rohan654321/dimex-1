// app/about-skladtech/page.tsx
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/UI/Button'
import NavBar from '@/components/NavBar'

export const metadata: Metadata = {
  title: 'About SkladTech | Warehouse Technology at TransRussia',
  description: 'Learn about SkladTech, the leading exhibition for warehouse technology and automation. Discover innovations and connect with industry leaders at TransRussia.',
}

export default function AboutSkladTechPage() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-black/70 to-black/20">
          <div className="absolute inset-0 z-0">
            <Image
              src="/delivery_robot_futuristic_environment_5ad8e0b754.jpg"
              alt="Warehouse automation"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container relative z-10 mx-auto px-4 py-40 text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-6xl lg:text-7xl">
              About SkladTech
            </h1>
            <p className="text-xl md:text-2xl">
              The Commercial Heart of Warehousing Solutions.
            </p>
          </div>
        </section>

        {/* Where Warehousing Solutions Come to Life */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl">
              <h2 className="mb-6 text-3xl font-bold md:text-5xl lg:text-6xl">
                Where Warehousing Solutions Come to Life
              </h2>
              <p className="mb-8 text-lg text-gray-700">
                SkladTech is Eurasia&apos;s premier exhibition dedicated to advanced warehouse equipment and technologies. Held alongside TransRussia, the country&apos;s largest transport and logistics exhibition, SkladTech serves as a specialized platform for showcasing cutting-edge solutions in storage systems, material handling, automation, and inventory management.
              </p>
              <Button href="/exhibiting-enquiry" className="px-10 py-3">
                Enquire to Exhibit
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-1 gap-8 bg-gray-50 py-12 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold text-blue-600 md:text-6xl">13,900+</div>
                <p className="text-lg">Attendees</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold text-blue-600 md:text-6xl">7,300+</div>
                <p className="text-lg">First Time Attendees</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold text-blue-600 md:text-6xl">34</div>
                <p className="text-lg">Countries Represented</p>
              </div>
            </div>
          </div>
        </section>

        {/* Exhibiting Sectors */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl">
              <h2 className="mb-6 text-3xl font-bold md:text-5xl lg:text-6xl">
                Exhibiting Sectors
              </h2>
              <p className="mb-12 text-lg text-gray-700">
                SkladTech showcases automation, robotics, inventory systems, and supply chain optimization, bringing cutting-edge solutions to warehousing. Explore advanced storage, IoT tech, and sustainable logistics while connecting with industry leaders shaping the future.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {sectors.map((sector, index) => (
                <Link
                  key={index}
                  href={sector.href}
                  className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="relative h-64 md:h-80">
                    <Image
                      src={sector.image}
                      alt={sector.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-white p-4">
                    <h3 className="font-semibold">{sector.title}</h3>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button href="/sectors" className="px-10 py-3">
                Explore Our Event Sectors
              </Button>
            </div>
          </div>
        </section>

        {/* Download Event Brochure */}
        <section className="bg-blue-900 py-20 text-white">
          <div className="container relative mx-auto px-4">
            <div className="max-w-2xl">
              <h2 className="mb-4 text-3xl font-bold md:text-5xl lg:text-6xl">
                Download Your Event Brochure
              </h2>
              <p className="mb-8 text-lg">
                Make sure you grab your copy of the event brochure to learn more about the show and explore your participation opportunities.
              </p>
              <Button href="/event-brochure" variant="secondary" className="px-10 py-3">
                Download Now
              </Button>
            </div>
            <div className="absolute right-0 bottom-0 hidden h-64 w-64 lg:block">
              <Image
                src="/Untitled_500_x_500_px_309_x_274_px_ff2199315c.png"
                alt="Brochure"
                width={500}
                height={500}
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* Meet the Visionaries */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl">
              <h2 className="mb-6 text-3xl font-bold md:text-5xl lg:text-6xl">
                Meet the Visionaries Transforming Warehousing and Logistics
              </h2>
              <p className="mb-8 text-lg text-gray-700">
                SkladTech unites decision-makers, industry leaders, and innovators in warehouse technology and logistics. Attendees explore cutting-edge solutions, forge partnerships, and optimize operations—shaping the future of warehousing.
              </p>
              <Button href="/post-show-report" className="px-10 py-3">
                Discover Key Visitor Insights – Download the Post-Show Report
              </Button>
            </div>

            {/* Visitor Stats */}
            <div className="mt-20 grid grid-cols-1 gap-8 bg-gray-50 py-12 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold text-blue-600 md:text-6xl">48%</div>
                <p className="text-lg">Transportation, Forwarding, Storage</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold text-blue-600 md:text-6xl">40%</div>
                <p className="text-lg">Cargo owners (manufacturing, wholesale trade, retail)</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold text-blue-600 md:text-6xl">12%</div>
                <p className="text-lg">IT-solutions, Insurance, Foreign Trade Agencies, Industry Ministries, Associations, Mass Media</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2025 Exhibitors Snapshot */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-3xl font-bold md:text-5xl lg:text-6xl">
              A Snapshot of Our 2025 Exhibitors
            </h2>
            <div className="rounded-xl bg-gray-50 p-8">
              <div className="mb-6">
                <Image
                  src="/Sklad_Tech_Exhbitors_2025_b558464148.jpg"
                  alt="2025 Exhibitors"
                  width={1200}
                  height={600}
                  className="rounded-lg"
                />
              </div>
              <Button 
                href="https://catalogue.ite-expo.ru/en-GB/exhibitorlist.aspx?project_id=535" 
                className="px-10 py-3"
              >
                View the 2025 Exhibitors
              </Button>
            </div>
          </div>
        </section>

        {/* When and Where */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-3xl font-bold md:text-5xl lg:text-6xl">
              When and Where
            </h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-8">
                <h3 className="mb-4 text-2xl font-bold">Venue</h3>
                <p className="text-lg">Russia, Moscow, Crocus Expo IEC, Pavilion 3</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-8">
                <h3 className="mb-4 text-2xl font-bold">Opening Hours</h3>
                <p className="text-lg">18, 19 March 2025: 10:00 - 18:00</p>
                <p className="text-lg">20 March 2025: 10:00 - 16:00</p>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Section */}
        <section className="relative py-40">
          <div className="absolute inset-0 z-0">
            <Image
              src="/1140_x_370_Travel_section_1_9001e4b12b.png"
              alt="Travel"
              fill
              className="object-cover"
            />
          </div>
          <div className="container relative z-10 mx-auto px-4 text-center text-white">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl lg:text-6xl">
              SkladTech Awaits
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg">
              Whether you&apos;re traveling from across the globe or nearby, we&apos;ve got you covered. Find all the essential information to ensure a smooth and hassle-free trip to SkladTech 2026.
            </p>
            <Button href="/plan-your-travel" variant="secondary" className="px-10 py-3">
              Plan Your Travel
            </Button>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-14 flex items-end justify-between">
              <div className="max-w-2xl">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-500"></div>
                  <span className="font-semibold">TransRussia / Skladtech</span>
                </div>
                <h2 className="mb-4 text-3xl font-bold md:text-5xl lg:text-6xl">
                  Quick Navigation
                </h2>
                <p className="text-lg text-gray-700">
                  Simplifying Your Participation Journey
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {navigationCards.map((card, index) => (
                <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                    <span className="text-2xl font-bold">0{index + 1}</span>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">{card.title}</h3>
                  <p className="mb-6 text-gray-600">{card.description}</p>
                  <Button href={card.href} className="w-full py-3">
                    {card.buttonText}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners & Sponsors */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-center text-3xl font-bold md:text-5xl lg:text-6xl">
              Partners & Sponsors
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {partners.map((partner, index) => (
                <Link
                  key={index}
                  href={partner.href}
                  className="flex flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-md hover:shadow-lg"
                >
                  <div className="relative h-32 w-full">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-center text-sm">{partner.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

// Data
const sectors = [
  {
    title: "Engineering Systems and Service Equipment",
    href: "/sectors/engineering-systems-and-service-equipment",
    image: "/ENGINEERING_SYSTEMS_AND_SERVICE_EQUIPMENT_ca848953af.WEBP",
  },
  {
    title: "Lifting and Transporting Equipment",
    href: "/sectors/lifting-and-transporting-equipment",
    image: "/LIFTING_AND_TRANSPORTING_EQUIPMENT_991a69b0e8.webp",
  },
  {
    title: "Packaging and Order Picking",
    href: "/sectors/packaging-and-order-picking",
    image: "/PACKAGING_AND_ORDER_PICKING_3520548978.webp",
  },
  {
    title: "Warehouse Automation Systems",
    href: "/sectors/trans-russia-sector",
    image: "/Tran_Russia_Sectors_a2542d0bb3.png",
  },
  {
    title: "Warehousing and Shelving Systems",
    href: "/sectors/warehouse-equipment-shelving-systems-robotic-technology-conveyor-lines",
    image: "/WAREHOUSING_AND_SHELVING_SYSTEMS_55f7c855ff.webp",
  },
  {
    title: "Warehouse Equipment Tires",
    href: "/sectors/skadltech-sector-1",
    image: "/heavyduty_truck_tires_warehouse_setting_industrial_commercial_use_48dd9ef472.jpg",
  },
]

const navigationCards = [
  {
    title: "Become an Exhibitor",
    description: "Connect with 30,000+ logistics professionals across 3 days for unparalleled networking opportunities.",
    buttonText: "Book a Stand",
    href: "/exhibiting-enquiry",
  },
  {
    title: "Download Your Event Brochure",
    description: "Find out who we are, what we do, and how best we can help you achieve your strategic business goals all wrapped up in our concise event brochure.",
    buttonText: "Download Now",
    href: "/event-brochure",
  },
  {
    title: "Become a Visitor",
    description: "Not ready to become an exhibitor? Why not visit the exhibition for free and find out what to expect for the following edition",
    buttonText: "Visitor Registration",
    href: "/visitor-registration",
  },
]

const partners = [
  {
    name: "Apace Digital Cargo",
    href: "/partner/apace-digital-cargo",
    logo: "/APACE_Digital_Cargo_523bc2c2a2.webp",
  },
  {
    name: "Cargo Insights",
    href: "/partner/cargo-insights",
    logo: "/Cargo_Insights_e965193be1.webp",
  },
  {
    name: "International Coordinating Council for Trans-Eurasian Transportation",
    href: "/partner/international-coordinating-council-for-trans-eurasian-transportation",
    logo: "/International_Coordinating_for_Trans0_Eurasian_Transportation_965b26881c.webp",
  },
  {
    name: "LOGIRUS",
    href: "/partner/logirus",
    logo: "/LOGIRUS_34da1707d5.webp",
  },
  {
    name: "CargoTalk",
    href: "/partner/cargo-talk",
    logo: "/Cargo_Talk_ME_logo_final_ff5213a4fd.jpg",
  },
]