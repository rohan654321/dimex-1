// components/SectorsSection.tsx
export default function SectorsSection() {
  const sectors = [
    {
      title: 'Complex Logistics Services & Freight Forwarding',
      slug: 'complex-logistics-services-and-freight-forwarding',
      description: 'Leading Russian and international freight forwarders will showcase comprehensive logistics solutions at the event.',
      image: '/images/sector1.png'
    },
    {
      title: 'Road Freight Transportation',
      slug: 'road-freight-transportation',
      description: '',
      image: '/images/sector2.png'
    },
    {
      title: 'Rail Freight',
      slug: 'rail-freight',
      description: 'Explore rail transport solutions for diverse cargo types, showcasing efficiency and versatility at TransRussia.',
      image: '/images/sector3.png'
    },
    {
      title: 'Air Freight',
      slug: 'air-freight',
      description: 'Air transportation is crucial for fast delivery of time-sensitive cargo like perishables, medicines, and e-commerce, overcoming topographical limitations that affect road or rail.',
      image: '/images/sector4.png'
    },
    {
      title: 'Maritime & Inland Waterway Transport',
      slug: 'maritime-and-inland-waterway-transport',
      description: 'Maritime cargo transportation offers cost-effective, high-capacity solutions for intercontinental shipments of diverse cargo types.',
      image: '/images/sector5.png'
    },
    {
      title: 'Ports & Terminals, Freight Handling Services In Ports',
      slug: 'ports-and-terminals-freight-handling-services-in-ports',
      description: 'Discover expert stevedoring, logistics, and storage solutions for seamless port operations at TransRussia.',
      image: '/images/sector6.png'
    }
  ]

  return (
    <section className="py-20">
      <div className="container">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-10 mb-14">
          <div className="lg:col-span-9">
            <div className="flex items-center justify-center w-fit gap-2 py-2 pe-5 pl-1 capitalize">
              <img src="/images/logo-icon-3.png" alt="TransRussia" className="size-auto w-5" />
              <span>Sectors</span>
            </div>
            
            <h2 className="text-[72px] leading-[0.9] font-bold text-black my-3">
              Discover 13 Product Sectors In-Demand
            </h2>
          </div>
          
          <div className="flex lg:col-span-3 lg:justify-end">
            <a href="/sectors" className="block">
              <button className="flex items-center justify-center group gap-2 overflow-hidden rounded-full px-10 py-3 font-jakarta text-[16px] font-semibold transition-all duration-300 bg-[#0092D7] text-white hover:bg-[#33A8DF] w-fit">
                Explore Sectors
              </button>
            </a>
          </div>
        </div>

        <div className="grid max-md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, index) => (
            <a 
              key={index}
              href={`/sectors/${sector.slug}`}
              className="group relative flex min-h-150 w-full flex-col justify-end overflow-hidden p-5 text-white"
            >
              <div 
                className="absolute inset-0 z-[-2] size-full object-cover"
                style={{
                  backgroundImage: `url(${sector.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: '50% 50%'
                }}
              />
              <div className="absolute inset-0 z-[-2] bg-linear-to-t from-black/90 from-10%" />
              
              <h5 className="text-[32px] font-semibold">{sector.title}</h5>
              <p className="transition-all duration-300 line-clamp-2 lg:h-0 lg:opacity-0 group-hover:lg:h-15 group-hover:lg:opacity-100">
                {sector.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}