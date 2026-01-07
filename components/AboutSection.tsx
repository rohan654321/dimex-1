// components/AboutSection.tsx
export default function AboutSection() {
  const stats = [
    { value: '30,500', label: 'Visitors' },
    { value: '600+', label: 'Exhibitors' },
    { value: '50+', label: 'Countries Represented' },
    { value: '13', label: 'Event Sectors' },
  ]

  return (
    <section className="relative z-1 overflow-hidden py-20">
      <div className="container">
        <div className="flex flex-col gap-5">
          <h2 className="text-[72px] leading-[0.9] font-bold text-black mb-8">
            Russia's Leading Transport and Logistics Event
          </h2>
          <p className="text-lg whitespace-pre-line max-w-4xl">
            TransRussia 2026 is the premier international exhibition for transport and logistics services, warehouse equipment, and advanced technologies. Taking place from 17–19 March 2026 at Crocus Expo, it brings together industry leaders, decision-makers, and innovators from across 50 countries.
            {'\n\n'}
            Whether you're looking to meet new clients, strengthen existing relationships, or explore cutting-edge industry advancements, TransRussia is the place to be.
          </p>
          <a href="/about-transrussia" className="block mt-8">
            <button className="flex items-center justify-center group gap-2 overflow-hidden rounded-full px-10 py-3 font-jakarta text-[16px] font-semibold transition-all duration-300 bg-[#0092D7] text-white hover:bg-[#33A8DF] w-fit">
              Learn More
            </button>
          </a>
        </div>
      </div>
      
      <div className="mt-20 bg-[#F4F4F4] py-10">
        <div className="container grid sm:grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center lg:justify-center">
              <div className="flex flex-col border-b border-black/10 pb-5 sm:w-fit">
                <h3 className="text-[60px] leading-none mb-1 font-bold text-[#0092D7]">
                  {stat.value}
                </h3>
                <p className="text-lg">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}