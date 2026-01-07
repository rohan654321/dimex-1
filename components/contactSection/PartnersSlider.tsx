// components/PartnersSlider.tsx
import { partners } from '@/data/partners';

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  type?: string;
}

export default function PartnersSlider() {
  return (
    <div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8" role="region" aria-roledescription="carousel">
        <div className="mb-10 flex flex-col items-center">
          <h2 className="title-72 text-black mt-5">Partners & Sponsors</h2>
        </div>
        
        <div className="overflow-hidden">
          <div className="flex -ml-4 items-stretch animate-scroll">
            {/* First set of partners */}
            {partners.map((partner: Partner) => (
              <div 
                key={partner.id}
                role="group" 
                aria-roledescription="slide" 
                className="min-w-0 shrink-0 grow-0 basis-full pl-4 h-auto md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <a 
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full flex-col items-center gap-5 text-center hover:opacity-90 transition-opacity"
                >
                  <div className="h-40 w-full overflow-hidden rounded-lg px-10 py-5 shadow-lg bg-white">
                    <img 
                      alt={`${partner.name} logo`}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-contain"
                      src={partner.logoUrl}
                      style={{ color: 'transparent' }}
                    />
                  </div>
                  <small className="text-sm font-medium">{partner.name}</small>
                  {partner.type && (
                    <span className="text-xs text-gray-500">{partner.type}</span>
                  )}
                </a>
              </div>
            ))}
            
            {/* Duplicate for infinite scroll effect */}
            {partners.map((partner: Partner) => (
              <div 
                key={`${partner.id}-duplicate`}
                role="group" 
                aria-roledescription="slide" 
                className="min-w-0 shrink-0 grow-0 basis-full pl-4 h-auto md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <a 
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full flex-col items-center gap-5 text-center hover:opacity-90 transition-opacity"
                >
                  <div className="h-40 w-full overflow-hidden rounded-lg px-10 py-5 shadow-lg bg-white">
                    <img 
                      alt={`${partner.name} logo`}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-contain"
                      src={partner.logoUrl}
                      style={{ color: 'transparent' }}
                    />
                  </div>
                  <small className="text-sm font-medium">{partner.name}</small>
                  {partner.type && (
                    <span className="text-xs text-gray-500">{partner.type}</span>
                  )}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}