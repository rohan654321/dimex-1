import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PartnersSection = () => {
  const partners = [
    { name: "Apace Digital Cargo", logo: "/APACE_Digital_Cargo_523bc2c2a2.webp", link: "/partner/apace-digital-cargo" },
    { name: "Cargo Insights", logo: "/Cargo_Insights_e965193be1.webp", link: "/partner/cargo-insights" },
    { name: "International Coordinating Council for Trans-Eurasian Transportation", logo: "/International_Coordinating_for_Trans0_Eurasian_Transportation_965b26881c.webp", link: "/partner/international-coordinating-council-for-trans-eurasian-transportation" },
    { name: "LOGIRUS", logo: "/LOGIRUS_34da1707d5.webp", link: "/partner/logirus" },
    { name: "CargoTalk", logo: "/Cargo_Talk_ME_logo_final_ff5213a4fd.jpg", link: "/partner/cargo-talk" },
    { name: "Logistics 360 Magazine", logo: "/Logisics_360_magazine_a74756752e.webp", link: "/partner/logistics-360-magazine" },
    { name: "BizToday", logo: "/Logo_Biz_Today_International_JPG_dd5d3adcb2.jpg", link: "/partner/trans-russia-partner-1" },
    { name: "Logistics.ru", logo: "/Logistics_ru_12a920fd01.webp", link: "/partner/logistics-ru" },
    { name: "TravTalkME", logo: "/Trav_Talk_6aedd6c627.webp", link: "/partner/trav-talk-me" },
    { name: "The Council of Supply Chain Professionals", logo: "/Council_of_Supply_Chain_Professinoals_03e79f3b06.webp", link: "/partner/the-council-of-supply-chain-professionals" },
    { name: "Moneta Tanitim", logo: "/Moneta_Tanitim_184cdc84c1.png", link: "/partner/trans-russia-partner-Moneta-Tanitim" },
    { name: "Utikad", logo: "/Utikad_2dea1b273c.webp", link: "/partner/utikad" },
    { name: "VTB", logo: "/VTB_16f0fc5875.webp", link: "/partner/vtb" },
    { name: "Urban Transport News", logo: "/Urban_Transport_News_Logo_2bf4a1812c.png", link: "/partner/trans-russia-partner-2" },
    { name: "WIFFA", logo: "/wiffa_1_971b62e54d.jpg", link: "/partner/trans-russia-partner-WIFFA" },
    { name: "UND", logo: "/UND_f47b714866.webp", link: "/partner/und" },
    { name: "RZD-Partner", logo: "/RZD_Partner_0ac7d0f0a3.webp", link: "/partner/rzd-partner" },
    { name: "RZD Business Asset", logo: "/RZD_Business_Asset_aca7ff2f81.webp", link: "/partner/rzd-business-asset" },
    { name: "Asia MH", logo: "/Asis_MH_dabd0b8a7b.webp", link: "/partner/asia-mh" },
    { name: "The Business Year", logo: "/The_Business_Year_e20d1c0f9f.png", link: "/partner/the-business-year" },
    { name: "ICIB", logo: "/thumbnail_ICIB_Logo_24_834a8e19c7.jpg", link: "/partner/trans-russia-partner-3" },
    { name: "ATI.SU", logo: "/ati_su_b4828c6c22.webp", link: "/partner/ati-su" },
    { name: "ACU Logo", logo: "/air_cargo_update_619deee571.webp", link: "/partner/acu-logo" },
    { name: "CCL Logistics", logo: "/CCL_Logistics_03f22ff0ec.webp", link: "/partner/ccl-logistics" },
    { name: "Delo", logo: "/delo_8f41577290.webp", link: "/partner/delo" },
    { name: "Industry Outlook", logo: "/Industry_Outlook_675c960053.webp", link: "/partner/industry-outlook" },
    { name: "Rail Analysis", logo: "/Rail_Analysis_4f6be2dfa1.webp", link: "/partner/rail-analysis" },
    { name: "Plant & Equipment", logo: "/Plan_and_Equipment_e86fc0b547.webp", link: "/partner/plant-and-equipment" },
    { name: "Indian Transport & Logistics News (ITLN)", logo: "/logo_bedd7fc0a0.png", link: "/partner/indian-transport-and-logistics-news-itln" },
    { name: "ECARGOLOG", logo: "/Trans_Russia_Media_Partners_Logo_3_786e33bc12.png", link: "/partner/ecargolog" },
    { name: "Northern Lights Communications", logo: "/Trans_Russia_Media_Partners_Logo_5_32b91a53eb.png", link: "/partner/northern-lights-communications" },
    { name: "Dubai Exporters", logo: "/Trans_Russia_Media_Partners_Logo_2_643306cd6f.png", link: "/partner/dubai-exporters" },
    { name: "Transport Advancement", logo: "/Trans_Russia_Media_Partners_Logo_1_472363416a.png", link: "/partner/transport-advancement" },
    { name: "OEM Update", logo: "/Trans_Russia_Media_Partners_Logo_4_4f9087bdc6.png", link: "/partner/oem-update" },
    { name: "Logistics Insider", logo: "/Insider_logistics_6983a0e400.png", link: "/partner/trans-russia-partner-logisitics-insider" }
  ];

  return (
    <div className="container">
      <div className="relative" role="region" aria-roledescription="carousel">
        <div className="mb-10 flex flex-col items-center">
          <h2 className="title-72 text-black mt-5">Partners & Sponsors</h2>
        </div>
        <div className="overflow-hidden">
          <div className="flex -ml-4 items-stretch">
            {partners.map((partner, index) => (
              <div key={index} role="group" aria-roledescription="slide" className="min-w-0 shrink-0 grow-0 basis-full pl-4 h-auto md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <Link href={partner.link} className="flex w-full flex-col items-center gap-5 text-center">
                  <div className="h-40 w-full overflow-hidden rounded-lg px-10 py-5 shadow-lg">
                    <Image 
                      src={partner.logo} 
                      alt={partner.name} 
                      width={160}
                      height={160}
                      className="size-full object-contain"
                    />
                  </div>
                  <small className="text-sm">{partner.name}</small>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;