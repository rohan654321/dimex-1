// app/terms-of-visiting/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionContainer from "@/components/UI/SectionContainer";

// Types
interface Partner {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

interface DynamicBlockData {
  id: string;
  Title: string | null;
  Content: string | null;
  Button1?: {
    Text: string;
    Theme: string;
    LinkTo: string;
    Target: string;
  } | null;
  Button2?: any;
  Image?: {
    data: {
      attributes: {
        url: string;
      };
    } | null;
  };
  BackgroundColor?: string;
}

interface DynamicTextBlock {
  __typename: string;
  DynamicTextBlockTitle: string | null;
  DynamicTextBlockColumns: string;
  DynamicTextBlockData: DynamicBlockData[];
}

// Mock Data (in a real app, this would come from an API)
const termsOfVisitingPageData = {
  hero: {
    title: "Before you visit...",
    description:
      "Find all the terms and conditions you need before visiting Eurasia's biggest logistics and warehousing event.",
  },
  blocks: [
    {
      __typename: "ComponentSharedDynamicTextBlock",
      DynamicTextBlockTitle: null,
      DynamicTextBlockColumns: "One",
      DynamicTextBlockData: [
        {
          id: "614",
          Title: "Terms of Visiting",
          Content: `
            <p>VISITING RULES APPLICABLE TO THE EVENTS ORGANIZED BY ITE EXPO INTERNATIONAL LLC</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>Approved by Order of the General Director No. 0-19/ВД dated 13 August 2019</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>1. INTRODUCTION</p>
            <p>&nbsp;</p>
            <p>1.1. These Rules set out the procedure with respect to admission of visitors to the events (exhibitions, conferences etc., hereinafter individually referred to as an "Event") organized by ITE Expo International LLC (Principal State Registration Number 1187746748694, Taxpayer Identification Number 7708333955, hereinafter referred to as the "Organizer") as well as stipulate the rules of conduct to be followed by visitors of the Events.</p>
            <p>&nbsp;</p>
            <p>1.2. Visiting the Events is allowed only subject to reading these Rules and acceptance thereof by the respective visitor.</p>
            <p>&nbsp;</p>
            <p>1.3. Any rules of conduct set by administrations of exhibition centres where the relevant Events are held apply to the extent they are not contrary to these Rules.</p>
            <p>&nbsp;</p>
            <p>2. ADMISSION TO EVENTS</p>
            <p>&nbsp;</p>
            <p>2.1. A badge is a visitor identification document stating the surname, name and, if applicable, name of the organization the visitor represents, and entitles the visitor to be admitted to the relevant Event.</p>
            <p>&nbsp;</p>
            <p>2.2. Badges can be obtained by visitors in either of the following ways:</p>
            <p>&nbsp;</p>
            <p>2.3.1. Self-printout — if the visitor is registered at the official website of the Event;</p>
            <p>&nbsp;</p>
            <p>2.3.2. Collection at the reception desk at the entrance to the Event — in exchange for a ticket or invitation card, or subject to presentation of a VIP Card issued by the Organizer. Tickets are available at ticket offices at the entry to the territory of the exhibition centre. VIP Cards issued by the Organizer are valid subject to presentation of an appropriate identity documents by the visitors.</p>
            <p>&nbsp;</p>
            <p>2.3. In the cases set out in Clause 2.3.2 of these Rules a badge can be obtained only subject to handing a filled in and signed visitor questionnaire to a representative of the Organizer. Questionnaire forms are available at the reception desk of the respective Event.</p>
            <p>&nbsp;</p>
            <p>2.4. Mass media representatives may obtain badges only subject to completion of the accreditation procedure shown on the official Website of the Event.</p>
            <p>&nbsp;</p>
            <p>2.5. The right to attend an Event free of charge on the days determined by the Organizer may be granted to students of higher education institutions of the relevant profiles. The said persons may be admitted to an Event in accordance with the list certified by the higher education institution administration and agreed with the Organizer in advance; they must be accompanied by a representative of the respective higher education institution.</p>
            <p>&nbsp;</p>
            <p>2.6. To enter the premises where the Event is held, the barcode of the badge should be touched to the scanning device of the turnstile.</p>
            <p>&nbsp;</p>
            <p>2.7. Visitors are not allowed to transfer their badges to third parties. The Organizer may check whether the name and surname appearing on the badge correspond to the name and surname of the visitor, for which reason the persons supervising admission to the Event may demand that the visitor presents an appropriate identification document.</p>
            <p>&nbsp;</p>
            <p>2.8. A visitor whose badge is lost should contact the reception desk of the Event to have the badge restored.</p>
            <p>&nbsp;</p>
            <p>3. AGE RESTRICTIONS</p>
            <p>&nbsp;</p>
            <p>3.1. Persons under the age of 18 may attend the Events only if accompanied by adults, except for the cases set out in Clause 3.2 hereof.</p>
            <p>&nbsp;</p>
            <p>3.2. The Organizer may apply age restrictions in respect of visitor admission to an Event if and when required pursuant to the Federal Law "On Protecting Children from Information Harmful to Their Health and Development" dated 29 December 2010 No. 436-FZ. In such cases the applicable age restriction signs are shown on the official website of the Event, reception desks, tickets, invitations cards, as well as promotion and information materials dedicated to the respective Event.</p>
            <p>&nbsp;</p>
            <p>3.3. Access of persons under the age of 18 to the Events to which the "18+" age restriction applies is strictly prohibited. If a person distributing tickets, invitation cards and other documents giving the right to enter the Event, or a person supervising admission to the Event, has doubts as to whether the person willing to obtain a ticket, invitation card or any other document giving the right to enter the Event, or enter the Event, has reached 18 years of age, the person distributing tickets, invitation cards and other documents giving the right to enter the Event, or a person supervising admission to the Event, may demand that the visitor presents an appropriate identification document (including identification documents of foreign citizens and stateless persons in the Russian Federation) showing the visitor's age.</p>
            <p>&nbsp;</p>
            <p>4. RULES OF CONDUCT</p>
            <p>&nbsp;</p>
            <p>4.1. Visitors shall respect public order within the territory of the exhibition centre where the Event is held, as well as within the adjacent territory, and shall comply with lawful instructions of the Organizer and exhibition centre administration.</p>
            <p>&nbsp;</p>
            <p>4.2. Visitors are not allowed:</p>
            <p>&nbsp;</p>
            <p>4.2.1. To bring any fire, gas spray and cold arms into the premises where the Event is held;</p>
            <p>&nbsp;</p>
            <p>4.2.2. To bring any high explosive and inflammable materials, any kind of pyrotechnics, as well as toxic, poisonous and caustic substances into the premises where the Event is held;</p>
            <p>&nbsp;</p>
            <p>4.2.3. To bring and consume alcoholic beverages, narcotic and psychotropic substances within the premises where the Event is held, as well as to attend the Event being intoxicated by alcohol, drugs or toxic substances;</p>
            <p>&nbsp;</p>
            <p>4.2.4. To enter the premises where the Event is held with animals;</p>
            <p>&nbsp;</p>
            <p>4.2.5. To enter into the premises where the Event is held in upper garments if the cloakrooms are open;</p>
            <p>&nbsp;</p>
            <p>4.2.6. To bring food and drinks into the premises where the Event is held;</p>
            <p>&nbsp;</p>
            <p>4.2.7. To move around the premises where the Event is held by bicycles, scooters, roller skates and other similar transport and sports facilities while attending the Event;</p>
            <p>&nbsp;</p>
            <p>4.2.8. To cross the carriageway marked with continuous lines within the inner part of the exhibition centre where the Event is held beyond pedestrian crossings, as well as move on the carriageway;</p>
            <p>&nbsp;</p>
            <p>4.2.9. To perform actions that might cause: threat for the property of the Organizer, exhibitors taking part in the Event and/or exhibition centre, as well as life or health of the people being within the premises where the Event is held; obstacles or disruptions in ensuring safety of the Event;</p>
            <p>&nbsp;</p>
            <p>4.2.10. To leave children unattended;</p>
            <p>&nbsp;</p>
            <p>4.2.11. To make writings, paste up and share print productions, posters, flyers and other information or promotion materials, as well as carry out advocacy work without written consent of the Organizer;</p>
            <p>&nbsp;</p>
            <p>4.2.12. To organize and hold unauthorized rallies, demonstrations, processions, picketing, as well as any other unauthorized promotion campaigns and flash mobs within the premises where the Event is held;</p>
            <p>&nbsp;</p>
            <p>4.2.13. To beg; to pollute and clog the territory where the Event is held;</p>
            <p>&nbsp;</p>
            <p>4.2.14. To enter the territory where the Event is held in filthy clothes; with luggage, substances and food that could smear other visitors and exhibits;</p>
            <p>&nbsp;</p>
            <p>4.2.15. To smoke in the buildings and within the outdoor territory of the exhibition centre where the Event is held, except in specifically designated areas.</p>
            <p>&nbsp;</p>
            <p>4.3. Visitors shall immediately report any unattended belongings or suspicious items to a representative of the Organizer or exhibition centre employee.</p>
            <p>&nbsp;</p>
            <p>4.4. Visitors shall familiarize themselves with the fire evacuation plan placed at the entry to the premises where the Event is held.</p>
            <p>&nbsp;</p>
            <p>4.5. In case of an emergency within the territory where the Event is held visitors shall follow the instructions of the representatives of the Organizer and/or exhibition centre employees.</p>
            <p>&nbsp;</p>
            <p>5. LIABILITY</p>
            <p>&nbsp;</p>
            <p>5.1. A visitor may be denied access to the Event, or sent away from the Event without reimbursement of the entry fee, if the visitor:</p>
            <p>&nbsp;</p>
            <p>5.1.1. Has no ticket/invitation card for the Event;</p>
            <p>&nbsp;</p>
            <p>5.1.2. Refuses to undergo body search and/or present hand luggage and personal belongings for inspection;</p>
            <p>&nbsp;</p>
            <p>5.1.3. Attempts to enter the territory of the exhibition centre where the Event is held with items prohibited to bring in;</p>
            <p>&nbsp;</p>
            <p>5.1.4. Performs actions against the public order or begs;</p>
            <p>&nbsp;</p>
            <p>5.1.5. Fails to comply with these Rules and instructions of representatives of the Organizer and/or exhibition centre in accordance with the laws of the Russian Federation.</p>
            <p>&nbsp;</p>
            <p>5.2. A visitor having committed any unlawful acts may be handed to the representatives of law enforcement authorities for a decision on initiation of administrative or criminal proceedings in respect of the visitor to be made.</p>
            <p>&nbsp;</p>
            <p>5.3. Any damage caused to the property of the Organizer, exhibitors or exhibition centre shall be compensated pursuant to the laws of the Russian Federation.</p>
          `,
          Button1: null,
          Button2: null,
          BackgroundColor: "#F3F9FF",
          Image: { data: null },
        },
      ],
    },
  ],
  partners: {
    title: "Partners & Sponsors",
    items: [
      {
        id: "27",
        name: "Apace Digital Cargo",
        slug: "apace-digital-cargo",
        logo: "https://cdn.itegroupnews.com/APACE_Digital_Cargo_523bc2c2a2.webp",
      },
      {
        id: "38",
        name: "Cargo Insights",
        slug: "cargo-insights",
        logo: "https://cdn.itegroupnews.com/Cargo_Insights_e965193be1.webp",
      },
      {
        id: "31",
        name: "International Coordinating Council for Trans-Eurasian Transportation",
        slug: "international-coordinating-council-for-trans-eurasian-transportation",
        logo: "https://cdn.itegroupnews.com/International_Coordinating_for_Trans0_Eurasian_Transportation_965b26881c.webp",
      },
      {
        id: "17",
        name: "LOGIRUS",
        slug: "logirus",
        logo: "https://cdn.itegroupnews.com/LOGIRUS_34da1707d5.webp",
      },
      {
        id: "40",
        name: "CargoTalk",
        slug: "cargo-talk",
        logo: "https://cdn.itegroupnews.com/Cargo_Talk_ME_logo_final_ff5213a4fd.jpg",
      },
      {
        id: "34",
        name: "Logistics 360 Magazine",
        slug: "logistics-360-magazine",
        logo: "https://cdn.itegroupnews.com/Logisics_360_magazine_a74756752e.webp",
      },
      {
        id: "43",
        name: "BizToday",
        slug: "trans-russia-partner-1",
        logo: "https://cdn.itegroupnews.com/Logo_Biz_Today_International_JPG_dd5d3adcb2.jpg",
      },
      {
        id: "23",
        name: "Logistics.ru",
        slug: "logistics-ru",
        logo: "https://cdn.itegroupnews.com/Logistics_ru_12a920fd01.webp",
      },
    ],
  },
};

// Helper function to render HTML content safely
function RenderHTML({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function TermsOfVisitingPage() {
  if (!termsOfVisitingPageData) {
    notFound();
  }

  return (
    <div className="page-spacing-wrapper font-parabolica">
      {/* Hero Section */}
      <div className="relative z-1 flex flex-col justify-end bg-[#F3F9FF] pt-48!">
        <SectionContainer className="flex flex-col justify-end pt-0! pb-10!">
          <h2 className="title-72 text-black">{termsOfVisitingPageData.hero.title}</h2>
          <p className="max-w-6xl whitespace-pre-line py-5">
            {termsOfVisitingPageData.hero.description}
          </p>
        </SectionContainer>
      </div>

      {/* Terms Content Block */}
      <div className="animated-block">
        <div className="animated-block-target">
          <SectionContainer>
            <div className="grid size-full grid-cols-1 gap-5 mt-5">
              {termsOfVisitingPageData.blocks[0]?.DynamicTextBlockData?.map((block) => (
                <div
                  key={block.id}
                  className="z-1 relative flex size-full min-h-[500px] flex-col p-5 lg:p-10 text-gray-500"
                  style={block.BackgroundColor ? { backgroundColor: block.BackgroundColor } : {}}
                >
                  <div className="flex flex-col z-1 gap-5">
                    {block.Title && (
                      <h2 className="title-40 font-semibold title-40 text-gray-500">{block.Title}</h2>
                    )}
                    {block.Content && (
                      <div className="rte-style text-gray-500 lg:[&_h1]:text-4xl lg:[&_h2]:text-3xl lg:[&_h3]:text-2xl [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:underline [&_a]:text-gray-500 [&_blockquote]:relative [&_blockquote]:italic [&_blockquote]:bg-[#e6f0ff] [&_blockquote]:text-gray-500 [&_blockquote]:w-fit [&_blockquote]:border-l-4 [&_blockquote]:border-gray-500 [&_blockquote]:p-5 [&_blockquote]:ml-5">
                        <RenderHTML html={block.Content} />
                      </div>
                    )}
                    {block.Button1 && (
                      <div className="flex w-full flex-wrap gap-5"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionContainer>
        </div>
      </div>
    </div>
  );
}