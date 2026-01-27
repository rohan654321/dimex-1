"use client";

import { useRef, useState, useEffect } from "react";
import {
  Upload, ZoomIn, ZoomOut, Trash2, Move, Square, Circle,
  Triangle, Hexagon, Octagon, Star, Heart, Type, Minus, Plus,
  Download, RotateCw, Copy, Grid, Layers, Palette, MousePointer,
  Hand, Building2, Table, Armchair, DoorOpen, MoveVertical, Toilet,
  Printer, Monitor, Speaker, Coffee, Save, Loader2, Eye, EyeOff,
  Ruler, MapPin, Package, Truck, AlertCircle, CheckCircle, Maximize2,
  Minimize2, Search, Scissors, Home, Filter, Settings, Menu, X,
  ChevronLeft, ChevronRight, Smartphone, Tablet, Monitor as MonitorIcon,
  Expand, Minimize
} from "lucide-react";
import type { Options as Html2CanvasOptions } from "html2canvas";


type ShapeType = "rectangle" | "square" | "circle" | "ellipse" | 
                 "triangle" | "hexagon" | "octagon" | "star" | 
                 "heart" | "line" | "arrow" | "text" | "booth" |
                 "table" | "chair" | "door" | "stairs" | "toilet" |
                 "register" | "stage" | "screen" | "speaker" | "cafe" |
                 "storage" | "truck" | "pillar" | "info" | "emergency";

interface Shape {
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
  text?: string;
  fontSize: number;
  zIndex: number;
  isLocked?: boolean;
  metadata?: {
    boothNumber?: string;
    companyName?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    products?: string[];
    status?: "available" | "booked" | "reserved" | "maintenance";
    category?: string;
  };
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  category: string;
}

type ToolMode = "select" | "draw" | "pan" | "text" | "measure";

interface FloorPlanData {
  id?: string;
  name: string;
  description?: string;
  floor: string;
  scale: number;
  gridSize: number;
  image?: string;
  shapes: Shape[];
  metadata?: {
    createdAt: string;
    updatedAt?: string;
    createdBy?: string;
    version?: string;
  };
}

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

  // Professional color palette
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

  // Device detection
  useEffect(() => {
    loadFloorPlans();
  }, []);

  // Update shapes when current floor plan changes
  useEffect(() => {
    if (currentFloorPlan.shapes) {
      setShapes(currentFloorPlan.shapes);
      setScale(currentFloorPlan.scale || 0.1);
      setGridSize(currentFloorPlan.gridSize || 20);
      if (currentFloorPlan.image) {
        setImage(currentFloorPlan.image);
      }
    }
  }, [currentFloorPlan]);

  // Update current floor plan when shapes change
  useEffect(() => {
    setCurrentFloorPlan(prev => ({
      ...prev,
      shapes,
      scale,
      gridSize
    }));
  }, [shapes, scale, gridSize]);

  // ================= BACKEND INTEGRATION =================

  const loadFloorPlans = async () => {
    try {
      setIsLoading(true);
      const response = await api.floorPlans.getAllFloorPlans({}, 1, 100);
      if (response.success && response.data.floorPlans) {
        setFloorPlans(response.data.floorPlans);
      }
    } catch (error) {
      console.error('Error loading floor plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFloorPlanToBackend = async (planData: FloorPlanData) => {
    try {
      setIsLoading(true);
      
      const planToSave = {
  ...planData,
  shapes: planData.shapes.map(shape => ({
    ...shape,
    x: safeNumber(shape.x),
    y: safeNumber(shape.y),
    width: safeNumber(shape.width),
    height: safeNumber(shape.height),
  })),
  metadata: {
    createdAt: planData.metadata?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: planData.metadata?.createdBy ?? "user",
    version: "1.0",
  },
};


      if (planData.id) {
        // Update existing floor plan
        const response = await api.floorPlans.updateFloorPlan(planData.id, planToSave);
        if (response.success) {
          alert('Floor plan updated successfully!');
          await loadFloorPlans();
          return response.data;
        }
      } else {
        // Create new floor plan
        const response = await api.floorPlans.createFloorPlan(planToSave);
        if (response.success) {
          alert('Floor plan saved successfully!');
          await loadFloorPlans();
          setCurrentFloorPlan(response.data);
          return response.data;
        }
      }
    } catch (error) {
      console.error('Error saving floor plan:', error);
      alert('Failed to save floor plan');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFloorPlanFromBackend = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await api.floorPlans.getFloorPlan(id);
      if (response.success) {
        setCurrentFloorPlan(response.data);
        setIsLoadDialogOpen(false);
        alert('Floor plan loaded successfully!');
        return response.data;
      }
    } catch (error) {
      console.error('Error loading floor plan:', error);
      alert('Failed to load floor plan');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFloorPlanFromBackend = async (id: string) => {
    if (confirm('Are you sure you want to delete this floor plan?')) {
      try {
        setIsLoading(true);
        const response = await api.floorPlans.deleteFloorPlan(id);
        if (response.success) {
          alert('Floor plan deleted successfully!');
          await loadFloorPlans();
          // Reset to new floor plan if we deleted the current one
          if (currentFloorPlan.id === id) {
            setCurrentFloorPlan({
              name: "New Floor Plan",
              description: "",
              floor: "1",
              scale: 0.1,
              gridSize: 20,
              shapes: []
            });
          }
        }
      } catch (error) {
        console.error('Error deleting floor plan:', error);
        alert('Failed to delete floor plan');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const duplicateFloorPlanInBackend = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await api.floorPlans.duplicateFloorPlan(id);
      if (response.success) {
        alert('Floor plan duplicated successfully!');
        await loadFloorPlans();
        return response.data;
      }
    } catch (error) {
      console.error('Error duplicating floor plan:', error);
      alert('Failed to duplicate floor plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToBackend = async () => {
    if (!saveName.trim()) {
      alert('Please enter a name for the floor plan');
      return;
    }

    const planData: FloorPlanData = {
      ...currentFloorPlan,
      name: saveName,
      description: currentFloorPlan.description || "",
      floor: currentFloorPlan.floor || "1",
      image: image || undefined,
      shapes,
      scale,
      gridSize,
      metadata: {
        ...currentFloorPlan.metadata,
        createdAt: currentFloorPlan.metadata?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "user",
        version: "1.0"
      }
    };

    await saveFloorPlanToBackend(planData);
    setIsSaveDialogOpen(false);
    setSaveName("");
  };

  const handleAutoSave = async () => {
    if (currentFloorPlan.id && currentFloorPlan.name !== "New Floor Plan") {
      try {
        await saveFloorPlanToBackend(currentFloorPlan);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentFloorPlan.id) {
        handleAutoSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentFloorPlan]);

  /* ================= FILE OPERATIONS ================= */
  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          setImage(reader.result as string);
          setImageDimensions({
            width: img.width,
            height: img.height
          });
          // Center the image
          setPanOffset({ x: 50, y: 50 });
          setIsLoading(false);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

const handleExport = async (format: 'png' | 'pdf' | 'json' = 'png') => {
  if (!containerRef.current) return;

  setIsLoading(true);
  try {
    if (format === 'json') {
      const planData = {
        ...currentFloorPlan,
        image,
        shapes,
        scale,
        gridSize,
      };

      const blob = new Blob(
        [JSON.stringify(planData, null, 2)],
        { type: 'application/json' }
      );

      api.downloadFile(blob, `floor-plan-${currentFloorPlan.name}.json`);
      return;
    }

    // png | pdf
    if (currentFloorPlan.id) {
      const blob = await api.floorPlans.exportFloorPlan(
        currentFloorPlan.id,
        format
      );
      api.downloadFile(blob, `floor-plan-${currentFloorPlan.name}.${format}`);
      return;
    }

    // fallback PNG via html2canvas
    const html2canvas = (await import('html2canvas')).default;

    const canvas = await html2canvas(containerRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    });

      const canvas = await html2canvas(containerRef.current!, options);
      const link = document.createElement("a");
      link.download = `exhibition-floor-plan-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    const data = {
      shapes,
      image,
      scale,
      createdAt: new Date().toISOString(),
      version: "1.0"
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exhibition-plan.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setShapes(data.shapes || []);
          setImage(data.image || null);
          setScale(data.scale || 0.1);
        } catch (error) {
          console.error('Error loading file:', error);
          alert('Error loading file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  /* ================= UTILITY FUNCTIONS ================= */
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

  /* ================= DRAWING & INTERACTION - MOUSE EVENTS ================= */
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

  /* ================= TOUCH EVENTS FOR MOBILE ================= */
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

  /* ================= SHAPE ACTIONS ================= */
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

  const selectedShape = shapes.find(s => s.id === selectedId);

  /* ================= LAYERS ================= */
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

  const getDefaultText = (type: ShapeType): string => {
    const defaults: Record<ShapeType, string> = {
      rectangle: "Area", square: "Square", circle: "Circle", ellipse: "Ellipse",
      triangle: "Triangle", hexagon: "Hexagon", octagon: "Octagon", star: "Star",
      heart: "Heart", line: "Line", arrow: "Arrow", text: "Text",
      booth: "Booth", table: "Table", chair: "Chair", door: "Door",
      stairs: "Stairs", toilet: "Toilet", register: "Register", stage: "Stage",
      screen: "Screen", speaker: "Speaker", cafe: "Cafe", storage: "Storage",
      truck: "Truck", pillar: "Pillar", info: "Info", emergency: "Emergency"
    };
    return defaults[type] || type;
  };

  const safeNumber = (num: number | undefined): number => {
    return num && !isNaN(num) ? num : 0;
  };

  /* ================= KEYBOARD SHORTCUTS ================= */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case "delete":
        case "backspace":
          deleteSelected();
          break;
        case "d":
          if (e.ctrlKey) duplicateSelected();
          break;
        case "r":
          rotateSelected();
          break;
        case "[":
          sendToBack();
          break;
        case "]":
          bringToFront();
          break;
        case "l":
          toggleLock();
          break;
        case " ":
          setCurrentTool("pan");
          break;
        case "escape":
          setSelectedId(null);
          setCurrentTool("select");
          setShowBoothDetails(false);
          break;
        case "+":
        case "=":
          if (e.ctrlKey) setZoom(z => Math.min(z + 0.1, 5));
          break;
        case "-":
          if (e.ctrlKey) setZoom(z => Math.max(z - 0.1, 0.1));
          break;
        case "m":
          setCurrentTool("measure");
          break;
        case "s":
          if (e.ctrlKey) {
            e.preventDefault();
            handleSave();
          }
          break;
        case "f":
          if (e.ctrlKey) {
            e.preventDefault();
            setIsFullscreen(!isFullscreen);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, shapes, isFullscreen]);

  // Handle fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  const zoomLevels = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4];

  return (
    <div className={`flex flex-col h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Building2 size={20} />
              </div>
              <div>
                <h1 className="font-semibold text-gray-800">Exhibition Planner</h1>
                <p className="text-xs text-gray-500">Professional Floor Plan Designer</p>
              </div>
            </div>
          </div>

          {/* Center: Stats & Status */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">{shapes.filter(s => s.type === 'booth').length} Booths</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">{shapes.length} Objects</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Scale: 1px = {scale}m</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Device Mode Selector */}
            <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`p-1.5 rounded ${deviceMode === "desktop" ? "bg-white shadow" : "hover:bg-gray-200"}`}
                title="Desktop View"
              >
                <MonitorIcon size={14} />
              </button>
              <button
                onClick={() => setDeviceMode("tablet")}
                className={`p-1.5 rounded ${deviceMode === "tablet" ? "bg-white shadow" : "hover:bg-gray-200"}`}
                title="Tablet View"
              >
                <Tablet size={14} />
              </button>
              <button
                onClick={() => setDeviceMode("mobile")}
                className={`p-1.5 rounded ${deviceMode === "mobile" ? "bg-white shadow" : "hover:bg-gray-200"}`}
                title="Mobile View"
              >
                <Smartphone size={14} />
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title={isFullscreen ? "Exit Fullscreen (Ctrl+F)" : "Fullscreen (Ctrl+F)"}
            >
              {isFullscreen ? <Minimize size={18} /> : <Expand size={18} />}
            </button>

            {/* File Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleLoad}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center gap-2"
              >
                <Save size={14} />
                <span className="hidden sm:inline">Load</span>
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm flex items-center gap-2"
              >
                <Save size={14} />
                <span className="hidden sm:inline">Save</span>
              </button>
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                <span className="hidden sm:inline">Upload</span>
              </button>
              <button
                onClick={handleExport}
                disabled={isLoading}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Stats Bar */}
        <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{shapes.filter(s => s.type === 'booth').length} Booths</span>
              <span className="text-gray-600">{shapes.length} Objects</span>
              <span className="text-gray-600">Scale: {scale}</span>
            </div>
            <span className="text-gray-500">Zoom: {Math.round(zoom * 100)}%</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR - TOOLS (Collapsible) */}
        {(isToolsOpen || deviceMode === "desktop") && (
          <aside className={`${deviceMode === "mobile" ? 'absolute inset-y-0 left-0 z-40 w-72 bg-white shadow-xl' : 'w-72'} ${deviceMode === "tablet" ? 'w-64' : ''} bg-white border-r border-gray-200 flex flex-col transition-all duration-200`}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Settings size={16} />
                  Tools & Properties
                </h3>
                <button
                  onClick={() => setIsToolsOpen(false)}
                  className="lg:hidden p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  { tool: "select", icon: MousePointer, label: "Select", color: "blue" },
                  { tool: "pan", icon: Hand, label: "Pan", color: "gray" },
                  { tool: "draw", icon: Square, label: "Draw", color: "purple" },
                  { tool: "text", icon: Type, label: "Text", color: "green" },
                  { tool: "measure", icon: Ruler, label: "Measure", color: "red" },
                ].map(({ tool, icon: Icon, label, color }) => (
                  <button
                    key={tool}
                    onClick={() => setCurrentTool(tool as ToolMode)}
                    className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                      currentTool === tool
                        ? `bg-${color}-50 border-${color}-200 text-${color}-700 shadow-sm`
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-xs mt-1">{label}</span>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              {selectedShape && (
                <div className="mb-6">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Quick Actions</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={duplicateSelected}
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg"
                      title="Duplicate"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={rotateSelected}
                      className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg"
                      title="Rotate"
                    >
                      <RotateCw size={14} />
                    </button>
                    <button
                      onClick={bringToFront}
                      className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg"
                      title="Bring to Front"
                    >
                      <Layers size={14} />
                    </button>
                    <button
                      onClick={sendToBack}
                      className="p-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg"
                      title="Send to Back"
                    >
                      <Layers size={14} className="rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {/* Color Picker */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Colors</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-700 mb-1 block">Fill Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={currentColor}
                        onChange={e => setCurrentColor(e.target.value)}
                        className="w-10 h-10 cursor-pointer rounded-lg border border-gray-300"
                      />
                      <div className="grid grid-cols-5 gap-1 flex-1">
                        {colorPalette.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentColor(color)}
                            className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 mb-1 block">Border Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={currentBorderColor}
                        onChange={e => setCurrentBorderColor(e.target.value)}
                        className="w-10 h-10 cursor-pointer rounded-lg border border-gray-300"
                      />
                      <div className="grid grid-cols-5 gap-1 flex-1">
                        {borderColors.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentBorderColor(color)}
                            className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shapes Library */}
            {currentTool === "draw" && (
              <div className="p-4 border-t border-gray-200 overflow-y-auto flex-1">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Shapes Library</h4>
                <div className="space-y-4">
                  {["booths", "fixtures", "basic", "text"].map(category => (
                    <div key={category}>
                      <h5 className="text-sm font-medium text-gray-700 mb-2 capitalize">{category}</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {exhibitionShapes
                          .filter(shape => shape.category === category)
                          .map(({ type, label, icon: Icon }) => (
                            <button
                              key={type}
                              onClick={() => setCurrentShape(type as ShapeType)}
                              className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                                currentShape === type
                                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <Icon size={16} />
                              <span className="text-xs mt-1 truncate w-full">{label}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Panel */}
            <div className="p-4 border-t border-gray-200">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Show Grid</label>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`w-10 h-5 rounded-full transition-colors ${showGrid ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white transform transition-transform ${showGrid ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Snap to Grid</label>
                  <button
                    onClick={() => setIsSnapToGrid(!isSnapToGrid)}
                    className={`w-10 h-5 rounded-full transition-colors ${isSnapToGrid ? 'bg-green-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white transform transition-transform ${isSnapToGrid ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Grid Size: {gridSize}px</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={gridSize}
                    onChange={e => setGridSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Scale: 1px = {scale}m</label>
                  <input
                    type="range"
                    min="0.01"
                    max="1"
                    step="0.01"
                    value={scale}
                    onChange={e => setScale(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* MAIN CANVAS AREA */}
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* Canvas Controls Bar */}
          <div className="bg-white border-b border-gray-200 p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Left: Zoom Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setZoom(z => Math.max(z - 0.2, 0.1))}
                    className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
                    disabled={zoom <= 0.1}
                  >
                    <ZoomOut size={16} />
                  </button>
                  <select
                    value={zoom}
                    onChange={e => setZoom(parseFloat(e.target.value))}
                    className="bg-transparent px-2 py-1 text-sm focus:outline-none"
                  >
                    {zoomLevels.map(level => (
                      <option key={level} value={level}>
                        {Math.round(level * 100)}%
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setZoom(z => Math.min(z + 0.2, 5))}
                    className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
                    disabled={zoom >= 5}
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    onClick={() => setZoom(1)}
                    className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded"
                  >
                    Reset
                  </button>
                </div>

                {/* View Toggles */}
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`px-3 py-1.5 rounded text-sm flex items-center gap-2 ${showGrid ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                  >
                    <Grid size={14} />
                    Grid
                  </button>
                  <button
                    onClick={() => setShowMeasurements(!showMeasurements)}
                    className={`px-3 py-1.5 rounded text-sm flex items-center gap-2 ${showMeasurements ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                  >
                    <Ruler size={14} />
                    Measure
                  </button>
                </div>
              </div>

              {/* Center: Selected Shape Actions */}
              {selectedShape && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                  <span className="text-sm text-gray-600 px-2">Selected:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={duplicateSelected}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      title="Duplicate (Ctrl+D)"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={rotateSelected}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      title="Rotate (R)"
                    >
                      <RotateCw size={14} />
                    </button>
                    <button
                      onClick={toggleLock}
                      className={`p-2 rounded-lg transition-colors ${selectedShape.isLocked ? 'bg-red-100 text-red-600' : 'hover:bg-white'}`}
                      title="Lock/Unlock (L)"
                    >
                      <Move size={14} />
                    </button>
                    <button
                      onClick={deleteSelected}
                      className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      title="Delete (Del)"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Right: Info & Help */}
              <div className="text-xs text-gray-500">
                <span className="hidden sm:inline">
                  <kbd className="px-2 py-1 bg-gray-100 rounded border mr-2">Space</kbd> Pan •
                  <kbd className="px-2 py-1 bg-gray-100 rounded border mx-2">Esc</kbd> Cancel •
                  <kbd className="px-2 py-1 bg-gray-100 rounded border mx-2">Del</kbd> Delete
                </span>
              </div>
            </div>
          </div>

          {/* Canvas Container */}
          <div
            ref={containerRef}
            className="flex-1 relative overflow-hidden bg-gray-50 select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Grid Background */}
            {showGrid && (
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #94a3b8 1px, transparent 1px),
                    linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
                  `,
                  backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
                  transform: `translate(${panOffset.x * zoom}px, ${panOffset.y * zoom}px)`
                }}
              />
            )}

            {/* Canvas Content */}
            <div
              className="absolute inset-0"
              style={{
                transform: `
                  translate(${panOffset.x * zoom}px, ${panOffset.y * zoom}px)
                  scale(${zoom})
                `,
                transformOrigin: '0 0'
              }}
            >
              {/* Background Image */}
              {image && (
                <img
                  src={image}
                  alt="Floor plan background"
                  className="absolute top-0 left-0 max-w-full max-h-full object-contain select-none pointer-events-none"
                  draggable={false}
                  style={{ opacity: 0.7 }}
                />
              )}

              {/* Shapes */}
              {[...shapes]
                .filter(shape => {
                  const layer = layers.find(l => l.category === exhibitionShapes.find(s => s.type === shape.type)?.category);
                  return layer ? layer.visible : true;
                })
                .sort((a, b) => a.zIndex - b.zIndex)
                .map(shape => {
                  const isSelected = shape.id === selectedId;
                  const layer = layers.find(l => l.category === exhibitionShapes.find(s => s.type === shape.type)?.category);
                  const isLocked = shape.isLocked || layer?.locked;
                  
                  return (
                    <div
                      key={shape.id}
                      onClick={(e) => handleShapeClick(shape.id, e)}
                      onTouchStart={(e) => handleShapeClick(shape.id, e)}
                      className={`absolute transition-all duration-150 ${isLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:shadow-md'} ${
                        isSelected ? 'ring-2 ring-blue-500 ring-offset-1 shadow-lg z-50' : ''
                      }`}
                      style={{
                        left: safeNumber(shape.x),
                        top: safeNumber(shape.y),
                        width: safeNumber(shape.type === 'square' || shape.type === 'circle' || shape.type === 'pillar' 
                          ? Math.max(shape.width, shape.height) 
                          : shape.width),
                        height: safeNumber(shape.type === 'square' || shape.type === 'circle' || shape.type === 'pillar'
                          ? Math.max(shape.width, shape.height) 
                          : shape.height),
                        backgroundColor: shape.color,
                        border: `${safeNumber(shape.borderWidth)}px solid ${shape.borderColor}`,
                        borderRadius: getBorderRadius(shape.type),
                        transform: `rotate(${safeNumber(shape.rotation)}deg)`,
                        transformOrigin: 'center',
                        zIndex: safeNumber(shape.zIndex)
                      }}
                    >
                      {/* Shape Icon */}
                      {shape.type !== "text" && (
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 opacity-60">
                          {(() => {
                            const Icon = getShapeIcon(shape.type);
                            return <Icon size={10} />;
                          })()}
                        </div>
                      )}

                      {/* Text Content */}
                      {(shape.text || shape.type === "text") && (
                        <div className="w-full h-full flex items-center justify-center pointer-events-none p-2">
                          <span
                            className="text-center wrap-break-word leading-tight"
                            style={{
                              fontSize: Math.max(8, safeNumber(shape.fontSize)),
                              color: shape.type === 'text' ? shape.borderColor : '#1f2937',
                              fontWeight: shape.type === 'booth' ? '600' : '400'
                            }}
                          >
                            {shape.text}
                          </span>
                        </div>
                      )}

                      {/* Status Indicator */}
                      {shape.type === "booth" && shape.metadata?.status && (
                        <div 
                          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: statusColors[shape.metadata.status] }}
                          title={`Status: ${shape.metadata.status}`}
                        />
                      )}

                      {/* Selection Handles & Resize Controls */}
                      {isSelected && !isLocked && (
                        <>
                          {/* Corner Resize Handles */}
                          <div
                            className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-nw-resize hover:bg-blue-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              const startX = e.clientX;
                              const startY = e.clientY;
                              
                              const handleMouseMove = (e: MouseEvent) => {
                                const deltaX = (startX - e.clientX) / zoom;
                                const deltaY = (startY - e.clientY) / zoom;
                                resizeSelected('nw', deltaX, deltaY);
                              };
                              
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                              };
                              
                              document.addEventListener('mousemove', handleMouseMove);
                              document.addEventListener('mouseup', handleMouseUp);
                            }}
                          />
                          <div
                            className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-ne-resize hover:bg-blue-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              const startX = e.clientX;
                              const startY = e.clientY;
                              
                              const handleMouseMove = (e: MouseEvent) => {
                                const deltaX = (e.clientX - startX) / zoom;
                                const deltaY = (startY - e.clientY) / zoom;
                                resizeSelected('ne', deltaX, deltaY);
                              };
                              
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                              };
                              
                              document.addEventListener('mousemove', handleMouseMove);
                              document.addEventListener('mouseup', handleMouseUp);
                            }}
                          />
                          <div
                            className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-sw-resize hover:bg-blue-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              const startX = e.clientX;
                              const startY = e.clientY;
                              
                              const handleMouseMove = (e: MouseEvent) => {
                                const deltaX = (startX - e.clientX) / zoom;
                                const deltaY = (e.clientY - startY) / zoom;
                                resizeSelected('sw', deltaX, deltaY);
                              };
                              
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                              };
                              
                              document.addEventListener('mousemove', handleMouseMove);
                              document.addEventListener('mouseup', handleMouseUp);
                            }}
                          />
                          <div
                            className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-se-resize hover:bg-blue-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              const startX = e.clientX;
                              const startY = e.clientY;
                              
                              const handleMouseMove = (e: MouseEvent) => {
                                const deltaX = (e.clientX - startX) / zoom;
                                const deltaY = (e.clientY - startY) / zoom;
                                resizeSelected('se', deltaX, deltaY);
                              };
                              
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                              };
                              
                              document.addEventListener('mousemove', handleMouseMove);
                              document.addEventListener('mouseup', handleMouseUp);
                            }}
                          />

                          {/* Side Resize Handles */}
                          <div className="absolute top-1/2 -left-1 w-2 h-6 bg-white border border-blue-500 rounded cursor-w-resize -translate-y-1/2" />
                          <div className="absolute top-1/2 -right-1 w-2 h-6 bg-white border border-blue-500 rounded cursor-e-resize -translate-y-1/2" />
                          <div className="absolute -top-1 left-1/2 h-2 w-6 bg-white border border-blue-500 rounded cursor-n-resize -translate-x-1/2" />
                          <div className="absolute -bottom-1 left-1/2 h-2 w-6 bg-white border border-blue-500 rounded cursor-s-resize -translate-x-1/2" />
                        </>
                      )}
                    </div>
                  );
                })}

              {/* Temporary Drawing Shape */}
              {tempShape && (
                <div
                  className="absolute border-2 border-dashed border-blue-400 bg-blue-100/20"
                  style={{
                    left: safeNumber(tempShape.x),
                    top: safeNumber(tempShape.y),
                    width: safeNumber(tempShape.type === 'square' || tempShape.type === 'circle' || tempShape.type === 'pillar'
                      ? Math.max(tempShape.width, tempShape.height) 
                      : tempShape.width),
                    height: safeNumber(tempShape.type === 'square' || tempShape.type === 'circle' || tempShape.type === 'pillar'
                      ? Math.max(tempShape.width, tempShape.height) 
                      : tempShape.height),
                    borderRadius: getBorderRadius(tempShape.type),
                    transform: `rotate(${safeNumber(tempShape.rotation)}deg)`,
                    transformOrigin: 'center'
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600 opacity-70">{tempShape.text}</span>
                  </div>
                </div>
              )}

              {/* Measurement Line */}
              {measurementLine && (
                <>
                  <div
                    className="absolute bg-red-500"
                    style={{
                      left: safeNumber(measurementLine.x1),
                      top: safeNumber(measurementLine.y1),
                      width: Math.sqrt(
                        Math.pow(measurementLine.x2 - measurementLine.x1, 2) + 
                        Math.pow(measurementLine.y2 - measurementLine.y1, 2)
                      ),
                      height: 2,
                      transform: `rotate(${Math.atan2(
                        measurementLine.y2 - measurementLine.y1,
                        measurementLine.x2 - measurementLine.x1
                      )}rad)`,
                      transformOrigin: '0 0'
                    }}
                  />
                  <div
                    className="absolute bg-white text-red-700 text-xs font-mono px-2 py-1 rounded shadow border border-red-200"
                    style={{
                      left: safeNumber((measurementLine.x1 + measurementLine.x2) / 2),
                      top: safeNumber((measurementLine.y1 + measurementLine.y2) / 2) - 25,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    {calculateDistance(
                      measurementLine.x1,
                      measurementLine.y1,
                      measurementLine.x2,
                      measurementLine.y2
                    ).meters}m
                    <div className="text-[10px] text-gray-500">
                      ({calculateDistance(measurementLine.x1, measurementLine.y1, measurementLine.x2, measurementLine.y2).pixels}px)
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Canvas Overlay Info */}
            <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-mono">
              <div className="flex items-center gap-4">
                <span>Zoom: {Math.round(zoom * 100)}%</span>
                <span className="text-gray-400">|</span>
                <span>X: {Math.round(panOffset.x)}</span>
                <span>Y: {Math.round(panOffset.y)}</span>
                <span className="text-gray-400">|</span>
                <span className="capitalize">{currentTool}</span>
              </div>
            </div>

            {/* Mobile Floating Actions */}
            {deviceMode === "mobile" && (
              <div className="absolute bottom-20 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50"
                >
                  <Settings size={20} />
                </button>
                <button
                  onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
                  className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50"
                >
                  <Layers size={20} />
                </button>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR - PROPERTIES & LAYERS (Collapsible) */}
        {(isPropertiesOpen || deviceMode === "desktop") && (
          <div className={`${deviceMode === "mobile" ? 'absolute inset-y-0 right-0 z-40 w-80 bg-white shadow-xl' : 'w-80'} ${deviceMode === "tablet" ? 'w-72' : ''} bg-white border-l border-gray-200 flex flex-col transition-all duration-200`}>
            {/* Layers Panel */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Layers size={16} />
                  Layers
                </h3>
                <button
                  onClick={() => setIsPropertiesOpen(false)}
                  className="lg:hidden p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {layers.map(layer => (
                  <div key={layer.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLayerVisibility(layer.id)}
                        className="p-1"
                      >
                        {layer.visible ? <Eye size={14} className="text-gray-700" /> : <EyeOff size={14} className="text-gray-400" />}
                      </button>
                      <span className="text-sm text-gray-700">{layer.name}</span>
                    </div>
                    <button
                      onClick={() => toggleLayerLock(layer.id)}
                      className={`p-1 ${layer.locked ? 'text-red-600' : 'text-gray-400'}`}
                    >
                      <Move size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Properties Panel */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedShape ? (
                showBoothDetails && selectedShape.type === "booth" ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 mb-4">Booth Details</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Booth #</label>
                          <input
                            type="text"
                            value={selectedShape.metadata?.boothNumber || ""}
                            onChange={e => updateShapeMetadata({ boothNumber: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Status</label>
                          <select
                            value={selectedShape.metadata?.status || "available"}
                            onChange={e => updateShapeMetadata({ status: e.target.value as any })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="available">Available</option>
                            <option value="booked">Booked</option>
                            <option value="reserved">Reserved</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Company</label>
                        <input
                          type="text"
                          value={selectedShape.metadata?.companyName || ""}
                          onChange={e => updateShapeMetadata({ companyName: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Company name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Contact</label>
                          <input
                            type="text"
                            value={selectedShape.metadata?.contactPerson || ""}
                            onChange={e => updateShapeMetadata({ contactPerson: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contact person"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Phone</label>
                          <input
                            type="tel"
                            value={selectedShape.metadata?.phone || ""}
                            onChange={e => updateShapeMetadata({ phone: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Phone number"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Dimensions</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Width (m)</label>
                            <input
                              type="number"
                              value={Math.round(safeNumber(selectedShape.width) * scale * 100) / 100}
                              onChange={e => {
                                const meters = parseFloat(e.target.value);
                                const pixels = meters / scale;
                                setShapes(prev =>
                                  prev.map(s =>
                                    s.id === selectedId
                                      ? { ...s, width: pixels }
                                      : s
                                  )
                                );
                              }}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              min="0.1"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Height (m)</label>
                            <input
                              type="number"
                              value={Math.round(safeNumber(selectedShape.height) * scale * 100) / 100}
                              onChange={e => {
                                const meters = parseFloat(e.target.value);
                                const pixels = meters / scale;
                                setShapes(prev =>
                                  prev.map(s =>
                                    s.id === selectedId
                                      ? { ...s, height: pixels }
                                      : s
                                  )
                                );
                              }}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              min="0.1"
                              step="0.1"
                            />
                          </div>
                        </div>
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

      {/* Modals */}
      {isSaveDialogOpen && <SaveFloorPlanModal />}
      {isLoadDialogOpen && <LoadFloorPlanModal />}
    </div>
  );
}
