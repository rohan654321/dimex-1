import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const EcosystemSection = () => {
  const ecosystemItems = [
    {
      number: "01",
      title: "The Exhibition",
      description: `At the heart of the ecosystem is the annual TransRussia exhibition in Moscow. It brings together the full spectrum of the transport and logistics sector, offering a high-impact platform to:

- Establish direct, face-to-face business connections.
 
- Showcase advanced solutions in video surveillance, access control, cybersecurity, fire safety, and perimeter protection.
 
- Meet thousands of security integrators, installers, distributors, and corporate buyers all in one place from 17 - 19 March 2026.`,
      image: "/TR_2025_161_da551e1607.jpg",
      link: "/about-transrussia",
      buttonText: "Know More"
    },
    {
      number: "02",
      title: "Conference and Summit",
      description: `Throughout the exhibition and beyond, the ecosystem includes a robust program of conferences, forums, and summits. These events are curated to foster dialogue around logistics innovations, policy, and market trends.

- Gain insights from experts on the latest logistics trends and market challenges.

- Explore innovative transport solutions, supply chain technologies, and infrastructure developments.

- Build valuable professional connections with industry peers, freight owners, and decision-makers.`,
      image: "/TR_2025_159_0d4f744777.jpg",
      link: "/conference-programme",
      buttonText: "Conference Programme"
    },
    {
      number: "03",
      title: "TransRussia Connect",
      description: `TransRussia Connect is the ecosystem's digital layer — an online platform designed to keep the conversation going before, during, and after the exhibition. Through Connect, participants can:

- Network with buyers, suppliers, and industry peers 365 days a year.

- Access curated content, market news, and exhibitor updates.

- Schedule meetings and follow up on new business leads online.`,
      image: "/Untitled_design_92_3f5e8a1454.png",
      link: "/connect",
      buttonText: "Join Connect"
    }
  ];

  return (
    <div className="container overflow-hidden">
      <div className="mb-14 flex flex-wrap justify-between gap-10 lg:items-end">
        <div className="lg:basis-2/3">
          <h2 className="title-72 text-black my-3">TransRussia Moscow: A Year-Round Logistics Ecosystem</h2>
          <p className="whitespace-pre-line">
            TransRussia is Eurasia's leading international exhibition for transport and logistics services. With a strong track record and industry trust, it plays a key role in connecting logistics providers, freight forwarders, cargo owners, and infrastructure operators from across Eurasia.
          </p>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {ecosystemItems.map((item, index) => (
          <div key={index} className="group flex flex-col gap-5 rounded-2xl border border-black/10 bg-white p-5 xl:p-7">
            <div className="flex-between">
              <Image 
                src={item.image} 
                alt={item.title} 
                width={64}
                height={64}
                className="mb-5 size-16 rounded-full object-cover"
              />
              <h4 className="title-32">{item.number}</h4>
            </div>
            <h4 className="title-32 font-semibold text-black">{item.title}</h4>
            <p className="mb-10 whitespace-pre-line">{item.description}</p>
            <Link href={item.link} className="mt-auto block w-full">
              <button className="flex-center group gap-2 overflow-hidden rounded-full px-10 py-3 font-jakarta text-[16px] font-semibold global-transition bg-mainColor2 text-white hover:bg-mainColor4 w-full">
                {item.buttonText}
              </button>
            </Link>
          </div>
        ))}
      </div>
      <Image 
        src="/imgs/shape.png" 
        alt="Shape" 
        width={900}
        height={900}
        className="absolute right-0 top-0 z-[-1] size-[900px] object-contain hidden lg:block"
      />
    </div>
  );
};

export default EcosystemSection;