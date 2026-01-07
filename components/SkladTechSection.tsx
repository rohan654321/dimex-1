// components/SkladTechSection.tsx
export default function SkladTechSection() {
  return (
    <section className="relative">
      <div className="container mx-auto grid items-center gap-10 overflow-hidden lg:grid-cols-3">
        <div className="grid place-content-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm" fill="none" viewBox="0 0 309 309">
            <path fill="#33A8DF" d="M154.5 0 0 154v93.211L154.5 93.236l84.188 83.916v83.915H70.312v1.31L24.516 308H309V154L154.5 0Z"/>
            <path fill="#0092D7" d="M195.5 308.062 70 177v84l52.5 47.062"/>
          </svg>
        </div>
        
        <div className="col-span-2 flex flex-col gap-5">
          <div className="flex items-center justify-center w-fit gap-2 py-2 pe-5 pl-1 capitalize">
            <img 
              src="/images/logo-icon-4.png" 
              alt="SkladTech" 
              className="size-auto w-5"
            />
            <span>Two Leading Events, One Location</span>
          </div>
          
          <h2 className="text-[72px] leading-[0.9] font-bold text-black">SkladTech</h2>
          
          <p className="whitespace-pre-line text-lg">
            Discover SkladTech, the premier showcase of cutting-edge warehouse equipment designed for maximum commercial impact. Held collocated with TransRussia, SkladTech offers unparalleled exposure to warehousing buyers at the industry's most significant gathering in CIS.
          </p>
          
          <a href="/about-skladtech" className="block">
            <button className="flex items-center justify-center group gap-2 overflow-hidden rounded-full px-10 py-3 font-jakarta text-[16px] font-semibold transition-all duration-300 bg-[#0092D7] text-white hover:bg-[#33A8DF] w-fit">
              Discover SkladTech
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}