export default function SectorsSection() {
  const sectors = [
    { title: 'Road Freight', slug: 'road', image: '/images/image.png' },
    { title: 'Rail Freight', slug: 'rail', image: '/images/image.png' },
    { title: 'Air Freight', slug: 'air', image: '/images/image.png' },
        { title: 'Road Freight', slug: 'road', image: '/images/image.png' },
    { title: 'Rail Freight', slug: 'rail', image: '/images/image.png' },
    { title: 'Air Freight', slug: 'air', image: '/images/image.png' },
  ];

  return (
    <section className="bg-white py-32">
      <div className="w-full px-6 xl:px-10">
        <div className="mx-auto max-w-[1600px]">

          {/* ================= HEADER ================= */}
          <div className="mb-15 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            {/* LEFT */}
            <div>
              {/* LABEL */}
              <div className="mb-5 flex items-center gap-3">
                <img
                  src="/images/logo-icon-3.png"
                  alt="Sectors"
                  className="h-6 w-6"
                />
                <span className="text-sm font-medium text-gray-700">
                  Sectors
                </span>
              </div>

              {/* TITLE */}
              <h2 className="
                text-5xl 
                lg:text-6xl 
                font-[600] 
                leading-[0.95]
                tracking-tight
                whitespace-nowrap
                max-xl:whitespace-normal
              ">
                Discover 13 Product Sectors In-Demand
              </h2>
            </div>

            {/* RIGHT BUTTON */}
            <a href="/sectors">
              <button className="
                rounded-full 
                bg-[#005EB8] 
                px-10 
                py-4 
                text-white 
                font-semibold 
                transition 
                hover:bg-[#0074D9]
              ">
                Explore Sectors
              </button>
            </a>
          </div>

          {/* ================= CARDS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {sectors.map((sector, i) => (
              <a
                key={i}
                href={`/sectors/${sector.slug}`}
                className="group relative h-[460px] overflow-hidden"
              >
                {/* IMAGE */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${sector.image})` }}
                />

                {/* DARK GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                {/* TEXT */}
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-3xl font-bold text-white">
                    {sector.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
