// components/DiscoverSection.tsx
export default function DiscoverSection() {
  return (
    <section className="relative z-1 mx-auto overflow-hidden bg-[#003366] text-white py-20">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex h-fit flex-col gap-5 lg:col-span-7 lg:border-l lg:pl-10 xl:pl-12 2xl:pl-14 3xl:pl-20 border-white/20">
            <h2 className="text-[72px] leading-[0.9] font-bold text-white">
              Discover // TransRussia
            </h2>
            
            <p className="whitespace-pre-line text-lg">
              Download our comprehensive post-show report to unlock the details of CIS's premier transport and logistics exhibition. Discover how exhibiting at TransRussia can help you expand your business into the growing market and connect with key decision-makers shaping the future of logistics.
              {'\n\n'}
              Download now and start planning your success!
            </p>
            
            <a href="/post-show-report" className="mt-10 block">
              <button className="flex items-center justify-center group gap-2 overflow-hidden rounded-full px-10 py-3 font-jakarta text-[16px] font-semibold transition-all duration-300 bg-white text-[#0092D7] hover:bg-[#0092D7] hover:text-white w-fit">
                Download the 2025 Post Show Report
              </button>
            </a>
          </div>
          
          <div className="grid min-h-75 place-content-center lg:col-span-5">
            <img 
              src="/images/brochure-mockup.png" 
              alt="TransRussia Brochure" 
              className="size-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}