// components/RecentActivity.tsx
'use client';

import { 
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  MapPinIcon,
  ShoppingBagIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const activities = [
  {
    id: 1,
    type: 'payment',
    title: 'Invoice Paid Successfully',
    description: 'Payment of $1,500 for stall booking confirmed',
    time: '2 hours ago',
    icon: CheckCircleIcon,
    color: 'text-green-600 bg-green-100'
  },
  {
    id: 2,
    type: 'stall',
    title: 'Stall Location Confirmed',
    description: 'Your premium stall A-12 has been assigned',
    time: '1 day ago',
    icon: MapPinIcon,
    color: 'text-blue-600 bg-blue-100'
  },
  {
    id: 3,
    type: 'document',
    title: 'Manual Updated',
    description: 'New exhibition guidelines added to manual',
    time: '2 days ago',
    icon: DocumentTextIcon,
    color: 'text-purple-600 bg-purple-100'
  },
  {
    id: 4,
    type: 'requirement',
    title: 'Requirement Submitted',
    description: 'Extra power outlet request is pending review',
    time: '3 days ago',
    icon: ShoppingBagIcon,
    color: 'text-amber-600 bg-amber-100'
  }
];

export default function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div 
          key={activity.id}
          className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
        >
          <div className={`p-2 rounded-lg ${activity.color} flex-shrink-0`}>
            <activity.icon className="h-4 w-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              {activity.title}
            </h4>
            <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
              {activity.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <ClockIcon className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          </div>
          
          <div className="h-2 w-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}