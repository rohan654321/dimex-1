// components/ExploreMoscowSection.tsx
export default function ExploreMoscowSection() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* SAME WIDTH SYSTEM AS OTHER SECTIONS */}
      <div className="w-full px-6 xl:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-8">
            
            {/* HEADING */}
            <h2 className="text-6xl md:text-5xl lg:text-6xl font-[600] leading-[0.85] tracking-tight text-black">
              Explore Moscow Beyond the Exhibition
            </h2>

            {/* DESCRIPTION */}
            <div className="max-w-3xl space-y-6">
              <p className="text-lg md:text-xl leading-relaxed text-black">
                Make the most of your visit to TransRussia by exploring the
                vibrant city of Moscow. Discover cultural landmarks, business
                districts, and networking opportunities that complement your
                exhibition experience.
              </p>
            </div>

            {/* CTA */}
            <a href="/explore-moscow" className="mt-6 w-fit">
              <button className="flex items-center justify-center gap-2 rounded-full bg-[#0092D7] px-10 py-4 text-[16px] font-semibold text-white transition-all duration-300 hover:bg-[#33A8DF]">
                City Guide
              </button>
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}
