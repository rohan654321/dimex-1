// components/HeroSection.tsx
export default function HeroSection() {
  return (
    <section id="heroSection" className="relative min-h-screen text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-[-2] overflow-hidden">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "url(/images/image.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-[-1] bg-black/50 md:bg-linear-to-t md:from-black/70 md:via-black/40 md:to-transparent" />

      {/* FULL WIDTH WRAPPER (same as navbar logic) */}
      <div className="min-h-screen w-full px-6 xl:px-10">
        {/* CONTENT WIDTH CONTROL (not container) */}
        <div className="mx-auto flex min-h-screen max-w-[1600px]">
          <div className="flex w-full flex-col justify-end gap-6 pb-16">
            {/* MAIN TITLE */}
            <h1 className="text-[170px] leading-[0.8] font-bold tracking-tight">
              TransRussia <span className="text-[#33A8DF]">2026</span>
            </h1>

            {/* BOTTOM ROW */}
            <div className="mt-8 flex w-full items-end justify-between gap-8">
              {/* LEFT TEXT */}
              <div className="max-w-[1100px]">
                <h2 className="mb-1 text-3xl font-bold leading-tight">
                  Where global logistics companies connect with CIS market leaders
                </h2>

                <ul className="text-lg">
                  <li className="flex gap-1">
                    <span className="text-[#f2f4f5]">•</span>
                    <span>
                      30th Edition of the International Exhibition for Transport &
                      Logistics Services, Warehouse Equipment, and Technologies
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-[#dbdfe0]">•</span>
                    <span>
                      5th Edition of SkladTech Leading B2B Exhibition for Warehouse
                      Equipment
                    </span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="shrink-0">
                <a href="/exhibiting-enquiry">
                  <button className="rounded-full bg-[#33A8DF] px-12 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#33A8DF]/40">
                    Book Your Stand
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
