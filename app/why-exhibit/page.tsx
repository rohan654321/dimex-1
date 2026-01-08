"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const WhyExhibitPage = () => {
  return (
    <div>
      {/* Hero Section - Fixed */}
      <div className="page-spacing-wrapper">
        <div className="relative z-[1] flex min-h-[700px] flex-col justify-end bg-mainColor5 !pt-96">
          <div className="container relative z-10 flex flex-col justify-end !pt-0 !pb-16 text-white">
            {/* Countdown Timer */}
            <div className="mb-10">
              <div className="inline-block rounded-full bg-white/20 px-8 py-3 backdrop-blur-sm">
                <p className="font-mono text-3xl font-bold">
                  <span className="text-mainColor2">67</span> Days{' '}
                  <span className="text-mainColor2">19</span> Hours{' '}
                  <span className="text-mainColor2">33</span> Mins
                </p>
              </div>
            </div>
            
            <h1 className="title-72 text-white mb-6 leading-tight">
              Unlock New Opportunities at <br />
              <span className="text-mainColor2">TransRussia</span>
            </h1>
            <p className="max-w-3xl text-xl leading-relaxed mb-10">
              Discover new possibilities at TransRussia 2026. Be where the logistics industry gathers to innovate, collaborate, and be at the forefront of logistics excellence.
            </p>
            
            {/* Date and Location */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="size-7 shrink-0 fill-mainColor2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm106.5 150.5L228.8 332.8h-.1c-1.7 1.7-6.3 5.5-11.6 5.5-3.8 0-8.1-2.1-11.7-5.7l-56-56c-1.6-1.6-1.6-4.1 0-5.7l17.8-17.8c.8-.8 1.8-1.2 2.8-1.2 1 0 2 .4 2.8 1.2l44.4 44.4 122-122.9c.8-.8 1.8-1.2 2.8-1.2 1.1 0 2.1.4 2.8 1.2l17.5 18.1c1.8 1.7 1.8 4.2.2 5.8z"></path>
                </svg>
                <p className="text-lg font-semibold">17 - 19 March 2026</p>
              </div>
              <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="size-7 shrink-0 fill-mainColor2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm106.5 150.5L228.8 332.8h-.1c-1.7 1.7-6.3 5.5-11.6 5.5-3.8 0-8.1-2.1-11.7-5.7l-56-56c-1.6-1.6-1.6-4.1 0-5.7l17.8-17.8c.8-.8 1.8-1.2 2.8-1.2 1 0 2 .4 2.8 1.2l44.4 44.4 122-122.9c.8-.8 1.8-1.2 2.8-1.2 1.1 0 2.1.4 2.8 1.2l17.5 18.1c1.8 1.7 1.8 4.2.2 5.8z"></path>
                </svg>
                <p className="text-lg font-semibold">Crocus Expo, Moscow</p>
              </div>
            </div>
            
            {/* CTA Button */}
            <Link href="/exhibiting-enquiry" className="block w-fit">
              <button className="flex-center group w-fit gap-3 overflow-hidden rounded-full px-14 py-4 font-jakarta text-[20px] font-bold global-transition bg-mainColor2 text-white hover:bg-mainColor4 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
                Enquire to Exhibit
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="size-6 transform transition-transform group-hover:translate-x-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
                </svg>
              </button>
            </Link>
          </div>
          
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0 size-full !py-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            <Image 
              alt="TransRussia 2026 Exhibition" 
              src="/images/image.png"
              fill
              priority
              className="size-full object-cover object-center"
              style={{ color: 'transparent' }}
            />
          </div>
        </div>
      </div>

      {/* Industry Comes Together Section */}
      <div className="animated-block py-24 bg-white">
        <div className="animated-block-target">
          <div className="container">
            <h2 className="title-72 text-black mb-14 text-center md:text-left">
              Where the Transport &<br className="hidden md:block" /> Logistics Industry Comes Together
            </h2>
            <div className="grid size-full grid-cols-1 gap-10 md:grid-cols-2">
              <div className="z-[1] relative flex size-full flex-col p-4 lg:p-6">
                <div className="flex flex-col z-[1] gap-8">
                  <div className="rte-style text-lg leading-relaxed text-gray-700">
                    <p className="mb-6 text-xl">TransRussia is a prime gateway to tap into the thriving logistics and transport sector within one of the world's largest economies.</p>
                    <p className="mb-10 text-xl">With Russia's strategic location and a market size of over 145 million people, the country presents significant growth potential for companies looking to expand their operations and optimize supply chains.</p>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-5 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mainColor2 flex-shrink-0">
                          <span className="text-2xl font-bold text-white">30.5K</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-black mb-2">30,500 Visitors</h3>
                          <p className="text-gray-600">Industry professionals from across the globe</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-5 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mainColor2 flex-shrink-0">
                          <span className="text-2xl font-bold text-white">600+</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-black mb-2">600+ Exhibitors</h3>
                          <p className="text-gray-600">Leading companies showcasing innovations</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-5 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mainColor2 flex-shrink-0">
                          <span className="text-2xl font-bold text-white">50+</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-black mb-2">50+ Countries Represented</h3>
                          <p className="text-gray-600">Global participation and networking</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex w-full flex-wrap gap-5 pt-8">
                    <Link href="/exhibiting-enquiry">
                      <button className="flex-center group w-fit gap-3 overflow-hidden rounded-full px-12 py-4 font-jakarta text-[18px] font-semibold global-transition bg-mainColor2 text-white hover:bg-mainColor4 hover:scale-105 transform transition-all duration-300">
                        Enquire to Exhibit
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="size-5 transform transition-transform group-hover:translate-x-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="z-[1] relative flex size-full min-h-[550px] flex-col overflow-hidden rounded-3xl shadow-2xl">
                <Image 
                  alt="TransRussia Exhibition Hall" 
                  src="/images/image.png"
                  fill
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 hover:scale-110"
                  style={{ color: 'transparent' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits Section - Fixed 6 Cards Layout */}
      <div className="animated-block py-24 bg-gray-50">
        <div className="animated-block-target">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="flex-center w-fit gap-3 py-2 pe-6 pl-2 capitalize mx-auto bg-white rounded-full px-6 shadow-sm">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-5 text-mainColor2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                </svg>
                <span className="text-mainColor2 font-bold">Key Benefits</span>
              </div>
              <h2 className="title-72 text-black my-8">Reasons Why You Should Exhibit</h2>
              <p className="whitespace-pre-line max-w-4xl mx-auto text-xl text-gray-600 leading-relaxed">
                TransRussia provides an unmatched platform for professionals in the transportation and logistics sector to present cutting-edge solutions to a qualified audience of industry leaders and decision-makers. With budgets dedicated to optimising supply chains and expanding operational efficiency, exhibiting at TransRussia offers you the opportunity to make valuable connections, establish strategic partnerships, and drive growth in a competitive market.
              </p>
            </div>
            
            <div className="mt-12 h-px w-full bg-gray-300"></div>
            
            {/* 6 Cards Grid - Fixed Layout */}
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 */}
              <div className="group flex flex-col gap-6 p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-black group-hover:text-mainColor2 transition-colors">Want to grow internationally?</h3>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mainColor2 group-hover:bg-mainColor4 transition-all duration-500 group-hover:rotate-12 flex-shrink-0 ml-4">
                    <Image 
                      src="/filtering_17929669_e485cd3789.png"
                      alt="International Growth"
                      width={28}
                      height={28}
                      className="text-white"
                    />
                  </div>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Connect with buyers and partners from over 50 countries who attend TransRussia to discover global solutions.
                </p>
              </div>
              
              {/* Card 2 */}
              <div className="group flex flex-col gap-6 p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-black group-hover:text-mainColor2 transition-colors">Facing challenges entering the market?</h3>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mainColor2 group-hover:bg-mainColor4 transition-all duration-500 group-hover:rotate-12 flex-shrink-0 ml-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Gain direct access to decision-makers and partners across Eurasia's logistics and transportation sectors.
                </p>
              </div>
              
              {/* Card 3 */}
              <div className="group flex flex-col gap-6 p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-black group-hover:text-mainColor2 transition-colors">Need better lead generation?</h3>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mainColor2 group-hover:bg-mainColor4 transition-all duration-500 group-hover:rotate-12 flex-shrink-0 ml-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Build a pipeline of leads from industries such as freight forwarding, manufacturing, and e-commerce logistics.
                </p>
              </div>
              
              {/* Card 4 */}
              <div className="group flex flex-col gap-6 p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-black group-hover:text-mainColor2 transition-colors">Struggling to measure impact?</h3>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mainColor2 group-hover:bg-mainColor4 transition-all duration-500 group-hover:rotate-12 flex-shrink-0 ml-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  TransRussia delivers tangible results, from new leads to direct sales and strengthened partnerships.
                </p>
              </div>
              
              {/* Card 5 */}
              <div className="group flex flex-col gap-6 p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-black group-hover:text-mainColor2 transition-colors">Concerned about cost and complexity?</h3>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mainColor2 group-hover:bg-mainColor4 transition-all duration-500 group-hover:rotate-12 flex-shrink-0 ml-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Meet partners to simplify your supply chain and operations across Eurasia.
                </p>
              </div>
              
              {/* Card 6 */}
              <div className="group flex flex-col gap-6 p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-black group-hover:text-mainColor2 transition-colors">Brand struggling to get noticed?</h3>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mainColor2 group-hover:bg-mainColor4 transition-all duration-500 group-hover:rotate-12 flex-shrink-0 ml-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Showcase your unique solutions in front of a targeted audience in a competitive environment.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-20">
              <Link href="/exhibiting-enquiry" className="inline-block">
                <button className="flex-center group w-fit gap-3 overflow-hidden rounded-full px-16 py-5 font-jakarta text-[20px] font-bold global-transition bg-mainColor2 text-white hover:bg-mainColor4 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl">
                  Enquire to Exhibit
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="size-6 transform transition-transform group-hover:translate-x-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CIS Growth Section */}
      <div className="animated-block py-24 bg-white">
        <div className="animated-block-target">
          <div className="container">
            <h2 className="title-72 text-black mb-16 text-center">Why Expand to the CIS?</h2>
            <div className="grid size-full grid-cols-1 gap-8 md:grid-cols-3">
              <div className="group relative flex size-full min-h-[400px] flex-col justify-end overflow-hidden rounded-3xl p-8 text-white before:absolute before:inset-0 before:z-[1] before:bg-gradient-to-t before:from-black/90 before:via-black/50 before:to-transparent transition-all duration-700 hover:scale-[1.02]">
                <Image 
                  alt="CIS Market Growth" 
                  src="/images/image.png"
                  fill
                  className="absolute inset-0 size-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  style={{ color: 'transparent' }}
                />
                <div className="flex flex-col z-[1] gap-6">
                  <h2 className="title-48 font-bold text-white mb-4">$88.38 Billion</h2>
                  <p className="text-xl font-medium">by 2024</p>
                  <p className="text-lg opacity-90">Russia's logistics market is on track to reach this milestone, supported by a resilient economy with a GDP surpassing $2 trillion.</p>
                </div>
              </div>
              
              <div className="group relative flex size-full min-h-[400px] flex-col justify-end overflow-hidden rounded-3xl p-8 text-white before:absolute before:inset-0 before:z-[1] before:bg-gradient-to-t before:from-black/90 before:via-black/50 before:to-transparent transition-all duration-700 hover:scale-[1.02]">
                <Image 
                  alt="Growing Demand" 
                  src="/images/image.png"
                  fill
                  className="absolute inset-0 size-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  style={{ color: 'transparent' }}
                />
                <div className="flex flex-col z-[1] gap-6">
                  <h2 className="title-48 font-bold text-white mb-4">Growth in Demand</h2>
                  <p className="text-xl font-medium">Exponential Expansion</p>
                  <p className="text-lg opacity-90">As the Russian economy rebounds, there's growing need for cutting-edge solutions in surveillance, access control, and cybersecurity.</p>
                </div>
              </div>
              
              <div className="group relative flex size-full min-h-[400px] flex-col justify-end overflow-hidden rounded-3xl p-8 text-white before:absolute before:inset-0 before:z-[1] before:bg-gradient-to-t before:from-black/90 before:via-black/50 before:to-transparent transition-all duration-700 hover:scale-[1.02]">
                <Image 
                  alt="Market Forecast" 
                  src="/images/image.png"
                  fill
                  className="absolute inset-0 size-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  style={{ color: 'transparent' }}
                />
                <div className="flex flex-col z-[1] gap-6">
                  <h2 className="title-48 font-bold text-white mb-4">$108.78 Billion</h2>
                  <p className="text-xl font-medium">by 2029</p>
                  <p className="text-lg opacity-90">Forecasted market size, offering exciting avenues for investment and innovation in one of the world's largest markets.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-8 rounded-2xl bg-mainColor5">
              <p className="text-xl text-center text-gray-700 italic">
                "As Russia's logistics landscape continues to expand, the market is forecasted to reach $108.78 billion by 2029, offering exciting avenues for investment and innovation in one of the world's largest markets."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Sectors Section - Fixed with proper layout */}
      <div className="animated-block py-24 bg-gray-50">
        <div className="animated-block-target">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
              <div className="lg:col-span-8">
                <div className="flex-center w-fit gap-3 py-2 pe-6 pl-2 capitalize">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-5 text-mainColor2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                  </svg>
                  <span className="text-mainColor2 font-bold">Event Sectors</span>
                </div>
                <h2 className="title-72 text-black my-6">From Freight to Technology<br />Discover our Core Sectors</h2>
              </div>
              <div className="flex lg:col-span-4 lg:justify-end">
                <Link href="/sectors" className="block">
                  <button className="flex-center group w-full lg:w-fit gap-3 overflow-hidden rounded-full px-10 py-4 font-jakarta text-[18px] font-semibold global-transition bg-mainColor2 text-white hover:bg-mainColor4 hover:scale-105 transform transition-all duration-300">
                    Explore Our 13 Sectors
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="size-5 transform transition-transform group-hover:translate-x-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
            
            {/* 6 Sector Cards - Grid Layout */}
          <div className="group relative min-h-[500px] w-full overflow-hidden rounded-2xl transition-transform duration-500 hover:scale-[1.02]">

  {/* IMAGE LAYER */}
  <div className="absolute inset-0 z-0">
    <Image
      alt="Road Freight Transportation"
      src="/images/image.png"
      fill
      priority
      sizes="(max-width: 1024px) 100vw, 33vw"
      className="object-cover transition-transform duration-700 group-hover:scale-110"
    />
  </div>

  {/* GRADIENT OVERLAY */}
  <div
    className="
      absolute inset-0 z-10
      bg-gradient-to-t from-black/90 via-black/60 to-transparent
      transition-all duration-500
      group-hover:from-black/70
      group-hover:via-black/40
    "
  />

  {/* CONTENT */}
  <div className="relative z-20 flex h-full flex-col justify-end p-8 text-white">
    <h5 className="title-32 font-bold mb-4 transition-colors duration-300 group-hover:text-mainColor2">
      Road Freight Transportation
    </h5>

    <p className="text-lg leading-relaxed opacity-0 translate-y-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
      Comprehensive road transport solutions for efficient cargo movement across Eurasia's extensive road networks.
    </p>
  </div>

</div>

          </div>
        </div>
      </div>

      {/* Brochure Download Section - Fixed */}
      <div className="animated-block py-24 bg-white">
        <div className="animated-block-target">
          <div className="container text-white">
            <div className="relative z-[1] min-h-[350px] w-full space-y-8 overflow-hidden rounded-3xl bg-gradient-to-r from-mainColor1 to-mainColor3 p-8 max-lg:pb-60 lg:p-12">
              <div className="absolute bottom-0 right-0 w-full md:w-1/2 h-full">
                <Image 
                  alt="Brochure Preview" 
                  src="/images/image.png"
                  fill
                  className="object-contain object-bottom-right"
                  style={{ color: 'transparent' }}
                />
              </div>
              <h2 className="title-72 text-white max-w-2xl">Download Your Event Brochure</h2>
              <p className="max-w-2xl text-xl leading-relaxed">
                Get a comprehensive look at the event's attendees, the sectors on display, and the key industry players present.
              </p>
              <Link href="/event-brochure" className="block">
                <button className="flex-center group w-fit gap-3 overflow-hidden rounded-full px-12 py-4 font-jakarta text-[18px] font-semibold global-transition bg-white text-mainColor2 hover:bg-mainColor2 hover:text-white hover:scale-105 transform transition-all duration-300">
                  Download Now
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="size-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path>
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section - Fixed with proper layout */}
      <div className="animated-block py-24 bg-white">
        <div className="animated-block-target">
          <div className="relative container" role="region" aria-roledescription="carousel">
            <div className="mb-12 flex justify-between max-lg:flex-col lg:items-end">
              <div className="lg:basis-2/3">
                <div className="flex-center w-fit gap-3 py-2 pe-6 pl-2 capitalize">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-5 text-mainColor2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.8 4.6c-2.1-1.3-4.7-2-7.5-2C5.1 2.6 0 7.7 0 14c0 4.4 2.9 8.1 6.8 9.4.5.1.7 0 .9-.3l1.2-1.9c.1-.2.1-.4 0-.6-.2-.3-.4-.6-.7-1-.3-.4-.6-.8-.9-1.3-.2-.4-.1-.8.1-1.2.8-1.4 1.3-2.9 1.5-4.4.1-.7.2-1.3.2-2 .4-1.8 1.9-3.2 3.8-3.2s3.4 1.4 3.8 3.2c0 .7.1 1.3.2 2 .2 1.5.7 3 1.5 4.4.2.3.2.7.1 1.1-.3.5-.6.9-.9 1.3-.3.4-.5.8-.7 1.1-.1.2-.1.4 0 .6l1.2 1.9c.2.2.4.3.9.3 3.9-1.3 6.8-5 6.8-9.4 0-4.2-2.3-7.9-5.7-9.4z"></path>
                  </svg>
                  <span className="text-mainColor2 font-bold">Testimonials</span>
                </div>
                <h2 className="title-72 text-black my-6">Trusted by Industry Leaders</h2>
              </div>
              
              {/* Navigation Buttons - Top Right Corner */}
              <div className="flex items-center gap-3 mt-6 lg:mt-0">
                <div className="flex items-center gap-2 mr-4">
                  <span className="text-sm text-gray-500">Slide</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((dot) => (
                      <div key={dot} className={`w-2 h-2 rounded-full ${dot === 1 ? 'bg-mainColor2' : 'bg-gray-300'}`}></div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-center group w-12 h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-mainColor2 hover:text-white transition-all duration-300 hover:scale-105">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" className="w-5 h-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"></path>
                    </svg>
                  </button>
                  <button className="flex-center group w-12 h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-mainColor2 hover:text-white transition-all duration-300 hover:scale-105">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" className="w-5 h-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-hidden">
              <div className="flex">
                <div role="group" aria-roledescription="slide" className="min-w-full shrink-0 grow-0 basis-full">
                  <div className="flex flex-col gap-8 max-lg:flex-col lg:items-center lg:gap-16 bg-white rounded-3xl p-8 shadow-lg">
                    <div className="w-full lg:w-1/3">
                      <div className="relative h-64 lg:h-80 w-full rounded-2xl overflow-hidden">
                        <Image 
                          alt="FESCO Executive" 
                          src="/images/image.png"
                          fill
                          className="object-cover"
                          style={{ color: 'transparent' }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-mainColor2 flex items-center justify-center">
                              <span className="text-white text-xl font-bold">FESCO</span>
                            </div>
                            <div>
                              <h5 className="text-white font-bold text-lg">FESCO</h5>
                              <p className="text-gray-300 text-sm">Transport Group</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full lg:w-2/3">
                      <div className="relative">
                        <svg className="absolute -left-4 -top-4 w-12 h-12 text-mainColor2 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <p className="text-2xl lg:text-3xl mb-8 leading-relaxed text-gray-800 font-medium italic">
                          "We participate and will continue to participate at TransRussia because of the year-on-year growth in quality contacts and business opportunities."
                        </p>
                        <div>
                          <h5 className="text-2xl font-bold text-black mb-2">ALEXEY KRAVCHENKO</h5>
                          <p className="text-gray-600 text-lg">Sales Director, FESCO Transport Group</p>
                          <div className="flex items-center gap-4 mt-6">
                            <div className="flex">
                              {[1,2,3,4,5].map((star) => (
                                <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-gray-500">5-star rating</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Profile Section */}
      <div className="animated-block py-24 bg-gray-50">
        <div className="animated-block-target">
          <div className="relative z-[1] overflow-hidden">
            <div className="container">
              <div className="flex flex-col gap-8">
                <h2 className="title-72 text-black text-center lg:text-left">Visitor Profile</h2>
                <p className="whitespace-pre-line text-xl text-gray-700 leading-relaxed max-w-4xl">
                  Discover the professionals shaping the future of logistics and transportation. TransRussia attracts a highly targeted audience of decision-makers, industry leaders, and innovators from across the globe. From senior executives in freight and supply chain management to specialists in e-commerce logistics and technology, our visitors come with clear objectives—to find solutions, forge partnerships, and drive businesses forward.
                </p>
                <Link href="/post-show-report" className="block w-fit">
                  <button className="flex-center group w-fit gap-3 overflow-hidden rounded-full px-12 py-4 font-jakarta text-[18px] font-semibold global-transition bg-mainColor2 text-white hover:bg-mainColor4 hover:scale-105 transform transition-all duration-300">
                    Know More Insights - Download Your Post-Show Report
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="size-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path>
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="mt-16 bg-white py-16">
              <div className="container grid sm:grid-cols-2 gap-12 lg:grid-cols-4">
                <div className="grid items-stretch lg:justify-center">
                  <div className="flex flex-col items-center text-center border-b border-gray-200 pb-8 max-lg:pb-8 sm:w-fit">
                    <h3 className="title-72 mb-4 font-bold text-mainColor2">48%</h3>
                    <p className="text-xl font-semibold text-gray-800">Transportation and Logistics Companies</p>
                    <p className="text-gray-600 mt-2">Carriers, freight forwarders, 3PL providers</p>
                  </div>
                </div>
                <div className="grid items-stretch lg:justify-center">
                  <div className="flex flex-col items-center text-center border-b border-gray-200 pb-8 max-lg:pb-8 sm:w-fit">
                    <h3 className="title-72 mb-4 font-bold text-mainColor2">40%</h3>
                    <p className="text-xl font-semibold text-gray-800">Cargo Owners, Manufacturers, Wholesales, Retail</p>
                    <p className="text-gray-600 mt-2">Shippers and consignees</p>
                  </div>
                </div>
                <div className="grid items-stretch lg:justify-center">
                  <div className="flex flex-col items-center text-center border-b border-gray-200 pb-8 max-lg:pb-8 sm:w-fit">
                    <h3 className="title-72 mb-4 font-bold text-mainColor2">31%</h3>
                    <p className="text-xl font-semibold text-gray-800">Head of Departments</p>
                    <p className="text-gray-600 mt-2">Senior management and decision-makers</p>
                  </div>
                </div>
                <div className="grid items-stretch lg:justify-center">
                  <div className="flex flex-col items-center text-center border-b border-gray-200 pb-8 max-lg:pb-8 sm:w-fit">
                    <h3 className="title-72 mb-4 font-bold text-mainColor2">12%</h3>
                    <p className="text-xl font-semibold text-gray-800">IT Solutions, Insurance, Foreign Trade Agencies</p>
                    <p className="text-gray-600 mt-2">Support and service providers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exhibitors Snapshot Section - Fixed with logo grid */}
      <div className="animated-block py-24 bg-white">
        <div className="animated-block-target">
          <div className="container">
            <h2 className="title-72 text-black mb-16 text-center">A Snapshot of Our Exhibitors</h2>
            
            {/* Logo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
              {[
                { name: "BTB", logo: "/images/image.png" },
                { name: "Globaltrans", logo: "/images/image.png" },
                { name: "Swift", logo: "/images/image.png" },
                { name: "Almark", logo: "/images/image.png" },
                { name: "PKU Logistics", logo: "/images/image.png" },
                { name: "FESCO", logo: "/images/image.png" }
              ].map((company, index) => (
                <div key={index} className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 h-32">
                  <div className="relative h-16 w-full">
                    <div className="flex items-center justify-center h-full">
                      <span className="text-xl font-bold text-gray-800">{company.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/exhibitor-list">
                <button className="flex-center group w-fit gap-3 overflow-hidden rounded-full px-14 py-5 font-jakarta text-[20px] font-bold global-transition bg-mainColor2 text-white hover:bg-mainColor4 hover:scale-105 transform transition-all duration-300 shadow-xl">
                  View The 2026 Exhibitor List
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="size-6 transform transition-transform group-hover:translate-x-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Info Section - Fixed Banner */}
      <div className="animated-block py-24 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        <div className="animated-block-target">
          <div className="relative !py-24">
            <Image 
              alt="Moscow Skyline" 
              src="/images/image.png"
              fill
              className="absolute inset-0 z-[-1] size-full object-cover opacity-40"
              style={{ color: 'transparent' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-black/90 z-[-1]"></div>
            <div className="flex-center container max-w-[1300px] flex-col gap-8 text-center text-white relative z-10">
              <h2 className="title-72 text-white">Your Journey Starts Here:<br />Essential Travel Info for TransRussia 2026</h2>
              <p className="whitespace-pre-line text-xl max-w-3xl leading-relaxed">
                Whether you're travelling from across the globe or nearby, we've got you covered. Find all the essential information to ensure a smooth and hassle-free trip to TransRussia Moscow 2026.
              </p>
              <Link href="/plan-your-travel" className="block">
                <button className="flex-center group w-fit gap-3 overflow-hidden rounded-full px-14 py-5 font-jakarta text-[20px] font-bold global-transition bg-mainColor2 text-white hover:bg-mainColor4 hover:scale-105 transform transition-all duration-300 shadow-xl">
                  Plan Your Travel
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="size-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152V422.8c0 9.8-6 18.6-15.1 22.3L416 503V200.4zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6V451.8L32.9 502.7C17.1 509 0 497.4 0 480.4V209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77V504.3L192 449.4V255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path>
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Section */}
      <div className="animated-block py-24 bg-white">
        <div className="animated-block-target">
          <div className="container overflow-hidden">
            <div className="mb-16 flex flex-wrap justify-between gap-10 lg:items-end">
              <div className="lg:basis-2/3">
                <div className="flex-center w-fit gap-3 py-2 pe-6 pl-2 capitalize">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="size-5 text-mainColor2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                  </svg>
                  <span className="text-mainColor2 font-bold">TransRussia/ Skladtech</span>
                </div>
                <h2 className="title-72 text-black my-6">Quick Navigation</h2>
                <p className="whitespace-pre-line text-xl text-gray-700 max-w-2xl">Simplifying Your Participation Journey</p>
              </div>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              <div className="group flex flex-col gap-6 rounded-3xl border-2 border-gray-100 bg-white p-8 xl:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex-between">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-mainColor2 group-hover:bg-mainColor4 transition-colors duration-500">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="title-40 text-gray-300">01</h4>
                </div>
                <h4 className="title-32 font-bold text-black">Become an Exhibitor</h4>
                <p className="mb-8 text-lg text-gray-600 leading-relaxed">
                  Connect with 30,500+ logistics professionals across 3 days for unparalleled networking opportunities.
                </p>
                <Link href="/exhibiting-enquiry" className="mt-auto block w-full">
                  <button className="flex-center group gap-3 overflow-hidden rounded-full px-8 py-4 font-jakarta text-[18px] font-semibold global-transition bg-mainColor2 text-white hover:bg-mainColor4 w-full">
                    Book a Stand
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="size-5 transform transition-transform group-hover:translate-x-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
                    </svg>
                  </button>
                </Link>
              </div>
              
              <div className="group flex flex-col gap-6 rounded-3xl border-2 border-gray-100 bg-white p-8 xl:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex-between">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-mainColor2 group-hover:bg-mainColor4 transition-colors duration-500">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="title-40 text-gray-300">02</h4>
                </div>
                <h4 className="title-32 font-bold text-black">Download Event Brochure</h4>
                <p className="mb-8 text-lg text-gray-600 leading-relaxed">
                  Find out what we do and how best we can help you achieve your strategic business goals all wrapped up in our event brochure.
                </p>
                <Link href="/event-brochure" className="mt-auto block w-full">
                  <button className="flex-center group gap-3 overflow-hidden rounded-full px-8 py-4 font-jakarta text-[18px] font-semibold global-transition bg-mainColor2 text-white hover:bg-mainColor4 w-full">
                    Download Now
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="size-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path>
                    </svg>
                  </button>
                </Link>
              </div>
              
              <div className="group flex flex-col gap-6 rounded-3xl border-2 border-gray-100 bg-white p-8 xl:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex-between">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-mainColor2 group-hover:bg-mainColor4 transition-colors duration-500">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="title-40 text-gray-300">03</h4>
                </div>
                <h4 className="title-32 font-bold text-black">Become a Visitor</h4>
                <p className="mb-8 text-lg text-gray-600 leading-relaxed">
                  Not ready to become an exhibitor? Why not visit the exhibition for free and find out what to expect for the following edition.
                </p>
                <Link href="/visitor-registration" className="mt-auto block w-full">
                  <button className="flex-center group gap-3 overflow-hidden rounded-full px-8 py-4 font-jakarta text-[18px] font-semibold global-transition bg-mainColor2 text-white hover:bg-mainColor4 w-full">
                    Visitor Registration
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="size-5 transform transition-transform group-hover:translate-x-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* When and Where Section */}
      <div className="animated-block py-24 bg-gray-50">
        <div className="animated-block-target">
          <div className="container flex flex-col items-start gap-8 text-black">
            <h2 className="title-72 text-black mb-8">When and Where</h2>
            <div className="grid w-full gap-8 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-8 shadow-xl">
                <div className="rte-style">
                  <h3 className="text-3xl font-bold text-mainColor2 mb-4">Venue</h3>
                  <h4 className="text-2xl font-bold text-black mb-4">Crocus Expo IEC, Pavilion 3</h4>
                  <p className="text-lg text-gray-600 mb-2">Russia, Moscow</p>
                  <p className="text-gray-500">Krasnogorsky District, Moscow Region</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-xl">
                <div className="rte-style">
                  <h3 className="text-3xl font-bold text-mainColor2 mb-4">Opening Hours</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-bold text-black">17, 18 March 2026</h4>
                      <p className="text-lg text-gray-600">10:00 - 18:00</p>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-black">19 March 2026</h4>
                      <p className="text-lg text-gray-600">10:00 - 16:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="w-full h-[400px] rounded-2xl overflow-hidden mt-8">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-gray-500">Interactive map will load here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Slider - Automatic */}
      <div className="animated-block py-24 bg-white">
        <div className="animated-block-target">
          <div className="relative container overflow-hidden">
            <div className="mb-16 text-center">
              <h2 className="title-72 text-black mt-5">Partners & Sponsors</h2>
              <p className="text-gray-600 mt-6 text-xl">Trusted by industry leaders worldwide</p>
            </div>
            
            {/* Automatic Slider */}
            <div className="relative overflow-hidden">
              <div className="flex animate-slide">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="min-w-[250px] mx-4">
                    <div className="h-40 w-full rounded-2xl bg-white p-8 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-20 w-40">
                        <div className="flex items-center justify-center h-full w-full">
                          <div className="h-16 w-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 font-medium">Partner Logo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white to-transparent"></div>
              <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent"></div>
            </div>
            
            {/* Slider Controls */}
            <div className="flex justify-center gap-4 mt-12">
              <button className="flex-center group w-14 h-14 rounded-full bg-gray-100 text-gray-600 hover:bg-mainColor2 hover:text-white transition-all duration-300">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" className="w-6 h-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"></path>
                </svg>
              </button>
              <button className="flex-center group w-14 h-14 rounded-full bg-mainColor2 text-white hover:bg-mainColor4 transition-all duration-300">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" className="w-6 h-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          {/* CSS for automatic slider animation */}
          <style jsx>{`
            @keyframes slide {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-250px * 15)); }
            }
            .animate-slide {
              animation: slide 40s linear infinite;
              display: flex;
              width: calc(250px * 30);
            }
            .animate-slide:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="title-32 text-white mb-6">TransRussia & SkladTech</h3>
              <p className="text-gray-300 mb-6 text-lg">
                TransRussia is Eurasia's leading international exhibition for transport and logistics services, warehouse equipment, and IT solutions. It brings together shippers, carriers, freight forwarders, and technology providers to explore innovations, build partnerships, and optimise supply chains across Eurasia and beyond.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mainColor2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Contact Us</p>
                  <p className="text-gray-300">+7-(495)-799-55-85</p>
                  <p className="text-gray-300">marketing@ite.group</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6">Quick Links</h4>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/exhibiting-enquiry" className="text-gray-300 hover:text-mainColor2 transition-colors">
                  Become an Exhibitor
                </Link>
                <Link href="/post-show-report" className="text-gray-300 hover:text-mainColor2 transition-colors">
                  Download Post-Show Report
                </Link>
                <Link href="/event-brochure" className="text-gray-300 hover:text-mainColor2 transition-colors">
                  Download Event Brochure
                </Link>
                <Link href="/visitor-registration" className="text-gray-300 hover:text-mainColor2 transition-colors">
                  Visitor Registration
                </Link>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-700">
                <p className="text-gray-400">
                  © TransRussia - 2025. All Right Reserved | Terms of Use | Privacy Policy | Cookie Policy | Sitemap
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyExhibitPage;