// app/contact/page.tsx
import { Metadata } from 'next';
import ContactForm from '@/components/contactSection/ContactForm';
import PartnersSlider from '@/components/contactSection/PartnersSlider';

export const metadata: Metadata = {
  title: 'Get in Touch with TransRussia & SkladTech Expo',
  description: 'Reach out to TransRussia & SkladTech Expo for inquiries, support, or information. Find contact details and connect with our team to learn more about the event.',
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative z-[1] flex flex-col justify-end bg-mainColor5 pt-48">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pt-0 pb-10">
          <h1 className="title-72 text-black">Contact Us</h1>
          <p className="max-w-6xl whitespace-pre-line py-5"></p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="animated-block">
        <div className="animated-block-target">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 form-style py-0">
            <ContactForm />
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="animated-block">
        <div className="animated-block-target">
          <PartnersSlider />
        </div>
      </div>
    </div>
  );
}