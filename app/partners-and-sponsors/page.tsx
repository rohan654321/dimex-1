'use client';

import React from 'react';

/* ===================== TYPES ===================== */

interface Partner {
  name: string;
  role: string;
  logo: string;
  exploreLink: string;
  websiteLink?: string;
  description?: string;
}

interface PartnerCardProps {
  partner: Partner;
  index: number;
}

interface PartnersSectionProps {
  title: string;
  partners: Partner[];
  sectionKey: string;
}

/* ===================== MAIN COMPONENT ===================== */

const PartnersSponsors: React.FC = () => {
  /* ===================== DATA ===================== */

  const partnersData: Record<string, Partner[]> = {
    supportingPartner2026: [
      {
        name: 'ICIB',
        role: 'Supporting Partner',
        logo: 'https://cdn.itegroupnews.com/thumbnail_ICIB_Logo_24_834a8e19c7.jpg',
        exploreLink: '/partner/trans-russia-partner-3/',
        websiteLink: 'http://www.icib.org.in/',
        description: 'Supporting Partner',
      },
    ],
    officialMediaPartner2026: [
      {
        name: 'Cargo Insights',
        role: 'Official Media Partner',
        logo: 'https://cdn.itegroupnews.com/Cargo_Insights_e965193be1.webp',
        exploreLink: '/partner/cargo-insights/',
        websiteLink: 'https://cargoinsights.co/',
        description: 'Official Media Partner',
      },
    ],
    transRussiaOfficialBank: [
      {
        name: 'VTB',
        role: 'TransRussia Official Bank',
        logo: 'https://cdn.itegroupnews.com/VTB_16f0fc5875.webp',
        exploreLink: '/partner/vtb/',
        websiteLink: 'https://www.vtb.ru/',
        description: 'TransRussia Official Bank',
      },
    ],
    wifiPartner: [
      {
        name: 'RZD Business Asset',
        role: 'Wi-Fi Partner',
        logo: 'https://cdn.itegroupnews.com/RZD_Business_Asset_aca7ff2f81.webp',
        exploreLink: '/partner/rzd-business-asset/',
        websiteLink: 'https://www.rzd-partner.ru/',
        description: 'General Media Partner',
      },
    ],
    coOrganizer: [
      {
        name:
          'International Coordinating Council for Trans-Eurasian Transportation',
        role: 'Co-organizer',
        logo:
          'https://cdn.itegroupnews.com/International_Coordinating_for_Trans0_Eurasian_Transportation_965b26881c.webp',
        exploreLink:
          '/partner/international-coordinating-council-for-trans-eurasian-transportation/',
        websiteLink: 'https://icctt.com/',
      },
    ],
    businessProgramPartner: [
      {
        name: 'The Council of Supply Chain Professionals',
        role: 'Business Programme Partner',
        logo:
          'https://cdn.itegroupnews.com/Council_of_Supply_Chain_Professinoals_03e79f3b06.webp',
        exploreLink:
          '/partner/the-council-of-supply-chain-professionals/',
        websiteLink: 'https://scmpro.ru/',
        description: 'Business Programme Partner',
      },
    ],
    mediaPartners: [
      {
        name: 'The Business Year',
        role: 'Media Partner',
        logo:
          'https://cdn.itegroupnews.com/The_Business_Year_e20d1c0f9f.png',
        exploreLink: '/partner/the-business-year/',
        websiteLink: 'https://thebusinessyear.com/',
      },
      {
        name: 'Indian Transport & Logistics News (ITLN)',
        role: 'Media Partner',
        logo: 'https://cdn.itegroupnews.com/logo_bedd7fc0a0.png',
        exploreLink:
          '/partner/indian-transport-and-logistics-news-itln/',
        websiteLink: 'https://www.itln.in/',
      },
      {
        name: 'Apace Digital Cargo',
        role: 'Media Partner',
        logo:
          'https://cdn.itegroupnews.com/APACE_Digital_Cargo_523bc2c2a2.webp',
        exploreLink: '/partner/apace-digital-cargo/',
        websiteLink: 'https://apacedigitalcargo.com/',
      },
    ],
  };

  /* ===================== COMPONENTS ===================== */

  const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
    return (
      <div className="flex flex-col overflow-hidden rounded-xl border border-mainColor1 transition-all duration-300 hover:shadow-xl lg:flex-row">
        <div className="flex h-48 w-full items-center justify-center border-b border-mainColor1 py-8 lg:h-auto lg:w-1/3 lg:border-b-0 lg:border-r">
          <div className="h-32 w-32 lg:h-40 lg:w-40">
            <img
              src={partner.logo}
              alt={partner.name}
              loading="lazy"
              className="h-full w-full object-contain p-2"
            />
          </div>
        </div>

        <div className="flex grow flex-col justify-between bg-mainColor1 p-6 text-white lg:p-8">
          <div>
            <h3 className="text-xl font-semibold line-clamp-2">
              {partner.name}
            </h3>
            {partner.description && (
              <p className="mt-2 text-sm opacity-90">
                {partner.description}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={partner.exploreLink}>
              <button className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-mainColor2 transition hover:bg-mainColor2 hover:text-white">
                Explore
              </button>
            </a>

            {partner.websiteLink && (
              <a href={partner.websiteLink} target="_blank">
                <button className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-mainColor2 transition hover:bg-mainColor2 hover:text-white">
                  Visit Website
                </button>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  const PartnersSection: React.FC<PartnersSectionProps> = ({
    title,
    partners,
    sectionKey,
  }) => {
    return (
      <section className="py-20">
        <div className="w-full px-6 xl:px-10">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="mb-10 text-4xl font-semibold text-black lg:text-5xl">
              {title}
            </h2>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {partners.map((partner, index) => (
                <PartnerCard
                  key={`${sectionKey}-${index}`}
                  partner={partner}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  /* ===================== RENDER ===================== */

  return (
    <div className="pt-[140px]">
      {/* HERO */}
<section className="bg-mainColor5 bg-gray-50 py-24 mb-12">
  <div className="w-full px-6 xl:px-10">
    <div className="mx-auto max-w-[1600px]">
      <h1 className="mb-4 text-6xl font-[600]">
        The legendary organisations that help bring TransRussia to life
      </h1>
      <p className="max-w-4xl text-lg text-gray-500">
        You find all our sponsors and partners on this page
      </p>
    </div>
  </div>
</section>


      <PartnersSection
        title="Supporting Partner 2026"
        partners={partnersData.supportingPartner2026}
        sectionKey="supporting"
      />

      <PartnersSection
        title="Official Media Partner 2026"
        partners={partnersData.officialMediaPartner2026}
        sectionKey="official-media"
      />

      <PartnersSection
        title="TransRussia Official Bank"
        partners={partnersData.transRussiaOfficialBank}
        sectionKey="official-bank"
      />

      <PartnersSection
        title="Wi-Fi Partner"
        partners={partnersData.wifiPartner}
        sectionKey="wifi"
      />

      <PartnersSection
        title="Co-organizer of the TransRussia International Conference"
        partners={partnersData.coOrganizer}
        sectionKey="co-organizer"
      />

      <PartnersSection
        title="Business Programme Partner"
        partners={partnersData.businessProgramPartner}
        sectionKey="business-program"
      />

      <PartnersSection
        title="Media Partners"
        partners={partnersData.mediaPartners}
        sectionKey="media-partners"
      />
    </div>
  );
};

export default PartnersSponsors;
