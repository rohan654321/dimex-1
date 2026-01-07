import React from 'react';
import Link from 'next/link';

const ExhibitorsSection = () => {
  return (
    <div className="container">
      <h2 className="title-72 text-black mb-10">A Glimpse of Our 2026 Exhibitors</h2>
      <div className="grid size-full grid-cols-1 gap-5">
        <div className="z-[1] relative flex size-full min-h-[500px] flex-col p-5 lg:p-10">
          <div className="flex flex-col z-[1] gap-5">
            <h2 className="title-40 font-semibold title-40">Participating in TransRussia Boosts Your Business Growth and Visibility</h2>
            <div className="rte-style [&_h1]:lg:text-4xl [&_h2]:lg:text-3xl [&_h3]:lg:text-2xl [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:underline [&_blockquote]:relative [&_blockquote]:italic [&_blockquote]:bg-[#f9f9f9] [&_blockquote]:text-xl [&_blockquote]:w-fit [&_blockquote]:border-l-4 [&_blockquote]:border-black [&_blockquote]:p-5 [&_blockquote]:ml-5"></div>
            <div className="flex w-full flex-wrap gap-5">
              <Link href="/exhibitor-list" target="_blank" rel="noopener noreferrer">
                <button className="flex-center group w-fit gap-2 overflow-hidden rounded-full px-10 py-3 font-jakarta text-[16px] font-semibold global-transition bg-mainColor2 text-white hover:bg-mainColor4">
                  View Our 2026 Exhibitor List
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitorsSection;