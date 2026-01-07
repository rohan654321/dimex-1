import React from 'react';

import HeroSection from '@/components/section/HeroSection';
import StatsSection from '@/components/section/StatsSection';
import EcosystemSection from '@/components/section/EcosystemSection';
import SectorsSection from '@/components/section/SectorsSection';
import BrochureSection from '@/components/section/BrochureSection';
import ExhibitorsSection from '@/components/section/ExhibitorsSection';
import ConferenceSection from '@/components/section/ConferenceSection';
import ConnectSection from '@/components/ConnectSection';
import TravelSection from '@/components/section/TravelSection';
import QuickNavigationSection from '@/components/section/QuickNavigationSection';
import PartnersSection from '@/components/PartnersSection';
import MapSection from '@/components/section/MapSection';

export default function AboutTransRussia() {
  return (
    <>
      {/* Intro Loader */}
      <div id="intro" className="fixed inset-0 z-[100] grid place-content-center bg-mainColor1">
        <div className="loader"></div>
      </div>



      {/* Back to Top Button */}
      <div className="fixed bottom-3 right-3 lg:bottom-10 lg:right-2 z-50 transition-all duration-300 opacity-0 translate-y-10 pointer-events-none">
        <button aria-label="Back to top" className="m-0 rounded-full border-none bg-white p-0 outline-none drop-shadow-lg">
          <svg className="size-10 fill-mainColor1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M22 12c0-5.522-4.476-10-10-10C6.479 2 2 6.479 2 12c0 5.524 4.478 10 10 10c5.524 0 10-4.476 10-10zm-14.53.28a.75.75 0 0 1-.073-.976l.073-.084l4-4a.75.75 0 0 1 .977-.073l.085.072l4 4.002a.75.75 0 0 1-.977 1.133l-.084-.073l-2.72-2.721v6.691a.75.75 0 0 1-.649.743l-.102.007a.75.75 0 0 1-.743-.648l-.007-.102v-6.69l-2.72 2.72a.75.75 0 0 1-.976.072l-.084-.072z"></path>
          </svg>
        </button>
      </div>

      <main>
        <div className="page-spacing-wrapper">
          <HeroSection />
          
          <div className="animated-block">
            <div className="animated-block-target">
              <StatsSection />
            </div>
          </div>

          <div className="animated-block">
            <div className="animated-block-target">
              <EcosystemSection />
            </div>
          </div>

          <div className="animated-block">
            <div className="animated-block-target">
              <SectorsSection />
            </div>
          </div>

          <div className="animated-block">
            <div className="animated-block-target">
              <BrochureSection />
            </div>
          </div>

          <div className="animated-block">
            <div className="animated-block-target">
              <ExhibitorsSection />
            </div>
          </div>

          <div className="animated-block">
            <div className="animated-block-target">
              <MapSection />
            </div>
          </div>

          <div className="animated-block">
            <div className="animated-block-target">
              <ConferenceSection />
            </div>
          </div>

          <div className="animated-block">
            <div className="animated-block-target">
              <ConnectSection />
            </div>
          </div>

          <div className="animated-block">
            <div className="animated-block-target">
              <TravelSection />
            </div>
          </div>

          <div className="animated-block">
            <div className="animated-block-target">
              <QuickNavigationSection />
            </div>
          </div>

          <div className="animated-block">
            <div className="animated-block-target">
              <PartnersSection />
            </div>
          </div>
        </div>
      </main>

    </>
  );
}