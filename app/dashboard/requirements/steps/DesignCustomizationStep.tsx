// components/steps/DesignCustomizationStep.tsx
import { useState } from 'react';

const decorationThemes = [
  {
    id: 'modern',
    name: 'Modern Minimalist',
    description: 'Clean lines, neutral colors, simple decor',
    image: '/theme-modern.png',
    colors: ['#FFFFFF', '#F5F5F5', '#333333', '#E0E0E0']
  },
  {
    id: 'luxury',
    name: 'Luxury Premium',
    description: 'Rich colors, velvet fabrics, golden accents',
    image: '/theme-luxury.png',
    colors: ['#1A237E', '#4A148C', '#D4AF37', '#000000']
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional, branded, executive style',
    image: '/theme-corporate.png',
    colors: ['#0D47A1', '#1565C0', '#FFFFFF', '#263238']
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    description: 'Colorful, eclectic, plants and patterns',
    image: '/theme-bohemian.png',
    colors: ['#FF6F00', '#4CAF50', '#FFEB3B', '#795548']
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Exposed elements, metal finishes, rustic',
    image: '/theme-industrial.png',
    colors: ['#616161', '#9E9E9E', '#795548', '#000000']
  },
  {
    id: 'garden',
    name: 'Garden Party',
    description: 'Greenery, floral arrangements, natural light',
    image: '/theme-garden.png',
    colors: ['#2E7D32', '#4CAF50', '#FFEB3B', '#FFFFFF']
  }
];

const addonOptions = [
  { id: 'lighting', name: 'Decorative Lighting', price: 5000, description: 'LED strips, spotlights, ambient lighting' },
  { id: 'plants', name: 'Plants & Greenery', price: 3000, description: 'Potted plants, vertical garden, floral arrangements' },
  { id: 'carpet', name: 'Premium Carpet', price: 8000, description: 'Custom sized carpet with logo' },
  { id: 'backdrop', name: 'Custom Backdrop', price: 15000, description: 'Printed backdrop with branding' },
  { id: 'tablecloth', name: 'Table Cloths & Runners', price: 2000, description: 'Premium quality linen' },
  { id: 'signage', name: 'Signage & Boards', price: 4000, description: 'Directional and informational signage' },
  { id: 'audio', name: 'Audio System', price: 10000, description: 'Background music system' },
  { id: 'wifi', name: 'WiFi Hotspot', price: 5000, description: 'Dedicated high-speed WiFi' },
];

export default function DesignCustomizationStep({ data, onNext, onBack }: any) {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [specialRequirements, setSpecialRequirements] = useState('');

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  return (
    <div className="space-y-8">
      {/* Decoration Theme Selection */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Select Decoration Theme</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {decorationThemes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`
                border rounded-xl p-4 cursor-pointer transition-all duration-200
                ${selectedTheme === theme.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">Theme Preview</div>
                  <div className="flex justify-center gap-1">
                    {theme.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <h4 className="font-semibold">{theme.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Addon Selection */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Additional Services & Addons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addonOptions.map((addon) => (
            <div
              key={addon.id}
              onClick={() => handleAddonToggle(addon.id)}
              className={`
                border rounded-lg p-4 cursor-pointer transition
                ${selectedAddons.includes(addon.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{addon.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{addon.description}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">₹{addon.price}</div>
                  <div className="text-xs text-gray-500">per event</div>
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <div className={`
                  w-5 h-5 border rounded mr-2 flex items-center justify-center
                  ${selectedAddons.includes(addon.id)
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300'
                  }
                `}>
                  {selectedAddons.includes(addon.id) && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
                <span className="text-sm">
                  {selectedAddons.includes(addon.id) ? 'Selected' : 'Select'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Requirements */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Special Requirements</h3>
        <textarea
          value={specialRequirements}
          onChange={(e) => setSpecialRequirements(e.target.value)}
          className="w-full border rounded-lg p-4 min-h-[120px]"
          placeholder="Enter any specific requirements, special arrangements, or additional notes..."
        />
      </div>

      {/* Preview Section */}
      <div className="border rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white">
        <h3 className="font-semibold text-lg mb-4">Configuration Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Selected Theme</div>
            <div className="font-medium">
              {selectedTheme
                ? decorationThemes.find(t => t.id === selectedTheme)?.name
                : 'Not selected'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Selected Addons</div>
            <div className="font-medium">{selectedAddons.length} addons selected</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Furniture Items</div>
            <div className="font-medium">{data.furnitureItems?.length || 0} types selected</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Layout</div>
            <div className="font-medium capitalize">{data.layoutType || 'Not selected'}</div>
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
            decorationTheme: selectedTheme,
            selectedAddons,
            specialRequirements
          })}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View Cost Summary
        </button>
      </div>
    </div>
  );
}