// components/QuickActions.tsx
'use client';

import {
  DocumentArrowDownIcon,
  EyeIcon,
  PlusCircleIcon,
  PrinterIcon,
  ShareIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const actions = [
  {
    id: 1,
    title: 'Download Manual',
    description: 'Latest exhibitor guide',
    icon: DocumentArrowDownIcon,
    color: 'bg-blue-500',
    href: '#'
  },
  {
    id: 2,
    title: 'View Layout',
    description: 'Interactive floor plan',
    icon: EyeIcon,
    color: 'bg-green-500',
    href: '/dashboard/layout'
  },
  {
    id: 3,
    title: 'Add Requirements',
    description: 'Submit extra needs',
    icon: PlusCircleIcon,
    color: 'bg-purple-500',
    href: '/dashboard/requirements'
  },
  {
    id: 4,
    title: 'Print Passes',
    description: 'Team access cards',
    icon: PrinterIcon,
    color: 'bg-amber-500',
    href: '#'
  },
  {
    id: 5,
    title: 'Share Profile',
    description: 'Company information',
    icon: ShareIcon,
    color: 'bg-pink-500',
    href: '#'
  },
  {
    id: 6,
    title: 'Rate Experience',
    description: 'Feedback survey',
    icon: StarIcon,
    color: 'bg-indigo-500',
    href: '#'
  }
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {actions.map((action) => (
        <button
          key={action.id}
          className="group relative p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-200 hover:shadow-md transition-all duration-200 text-left"
        >
          <div className={`${action.color} p-2.5 rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform`}>
            <action.icon className="h-5 w-5 text-white" />
          </div>
          
          <h3 className="font-medium text-gray-900 text-sm mb-1">
            {action.title}
          </h3>
          <p className="text-xs text-gray-500">
            {action.description}
          </p>
          
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          </div>
        </button>
      ))}
    </div>
  );
}