// components/HeroSection.tsx
export default function HeroSection() {
  return (
    <section id="heroSection" className="relative text-white min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-[-2] overflow-hidden">
        <div 
          className="size-full"
          style={{
            backgroundImage: 'url(/images/image.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>
      
      {/* Dark overlay gradient for better text readability */}
      <div className="absolute inset-0 z-[-1] bg-black/50 md:bg-linear-to-t md:from-black/70 md:via-black/40 md:to-transparent" />
      
      <div className="container grid size-full min-h-screen">
        <div className="flex flex-col justify-end gap-5 pb-16">
          <h1 className="text-[140px] leading-[0.8] font-bold tracking-tight hero-element">
            TransRussia <span className="text-[#33A8DF]">2026</span>
          </h1>
          
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-4 hero-element">
                Where global logistics companies connect with CIS market leaders
              </h2>
              <ul className="space-y-2 text-lg hero-element">
                <li>• 30th Edition of the International Exhibition for Transport & Logistics Services, Warehouse Equipment, and Technologies</li>
                <li>• 5th Edition of SkladTech Leading B2B Exhibition for Warehouse Equipment</li>
              </ul>
            </div>
            
            <div className="space-y-5">
              <a href="/exhibiting-enquiry" className="hero-element shrink-0">
                <button className="flex items-center justify-center group gap-2 overflow-hidden rounded-full px-10 py-3 font-jakarta text-[16px] font-semibold transition-all duration-300 bg-[#0092D7] text-white hover:bg-[#33A8DF] w-fit">
                  Book Your Stand
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}