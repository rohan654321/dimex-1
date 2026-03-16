import SectionContainer from '@/components/UI/SectionContainer';

export default function AttentionSection() {
  return (
    <div className="relative">
      <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
        <h2 className="title-72 text-black mb-8">
          ATTENTION
        </h2>

        <p className="text-lg text-gray-600 mb-6">
          Design project of your stand with an indication of overall
          dimensions must be approved by the Maxx Business Media Pvt. Ltd.,
          Technical Service Department.
        </p>

        <p className="text-lg text-gray-600">
          Please send it via e-mail no later than 1 month before set-up.
          You can find the contact person information on the forms or below.
        </p>
      </div>
    </div>
  );
}