// pages/index.tsx - Main page component
import React from 'react';
import TransRussiaPage from '@/components/TransRussiaPage';
import BackToTop from '../exhibitor-resource-center/component/BackToTop';

// This would typically come from an API or CMS
const pageData = {
  navbarData: {
    NavText: {
      Text1: "08-10 October 2026",
      Text2: "Auto Cluster Exhibition Centre, Pune"
    },
    Data: [
      {
        id: "2",
        Title: "Exhibit",
        LinkTo: "exhibiting-enquiry",
        MenuAttached: true,
        Links: [
          { id: "279", Text: "Why Exhibit", LinkTo: "why-exhibit", NewTab: false },
          { id: "1747", Text: "Why Exhibit - Turkey Exhibitors", LinkTo: "turkiye-exhibitors-turkish", NewTab: false },
          { id: "1894", Text: "Why Exhibit - India Exhibitors", LinkTo: "india-exhibitors", NewTab: false },
          { id: "124", Text: "Become an Exhibitor", LinkTo: "exhibiting-enquiry", NewTab: false },
          { id: "110", Text: "Event Sectors", LinkTo: "sectors", NewTab: false },
          { id: "823", Text: "Exhibitor List 2026", LinkTo: "exhibitor-list", NewTab: true },
          { id: "112", Text: "Plan your travel", LinkTo: "plan-your-travel", NewTab: false },
          { id: "1011", Text: "Exhibitor Resource Centre", LinkTo: "exhibitor-resource-center", NewTab: false },
          { id: "1908", Text: "Exhibitor Promotion", LinkTo: "free-promo", NewTab: false }
        ]
      },
      {
        id: "1",
        Title: "Attend",
        LinkTo: null,
        MenuAttached: true,
        Links: [
          { id: "111", Text: "Why Visit", LinkTo: "why-visit", NewTab: false },
          { id: "127", Text: "2026 Exhibitor List", LinkTo: "exhibitor-list", NewTab: true },
          { id: "126", Text: "Event Sector", LinkTo: "sectors", NewTab: false },
          { id: "398", Text: "Download Event Brochure", LinkTo: "event-brochure", NewTab: false },
          { id: "1676", Text: "Download Post-Show Report", LinkTo: "post-show-report", NewTab: false },
          { id: "1012", Text: "Plan Your Travel", LinkTo: "plan-your-travel", NewTab: false }
        ]
      },
      {
        id: "4",
        Title: "Connect",
        LinkTo: "connect",
        MenuAttached: true,
        Links: []
      },
      {
        id: "11",
        Title: "Insights",
        LinkTo: null,
        MenuAttached: true,
        Links: [
          { id: "824", Text: "Industry News", LinkTo: "articles", NewTab: false },
          { id: "826", Text: "Post Show Report", LinkTo: "post-show-report", NewTab: false },
          { id: "825", Text: "Event Brochure", LinkTo: "event-brochure", NewTab: false },
          { id: "1885", Text: "Media Gallery", LinkTo: "media-gallery", NewTab: false },
          
        ]
      },
      {
        id: "13",
        Title: "About",
        LinkTo: "about-Diemex 2026",
        MenuAttached: true,
        Links: [
          { id: "230", Text: "About TransRussia", LinkTo: "about-transrussia", NewTab: false },
          { id: "232", Text: "About SkladTech", LinkTo: "about-skladtech", NewTab: false },
          { id: "231", Text: "About ITE Group", LinkTo: "about-ite", NewTab: false },
          { id: "1921", Text: "Partners & Sponsors", LinkTo: "https://trstexpo.com/partners-and-sponsors/", NewTab: false }
        ]
      },
      {
        id: "12",
        Title: "Contact us",
        LinkTo: "contact-us",
        MenuAttached: true,
        Links: []
      }
    ],
    Buttons: [
      { id: "1700", Text: "Become an Exhibitor", Theme: "Primary", LinkTo: "exhibiting-enquiry", NewTab: false },
      { id: "2994", Text: "Register Now", Theme: "Primary", LinkTo: "visitor-registration", NewTab: false }
    ],
    Copyright: "©Transrussia - 2025. All Right Reserved",
    EndLinks: [
      
    ]
  },
  pageData: {
    Header: {
      Title: "Visitor Registration",
      Content: ""
    },
    Sections: [
      {
        __typename: "ComponentSharedFormModule",
        id: "45",
        Data: `<div class="raw-html-embed"><link rel="stylesheet" type="text/css" href="https://wisent-live-online.website.yandexcloud.net/new.css">
<p id="promocode">&nbsp;</p>
<div id="app"><!-- Content will be inserted here--></div>
<script src="https://wisent-live-online.website.yandexcloud.net/app.js" id="project" data-yaid="" data-apibaseurl="https://wisent-live-api.hyve.ru/api" data-registrationcode="177036" data-externalfunction="customFunction" data-promocode=""></script>
<script src="https://wisent-live-online.website.yandexcloud.net/customFunction.js" id="customFunction"></script>
<script type="text/javascript">
  function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      vars[key] = value;
    });
    return vars;
  }
  if (getUrlVars()["promo"]) {
    var div = document.getElementById('promocode');
    div.innerHTML += "<p class='alert alert-warning'>Your promocode: " + getUrlVars()["promo"] + "</p>";
  }
</script></div><p><span style="background-color:rgb(255,255,255);color:rgb(13,13,13);font-family:ui-sans-serif, -apple-system, system-ui, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, Helvetica, "Apple Color Emoji", Arial, "Segoe UI Emoji", "Segoe UI Symbol";font-size:11px;">T&Cs: By subscribing to the TransRussia website, you agree to receive marketing communications, updates, and promotional materials from us. You can unsubscribe anytime by clicking the "unsubscribe" link in our emails. For more information on how we handle your data, please refer to our </span><a href="https://dimex-ruby.vercel.app/privacy-policy/"><span style="background-color:rgb(255,255,255);color:rgb(13,13,13);font-family:ui-sans-serif, -apple-system, system-ui, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, Helvetica, "Apple Color Emoji", Arial, "Segoe UI Emoji", "Segoe UI Symbol";font-size:11px;"><strong>Privacy Policy</strong></span></a></p>`
      },
      {
        __typename: "ComponentTransRussiaPartnersSection",
        id: "46",
        PartnersSectionTitle: "Partners & Sponsors",
        Partners: {
          data: [
            {
              id: "27",
              attributes: {
                Name: "Apace Digital Cargo",
                Logo: {
                  data: {
                    attributes: {
                      url: "https://cdn.itegroupnews.com/APACE_Digital_Cargo_523bc2c2a2.webp"
                    }
                  }
                },
                Slug: "apace-digital-cargo"
              }
            },
            // Add more partners as needed
          ]
        }
      }
    ]
  },
  footerData: {
    FooterColumns: [
      {
        id: "1",
        Data: [
          {
            id: "181",
            Title: null,
            Content: {
              Content: "<p>Diemex 2026 is India's leading international exhibition for Die, Mould and Precision Manufacturing Technologies.</p>"
            },
            Socials: []
          },
          {
            id: "182",
            Title: "Contact Us",
            Content: {
              Content: "<p>+91-91483 19993</p><p><a href=\"mailto:pad@maxxmedia.in\">pad@maxxmedia.in</a></p>"
            },
            Socials: []
          }
        ]
      },
      {
        id: "2",
        Data: [
          {
            id: "1",
            Title: "Opening Hours",
            Content: {
              Content: `<p style="margin-left:0px;"><strong>17 March 2026:</strong> 10:00—18:00</p>
                       <p style="margin-left:0px;">&nbsp;</p>
                       <p style="margin-left:0px;"><strong>18 March 2026:</strong> 10:00—18:00</p>
                       <p style="margin-left:0px;">&nbsp;</p>
                       <p style="margin-left:0px;"><strong>19 March 2026:</strong> 10:00—16:00</p>`
            },
            Socials: []
          },
          {
            id: "8",
            Title: "Venue",
            Content: {
              Content: "<p>Auto Cluster Exhibition Centre, Pune</p>"
            },
            Socials: []
          }
        ]
      },
      {
        id: "31",
        Data: [
          {
            id: "81",
            Title: "Quick Links",
            Content: {
              Content: `<p><a href="exhibiting-enquiry">Become an Exhibitor</a></p>
                       <p style="margin-left:0px;"><a href="post-show-report">Download the post-show report</a></p>
                       <p style="margin-left:0px;"><a href="event-brochure">Download event brochure</a></p>`
            },
            Socials: []
          },
          {
            id: "180",
            Title: "Stay Connected",
            Content: null,
            Socials: [
              {
                LogoORBanner: {
                  data: {
                    attributes: {
                      url: "",
                      width: 32,
                      height: 32
                    }
                  }
                },
                Link: "",
                Target: "New_Tab"
              },
              {
                LogoORBanner: {
                  data: {
                    attributes: {
                      url: "",
                      width: 50,
                      height: 50
                    }
                  }
                },
                Link: "",
                Target: "New_Tab"
              }
            ]
          }
        ]
      }
    ],
    CopyrightText: "©Diemex - 2026. All Right Reserved",
    EndLinks: [
      
      { id: "396", Text: "Privacy Policy", LinkTo:"https://www.diemex.in/privacy-policy", NewTab: true },
     
    ]
  }
};

const HomePage: React.FC = () => {
  return (
    <>
        <TransRussiaPage
      navbarData={pageData.navbarData}
      pageData={pageData.pageData}
      footerData={{
        ...pageData.footerData,
        FooterColumns: pageData.footerData.FooterColumns.map((column) => ({
          ...column,
          Data: column.Data.map((data) => ({
            ...data,
            Content: data.Content || { Content: "" }, // Provide a default value for null Content
          })),
        })),
      }}
    />
    <BackToTop/>
    </>

  );
};

export default HomePage;
