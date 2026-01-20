// components/steps/FurnitureRequirementForm.tsx
import { useState } from 'react';

const furnitureCategories = [
  {
    id: 'chairs',
    name: 'Chairs',
    description: 'Various types of chairs for seating',
    icon: '🪑',
    subcategories: ['Conference', 'Banquet', 'Folding', 'Bar Stools']
  },
  {
    id: 'tables',
    name: 'Tables',
    description: 'Different table sizes and styles',
    icon: '🛋️',
    subcategories: ['Round', 'Rectangular', 'Cocktail', 'High-top']
  },
  {
    id: 'sofa',
    name: 'Sofa & Lounge',
    description: 'Comfortable seating arrangements',
    icon: '🛋️',
    subcategories: ['Sectional', 'Modular', 'Benches', 'Lounge Chairs']
  },
  {
    id: 'storage',
    name: 'Storage Units',
    description: 'Cabinets, racks, and storage solutions',
    icon: '🗄️',
    subcategories: ['Cabinets', 'Shelves', 'Racks', 'Lockers']
  },
  {
    id: 'decor',
    name: 'Decoration',
    description: 'Stage and stall decoration items',
    icon: '🎨',
    subcategories: ['Backdrops', 'Lighting', 'Floral', 'Signage']
  }
];

export default function FurnitureRequirementForm({ data, onNext, onBack }: any) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [layoutType, setLayoutType] = useState('');

  const layoutOptions = [
    { id: 'conference', name: 'Conference Style', image: '/layout-conference.png' },
    { id: 'classroom', name: 'Classroom Style', image: '/layout-classroom.png' },
    { id: 'theater', name: 'Theater Style', image: '/layout-theater.png' },
    { id: 'u-shape', name: 'U-Shape', image: '/layout-ushape.png' },
    { id: 'banquet', name: 'Banquet Style', image: '/layout-banquet.png' },
    { id: 'exhibition', name: 'Exhibition Stall', image: '/layout-exhibition.png' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {furnitureCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              p-4 rounded-xl border-2 text-left transition-all duration-200
              ${selectedCategory === category.id 
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <h4 className="font-semibold text-gray-800">{category.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {category.subcategories.map(sub => (
                <span key={sub} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {sub}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Layout Selection */}
      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-4">Select Layout Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {layoutOptions.map((layout) => (
            <div
              key={layout.id}
              onClick={() => setLayoutType(layout.id)}
              className={`
                border rounded-lg p-3 cursor-pointer transition
                ${layoutType === layout.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
                }
              `}
            >
              <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Layout Preview</div>
              </div>
              <p className="text-sm font-medium text-center">{layout.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description / Special Requirements
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-3 min-h-[100px]"
            placeholder="Describe your requirements in detail..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date
            </label>
            <input
              type="date"
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => onNext({
            category: selectedCategory,
            description,
            quantity,
            layoutType
          })}
          disabled={!selectedCategory}
          className={`px-6 py-2 rounded-lg ${
            selectedCategory 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Select Items
        </button>
      </div>
    </div>
  );
}