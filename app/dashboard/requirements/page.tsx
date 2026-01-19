// app/dashboard/requirements/page.tsx
'use client';

import { useState } from 'react';
import { PlusIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { ExtraRequirement } from '@/types';

const initialRequirements: ExtraRequirement[] = [
  {
    id: 'REQ001',
    type: 'electrical',
    description: 'Additional power outlet (220V)',
    quantity: 2,
    status: 'approved',
    cost: 150
  },
  {
    id: 'REQ002',
    type: 'furniture',
    description: 'Extra chairs',
    quantity: 4,
    status: 'pending',
    cost: 80
  },
  {
    id: 'REQ003',
    type: 'display',
    description: 'TV monitor (55")',
    quantity: 1,
    status: 'pending',
    cost: 200
  },
  {
    id: 'REQ004',
    type: 'other',
    description: 'Special waste disposal',
    quantity: 1,
    status: 'rejected'
  }
];

const requirementTypes = [
  { id: 'electrical', name: 'Electrical', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'furniture', name: 'Furniture', color: 'bg-green-100 text-green-800' },
  { id: 'display', name: 'Display', color: 'bg-purple-100 text-purple-800' },
  { id: 'other', name: 'Other', color: 'bg-gray-100 text-gray-800' }
];

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState(initialRequirements);
  const [showForm, setShowForm] = useState(false);
  const [newRequirement, setNewRequirement] = useState({
    type: 'electrical',
    description: '',
    quantity: 1,
    notes: ''
  });

  const getStatusIcon = (status: ExtraRequirement['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const getTypeColor = (type: ExtraRequirement['type']) => {
    const typeObj = requirementTypes.find(t => t.id === type);
    return typeObj?.color || 'bg-gray-100 text-gray-800';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: ExtraRequirement = {
      id: `REQ${(requirements.length + 1).toString().padStart(3, '0')}`,
      type: newRequirement.type as any,
      description: newRequirement.description,
      quantity: newRequirement.quantity,
      status: 'pending',
      cost: undefined
    };
    
    setRequirements([...requirements, newReq]);
    setNewRequirement({ type: 'electrical', description: '', quantity: 1, notes: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Extra Requirements</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Requirement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="text-2xl font-bold text-gray-900">{requirements.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {requirements.filter(r => r.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {requirements.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Estimated Cost</p>
          <p className="text-2xl font-bold text-blue-600">
            ${requirements.reduce((sum, req) => sum + (req.cost || 0), 0)}
          </p>
        </div>
      </div>

      {/* Requirements List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Submitted Requirements</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requirements.map((requirement) => (
                <tr key={requirement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(requirement.type)}`}>
                      {requirementTypes.find(t => t.id === requirement.type)?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{requirement.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {requirement.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(requirement.status)}
                      <span className="ml-2 text-sm font-medium capitalize">{requirement.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {requirement.cost ? `$${requirement.cost}` : 'TBD'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-yellow-800 mb-3">Important Notes</h3>
        <ul className="space-y-2 text-yellow-700">
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></span>
            All extra requirements must be submitted at least 2 weeks before the event
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></span>
            Additional charges may apply for special requirements
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></span>
            Approval of requirements may take 3-5 business days
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></span>
            Once approved, requirements cannot be cancelled without penalty
          </li>
        </ul>
      </div>

      {/* New Requirement Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">New Requirement</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirement Type
                  </label>
                  <select
                    value={newRequirement.type}
                    onChange={(e) => setNewRequirement(prev => ({ ...prev, type: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {requirementTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newRequirement.description}
                    onChange={(e) => setNewRequirement(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Describe your requirement in detail..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={newRequirement.quantity}
                    onChange={(e) => setNewRequirement(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={newRequirement.notes}
                    onChange={(e) => setNewRequirement(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Any special instructions or details..."
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Submit Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}