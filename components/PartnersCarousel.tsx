'use client'

import { useState, useEffect } from 'react'
import { partners } from '@/lib/data'

export default function PartnersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partners.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const visiblePartners = partners.slice(currentIndex, currentIndex + 5).concat(
    partners.slice(0, Math.max(0, 5 - (partners.length - currentIndex)))
  )

  return (
    <div className="container overflow-hidden">
      <div className="mb-10 flex flex-col items-center">
        <h2 className="title-72 text-black mt-5">Partners & Sponsors</h2>
      </div>
      
      <div className="overflow-hidden">
        <div className="flex items-stretch gap-5">
          {visiblePartners.map((partner, index) => (
            <div
              key={partner.id}
              className="min-w-0 shrink-0 grow-0 basis-full md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <div className="flex w-full flex-col items-center gap-5 text-center">
                <div className="h-40 w-full overflow-hidden rounded-lg bg-white px-10 py-5 shadow-lg">
                  <div className="h-full w-full bg-linear-to-br from-gray-100 to-gray-200"></div>
                </div>
                <small className="text-sm font-medium text-gray-700">{partner.name}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}