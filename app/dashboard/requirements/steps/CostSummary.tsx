export default function CostSummary({ data, onBack, onNext }: any) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Cost Breakdown</h3>

      <table className="w-full border">
        <tbody>
          <tr>
            <td className="border p-2">Unit Cost</td>
            <td className="border p-2">₹150</td>
          </tr>
          <tr>
            <td className="border p-2">Quantity</td>
            <td className="border p-2">{data.quantity}</td>
          </tr>
          <tr className="font-semibold">
            <td className="border p-2">Total</td>
            <td className="border p-2">₹{data.estimatedCost}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between">
        <button onClick={onBack} className="border px-4 py-2 rounded">
          Back
        </button>
        <button onClick={onNext} className="bg-blue-600 text-white px-4 py-2 rounded">
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
