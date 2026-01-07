import React from 'react';

const MapSection = () => {
  return (
    <div className="container flex flex-col items-start gap-5 py-10 text-black">
      <h2 className="title-72 text-black mb-5">Here's Where You Can Find Us!</h2>
      <div className="grid w-full gap-5 lg:grid-cols-2">
        <div className="rounded-xl bg-mainColor5 p-5">
          <div className="rte-style [&_h1]:lg:text-4xl [&_h2]:lg:text-3xl [&_h3]:lg:text-2xl [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:underline [&_blockquote]:relative [&_blockquote]:italic [&_blockquote]:bg-[#f9f9f9] [&_blockquote]:text-xl [&_blockquote]:w-fit [&_blockquote]:border-l-4 [&_blockquote]:border-black [&_blockquote]:p-5 [&_blockquote]:ml-5">
            <p style={{marginLeft: '0px'}}><strong>Venue</strong></p>
            <h4 style={{marginLeft: '0px'}}><strong>Russia, Moscow, Crocus Expo IEC, Pavilion 3</strong></h4>
          </div>
        </div>
        <div className="rounded-xl bg-mainColor5 p-5">
          <div className="rte-style [&_h1]:lg:text-4xl [&_h2]:lg:text-3xl [&_h3]:lg:text-2xl [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:underline [&_blockquote]:relative [&_blockquote]:italic [&_blockquote]:bg-[#f9f9f9] [&_blockquote]:text-xl [&_blockquote]:w-fit [&_blockquote]:border-l-4 [&_blockquote]:border-black [&_blockquote]:p-5 [&_blockquote]:ml-5">
            <p style={{marginLeft: '0px'}}><strong>Opening Hours</strong></p>
            <h4 style={{marginLeft: '0px'}}><strong>17, 18 March 2026: 10:00 -18:00</strong></h4>
            <h4 style={{marginLeft: '0px'}}><strong>19 March 2026: 10:00 -16:00</strong></h4>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div>Loading....</div>
        {/* Map component would go here */}
      </div>
    </div>
  );
};

export default MapSection;