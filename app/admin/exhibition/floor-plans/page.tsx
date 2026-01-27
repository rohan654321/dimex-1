"use client";

import React from "react"

import { useRef, useState, useEffect, CSSProperties } from "react";
import { Upload, ZoomIn, ZoomOut, Trash2, Move, Square, Circle, Triangle, Hexagon, Octagon, Star, Heart, Type, Minus, Plus, Download, RotateCw, Copy, Grid, Layers, Palette, MousePointer, Hand, Building2, Table, Armchair, DoorOpen, MoveVertical, Tablet as Toilet, Printer, Monitor, Speaker, Coffee, Save, Loader2, Eye, EyeOff, Ruler, MapPin, Package, Truck, AlertCircle, CheckCircle, Maximize2, Minimize2, Search, Scissors, Home, Filter, Settings, Menu, X, ChevronLeft, ChevronRight, Smartphone, Tablet, MonitorIcon, Expand, Minimize, Users, Calendar, Clock, Share2, Cloud, Database, FolderPlus, History, RefreshCw, Shield, StarIcon, TrendingUp } from "lucide-react";
import type { Options as Html2CanvasOptions } from "html2canvas";
import toast, { Toaster } from 'react-hot-toast';

// Import shared types
import { FloorPlan, Shape, ShapeType } from '@/lib/types';

// API service functions
import { floorPlansAPI } from '@/lib/api/floorPlans';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  category: string;
}

type ToolMode = "select" | "draw" | "pan" | "text" | "measure";

export default function ProfessionalExhibitionEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{width: number, height: number} | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([
    {
      id: "booth-1",
      type: "booth" as ShapeType,
      x: 100,
      y: 100,
      width: 80,
      height: 60,
      rotation: 0,
      color: "rgba(59, 130, 246, 0.3)",
      borderColor: "#1e40af",
      borderWidth: 2,
      fontSize: 12,
      text: "Booth 1",
      zIndex: 1,
      isLocked: false,
      metadata: {
        boothNumber: "1",
        companyName: "TechCorp Inc.",
        status: "booked",
        category: "Technology",
        notes: "VIP Client"
      }
    }
  ]);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [currentTool, setCurrentTool] = useState<ToolMode>("select");
  const [currentShape, setCurrentShape] = useState<ShapeType>("booth");
  const [currentColor, setCurrentColor] = useState("rgba(59, 130, 246, 0.3)");
  const [currentBorderColor, setCurrentBorderColor] = useState("#1e40af");
  const [borderWidth, setBorderWidth] = useState(2);
  const [fontSize, setFontSize] = useState(12);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [tempShape, setTempShape] = useState<Shape | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [gridSize, setGridSize] = useState(20);
  const [showGrid, setShowGrid] = useState(true);
  const [isSnapToGrid, setIsSnapToGrid] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [measurementLine, setMeasurementLine] = useState<{x1: number, y1: number, x2: number, y2: number} | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureStart, setMeasureStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.1);
  const [activeLayer, setActiveLayer] = useState<string>("booths");
  const [layers, setLayers] = useState<Layer[]>([
    { id: "booths", name: "Booths", visible: true, locked: false, category: "booths" },
    { id: "fixtures", name: "Fixtures", visible: true, locked: false, category: "fixtures" },
    { id: "text", name: "Text Labels", visible: true, locked: false, category: "text" },
    { id: "measurements", name: "Measurements", visible: true, locked: true, category: "measurements" }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showBoothDetails, setShowBoothDetails] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  const [isToolsOpen, setIsToolsOpen] = useState(true);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloorPlan, setCurrentFloorPlan] = useState<FloorPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [saveInterval, setSaveInterval] = useState<NodeJS.Timeout | null>(null);

  const colorPalette = [
    "rgba(59, 130, 246, 0.3)", "rgba(16, 185, 129, 0.3)", "rgba(245, 158, 11, 0.3)",
    "rgba(236, 72, 153, 0.3)", "rgba(139, 92, 246, 0.3)", "rgba(6, 182, 212, 0.3)",
    "rgba(132, 204, 22, 0.3)", "rgba(249, 115, 22, 0.3)", "rgba(99, 102, 241, 0.3)",
    "rgba(239, 68, 68, 0.3)"
  ];

  const borderColors = [
    "#1e40af", "#047857", "#b45309", "#be185d", "#5b21b6",
    "#0e7490", "#4d7c0f", "#c2410c", "#4338ca", "#b91c1c"
  ];

  const exhibitionShapes = [
    { type: "booth" as ShapeType, label: "Booth", icon: Building2, category: "booths" },
    { type: "table" as ShapeType, label: "Table", icon: Table, category: "fixtures" },
    { type: "chair" as ShapeType, label: "Chair", icon: Armchair, category: "fixtures" },
    { type: "door" as ShapeType, label: "Door", icon: DoorOpen, category: "fixtures" },
    { type: "stairs" as ShapeType, label: "Stairs", icon: MoveVertical, category: "fixtures" },
    { type: "toilet" as ShapeType, label: "Toilet", icon: Toilet, category: "fixtures" },
    { type: "register" as ShapeType, label: "Register", icon: Printer, category: "fixtures" },
    { type: "stage" as ShapeType, label: "Stage", icon: Speaker, category: "fixtures" },
    { type: "screen" as ShapeType, label: "Screen", icon: Monitor, category: "fixtures" },
    { type: "speaker" as ShapeType, label: "Speaker", icon: Speaker, category: "fixtures" },
    { type: "cafe" as ShapeType, label: "Cafe", icon: Coffee, category: "fixtures" },
    { type: "storage" as ShapeType, label: "Storage", icon: Package, category: "fixtures" },
    { type: "truck" as ShapeType, label: "Loading", icon: Truck, category: "fixtures" },
    { type: "pillar" as ShapeType, label: "Pillar", icon: Square, category: "fixtures" },
    { type: "info" as ShapeType, label: "Info Desk", icon: MapPin, category: "fixtures" },
    { type: "emergency" as ShapeType, label: "Emergency", icon: AlertCircle, category: "fixtures" },
    { type: "rectangle" as ShapeType, label: "Rectangle", icon: Square, category: "basic" },
    { type: "square" as ShapeType, label: "Square", icon: Square, category: "basic" },
    { type: "circle" as ShapeType, label: "Circle", icon: Circle, category: "basic" },
    { type: "text" as ShapeType, label: "Text", icon: Type, category: "text" },
  ];

  const statusColors = {
    available: "#10b981",
    booked: "#3b82f6",
    reserved: "#f59e0b",
    maintenance: "#ef4444"
  };

  const loadFloorPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const response = await floorPlansAPI.getAll();
      if (response.data) {
        setFloorPlans(response.data);
        toast.success('Floor plans loaded successfully');
      }
    } catch (error) {
      console.error('Error loading floor plans:', error);
      toast.error('Failed to load floor plans');
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const saveFloorPlanToBackend = async (isAutoSave: boolean = false) => {
    if (!planName.trim() && !isAutoSave) {
      toast.error('Please enter a plan name');
      return;
    }

    try {
      setIsSaving(true);
      
      const floorPlanData: Omit<FloorPlan, 'id'> = {
        name: planName || `Untitled Plan ${new Date().toLocaleDateString()}`,
        description: planDescription,
        version: "1.0",
        shapes: shapes.map(shape => ({
          ...shape,
          x: safeNumber(shape.x),
          y: safeNumber(shape.y),
          width: safeNumber(shape.width),
          height: safeNumber(shape.height),
          type: shape.type as ShapeType
        })),
        image: image || undefined,
        scale,
        tags: ['exhibition', 'floor-plan'],
        isPublic: false
      };

      let response;
      if (currentFloorPlan?.id) {
        response = await floorPlansAPI.update(currentFloorPlan.id, floorPlanData);
        if (response.success) {
          toast.success('Floor plan updated successfully');
        }
      } else {
        response = await floorPlansAPI.create(floorPlanData);
        if (response.success && response.data) {
          toast.success('Floor plan saved successfully');
          setCurrentFloorPlan(response.data);
        }
      }

      setLastSaved(new Date().toLocaleTimeString());
      if (!isAutoSave) {
        setShowSaveModal(false);
        setPlanName('');
        setPlanDescription('');
      }

      await loadFloorPlans();
    } catch (error) {
      console.error('Error saving floor plan:', error);
      toast.error('Failed to save floor plan');
    } finally {
      setIsSaving(false);
    }
  };

  const loadFloorPlanFromBackend = async (planId: string) => {
    try {
      setIsLoading(true);
      const response = await floorPlansAPI.getById(planId);
      const plan = response.data;
      
      if (plan) {
        setShapes(plan.shapes || []);
        setImage(plan.image || null);
        setScale(plan.scale || 0.1);
        setCurrentFloorPlan(plan);
        setLastSaved(plan.updatedAt || plan.createdAt || null);
        
        toast.success(`Loaded: ${plan.name}`);
        setShowLoadModal(false);
      }
    } catch (error) {
      console.error('Error loading floor plan:', error);
      toast.error('Failed to load floor plan');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFloorPlanFromBackend = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this floor plan?')) {
      return;
    }

    try {
      await floorPlansAPI.delete(planId);
      toast.success('Floor plan deleted successfully');
      
      if (currentFloorPlan?.id === planId) {
        setCurrentFloorPlan(null);
        setShapes([]);
        setImage(null);
        setSelectedId(null);
      }
      
      await loadFloorPlans();
    } catch (error) {
      console.error('Error deleting floor plan:', error);
      toast.error('Failed to delete floor plan');
    }
  };

  const duplicateFloorPlan = async (planId: string) => {
    try {
      const response = await floorPlansAPI.getById(planId);
      const plan = response.data;
      
      if (!plan) throw new Error('Plan not found');
      
      const newPlanName = `${plan.name} (Copy)`;
      const duplicateData: Omit<FloorPlan, 'id'> = {
        name: newPlanName,
        description: plan.description,
        version: plan.version,
        shapes: plan.shapes,
        image: plan.image,
        scale: plan.scale,
        tags: plan.tags,
        isPublic: plan.isPublic
      };

      const newPlan = await floorPlansAPI.create(duplicateData);
      if (newPlan.success) {
        toast.success('Floor plan duplicated successfully');
        await loadFloorPlans();
      }
      
      return newPlan.data;
    } catch (error) {
      console.error('Error duplicating floor plan:', error);
      toast.error('Failed to duplicate floor plan');
      throw error;
    }
  };

  const exportFloorPlan = async (format: 'json' | 'png' | 'pdf' = 'png') => {
    try {
      if (format === 'png') {
        await handleExport();
        return;
      }

      if (format === 'json') {
        const data = {
          name: planName || `Exhibition_Plan_${Date.now()}`,
          version: "1.0",
          shapes: shapes,
          image: image || undefined,
          scale,
          createdAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.name}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        toast.success('Exported as JSON successfully');
      }

      if (format === 'pdf' && currentFloorPlan?.id) {
        const response = await floorPlansAPI.export(currentFloorPlan.id, 'pdf');
        if (response.data) {
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${currentFloorPlan.name}.pdf`;
          link.click();
          URL.revokeObjectURL(url);
          
          toast.success('Exported as PDF successfully');
        }
      }
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error('Export failed');
    }
  };

  const uploadImageToBackend = async (file: File) => {
    try {
      if (!currentFloorPlan?.id) {
        await saveFloorPlanToBackend();
      }
      
      const response = await floorPlansAPI.uploadImage(currentFloorPlan!.id!, file);
      if (response.data?.imageUrl) {
        setImage(response.data.imageUrl);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  useEffect(() => {
    if (autoSave && currentFloorPlan?.id) {
      const interval = setInterval(() => {
        saveFloorPlanToBackend(true);
      }, 30000);
      
      setSaveInterval(interval);
      
      return () => {
        if (saveInterval) {
          clearInterval(saveInterval);
        }
      };
    }
  }, [autoSave, currentFloorPlan?.id, saveInterval]);

  useEffect(() => {
    loadFloorPlans();
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shapes.length > 0 && !currentFloorPlan?.id) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceMode("mobile");
        setIsToolsOpen(false);
        setIsPropertiesOpen(false);
      } else if (width < 1024) {
        setDeviceMode("tablet");
        setIsToolsOpen(true);
        setIsPropertiesOpen(false);
      } else {
        setDeviceMode("desktop");
        setIsToolsOpen(true);
        setIsPropertiesOpen(true);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    setShapes(prev => prev.map(shape => ({
      ...shape,
      x: isNaN(shape.x) ? 0 : shape.x,
      y: isNaN(shape.y) ? 0 : shape.y,
      width: isNaN(shape.width) ? 50 : shape.width,
      height: isNaN(shape.height) ? 50 : shape.height,
    })));
  }, []);

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }
      
      setIsLoading(true);
      
      try {
        if (currentFloorPlan?.id) {
          await uploadImageToBackend(file);
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              setImage(reader.result as string);
              setImageDimensions({
                width: img.width,
                height: img.height
              });
              setPanOffset({ x: 50, y: 50 });
              setIsLoading(false);
              toast.success('Image uploaded successfully');
            };
            img.src = reader.result as string;
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    input.click();
  };

  const handleExport = async () => {
    if (!containerRef.current) return;
    
    setIsLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;

      const options: Partial<Html2CanvasOptions> = {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        removeContainer: true,
      };

      const canvas = await html2canvas(containerRef.current!, options);
      const link = document.createElement("a");
      link.download = `exhibition-floor-plan-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success('Exported as PNG successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (currentFloorPlan?.id) {
      saveFloorPlanToBackend();
    } else {
      setShowSaveModal(true);
    }
  };

  const handleLoad = () => {
    setShowLoadModal(true);
  };

  const createNewPlan = () => {
    if (shapes.length > 0 && !currentFloorPlan?.id) {
      if (!confirm('You have unsaved changes. Create new plan?')) {
        return;
      }
    }
    
    setCurrentFloorPlan(null);
    setShapes([]);
    setImage(null);
    setSelectedId(null);
    setPanOffset({ x: 0, y: 0 });
    setZoom(1);
    setPlanName('');
    setPlanDescription('');
    
    toast.success('New plan created');
  };

  const getCoordinates = (clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    let x = (clientX - rect.left) / zoom - panOffset.x;
    let y = (clientY - rect.top) / zoom - panOffset.y;

    if (isSnapToGrid && showGrid) {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }

    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const { x, y } = getCoordinates(e.clientX, e.clientY);

    if (currentTool === "pan") {
      setIsPanning(true);
      setStartPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (currentTool === "measure") {
      setIsMeasuring(true);
      setMeasureStart({ x, y });
      setMeasurementLine({ x1: x, y1: y, x2: x, y2: y });
      return;
    }

    if (currentTool === "draw" || currentTool === "text") {
      setIsDrawing(true);
      setStartPoint({ x, y });

      const shapeType = currentTool === "text" ? "text" : currentShape;
      const newShape: Shape = {
        id: "temp",
        type: shapeType,
        x,
        y,
        width: 0,
        height: 0,
        rotation: 0,
        color: currentColor,
        borderColor: currentBorderColor,
        borderWidth,
        fontSize,
        text: shapeType === "text" ? "Text" : getDefaultText(shapeType),
        zIndex: shapes.length,
        isLocked: false,
        metadata: shapeType === "booth" ? {
          boothNumber: (shapes.filter(s => s.type === "booth").length + 1).toString(),
          status: "available",
          category: "General"
        } : undefined
      };

      setTempShape(newShape);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const { x, y } = getCoordinates(e.clientX, e.clientY);

    if (isPanning) {
      const deltaX = (e.clientX - startPoint.x) / zoom;
      const deltaY = (e.clientY - startPoint.y) / zoom;
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setStartPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (isMeasuring && measurementLine) {
      setMeasurementLine({
        ...measurementLine,
        x2: x,
        y2: y
      });
      return;
    }

    if (isDrawing && tempShape) {
      let width = Math.abs(x - startPoint.x);
      let height = Math.abs(y - startPoint.y);

      if (tempShape.type === "square" || tempShape.type === "circle" || tempShape.type === "pillar") {
        const size = Math.max(width, height);
        width = size;
        height = size;
      }

      if (isSnapToGrid && showGrid) {
        width = Math.round(width / gridSize) * gridSize;
        height = Math.round(height / gridSize) * gridSize;
      }

      setTempShape({
        ...tempShape,
        x: Math.min(startPoint.x, x),
        y: Math.min(startPoint.y, y),
        width: Math.max(20, width),
        height: Math.max(20, height)
      });
    }

    if (currentTool === "select" && selectedId && e.buttons === 1) {
      const shape = shapes.find(s => s.id === selectedId);
      if (shape && !shape.isLocked) {
        const activeLayerObj = layers.find(l => l.id === activeLayer);
        if (activeLayerObj && !activeLayerObj.locked) {
          let newX = x - shape.width / 2;
          let newY = y - shape.height / 2;

          if (isSnapToGrid && showGrid) {
            newX = Math.round(newX / gridSize) * gridSize;
            newY = Math.round(newY / gridSize) * gridSize;
          }

          setShapes(prev =>
            prev.map(s =>
              s.id === selectedId
                ? { ...s, x: newX, y: newY }
                : s
            )
          );
        }
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDrawing && tempShape && tempShape.width > 10 && tempShape.height > 10) {
      const finalShape = {
        ...tempShape,
        id: `shape-${Date.now()}`
      };
      setShapes(prev => [...prev, finalShape]);
      setSelectedId(finalShape.id);
      if (finalShape.type === "booth") {
        setShowBoothDetails(true);
      }
    }

    setIsDrawing(false);
    setIsPanning(false);
    setIsMeasuring(false);
    setTempShape(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const touch = e.touches[0];
    const { x, y } = getCoordinates(touch.clientX, touch.clientY);

    if (currentTool === "pan") {
      setIsPanning(true);
      setStartPoint({ x: touch.clientX, y: touch.clientY });
      return;
    }

    if (currentTool === "measure") {
      setIsMeasuring(true);
      setMeasureStart({ x, y });
      setMeasurementLine({ x1: x, y1: y, x2: x, y2: y });
      return;
    }

    if (currentTool === "draw" || currentTool === "text") {
      setIsDrawing(true);
      setStartPoint({ x, y });

      const shapeType = currentTool === "text" ? "text" : currentShape;
      const newShape: Shape = {
        id: "temp",
        type: shapeType,
        x,
        y,
        width: 0,
        height: 0,
        rotation: 0,
        color: currentColor,
        borderColor: currentBorderColor,
        borderWidth,
        fontSize,
        text: shapeType === "text" ? "Text" : getDefaultText(shapeType),
        zIndex: shapes.length,
        isLocked: false,
        metadata: shapeType === "booth" ? {
          boothNumber: (shapes.filter(s => s.type === "booth").length + 1).toString(),
          status: "available",
          category: "General"
        } : undefined
      };

      setTempShape(newShape);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const touch = e.touches[0];
    const { x, y } = getCoordinates(touch.clientX, touch.clientY);

    if (isPanning) {
      const deltaX = (touch.clientX - startPoint.x) / zoom;
      const deltaY = (touch.clientY - startPoint.y) / zoom;
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setStartPoint({ x: touch.clientX, y: touch.clientY });
      return;
    }

    if (isMeasuring && measurementLine) {
      setMeasurementLine({
        ...measurementLine,
        x2: x,
        y2: y
      });
      return;
    }

    if (isDrawing && tempShape) {
      let width = Math.abs(x - startPoint.x);
      let height = Math.abs(y - startPoint.y);

      if (tempShape.type === "square" || tempShape.type === "circle" || tempShape.type === "pillar") {
        const size = Math.max(width, height);
        width = size;
        height = size;
      }

      if (isSnapToGrid && showGrid) {
        width = Math.round(width / gridSize) * gridSize;
        height = Math.round(height / gridSize) * gridSize;
      }

      setTempShape({
        ...tempShape,
        x: Math.min(startPoint.x, x),
        y: Math.min(startPoint.y, y),
        width: Math.max(20, width),
        height: Math.max(20, height)
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isDrawing && tempShape && tempShape.width > 10 && tempShape.height > 10) {
      const finalShape = {
        ...tempShape,
        id: `shape-${Date.now()}`
      };
      setShapes(prev => [...prev, finalShape]);
      setSelectedId(finalShape.id);
      if (finalShape.type === "booth") {
        setShowBoothDetails(true);
      }
    }

    setIsDrawing(false);
    setIsPanning(false);
    setIsMeasuring(false);
    setTempShape(null);
  };

  const handleShapeClick = (shapeId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (currentTool === "select") {
      setSelectedId(shapeId);
      const shape = shapes.find(s => s.id === shapeId);
      if (shape?.type === "booth") {
        setShowBoothDetails(true);
      }
    }
  };

  const deleteSelected = () => {
    if (selectedId) {
      setShapes(prev => prev.filter(s => s.id !== selectedId));
      setSelectedId(null);
      setShowBoothDetails(false);
      toast.success('Shape deleted');
    }
  };

  const duplicateSelected = () => {
    if (selectedId) {
      const selected = shapes.find(s => s.id === selectedId);
      if (selected) {
        const duplicate = {
          ...selected,
          id: `shape-${Date.now()}`,
          x: selected.x + 20,
          y: selected.y + 20
        };
        setShapes(prev => [...prev, duplicate]);
        setSelectedId(duplicate.id);
        toast.success('Shape duplicated');
      }
    }
  };

  const rotateSelected = () => {
    if (selectedId) {
      setShapes(prev =>
        prev.map(s =>
          s.id === selectedId
            ? { ...s, rotation: (s.rotation + 45) % 360 }
            : s
        )
      );
      toast.success('Shape rotated');
    }
  };

  const resizeSelected = (direction: 'nw' | 'ne' | 'sw' | 'se', deltaX: number, deltaY: number) => {
    if (selectedId) {
      setShapes(prev =>
        prev.map(s => {
          if (s.id !== selectedId) return s;
          
          let newWidth = s.width;
          let newHeight = s.height;
          let newX = s.x;
          let newY = s.y;

          switch (direction) {
            case 'se':
              newWidth = Math.max(20, s.width + deltaX);
              newHeight = Math.max(20, s.height + deltaY);
              break;
            case 'sw':
              newWidth = Math.max(20, s.width - deltaX);
              newHeight = Math.max(20, s.height + deltaY);
              newX = s.x + deltaX;
              break;
            case 'ne':
              newWidth = Math.max(20, s.width + deltaX);
              newHeight = Math.max(20, s.height - deltaY);
              newY = s.y + deltaY;
              break;
            case 'nw':
              newWidth = Math.max(20, s.width - deltaX);
              newHeight = Math.max(20, s.height - deltaY);
              newX = s.x + deltaX;
              newY = s.y + deltaY;
              break;
          }

          if (s.type === 'square' || s.type === 'circle') {
            const size = Math.max(newWidth, newHeight);
            newWidth = size;
            newHeight = size;
          }

          return { ...s, x: newX, y: newY, width: newWidth, height: newHeight };
        })
      );
    }
  };

  const bringToFront = () => {
    if (selectedId) {
      const maxZIndex = Math.max(...shapes.map(s => s.zIndex));
      setShapes(prev =>
        prev.map(s =>
          s.id === selectedId
            ? { ...s, zIndex: maxZIndex + 1 }
            : s
        )
      );
      toast.success('Brought to front');
    }
  };

  const sendToBack = () => {
    if (selectedId) {
      const minZIndex = Math.min(...shapes.map(s => s.zIndex));
      setShapes(prev =>
        prev.map(s =>
          s.id === selectedId
            ? { ...s, zIndex: minZIndex - 1 }
            : s
        )
      );
      toast.success('Sent to back');
    }
  };

  const toggleLock = () => {
    if (selectedId) {
      setShapes(prev =>
        prev.map(s =>
          s.id === selectedId
            ? { ...s, isLocked: !s.isLocked }
            : s
        )
      );
      const selected = shapes.find(s => s.id === selectedId);
      toast.success(selected?.isLocked ? 'Shape unlocked' : 'Shape locked');
    }
  };

  const updateSelectedText = (text: string) => {
    if (selectedId) {
      setShapes(prev =>
        prev.map(s =>
          s.id === selectedId
            ? { ...s, text }
            : s
        )
      );
    }
  };

  const updateBoothMetadata = (key: string, value: any) => {
    if (selectedId) {
      setShapes(prev =>
        prev.map(s => {
          if (s.id !== selectedId) return s;
          return {
            ...s,
            metadata: {
              ...s.metadata,
              [key]: value
            }
          };
        })
      );
    }
  };

  const getDefaultText = (shapeType: ShapeType): string => {
    const shapeCount = shapes.filter(s => s.type === shapeType).length + 1;
    switch (shapeType) {
      case 'booth': return `Booth ${shapeCount}`;
      case 'table': return `Table ${shapeCount}`;
      case 'chair': return `Chair ${shapeCount}`;
      case 'door': return 'Door';
      case 'stairs': return 'Stairs';
      case 'toilet': return 'Toilet';
      case 'register': return 'Register';
      case 'stage': return 'Stage';
      case 'screen': return 'Screen';
      case 'speaker': return 'Speaker';
      case 'cafe': return 'Cafe';
      case 'storage': return 'Storage';
      case 'truck': return 'Loading';
      case 'pillar': return 'Pillar';
      case 'info': return 'Info Desk';
      case 'emergency': return 'Emergency';
      case 'text': return 'Text';
      default: return shapeType.charAt(0).toUpperCase() + shapeType.slice(1);
    }
  };

  const getShapeIcon = (shapeType: ShapeType) => {
    const shape = exhibitionShapes.find(s => s.type === shapeType);
    return shape?.icon || Square;
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleZoomReset = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === layerId
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    );
  };

  const toggleLayerLock = (layerId: string) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === layerId
          ? { ...layer, locked: !layer.locked }
          : layer
      )
    );
  };

  const getShapesForActiveLayer = () => {
    const layer = layers.find(l => l.id === activeLayer);
    if (!layer) return shapes;
    
    return shapes.filter(shape => {
      const shapeDef = exhibitionShapes.find(s => s.type === shape.type);
      return shapeDef?.category === layer.category;
    });
  };

  const calculateMeasurement = () => {
    if (!measurementLine) return '';
    const dx = measurementLine.x2 - measurementLine.x1;
    const dy = measurementLine.y2 - measurementLine.y1;
    const pixels = Math.sqrt(dx * dx + dy * dy);
    const meters = pixels * scale;
    return `${meters.toFixed(2)}m (${pixels.toFixed(0)}px)`;
  };

  const safeNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const getSelectedShape = () => {
    return shapes.find(s => s.id === selectedId);
  };

  const renderShape = (shape: Shape) => {
    const isSelected = shape.id === selectedId;
    const layer = layers.find(l => {
      const shapeDef = exhibitionShapes.find(s => s.type === shape.type);
      return shapeDef?.category === l.category;
    });

    if (layer && !layer.visible) return null;

    const commonStyles: CSSProperties = {
      position: 'absolute',
      left: `${shape.x}px`,
      top: `${shape.y}px`,
      width: `${shape.width}px`,
      height: `${shape.height}px`,
      transform: `rotate(${shape.rotation}deg)`,
      backgroundColor: shape.color || 'transparent',
      border: `${shape.borderWidth}px solid ${shape.borderColor}`,
      zIndex: shape.zIndex,
      cursor: layer?.locked || shape.isLocked ? 'not-allowed' : 'move',
      pointerEvents: (layer?.locked || shape.isLocked ? 'none' : 'auto') as 'auto' | 'none',
      boxSizing: 'border-box',
    };

    const textStyles: CSSProperties = {
      ...commonStyles,
      backgroundColor: 'transparent',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${shape.fontSize}px`,
      color: shape.borderColor,
      fontWeight: 'bold',
      textAlign: 'center',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      padding: '4px',
      userSelect: 'none',
    };

    switch (shape.type) {
      case 'circle':
        return (
          <div
            key={shape.id}
            style={{
              ...commonStyles,
              borderRadius: '50%',
            }}
            onClick={(e) => handleShapeClick(shape.id, e)}
            onTouchStart={(e) => handleShapeClick(shape.id, e)}
          />
        );

      case 'text':
        return (
          <div
            key={shape.id}
            style={textStyles}
            onClick={(e) => handleShapeClick(shape.id, e)}
            onTouchStart={(e) => handleShapeClick(shape.id, e)}
          >
            {shape.text}
          </div>
        );

      case 'booth':
        const boothStatus = shape.metadata?.status || 'available';
        return (
          <div
            key={shape.id}
            style={{
              ...commonStyles,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              background: `linear-gradient(135deg, ${shape.color} 0%, rgba(255,255,255,0.3) 100%)`,
            } as CSSProperties}
            onClick={(e) => handleShapeClick(shape.id, e)}
            onTouchStart={(e) => handleShapeClick(shape.id, e)}
          >
            <div style={{
              fontSize: '10px',
              fontWeight: 'bold',
              color: shape.borderColor,
              textAlign: 'center',
              marginBottom: '2px'
            }}>
              {shape.text}
            </div>
            {shape.metadata?.boothNumber && (
              <div style={{
                fontSize: '8px',
                color: statusColors[boothStatus as keyof typeof statusColors] || '#666',
                backgroundColor: 'rgba(255,255,255,0.8)',
                padding: '1px 4px',
                borderRadius: '3px',
                fontWeight: 'bold'
              }}>
                #{shape.metadata.boothNumber}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div
            key={shape.id}
            style={commonStyles}
            onClick={(e) => handleShapeClick(shape.id, e)}
            onTouchStart={(e) => handleShapeClick(shape.id, e)}
          >
            {shape.text && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '10px',
                fontWeight: 'bold',
                color: shape.borderColor,
                textAlign: 'center',
                width: '100%',
                padding: '0 4px',
              }}>
                {shape.text}
              </div>
            )}
          </div>
        );
    }
  };

  const renderSelectionHandles = () => {
    const selected = getSelectedShape();
    if (!selected || selected.type === 'text') return null;

    const handles = [
      { position: 'nw', x: -4, y: -4 },
      { position: 'ne', x: selected.width - 4, y: -4 },
      { position: 'sw', x: -4, y: selected.height - 4 },
      { position: 'se', x: selected.width - 4, y: selected.height - 4 },
    ];

    return handles.map(handle => (
      <div
        key={handle.position}
        style={{
          position: 'absolute',
          left: `${selected.x + handle.x}px`,
          top: `${selected.y + handle.y}px`,
          width: '8px',
          height: '8px',
          backgroundColor: '#3b82f6',
          border: '2px solid white',
          borderRadius: '2px',
          cursor: `${handle.position}-resize`,
          zIndex: 1000,
        } as CSSProperties}
        onMouseDown={(e) => {
          e.preventDefault();
          const startX = e.clientX;
          const startY = e.clientY;

          const handleMouseMove = (me: MouseEvent) => {
            const deltaX = me.clientX - startX;
            const deltaY = me.clientY - startY;
            resizeSelected(handle.position as 'nw' | 'ne' | 'sw' | 'se', deltaX, deltaY);
          };

          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      />
    ));
  };

  const renderMeasurementLine = () => {
    if (!measurementLine || !showMeasurements) return null;

    const distance = calculateMeasurement();
    const midX = (measurementLine.x1 + measurementLine.x2) / 2;
    const midY = (measurementLine.y1 + measurementLine.y2) / 2;

    return (
      <>
        <svg
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 100,
          }}
        >
          <line
            x1={measurementLine.x1}
            y1={measurementLine.y1}
            x2={measurementLine.x2}
            y2={measurementLine.y2}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <circle cx={measurementLine.x1} cy={measurementLine.y1} r="4" fill="#ef4444" />
          <circle cx={measurementLine.x2} cy={measurementLine.y2} r="4" fill="#ef4444" />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: `${midX}px`,
            top: `${midY - 15}px`,
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            pointerEvents: 'none',
            zIndex: 101,
          }}
        >
          {distance}
        </div>
      </>
    );
  };

  const renderGrid = () => {
    if (!showGrid) return null;

    const gridLines = [];
    const width = imageDimensions?.width || 800;
    const height = imageDimensions?.height || 600;

    for (let x = 0; x < width; x += gridSize) {
      gridLines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      );
    }

    for (let y = 0; y < height; y += gridSize) {
      gridLines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      );
    }

    return (
      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: `${width}px`,
          height: `${height}px`,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        {gridLines}
      </svg>
    );
  };

  const renderToolbar = () => {
    return (
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setCurrentTool('select')}
          style={{
            padding: '8px 12px',
            backgroundColor: currentTool === 'select' ? '#3b82f6' : '#e5e7eb',
            color: currentTool === 'select' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <MousePointer size={16} /> Select
        </button>
        <button
          onClick={() => setCurrentTool('draw')}
          style={{
            padding: '8px 12px',
            backgroundColor: currentTool === 'draw' ? '#3b82f6' : '#e5e7eb',
            color: currentTool === 'draw' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Square size={16} /> Draw
        </button>
        <button
          onClick={() => setCurrentTool('text')}
          style={{
            padding: '8px 12px',
            backgroundColor: currentTool === 'text' ? '#3b82f6' : '#e5e7eb',
            color: currentTool === 'text' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Type size={16} /> Text
        </button>
        <button
          onClick={() => setCurrentTool('pan')}
          style={{
            padding: '8px 12px',
            backgroundColor: currentTool === 'pan' ? '#3b82f6' : '#e5e7eb',
            color: currentTool === 'pan' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Hand size={16} /> Pan
        </button>
        <button
          onClick={() => setCurrentTool('measure')}
          style={{
            padding: '8px 12px',
            backgroundColor: currentTool === 'measure' ? '#3b82f6' : '#e5e7eb',
            color: currentTool === 'measure' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Ruler size={16} /> Measure
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={handleZoomIn}
          style={{
            padding: '8px 12px',
            backgroundColor: '#e5e7eb',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          style={{
            padding: '8px 12px',
            backgroundColor: '#e5e7eb',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={handleZoomReset}
          style={{
            padding: '8px 12px',
            backgroundColor: '#e5e7eb',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <RotateCw size={16} />
        </button>
      </div>
    );
  };

  const renderPropertiesPanel = () => {
    const selected = getSelectedShape();
    if (!selected) return null;

    return (
      <div style={{
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 'bold' }}>
          Properties
        </h3>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
            Fill Color
          </label>
          <input
            type="color"
            value={selected.color || '#3b82f6'}
            onChange={(e) => {
              setShapes(prev =>
                prev.map(s => s.id === selectedId ? { ...s, color: e.target.value } : s)
              );
            }}
            style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
            Border Color
          </label>
          <input
            type="color"
            value={selected.borderColor}
            onChange={(e) => {
              setShapes(prev =>
                prev.map(s => s.id === selectedId ? { ...s, borderColor: e.target.value } : s)
              );
            }}
            style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
            Border Width: {selected.borderWidth}px
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={selected.borderWidth}
            onChange={(e) => {
              setShapes(prev =>
                prev.map(s => s.id === selectedId ? { ...s, borderWidth: parseInt(e.target.value) } : s)
              );
            }}
            style={{ width: '100%' }}
          />
        </div>

        {selected.type === 'text' && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
              Text
            </label>
            <input
              type="text"
              value={selected.text}
              onChange={(e) => updateSelectedText(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
            />
          </div>
        )}

        {selected.type === 'text' && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
              Font Size: {selected.fontSize}px
            </label>
            <input
              type="range"
              min="8"
              max="48"
              value={selected.fontSize}
              onChange={(e) => {
                setShapes(prev =>
                  prev.map(s => s.id === selectedId ? { ...s, fontSize: parseInt(e.target.value) } : s)
                );
              }}
              style={{ width: '100%' }}
            />
          </div>
        )}

        {selected.type === 'booth' && selected.metadata && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                Booth Number
              </label>
              <input
                type="text"
                value={selected.metadata.boothNumber || ''}
                onChange={(e) => updateBoothMetadata('boothNumber', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                Status
              </label>
              <select
                value={selected.metadata.status || 'available'}
                onChange={(e) => updateBoothMetadata('status', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                Category
              </label>
              <input
                type="text"
                value={selected.metadata.category || ''}
                onChange={(e) => updateBoothMetadata('category', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                Notes
              </label>
              <textarea
                value={selected.metadata.notes || ''}
                onChange={(e) => updateBoothMetadata('notes', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', minHeight: '60px' }}
              />
            </div>
          </>
        )}

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
            Rotation: {selected.rotation}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={selected.rotation}
            onChange={(e) => {
              setShapes(prev =>
                prev.map(s => s.id === selectedId ? { ...s, rotation: parseInt(e.target.value) } : s)
              );
            }}
            style={{ width: '100%' }}
          />
        </div>

        <button
          onClick={toggleLock}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            backgroundColor: selected.isLocked ? '#ef4444' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {selected.isLocked ? 'Unlock' : 'Lock'}
        </button>

        <button
          onClick={deleteSelected}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Delete
        </button>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Toaster />
      
      <div style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            onClick={handleUpload}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 'bold',
            }}
          >
            <Upload size={16} /> Upload Background
          </button>
          
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 'bold',
            }}
          >
            <Save size={16} /> Save
          </button>

          <button
            onClick={handleLoad}
            style={{
              padding: '8px 16px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 'bold',
            }}
          >
            <Download size={16} /> Load
          </button>

          <button
            onClick={() => exportFloorPlan('png')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 'bold',
            }}
          >
            <Download size={16} /> Export
          </button>

          <button
            onClick={createNewPlan}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 'bold',
            }}
          >
            <Plus size={16} /> New
          </button>
        </div>

        {renderToolbar()}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <div style={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: '#f3f4f6',
            position: 'relative',
          }}>
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                position: 'relative',
                width: imageDimensions?.width || 800,
                height: imageDimensions?.height || 600,
                margin: 'auto',
                backgroundColor: '#ffffff',
                backgroundImage: image ? `url(${image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: '0 0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
            >
              {renderGrid()}
              {shapes.map(shape => renderShape(shape))}
              {tempShape && renderShape(tempShape)}
              {selectedId && renderSelectionHandles()}
              {renderMeasurementLine()}
            </div>
          </div>
        </div>

        {isPropertiesOpen && deviceMode !== 'mobile' && (
          <div style={{
            width: '300px',
            borderLeft: '1px solid #e5e7eb',
            overflow: 'auto',
            padding: '12px',
            backgroundColor: '#f9fafb',
          }}>
            {renderPropertiesPanel()}
          </div>
        )}
      </div>

      {showSaveModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px', fontWeight: 'bold' }}>
              Save Floor Plan
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                Plan Name
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="e.g., Exhibition 2024"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                Description
              </label>
              <textarea
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
                placeholder="Add any notes or description..."
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  minHeight: '80px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => saveFloorPlanToBackend()}
                disabled={isSaving}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: isSaving ? '#d1d5db' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                {isSaving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: '#e5e7eb',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoadModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px', fontWeight: 'bold' }}>
              Load Floor Plan
            </h2>

            {isLoadingPlans ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto', marginBottom: '8px' }} />
                <p>Loading floor plans...</p>
              </div>
            ) : floorPlans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
                <p>No floor plans found. Create a new one first!</p>
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                {floorPlans.map(plan => (
                  <div
                    key={plan.id}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    onClick={() => loadFloorPlanFromBackend(plan.id)}
                  >
                    <h3 style={{ marginTop: 0, marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                      {plan.name}
                    </h3>
                    <p style={{ marginTop: 0, marginBottom: '4px', fontSize: '12px', color: '#666' }}>
                      {plan.description}
                    </p>
                    <p style={{ marginTop: 0, marginBottom: 0, fontSize: '11px', color: '#999' }}>
                      {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowLoadModal(false)}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '8px',
                backgroundColor: '#e5e7eb',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
