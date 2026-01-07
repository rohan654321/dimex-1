import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const QuickNavigationSection = () => {
  const navigationItems = [
    {
      number: "01",
      title: "Become an Exhibitor",
      description: "Connect with 30,000+ logistics professionals across 3 days for unparalleled networking opportunities.",
      image: "/TR_24_IMG_1001i_81aab0ef5c.jpg",
      link: "/exhibiting-enquiry",
      buttonText: "Book a Stand"
    },
    {
      number: "02",
      title: "Download Your Event Brochure",
      description: "Find out who we are, what we do, and how best we can help you achieve your strategic business goals all wrapped up in our concise event brochure.",
      image: "/Untitled_500_x_500_px_309_x_274_px_ff2199315c.png",
      link: "/event-brochure",
      buttonText: "Download Now"
    },
    {
      number: "03",
      title: "Contact Us",
      description: "Not ready to become an exhibitor? Why not visit the exhibition for free and find out what to expect for the following edition",
      image: "/TR_24_IMG_0683i_0b1dc919c3.jpg",
      link: "/contact-us",
      buttonText: "Contact Us"
    }
  ];

  return (
    <div className="container overflow-hidden">
      <div className="mb-14 flex flex-wrap justify-between gap-10 lg:items-end">
        <div className="lg:basis-2/3">
          <h2 className="title-72 text-black my-3">Quick Navigation</h2>
          <p className="whitespace-pre-line">Simplifying Your Participation Journey</p>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {navigationItems.map((item, index) => (
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

export default QuickNavigationSection;