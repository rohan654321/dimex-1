// components/steps/FurnitureSelectionStep.tsx
import { useState } from 'react';

const furnitureItems = {
  chairs: [
    {
      id: 1,
      name: 'Conference Chair',
      description: 'Executive swivel chair with armrests',
      price: 2500,
      image: '/chair-conference.png',
      colors: ['Black', 'Brown', 'Gray', 'Blue'],
      material: 'Leather',
      quantity: 0
    },
    {
      id: 2,
      name: 'Banquet Chair',
      description: 'Upholstered banquet chair with cushion',
      price: 1800,
      image: '/chair-banquet.png',
      colors: ['Gold', 'Silver', 'White', 'Red'],
      material: 'Fabric',
      quantity: 0
    },
    {
      id: 3,
      name: 'Folding Chair',
      description: 'Portable plastic folding chair',
      price: 600,
      image: '/chair-folding.png',
      colors: ['Black', 'White', 'Gray', 'Blue'],
      material: 'Plastic',
      quantity: 0
    },
    {
      id: 4,
      name: 'Bar Stool',
      description: 'Adjustable height bar stool',
      price: 3200,
      image: '/chair-bar.png',
      colors: ['Black', 'Chrome', 'Wood'],
      material: 'Metal/Wood',
      quantity: 0
    }
  ],
  sofa: [
    {
      id: 5,
      name: '3-Seater Sofa',
      description: 'Luxury fabric sofa with cushions',
      price: 25000,
      image: '/sofa-3seater.png',
      colors: ['Beige', 'Gray', 'Navy', 'Brown'],
      material: 'Fabric',
      quantity: 0
    },
    {
      id: 6,
      name: 'Modular Sectional',
      description: 'Customizable modular sofa set',
      price: 45000,
      image: '/sofa-modular.png',
      colors: ['Gray', 'Blue', 'Green', 'Mustard'],
      material: 'Leather',
      quantity: 0
    },
    {
      id: 7,
      name: 'Lounge Chair',
      description: 'Single lounge chair with ottoman',
      price: 12000,
      image: '/chair-lounge.png',
      colors: ['Black', 'White', 'Brown'],
      material: 'Leather',
      quantity: 0
    }
  ]
};

export default function FurnitureSelectionStep({ data, onNext, onBack }: any) {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('chairs');

  const handleQuantityChange = (itemId: number, quantity: number) => {
    const updatedItems = [...selectedItems];
    const existingItem = updatedItems.find(item => item.id === itemId);
    
    if (existingItem) {
      if (quantity === 0) {
        // Remove item if quantity is 0
        setSelectedItems(updatedItems.filter(item => item.id !== itemId));
      } else {
        existingItem.quantity = quantity;
        setSelectedItems(updatedItems);
      }
    } else if (quantity > 0) {
      const newItem = furnitureItems[selectedCategory as keyof typeof furnitureItems]
        .find(item => item.id === itemId);
      if (newItem) {
        setSelectedItems([...updatedItems, { ...newItem, quantity }]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {Object.keys(furnitureItems).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                py-2 px-4 border-b-2 font-medium text-sm transition
                ${selectedCategory === category
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Furniture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {furnitureItems[selectedCategory as keyof typeof furnitureItems]?.map((item) => {
          const selectedItem = selectedItems.find(i => i.id === item.id);
          
          return (
            <div key={item.id} className="border rounded-xl p-4 hover:shadow-lg transition">
              <div className="flex gap-4">
                {/* Image Placeholder */}
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-gray-400">Image</div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-lg">{item.name}</h4>
                    <span className="font-bold text-blue-600">₹{item.price}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">Color:</span>
                      <div className="flex gap-2">
                        {item.colors.map((color) => (
                          <div
                            key={color}
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">Material:</span>
                      <span className="text-sm">{item.material}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, (selectedItem?.quantity || 0) - 1)}
                        className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{selectedItem?.quantity || 0}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, (selectedItem?.quantity || 0) + 1)}
                        className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    
                    {selectedItem && (
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Subtotal</div>
                        <div className="font-semibold">₹{selectedItem.quantity * item.price}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Items Summary */}
      {selectedItems.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="font-semibold text-lg mb-4">Selected Items</h4>
          <div className="space-y-3">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600 ml-4">× {item.quantity}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span>₹{item.price * item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 0)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <span className="font-semibold">Total Selected</span>
              <span className="font-bold text-lg">
                ₹{selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => onNext(selectedItems)}
          disabled={selectedItems.length === 0}
          className={`px-6 py-2 rounded-lg ${
            selectedItems.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Customize Design
        </button>
      </div>
    </div>
  );
}