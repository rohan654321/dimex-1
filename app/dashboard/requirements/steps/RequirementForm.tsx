// components/steps/RequirementForm.tsx
'use client';

interface RequirementFormProps {
  onCategorySelect: (category: string) => void;
  onNext: () => void;
  data?: {
    type: string;
    description: string;
    quantity: number;
    estimatedCost?: number;
  };
}

export default function RequirementForm({ onCategorySelect, onNext, data }: RequirementFormProps) {
  // Ensure data has default values
  const formData = data || {
    type: 'electrical',
    description: '',
    quantity: 1,
    estimatedCost: 0
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const requirementTypes = [
    { id: 'furniture', name: 'Furniture', icon: '🪑', description: 'Chairs, tables, sofas, storage units' },
    { id: 'electrical', name: 'Electrical', icon: '⚡', description: 'Power supply, lighting, equipment' },
    { id: 'audio_visual', name: 'Audio Visual', icon: '🎥', description: 'Sound systems, projectors, screens' },
    { id: 'catering', name: 'Catering', icon: '🍽️', description: 'Food, beverages, service staff' },
    { id: 'temporary_staff', name: 'Temporary Staff', icon: '👥', description: 'Event staff, helpers, security' },
    { id: 'decor', name: 'Decoration', icon: '🎨', description: 'Theme, flowers, branding materials' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Select Requirement Type</h3>
        <p className="text-gray-600">Choose the type of requirement you want to add</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {requirementTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onCategorySelect(type.id)}
            className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left hover:shadow-lg"
          >
            <div className="text-3xl mb-3">{type.icon}</div>
            <h4 className="font-semibold text-lg text-gray-800">{type.name}</h4>
            <p className="text-sm text-gray-600 mt-2">{type.description}</p>
          </button>
        ))}
      </div>

      {/* For non-furniture requirements */}
      <form onSubmit={handleSubmit} className="mt-8 border-t pt-8">
        <h4 className="font-semibold text-lg mb-4">Other Requirements</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirement Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => formData.type = e.target.value}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="electrical">Electrical</option>
              <option value="audio_visual">Audio Visual</option>
              <option value="catering">Catering</option>
              <option value="temporary_staff">Temporary Staff</option>
              <option value="decor">Decoration</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => formData.description = e.target.value}
              className="w-full border rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your requirement in detail..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              value={formData.quantity}
              onChange={(e) => formData.quantity = Number(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-900 transition font-medium"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}