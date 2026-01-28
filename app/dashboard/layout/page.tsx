'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ArrowsPointingOutIcon, DocumentArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { floorPlansAPI } from '@/lib/api/floorPlans';

interface FloorPlan {
  id: number;
  name: string;
  description: string;
  image: string;
  scale: number;
  gridSize: number;
  showGrid: boolean;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export default function LayoutPage() {
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<FloorPlan | null>(null);
  const [stallDetails, setStallDetails] = useState({
    stallNumber: 'A-12',
    location: 'Main Hall, Near Entrance',
    size: '3m x 3m (9 sqm)',
    type: 'Premium Corner Stall',
    amenities: [
      'Power Outlets (2)',
      'WiFi Access',
      'Spotlights',
      'Table & Chairs'
    ],
    restrictions: [
      'No open flames',
      'Maximum height: 3m',
      'No blocking aisles'
    ]
  });

  useEffect(() => {
    fetchFloorPlans();
  }, []);

  const fetchFloorPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching floor plans...');
      const response = await floorPlansAPI.getAll();
      
      console.log('📦 API Response:', response);
      
      if (response.success && response.data) {
        let plans: FloorPlan[] = [];
        
        if (Array.isArray(response.data)) {
          plans = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          plans = response.data.data;
        }
        
        console.log(`✅ Found ${plans.length} floor plans`);
        
        // Filter plans that have images
        const plansWithImages = plans.filter(plan => plan.image);
        
        if (plansWithImages.length > 0) {
          setFloorPlans(plansWithImages);
          setSelectedPlan(plansWithImages[0]);
          console.log(`🖼️ ${plansWithImages.length} plans have images`);
        } else {
          setError('No floor plans with images found');
          console.log('⚠️ No floor plans with images');
        }
      } else {
        setError(response.error || 'Failed to load floor plans');
      }
    } catch (error) {
      console.error('❌ Error fetching floor plans:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setScale(1);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', e);
    const img = e.currentTarget;
    img.src = '/placeholder-floor-plan.svg';
    img.alt = 'Floor plan image not available';
  };

  const handleDownloadImage = () => {
    if (!selectedPlan?.image) return;
    
    const link = document.createElement('a');
    link.href = selectedPlan.image;
    link.download = `floor-plan-${selectedPlan.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullscreen = () => {
    if (!selectedPlan?.image) return;
    
    window.open(selectedPlan.image, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Exhibition Layout</h1>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="h-[500px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading floor plans...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Exhibition Layout</h1>
          <button
            onClick={fetchFloorPlans}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="h-[500px] flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-red-500 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Floor Plans</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">
                Please check if floor plans have been created in the admin panel.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exhibition Layout</h1>
          <p className="text-gray-600 mt-1">
            View your exhibition stall location and details
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-lg">
            <button
              onClick={zoomOut}
              className="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded"
              disabled={scale <= 0.5}
              title="Zoom Out"
            >
              <span className="font-bold">-</span>
            </button>
            <span className="text-sm w-16 text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={zoomIn}
              className="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded"
              disabled={scale >= 3}
              title="Zoom In"
            >
              <span className="font-bold">+</span>
            </button>
            <button
              onClick={resetZoom}
              className="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded text-sm"
              title="Reset Zoom"
            >
              Reset
            </button>
          </div>
          <button 
            onClick={handleFullscreen}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowsPointingOutIcon className="h-4 w-4 mr-2" />
            Full Screen
          </button>
          <button 
            onClick={handleDownloadImage}
            disabled={!selectedPlan?.image}
            className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-4">
            {/* Floor Plan Selector */}
            {floorPlans.length > 1 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Floor Plan
                </label>
                <div className="flex flex-wrap gap-2">
                  {floorPlans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`px-3 py-2 text-sm rounded-md transition-colors ${
                        selectedPlan?.id === plan.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {plan.name || `Plan ${plan.id}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Floor Plan Image Container */}
            <div className="relative h-[500px] bg-gray-50 border border-gray-200 rounded-lg overflow-auto">
              {selectedPlan?.image ? (
                <div className="relative w-full h-full">
                  <img
                    src={selectedPlan.image}
                    alt={selectedPlan.name || 'Floor Plan'}
                    className="absolute top-0 left-0 w-full h-full object-contain"
                    style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
                    onError={handleImageError}
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <svg className="h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium">No Image Available</p>
                  <p className="text-sm mt-1">This floor plan doesn't have an image</p>
                </div>
              )}
            </div>

            {/* Plan Details */}
            {selectedPlan && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Plan Name:</span>
                    <p className="font-medium">{selectedPlan.name || 'Unnamed'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Scale:</span>
                    <p className="font-medium">{selectedPlan.scale}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Grid Size:</span>
                    <p className="font-medium">{selectedPlan.gridSize}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Updated:</span>
                    <p className="font-medium">
                      {new Date(selectedPlan.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stall Details Sidebar */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Stall Details</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Your Stall
            </span>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-600 font-medium mb-1">Stall Number</p>
                <p className="text-xl font-bold text-gray-900">{stallDetails.stallNumber}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-green-600 font-medium mb-1">Stall Size</p>
                <p className="text-lg font-medium text-gray-900">{stallDetails.size}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Location Details</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{stallDetails.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Stall Type</p>
                    <p className="text-gray-900">{stallDetails.type}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Amenities Included</h3>
              <div className="space-y-2">
                {stallDetails.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Important Restrictions</h3>
              <div className="space-y-2">
                {stallDetails.restrictions.map((restriction, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-gray-700 text-sm">{restriction}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Stall Manual
                </button>
                <button 
                  onClick={fetchFloorPlans}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Refresh Floor Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Footer */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h1m0 0h-1m1 0v4m0 0l3 3m-3-3l3-3m-3 3l-3-3m3 3V8m0 0l3 3m-3-3l-3 3" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Need Help?</h4>
            <p className="text-sm text-blue-600 mt-1">
              If you cannot locate your stall or have questions about the layout, 
              please contact exhibition support at support@exhibition.com or call +1 (555) 123-4567.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}