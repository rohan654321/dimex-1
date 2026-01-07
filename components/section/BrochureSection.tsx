import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BrochureSection = () => {
  return (
    <div className="container text-white">
      <div className="relative z-[1] min-h-[300px] w-full space-y-5 overflow-hidden rounded-3xl bg-mainColor1 p-5 max-lg:pb-60 lg:p-10">
        <Image 
          src="/Brochure_Mockup_8_f53822fd4a.png" 
          alt="Brochure Mockup" 
          width={500}
          height={500}
          className="size-auto absolute bottom-0 right-0"
        />
        <h2 className="title-72 text-white">Download Your Event Brochure</h2>
        <p className="max-w-6xl whitespace-pre-line">
          Make sure you grab your copy of the event brochure to learn more about the show and explore your participation opportunities.
        </p>
        <Link href="/event-brochure" className="block">
          <button className="flex-center group w-fit gap-2 overflow-hidden rounded-full px-10 py-3 font-jakarta text-[16px] font-semibold global-transition bg-white text-mainColor2 hover:bg-mainColor2 hover:text-white">
            Download Now
          </button>
        </Link>
        <div className="circles flex-center absolute bottom-[-40%] end-[-3%] z-[-1] size-[400px]">
          <div className="absolute size-full rounded-full bg-mainColor2 opacity-50"></div>
          <div className="absolute size-2/3 rounded-full bg-mainColor2 opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default BrochureSection;