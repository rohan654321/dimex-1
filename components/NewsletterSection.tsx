export default function NewsletterSection() {
  return (
    <section className="py-32">
      {/* GLOBAL WIDTH SYSTEM */}
      <div className="w-full px-6 xl:px-10">
        <div className="mx-auto max-w-[1600px]">
          
          {/* CARD */}
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#0b1f3f] to-[#0a2348] px-10 py-14 text-white md:px-14 lg:px-20">
            
            {/* LEFT CONTENT */}
            <div className="relative z-10 max-w-[720px] space-y-6">
              <h2 className="text-[56px] leading-[1.05] font-bold tracking-tight">
                Join our Newsletter
              </h2>

              <p className="text-[18px] leading-relaxed text-white/90">
                Don&apos;t miss out on the latest with our weekly newsletter,
                bringing you not only the latest updates from the event but also
                cutting-edge insights from the entire industry. Don&apos;t miss
                out—subscribe now for more
              </p>

              <a href="/newsletter" className="inline-block pt-4">
                <button className="rounded-full bg-white px-8 py-3 text-[15px] font-semibold text-[#0b1f3f] transition hover:bg-[#0092D7] hover:text-white">
                  Sign up Today
                </button>
              </a>
            </div>

            {/* IMAGE */}
            <img
              src="/images/image.png"
              alt="Newsletter"
              className="pointer-events-none absolute bottom-0 right-0 z-10 hidden h-[150px] object-contain lg:block"
            />

            {/* BACKGROUND CIRCLES */}
            <div className="pointer-events-none absolute -bottom-[35%] -right-[8%] z-0 h-[520px] w-[520px] rounded-full bg-[#0092D7]/25" />
            <div className="pointer-events-none absolute -bottom-[20%] -right-[3%] z-0 h-[360px] w-[360px] rounded-full bg-[#0092D7]/25" />
          </div>
        </div>
      </div>
    </section>
  );
}
