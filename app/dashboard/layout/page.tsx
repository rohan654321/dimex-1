// app/dashboard/layout/page.tsx
'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

const stallPositions = [
  { id: 'A-10', x: 50, y: 50, booked: false },
  { id: 'A-11', x: 150, y: 50, booked: false },
  { id: 'A-12', x: 250, y: 50, booked: true, currentUser: true },
  { id: 'A-13', x: 350, y: 50, booked: true },
  { id: 'B-10', x: 50, y: 150, booked: false },
  { id: 'B-11', x: 150, y: 150, booked: true },
  { id: 'B-12', x: 250, y: 150, booked: false },
];

export default function LayoutPage() {
  const [scale, setScale] = useState(1);
  const [selectedStall, setSelectedStall] = useState(stallPositions[2]);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Exhibition Layout</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              -
            </button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <button
              onClick={zoomIn}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              +
            </button>
          </div>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <ArrowsPointingOutIcon className="h-4 w-4 mr-2" />
            Full Screen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="relative h-[500px] bg-gray-50 border border-gray-200 rounded-lg overflow-auto">
              <div 
                className="absolute inset-0"
                style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
              >
                {/* Layout grid */}
                <div className="absolute inset-0">
                  {/* Aisle lines */}
                  <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-yellow-300" />
                  <div className="absolute left-2/4 top-0 bottom-0 w-1 bg-yellow-300" />
                  <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-yellow-300" />
                  
                  {/* Stalls */}
                  {stallPositions.map((stall) => (
                    <div
                      key={stall.id}
                      className={`absolute w-20 h-20 border-2 flex items-center justify-center cursor-pointer transition-all ${
                        stall.currentUser
                          ? 'bg-blue-100 border-blue-500'
                          : stall.booked
                          ? 'bg-red-100 border-red-300'
                          : 'bg-green-100 border-green-300'
                      }`}
                      style={{ left: `${stall.x}px`, top: `${stall.y}px` }}
                      onClick={() => setSelectedStall(stall)}
                    >
                      <span className={`font-bold ${
                        stall.currentUser
                          ? 'text-blue-700'
                          : stall.booked
                          ? 'text-red-700'
                          : 'text-green-700'
                      }`}>
                        {stall.id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border-2 border-green-300 mr-2"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-300 mr-2"></div>
                <span className="text-sm text-gray-600">Booked</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600">Your Stall</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stall Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Stall Details</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Stall Number</h3>
              <p className="text-lg font-bold text-gray-900">A-12</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="text-gray-900">Main Hall, Near Entrance</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Size</h3>
              <p className="text-gray-900">3m x 3m (9 sqm)</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Type</h3>
              <p className="text-gray-900">Premium Corner Stall</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Amenities</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li className="text-gray-700">Power Outlets (2)</li>
                <li className="text-gray-700">WiFi Access</li>
                <li className="text-gray-700">Spotlights</li>
                <li className="text-gray-700">Table & Chairs</li>
              </ul>
            </div>
            
            <div className="pt-4 border-t">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium">
                Download Stall Layout PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}