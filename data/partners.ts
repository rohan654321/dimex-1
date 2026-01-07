// data/partners.ts
export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  type?: string;
}

export const partners: Partner[] = [
  {
    id: '1',
    name: 'Apace Digital Cargo',
    logoUrl: 'https://cdn.itegroupnews.com/APACE_Digital_Cargo_523bc2c2a2.webp',
    websiteUrl: 'https://apacedigitalcargo.com/',
    type: 'Media Partner'
  },
  {
    id: '2',
    name: 'Cargo Insights',
    logoUrl: 'https://cdn.itegroupnews.com/Cargo_Insights_e965193be1.webp',
    websiteUrl: 'https://cargoinsights.co/',
    type: 'Official Media Partner'
  },
  {
    id: '3',
    name: 'International Coordinating Council for Trans-Eurasian Transportation',
    logoUrl: 'https://cdn.itegroupnews.com/International_Coordinating_for_Trans0_Eurasian_Transportation_965b26881c.webp',
    websiteUrl: 'https://icctt.com/'
  },
  {
    id: '4',
    name: 'LOGIRUS',
    logoUrl: 'https://cdn.itegroupnews.com/LOGIRUS_34da1707d5.webp',
    websiteUrl: 'https://logirus.ru/',
    type: 'Media partner'
  },
  {
    id: '5',
    name: 'CargoTalk',
    logoUrl: 'https://cdn.itegroupnews.com/Cargo_Talk_ME_logo_final_ff5213a4fd.jpg',
    websiteUrl: 'https://www.cargotalkgcc.com/',
    type: 'Media Partner'
  },
  // Add more partners as needed
];