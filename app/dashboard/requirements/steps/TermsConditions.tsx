export default function TermsConditions({ accepted, onAccept, onBack }: any) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Terms & Conditions</h3>

      <div className="h-40 overflow-y-auto border p-3 text-sm">
        • Payments once made are non-refundable  
        • Power supply subject to availability  
        • Organizer reserves rights to modify charges  
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" required />
        <span>I agree to the terms & conditions</span>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="border px-4 py-2 rounded">
          Back
        </button>
        <button onClick={onAccept} className="bg-green-600 text-white px-4 py-2 rounded">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
