// components/PartnersSection.tsx
export default function PartnersSection() {
  const partners = [
    { name: 'Apace Digital Cargo', logo: '/images/partner1.webp' },
    { name: 'Cargo Insights', logo: '/images/partner2.webp' },
    { name: 'International Coordinating Council for Trans-Eurasian Transportation', logo: '/images/partner3.webp' },
    { name: 'LOGIRUS', logo: '/images/partner4.webp' },
    { name: 'CargoTalk', logo: '/images/partner5.jpg' },
    { name: 'Logistics 360 Magazine', logo: '/images/partner6.webp' },
    { name: 'BizToday', logo: '/images/partner7.jpg' },
    { name: 'Logistics.ru', logo: '/images/partner8.webp' },
    { name: 'TravTalkME', logo: '/images/partner9.webp' },
    { name: 'The Council of Supply Chain Professionals', logo: '/images/partner10.webp' },
  ]

  return (
    <section className="py-20">
      <div className="container">
        <div className="mb-10 flex flex-col items-center">
          <div className="flex items-center justify-center w-fit gap-2 py-2 pe-5 pl-1 capitalize">
            <img src="/images/logo-icon-3.png" alt="TransRussia" className="size-auto w-5" />
            <span>Partners & Sponsors</span>
          </div>
          
          <h2 className="text-[72px] leading-[0.9] font-bold text-black mt-5">
            Driving Success Together
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <a 
              key={index}
              href={`/partner/${partner.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex w-full flex-col items-center gap-5 text-center"
            >
              <div className="h-40 w-full overflow-hidden rounded-lg px-10 py-5 shadow-lg bg-white flex items-center justify-center">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="size-full object-contain"
                />
              </div>
              <small className="text-sm">{partner.name}</small>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}