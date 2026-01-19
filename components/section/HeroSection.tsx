import React from "react"
import Image from "next/image"
import SectionContainer from "@/components/UI/SectionContainer"

const HeroSection = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <Image
        src="/images/image.png"
        alt="TransRussia©24"
        fill
        priority
        className="object-cover"
      />

      {/* GRADIENT (BOTTOM ONLY) */}
      <div className="absolute bottom-0 h-[45%] w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-end">
        <SectionContainer>
          <div className="pb-25 text-white">
            <h2 className="title-72">About DIEMEX 2026</h2>
            <p className="mt-4 max-w-6xl text-lg">
              Shaping the Future of Die & Mould Manufacturing.
            </p>
          </div>
        </SectionContainer>
      </div>
    </section>
  )
}

export default HeroSection
