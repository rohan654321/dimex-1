export interface Sector {
  id: number
  title: string
  slug: string
  image: string
  shortText?: string
}

export interface Partner {
  id: number
  name: string
  logo: string
  type?: string
  slug: string
}

export const transRussiaSectors: Sector[] = [
  {
    id: 1,
    title: 'Equipment Suppliers',
    slug: 'equipment-suppliers',
    shortText: 'Manufacturers of cranes and loading equipment for shipbuilding, ports, and terminals.',
    image: '/images/equipment.jpg'
  },
  {
    id: 2,
    title: 'Ports & Terminals, Freight Handling Services In Ports',
    slug: 'ports-and-terminals',
    shortText: 'Discover expert stevedoring, logistics, and storage solutions for seamless port operations.',
    image: '/images/ports.jpg'
  },
  {
    id: 3,
    title: 'Road Freight Transportation',
    slug: 'road-freight-transportation',
    image: '/images/road-freight.jpg'
  },
  {
    id: 4,
    title: 'Maritime & Inland Waterway Transport',
    slug: 'maritime-transport',
    shortText: 'Maritime cargo transportation offers cost-effective, high-capacity solutions.',
    image: '/images/maritime.jpg'
  },
  {
    id: 5,
    title: 'IT-Solutions',
    slug: 'it-solutions',
    shortText: 'Leading IT developers showcasing comprehensive solutions in information technologies.',
    image: '/images/it-solutions.jpg'
  },
  {
    id: 6,
    title: 'Logistics, Distribution Centers & Terminals',
    slug: 'logistics-centers',
    shortText: 'Services tailored for cargo processing within terminal and warehouse complexes.',
    image: '/images/logistics.jpg'
  },
  {
    id: 7,
    title: 'Outsize & Heavy Lift Carriage (Breakbulk)',
    slug: 'heavy-lift',
    shortText: 'Explore advanced logistics solutions for oversized and heavy-lift cargo.',
    image: '/images/heavy-lift.jpg'
  },
  {
    id: 8,
    title: 'Complex Logistics Services & Freight Forwarding',
    slug: 'complex-logistics',
    shortText: 'Leading Russian and international freight forwarders showcasing comprehensive logistics solutions.',
    image: '/images/complex-logistics.jpg'
  },
  {
    id: 9,
    title: 'E-commerce Logistics',
    slug: 'e-commerce-logistics',
    shortText: 'Services cover last-mile delivery, warehousing, order picking, and full fulfillment.',
    image: '/images/ecommerce.jpg'
  },
  {
    id: 10,
    title: 'Rail Freight',
    slug: 'rail-freight',
    shortText: 'Explore rail transport solutions for diverse cargo types.',
    image: '/images/rail.jpg'
  },
  {
    id: 11,
    title: 'Air Freight',
    slug: 'air-freight',
    shortText: 'Air transportation for fast delivery of time-sensitive cargo.',
    image: '/images/air-freight.jpg'
  },
  {
    id: 12,
    title: 'Associated Services',
    slug: 'associated-services',
    shortText: 'Consultations on logistics challenges including insurance, customs clearance, and security.',
    image: '/images/services.jpg'
  },
  {
    id: 13,
    title: 'Commercial Vehicle Tires',
    slug: 'commercial-tires',
    image: '/images/tires.jpg'
  }
]

export const skladTechSectors: Sector[] = [
  {
    id: 14,
    title: 'Engineering Systems and Service Equipment',
    slug: 'engineering-systems',
    shortText: 'Equipment maintenance and repair, HVAC equipment, Lighting & Cleaning equipment.',
    image: '/images/engineering.jpg'
  },
  {
    id: 15,
    title: 'Lifting and Transporting Equipment',
    slug: 'lifting-equipment',
    shortText: 'Handling, lifting and transporting equipment, Cranes, Winches & Component equipment.',
    image: '/images/lifting.jpg'
  },
  {
    id: 16,
    title: 'Packaging and Order Picking',
    slug: 'packaging',
    shortText: 'Transport packaging, Packaging materials & Measuring equipment and systems.',
    image: '/images/packaging.jpg'
  },
  {
    id: 17,
    title: 'Warehouse Automation Systems',
    slug: 'warehouse-automation',
    shortText: 'Warehouse and supply chain management systems, labeling solutions, access control.',
    image: '/images/automation.jpg'
  },
  {
    id: 18,
    title: 'Warehousing and Shelving Systems',
    slug: 'warehousing-systems',
    shortText: 'Warehouse Equipment, Shelving systems, Robotic technology & Conveyor lines.',
    image: '/images/warehousing.jpg'
  },
  {
    id: 19,
    title: 'Warehouse Equipment Tires',
    slug: 'warehouse-tires',
    image: '/images/warehouse-tires.jpg'
  }
]

export const partners: Partner[] = [
  { id: 1, name: 'Apace Digital Cargo', logo: '/logos/apace.png', slug: 'apace-digital-cargo' },
  { id: 2, name: 'Cargo Insights', logo: '/logos/cargo-insights.png', slug: 'cargo-insights' },
  { id: 3, name: 'International Coordinating Council', logo: '/logos/icctt.png', slug: 'icctt' },
  { id: 4, name: 'LOGIRUS', logo: '/logos/logirus.png', slug: 'logirus' },
  { id: 5, name: 'CargoTalk', logo: '/logos/cargotalk.png', slug: 'cargo-talk' },
  { id: 6, name: 'Logistics 360 Magazine', logo: '/logos/logistics360.png', slug: 'logistics-360' },
  { id: 7, name: 'BizToday', logo: '/logos/biztoday.png', slug: 'biztoday' },
  { id: 8, name: 'Logistics.ru', logo: '/logos/logistics-ru.png', slug: 'logistics-ru' },
  { id: 9, name: 'TravTalkME', logo: '/logos/travtalk.png', slug: 'trav-talk' },
  { id: 10, name: 'The Council of Supply Chain Professionals', logo: '/logos/scmpro.png', slug: 'scmpro' },
  { id: 11, name: 'Moneta Tanitim', logo: '/logos/moneta.png', slug: 'moneta' },
  { id: 12, name: 'Utikad', logo: '/logos/utikad.png', slug: 'utikad' },
  { id: 13, name: 'VTB', logo: '/logos/vtb.png', slug: 'vtb' },
  { id: 14, name: 'Urban Transport News', logo: '/logos/urban-transport.png', slug: 'urban-transport' },
  { id: 15, name: 'WIFFA', logo: '/logos/wiffa.png', slug: 'wiffa' }
]