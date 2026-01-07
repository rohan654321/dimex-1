import React from 'react';

const StatsSection = () => {
  const stats = [
    { value: "30,500", label: "Visitors" },
    { value: "600+", label: "Exhibitors" },
    { value: "50+", label: "Countries Represented" },
    { value: "13", label: "Event Sectors" }
  ];

  return (
    <div className="relative z-[1] overflow-hidden">
      <div className="container">
        <div className="flex flex-col gap-5">
          <h2 className="title-72 text-black">Shaping the Future of Transport and Logistics</h2>
          <p className="whitespace-pre-line">
            TransRussia is Eurasia's largest transport and logistics exhibition, featuring top companies across rail, road, sea, air, warehousing, and IT. This year, the 30th edition, held alongside SkladTech - a special warehouse equipment showcase will run from March 17-19, 2026, at Crocus Expo IEC, Pavilion 3 in Moscow.
          </p>
          <a href="/why-exhibit" className="block">
            <button className="flex-center group w-fit gap-2 overflow-hidden rounded-full px-10 py-3 font-jakarta text-[16px] font-semibold global-transition bg-mainColor2 text-white hover:bg-mainColor4">
              Why Exhibit
            </button>
          </a>
        </div>
      </div>
      <div className="mt-10 bg-mainColor5 py-10">
        <div className="container grid sm:grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="grid items-stretch lg:justify-center">
              <div className="flex flex-col border-b border-black/10 pb-5 max-lg:pb-5 sm:w-fit">
                <h3 className="title-60 mb-1 font-bold text-mainColor2">{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;