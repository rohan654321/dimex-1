import React from 'react';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <div className="relative z-[1] flex flex-col justify-end bg-mainColor5 !pt-96">
      <div className="container flex flex-col justify-end !pt-0 !pb-10 text-white">
        <h2 className="title-72 text-white">About TransRussia</h2>
        <p className="max-w-6xl whitespace-pre-line py-5">Shaping Routes To A Seamless Supply Chain.</p>
      </div>
      <div className="absolute inset-0 z-[-1] size-full !py-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black"></div>
        <Image 
          src="/photorealistic_scene_with_warehouse_logistics_operations_bf55208e3d.jpg" 
          alt="TransRussia©24" 
          fill
          className="size-full object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default HeroSection;