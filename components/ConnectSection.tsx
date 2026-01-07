// components/ConnectSection.tsx
export default function ConnectSection() {
  return (
    <section className="relative z-1 overflow-hidden bg-[#003366] text-white py-20">
      <div className="container">
        <div className="grid gap-0 lg:grid-cols-3 lg:gap-20">
          <div className="flex flex-col gap-5 py-10 lg:col-span-2 lg:py-32">
            <h2 className="text-[72px] leading-[0.9] font-bold text-white">
              Stay Connected
            </h2>
            
            <p className="whitespace-pre-line text-lg">
              Experience year-round networking and collaboration with TransRussia Connect, our exclusive app designed for logistics professionals. Connect and collaborate seamlessly, 365 days a year, using this dedicated platform.
            </p>
            
            <a href="https://app.transrussia-connect.com/public/post?id=3f91096c0eb34ab0bf2a55762da78caa&vendorId=edce6a84-ed2f-455a-afd7-d7fbb0d16c00" className="mt-10 block">
              <button className="flex items-center justify-center group gap-2 overflow-hidden rounded-full px-10 py-3 font-jakarta text-[16px] font-semibold transition-all duration-300 bg-white text-[#0092D7] hover:bg-[#0092D7] hover:text-white w-fit">
                Join TransRussia Connect
              </button>
            </a>
          </div>
          
          <div className="flex items-center justify-center relative z-[-1] my-10 h-112.5 lg:h-112.5">
            <img 
              src="/images/connect-app.webp" 
              alt="TransRussia Connect" 
              className="size-auto"
            />
            <div className="absolute inset-0 flex items-center justify-center z-[-1] aspect-square w-full scale-150">
              <div className="absolute size-full rounded-full bg-[#0092D7] opacity-30" />
              <div className="absolute size-2/3 rounded-full bg-[#0092D7] opacity-30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}