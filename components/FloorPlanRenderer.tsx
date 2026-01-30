'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Building2, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Shape } from '@/lib/types';

/* =========================================================
   Shared Shape Renderer
========================================================= */

interface RenderShapeProps {
  shape: Shape;
  isSelected?: boolean;
  onClick?: (shapeId: string) => void;
}

export const renderShape = (
  shape: Shape,
  isSelected: boolean = false,
  onClick?: (shapeId: string) => void
) => {
  const getBorderRadius = (type: Shape['type']) => {
    switch (type) {
      case 'circle':
      case 'pillar':
        return '50%';
      case 'triangle':
        return '0';
      default:
        return '6px';
    }
  };

  const getIcon = (type: Shape['type']) => {
    switch (type) {
      case 'booth':
        return Building2;
      case 'info':
        return MapPin;
      case 'stage':
        return CheckCircle;
      case 'emergency':
        return XCircle;
      default:
        return null;
    }
  };

  const Icon = getIcon(shape.type);

  return (
    <div
      key={shape.id}
      onClick={() => onClick?.(shape.id)}
      className={`absolute transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1 shadow-lg z-50' : ''}`}
      style={{
        left: shape.x,
        top: shape.y,
        width:
          shape.type === 'square' ||
          shape.type === 'circle' ||
          shape.type === 'pillar'
            ? Math.max(shape.width, shape.height)
            : shape.width,
        height:
          shape.type === 'square' ||
          shape.type === 'circle' ||
          shape.type === 'pillar'
            ? Math.max(shape.width, shape.height)
            : shape.height,
        backgroundColor: shape.color,
        border: `${shape.borderWidth}px solid ${shape.borderColor}`,
        borderRadius: getBorderRadius(shape.type),
        transform: `rotate(${shape.rotation}deg)`,
        transformOrigin: 'center',
        zIndex: shape.zIndex ?? 1,
      }}
    >
      {/* Icon */}
      {Icon && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 opacity-60">
          <Icon size={12} />
        </div>
      )}

      {/* Text */}
      {(shape.text || shape.type === 'text') && (
        <div className="w-full h-full flex items-center justify-center pointer-events-none p-2">
          <span
            className="text-center break-words leading-tight"
            style={{
              fontSize: Math.max(8, shape.fontSize ?? 12),
              color: shape.type === 'text' ? shape.borderColor : '#1f2937',
              fontWeight: shape.type === 'booth' ? '600' : '400',
              wordBreak: 'break-word',
            }}
          >
            {shape.text}
          </span>
        </div>
      )}

      {/* Booth Status */}
      {shape.type === 'booth' && shape.metadata?.status && (
        <div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
          style={{
            backgroundColor:
              {
                available: '#10b981',
                booked: '#3b82f6',
                reserved: '#f59e0b',
                maintenance: '#ef4444',
              }[shape.metadata.status] ?? '#6b7280',
          }}
          title={`Status: ${shape.metadata.status}`}
        />
      )}

      {/* User Booth */}
      {shape.metadata?.isUserBooth && (
        <div className="absolute inset-0 border-2 border-green-500 rounded animate-pulse pointer-events-none" />
      )}
    </div>
  );
};

/* =========================================================
   FloorPlanRenderer Component
========================================================= */

export interface FloorPlanRendererProps {
  image?: string;
  shapes: Shape[];
  scale: number;

  showGrid?: boolean;
  gridSize?: number;

  zoom?: number;
  panOffset?: {
    x: number;
    y: number;
  };

  onShapeClick?: (shapeId: string) => void;
  selectedShapeId?: string | null;
  isEditable?: boolean;
}

export default function FloorPlanRenderer({
  image,
  shapes,
  scale,
  showGrid = true,
  gridSize = 20,
  zoom = 1,
  panOffset = { x: 0, y: 0 },
  onShapeClick,
  selectedShapeId = null,
  isEditable = false,
}: FloorPlanRendererProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [, setContainerSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const sortedShapes = [...shapes].sort(
    (a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1)
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gray-50 overflow-hidden select-none"
      style={{ minHeight: '500px' }}
    >
      {/* Grid */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #94a3b8 1px, transparent 1px),
              linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
            transform: `translate(${panOffset.x * zoom}px, ${panOffset.y * zoom}px)`,
          }}
        />
      )}

      {/* Canvas */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${panOffset.x * zoom}px, ${panOffset.y * zoom}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {image && (
          <img
            src={image}
            alt="Floor plan background"
            className="absolute top-0 left-0 max-w-full max-h-full object-contain pointer-events-none"
            draggable={false}
          />
        )}

        {sortedShapes.map((shape) =>
          renderShape(shape, shape.id === selectedShapeId, onShapeClick)
        )}
      </div>

      {/* Scale Info */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-mono">
        <span>Scale: 1:{scale}px</span> |{' '}
        <span>Zoom: {Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
