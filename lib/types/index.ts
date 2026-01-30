/* =========================================================
   Shared Types – SINGLE SOURCE OF TRUTH
========================================================= */

export type ShapeType =
  | 'booth'
  | 'table'
  | 'chair'
  | 'door'
  | 'stairs'
  | 'toilet'
  | 'register'
  | 'stage'
  | 'screen'
  | 'speaker'
  | 'cafe'
  | 'storage'
  | 'truck'
  | 'pillar'
  | 'info'
  | 'emergency'
  | 'text'
  | 'rectangle'
  | 'square'
  | 'circle'
  | 'triangle'
  | 'hexagon'
  | 'octagon';

export interface ShapeMetadata {
  boothNumber?: string;
  companyName?: string;
  status?: 'available' | 'booked' | 'reserved' | 'maintenance';
  category?: string;
  
  // For exhibitor view
  isUserBooth?: boolean;
  amenities?: string[];
  restrictions?: string[];
  contactPerson?: string;
  phone?: string;
  email?: string;
  
  // For rendering and calculations
  scale?: number;
  originalScale?: number;
  realWidth?: string;
  realHeight?: string;
  savedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  isDuplicate?: boolean;
  
  // For debugging
  viewState?: {
    zoom: number;
    panOffset: { x: number; y: number };
    scale: number;
  };
  
  [key: string]: any;
}

export interface Shape {
  id: string;
  type: ShapeType;

  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;

  color: string;
  borderColor: string;
  borderWidth: number;

  fontSize?: number;
  text?: string;

  zIndex?: number;
  isLocked?: boolean;

  metadata?: ShapeMetadata;
}

export interface FloorPlan {
  id: string;
  name: string;
  description?: string;
  image?: string;
  
  // Add version property
  version?: string;
  
  scale: number;
  gridSize?: number;
  showGrid?: boolean;
  tags?: string[];
  isPublic?: boolean;
  isMaster?: boolean;
  
  shapes: Shape[];
  
  createdAt?: string;
  updatedAt?: string;
  thumbnail?: string;
  viewState?: {
    zoom: number;
    panOffset: { x: number; y: number };
    scale: number;
  };
}
