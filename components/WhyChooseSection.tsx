// components/WhyChooseSection.tsx
export default function WhyChooseSection() {
  const reasons = [
    {
      number: '01',
      title: 'Connect with over 30,000 industry professionals',
      description: 'Access a highly targeted audience of transport and logistics professionals, including decision-makers actively seeking new solutions and partnerships.'
    },
    {
      number: '02',
      title: 'Expand your market presence at TransRussia',
      description: 'Gain a market share the 12 countries part of the CIS region by showcasing your brand to a selected and highly engaged audience.'
    },
    {
      number: '03',
      title: 'Meet decision-makers and build instantly trust',
      description: 'Showcase your innovative solutions and establish your brand as a market leader in this rapidly growing sector.'
    }
  ]

  return (
    <section className="bg-[#F4F4F4] pt-0">
      <div className="bg-[#003366] py-14">
        <div className="container space-y-5">
          <h2 className="text-[72px] leading-[0.9] font-bold text-white">
            Why choose  TransRussia  2026
          </h2>
        </div>
      </div>
      
      <div className="container">
        <div className="mt-14 grid lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              className="flex flex-col max-lg:pb-5 lg:w-full lg:border-r lg:border-r-black/10 lg:px-10 lg:last:border-r-0"
            >
              <h3 className="text-[32px] font-bold text-[#0092D7]">{reason.number}</h3>
              <h4 className="text-[32px] font-bold text-black mt-2">{reason.title}</h4>
              <p className="mt-5 lg:mt-10 text-lg">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}