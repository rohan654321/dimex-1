import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const TravelSection = () => {
  return (
    <div className="xl:!py-62 relative !py-40">
      <Image 
        src="/Trans_Russia_Previous_Exhibitors_1_68b0c1defd.png" 
        alt="Previous Exhibitors" 
        fill
        className="absolute inset-0 z-[-1] size-full object-cover"
      />
      <div className="flex-center container max-w-[1300px] flex-col gap-5 text-center text-white">
        <h2 className="title-72 text-white">TransRussia Awaits</h2>
        <p className="whitespace-pre-line">
          Whether you're traveling from across the globe or nearby, we've got you covered. Find all the essential information to ensure a smooth and hassle-free trip to TransRussia 2026.
        </p>
        <Link href="/plan-your-travel" className="block">
          <button className="flex-center group w-fit gap-2 overflow-hidden rounded-full px-10 py-3 font-jakarta text-[16px] font-semibold global-transition bg-mainColor2 text-white hover:bg-mainColor4">
            Plan Your Travel
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TravelSection;