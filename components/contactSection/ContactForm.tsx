// components/ContactForm.tsx
interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className = '' }: ContactFormProps) {
  return (
    <div className={`${className}`}>
      <div>
        <p className="mb-6">
          Have questions or need help? Contact us below, and our team will respond promptly.
        </p>
        
        {/* ActiveCampaign Form Embed */}
        <div className="raw-html-embed">
          <div className="_form_200"></div>
          <script src="https://ite681.activehosted.com/f/embed.php?id=200" charSet="utf-8"></script>
        </div>

        <p className="mt-6 text-xs text-gray-700">
          T&amp;Cs: By subscribing to the TransRussia website, you agree to receive marketing communications, updates, 
          and promotional materials from us. You can unsubscribe anytime by clicking the &quot;unsubscribe&quot; link in our emails. 
          For more information on how we handle your data, please refer to our{' '}
          <a 
            href="https://ite.group/en/privacy/" 
            className="font-semibold text-mainColor2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}