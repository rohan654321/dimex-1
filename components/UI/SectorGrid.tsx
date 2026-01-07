import Link from 'next/link'

interface Sector {
  id: number
  title: string
  slug: string
  image: string
  shortText?: string
}

interface SectorGridProps {
  sectors: Sector[]
}

export default function SectorGrid({ sectors }: SectorGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sectors.map((sector) => (
        <Link
          key={sector.id}
          href={`/sectors/${sector.slug}`}
          className="group relative aspect-square w-full overflow-hidden rounded-lg shadow-md hover:shadow-lg global-transition"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
          
          <div 
            className="absolute inset-0 bg-cover bg-center global-transition group-hover:scale-105"
            style={{ backgroundImage: `url(${sector.image})` }}
          />
          
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
            <h3 className="text-white text-base md:text-lg font-semibold mb-1 line-clamp-2">
              {sector.title}
            </h3>
            {sector.shortText && (
              <p className="text-gray-200 text-xs opacity-0 group-hover:opacity-100 global-transition line-clamp-2">
                {sector.shortText}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}