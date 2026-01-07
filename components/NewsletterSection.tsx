// components/NewsletterSection.tsx
export default function NewsletterSection() {
  return (
    <section className="py-20">
      <div className="container text-white">
        <div className="relative z-1 min-h-75 w-full space-y-5 overflow-hidden rounded-3xl bg-[#003366] p-5 max-lg:pb-60 lg:p-10">
          <img 
            src="/images/newsletter-img.png" 
            alt="Newsletter" 
            className="size-auto absolute bottom-0 right-0 max-lg:hidden"
          />
          
          <h2 className="text-[72px] leading-[0.9] font-bold text-white">
            Join our Newsletter
          </h2>
          
          <p className="max-w-6xl whitespace-pre-line text-lg">
            Don't miss out on the latest with our weekly newsletter, bringing you not only the latest updates from the event but also cutting-edge insights from the entire industry. Don't miss out—subscribe now for more
          </p>
          
          <a href="/newsletter" className="block">
            <button className="flex items-center justify-center group gap-2 overflow-hidden rounded-full px-10 py-3 font-jakarta text-[16px] font-semibold transition-all duration-300 bg-white text-[#0092D7] hover:bg-[#0092D7] hover:text-white w-fit">
              Sign up Today
            </button>
          </a>
          
          <div className="flex items-center justify-center absolute bottom-[-40%] end-[-3%] z-[-1] size-100">
            <div className="absolute size-full rounded-full bg-[#0092D7] opacity-50" />
            <div className="absolute size-2/3 rounded-full bg-[#0092D7] opacity-50" />
          </div>
        </div>
      </div>
    </section>
  )
}