// components/ExploreMoscowSection.tsx
export default function ExploreMoscowSection() {
  return (
    <section className="relative z-1 overflow-hidden py-20">
      <div className="container">
        <div className="flex flex-col gap-5">
          <h2 className="text-[72px] leading-[0.9] font-bold text-black">
            Explore Moscow Beyond the Exhibition
          </h2>
          <a href="/explore-moscow" className="block">
            <button className="flex items-center justify-center group gap-2 overflow-hidden rounded-full px-10 py-3 font-jakarta text-[16px] font-semibold transition-all duration-300 bg-[#0092D7] text-white hover:bg-[#33A8DF] w-fit">
              City Guide
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}