export default function PaymentStep({ amount, onBack }: any) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Payment</h3>

      <p>Total Amount Payable: <strong>₹{amount}</strong></p>

      <button className="w-full bg-blue-600 text-white py-2 rounded">
        Pay Now
      </button>

      <button onClick={onBack} className="w-full border py-2 rounded">
        Back
      </button>
    </div>
  );
}
