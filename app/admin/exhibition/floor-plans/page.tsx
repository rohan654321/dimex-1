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
  Expand, Minimize, SaveAll, FolderOpen, FileText, FolderTree,
  BookOpen, Database, CloudUpload, CloudDownload, Shield, Users,
  Calendar, Clock, Share2, Cloud, History, RefreshCw, TrendingUp,
  Star as StarIcon
} from "lucide-react";
import type { Options as Html2CanvasOptions } from "html2canvas";
import toast, { Toaster } from 'react-hot-toast';

// Import shared types
import { FloorPlan, Shape, ShapeType } from '@/lib/types';

// API service functions
import { floorPlansAPI } from '@/lib/api/floorPlans';

type ToolMode = "select" | "draw" | "pan" | "text" | "measure";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  category: string;
}

// Add this interface at the top, after other interfaces
interface ExhibitionShape {
  type: ShapeType;
  label: string;
  icon: any;
  category: string;
}

export default function ProfessionalExhibitionEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{width: number, height: number} | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([
    {
      id: "booth-1",
      type: "booth",
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
      metadata: {
        boothNumber: "1",
        companyName: "TechCorp Inc.",
        status: "booked",
        category: "Technology"
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
  
  // Floor plan management state
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloorPlan, setCurrentFloorPlan] = useState<FloorPlan | null>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoSave, setAutoSave] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [saveInterval, setSaveInterval] = useState<NodeJS.Timeout | null>(null);

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

  const exhibitionShapes: ExhibitionShape[] = [
    { type: "booth", label: "Booth", icon: Building2, category: "booths" },
    { type: "table", label: "Table", icon: Table, category: "fixtures" },
    { type: "chair", label: "Chair", icon: Armchair, category: "fixtures" },
    { type: "door", label: "Door", icon: DoorOpen, category: "fixtures" },
    { type: "stairs", label: "Stairs", icon: MoveVertical, category: "fixtures" },
    { type: "toilet", label: "Toilet", icon: Toilet, category: "fixtures" },
    { type: "register", label: "Register", icon: Printer, category: "fixtures" },
    { type: "stage", label: "Stage", icon: Speaker, category: "fixtures" },
    { type: "screen", label: "Screen", icon: Monitor, category: "fixtures" },
    { type: "speaker", label: "Speaker", icon: Speaker, category: "fixtures" },
    { type: "cafe", label: "Cafe", icon: Coffee, category: "fixtures" },
    { type: "storage", label: "Storage", icon: Package, category: "fixtures" },
    { type: "truck", label: "Loading", icon: Truck, category: "fixtures" },
    { type: "pillar", label: "Pillar", icon: Square, category: "fixtures" },
    { type: "info", label: "Info Desk", icon: MapPin, category: "fixtures" },
    { type: "emergency", label: "Emergency", icon: AlertCircle, category: "fixtures" },
    { type: "rectangle", label: "Rectangle", icon: Square, category: "basic" },
    { type: "square", label: "Square", icon: Square, category: "basic" },
    { type: "circle", label: "Circle", icon: Circle, category: "basic" },
    { type: "text", label: "Text", icon: Type, category: "text" },
  ];

  const statusColors = {
    available: "#10b981",
    booked: "#3b82f6",
    reserved: "#f59e0b",
    maintenance: "#ef4444"
  };

  // ================= BACKEND INTEGRATION FUNCTIONS =================

  const loadFloorPlans = async () => {
    try {
      setIsLoading(true);
      const response = await floorPlansAPI.getAll();
      if (response.data) {
        // Transform API response to match FloorPlan type
        const transformedPlans: FloorPlan[] = response.data.map((plan: any) => ({
          id: String(plan.id),
          name: plan.name,
          description: plan.description || '',
          version: plan.version || "1.0",
          shapes: Array.isArray(plan.shapes) ? plan.shapes.map((shape: any) => ({
            ...shape,
            id: shape.id || `shape-${Date.now()}-${Math.random()}`,
            type: (shape.type || 'rectangle') as ShapeType,
            x: Number(shape.x) || 0,
            y: Number(shape.y) || 0,
            width: Number(shape.width) || 50,
            height: Number(shape.height) || 50,
            rotation: Number(shape.rotation) || 0,
            color: shape.color || "rgba(59, 130, 246, 0.3)",
            borderColor: shape.borderColor || "#1e40af",
            borderWidth: Number(shape.borderWidth) || 2,
            fontSize: Number(shape.fontSize) || 12,
            text: shape.text || '',
            zIndex: Number(shape.zIndex) || 1,
            metadata: shape.metadata || {},
            isLocked: Boolean(shape.isLocked)
          })) : [],
          image: plan.image || undefined,
          scale: Number(plan.scale) || 0.1,
          tags: plan.tags || [],
          isPublic: Boolean(plan.isPublic),
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
          thumbnail: plan.thumbnail
        }));
        setFloorPlans(transformedPlans);
        toast.success('Floor plans loaded successfully');
      }
    } catch (error) {
      console.error('Error loading floor plans:', error);
      toast.error('Failed to load floor plans');
    } finally {
      setIsLoading(false);
    }
  };

  const saveFloorPlanToBackend = async (isAutoSave: boolean = false) => {
    const planName = saveName || currentFloorPlan?.name || `Untitled Plan ${new Date().toLocaleDateString()}`;
    
    if (!planName.trim() && !isAutoSave) {
      toast.error('Please enter a plan name');
      return;
    }

    try {
      setIsLoading(true);
      
      const floorPlanData: any = {
        name: planName,
        description: currentFloorPlan?.description || '',
        version: "1.0",
        shapes: shapes.map(shape => ({
          ...shape,
          x: safeNumber(shape.x),
          y: safeNumber(shape.y),
          width: safeNumber(shape.width),
          height: safeNumber(shape.height),
          rotation: safeNumber(shape.rotation),
          type: shape.type
        })),
        image: image || undefined,
        scale: scale,
        gridSize: gridSize,
        showGrid: showGrid,
        tags: ['exhibition', 'floor-plan'],
        isPublic: false
      };

      let response;
      if (currentFloorPlan?.id) {
        response = await floorPlansAPI.update(currentFloorPlan.id, floorPlanData);
        if (response.success) {
          toast.success('Floor plan updated successfully');
          setLastSaved(new Date().toLocaleTimeString());
          // Update current floor plan
          setCurrentFloorPlan(prev => prev ? { ...prev, ...floorPlanData, updatedAt: new Date().toISOString() } : null);
        }
      } else {
        response = await floorPlansAPI.create(floorPlanData);
        if (response.success && response.data) {
          toast.success('Floor plan saved successfully');
          const transformedPlan: FloorPlan = {
            ...response.data,
            id: String(response.data.id),
            shapes: (response.data.shapes || []).map((shape: any) => ({
              ...shape,
              id: shape.id || `shape-${Date.now()}-${Math.random()}`,
              type: (shape.type || 'rectangle') as ShapeType
            }))
          };
          setCurrentFloorPlan(transformedPlan);
          setLastSaved(new Date().toLocaleTimeString());
        }
      }

      if (!isAutoSave) {
        setIsSaveDialogOpen(false);
        setSaveName('');
      }

      // Reload the list
      await loadFloorPlans();
    } catch (error) {
      console.error('Error saving floor plan:', error);
      toast.error('Failed to save floor plan');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFloorPlanFromBackend = async (planId: string) => {
    try {
      setIsLoading(true);
      const response = await floorPlansAPI.getById(planId);
      const plan = response.data;
      
      if (plan) {
        const transformedPlan: FloorPlan = {
          ...plan,
          id: String(plan.id),
          shapes: (plan.shapes || []).map((shape: any) => ({
            ...shape,
            id: shape.id || `shape-${Date.now()}-${Math.random()}`,
            type: (shape.type || 'rectangle') as ShapeType,
            x: Number(shape.x) || 0,
            y: Number(shape.y) || 0,
            width: Number(shape.width) || 50,
            height: Number(shape.height) || 50,
            rotation: Number(shape.rotation) || 0,
            color: shape.color || "rgba(59, 130, 246, 0.3)",
            borderColor: shape.borderColor || "#1e40af",
            borderWidth: Number(shape.borderWidth) || 2,
            fontSize: Number(shape.fontSize) || 12,
            text: shape.text || '',
            zIndex: Number(shape.zIndex) || 1,
            metadata: shape.metadata || {},
            isLocked: Boolean(shape.isLocked)
          }))
        };
        
        setShapes(transformedPlan.shapes || []);
        setImage(transformedPlan.image || null);
        setScale(Number(transformedPlan.scale) || 0.1);
        setCurrentFloorPlan(transformedPlan);
        setLastSaved(transformedPlan.updatedAt || transformedPlan.createdAt || null);
        
        toast.success(`Loaded: ${transformedPlan.name}`);
        setIsLoadDialogOpen(false);
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
      const duplicateData: any = {
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
          name: saveName || currentFloorPlan?.name || `Exhibition_Plan_${Date.now()}`,
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

  // ================= USE EFFECTS =================

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
    // Fix any NaN values in shapes
    setShapes(prev => prev.map(shape => ({
      ...shape,
      x: safeNumber(shape.x),
      y: safeNumber(shape.y),
      width: safeNumber(shape.width),
      height: safeNumber(shape.height),
      rotation: safeNumber(shape.rotation),
      fontSize: safeNumber(shape.fontSize),
      borderWidth: safeNumber(shape.borderWidth),
      zIndex: safeNumber(shape.zIndex),
      text: shape.text || getDefaultText(shape.type)
    })));
  }, []);

  // ================= FILE OPERATIONS =================

 const handleUpload = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*,.png,.jpg,.jpeg,.gif,.webp";
  input.onchange = async e => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Upload to Cloudinary via backend
      const response = await floorPlansAPI.uploadImage(file);
      
      if (response.success && response.data) {
        // Set the Cloudinary URL
        setImage(response.data.url);
        
        // If we have a saved floor plan, update it
        if (currentFloorPlan?.id) {
          await floorPlansAPI.update(currentFloorPlan.id, { 
            image: response.data.url,
            thumbnail: response.data.thumbnail 
          });
        }
        
        toast.success('Image uploaded to Cloudinary successfully');
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
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
      setIsSaveDialogOpen(true);
      setSaveName(currentFloorPlan?.name || "New Floor Plan");
    }
  };

  const handleLoad = () => {
    setIsLoadDialogOpen(true);
  };

  const handleLoadFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as FloorPlan;
          
          // Process shapes to ensure they have proper IDs and types
          const processedShapes = (data.shapes || []).map((shape, index) => ({
            ...shape,
            id: shape.id || `shape-${Date.now()}-${index}`,
            type: (shape.type || 'rectangle') as ShapeType,
            x: safeNumber(shape.x),
            y: safeNumber(shape.y),
            width: safeNumber(shape.width),
            height: safeNumber(shape.height),
            text: shape.text || getDefaultText(shape.type || 'rectangle')
          }));
          
          setCurrentFloorPlan({
            ...data,
            shapes: processedShapes
          });
          setShapes(processedShapes);
          setImage(data.image || null);
          setScale(safeNumber(data.scale));
          toast.success('Floor plan loaded from file!');
        } catch (error) {
          console.error('Error loading file:', error);
          toast.error('Error loading file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleNewFloorPlan = () => {
    if (shapes.length > 0 && !currentFloorPlan?.id) {
      if (!confirm('You have unsaved changes. Create new plan?')) {
        return;
      }
    }
    
    setCurrentFloorPlan({
      name: "New Floor Plan",
      description: "",
      version: "1.0",
      shapes: [],
      scale: 0.1,
      tags: [],
      isPublic: false
    });
    setImage(null);
    setShapes([]);
    setSelectedId(null);
    setPanOffset({ x: 0, y: 0 });
    setZoom(1);
    setSaveName('');
    
    toast.success('New plan created');
  };

  // ================= UTILITY FUNCTIONS =================
  
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

  // ================= DRAWING & INTERACTION FUNCTIONS =================

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
        zIndex: shapes.length + 1,
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
      const finalShape: Shape = {
        ...tempShape,
        id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: tempShape.text || getDefaultText(tempShape.type)
      };
      setShapes(prev => [...prev, finalShape]);
      setSelectedId(finalShape.id);
      if (finalShape.type === "booth") {
        setShowBoothDetails(true);
      }
      toast.success(`${getShapeLabel(finalShape.type)} added`);
    }

    setIsDrawing(false);
    setIsPanning(false);
    setIsMeasuring(false);
    setTempShape(null);
  };

  // ================= TOUCH EVENTS =================

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
        zIndex: shapes.length + 1,
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
      const finalShape: Shape = {
        ...tempShape,
        id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: tempShape.text || getDefaultText(tempShape.type)
      };
      setShapes(prev => [...prev, finalShape]);
      setSelectedId(finalShape.id);
      if (finalShape.type === "booth") {
        setShowBoothDetails(true);
      }
      toast.success(`${getShapeLabel(finalShape.type)} added`);
    }

    setIsDrawing(false);
    setIsPanning(false);
    setIsMeasuring(false);
    setTempShape(null);
  };

  // ================= SHAPE ACTIONS =================

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
        const duplicate: Shape = {
          ...selected,
          id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          x: selected.x + 20,
          y: selected.y + 20,
          text: selected.text || getDefaultText(selected.type)
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
            ? { ...s, rotation: (safeNumber(s.rotation) + 45) % 360 }
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
          
          let newWidth = safeNumber(s.width);
          let newHeight = safeNumber(s.height);
          let newX = safeNumber(s.x);
          let newY = safeNumber(s.y);

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

          if (s.type === 'square' || s.type === 'circle' || s.type === 'pillar') {
            const size = Math.max(newWidth, newHeight);
            newWidth = size;
            newHeight = size;
          }

          return { 
            ...s, 
            x: newX, 
            y: newY, 
            width: newWidth, 
            height: newHeight,
            text: s.text || getDefaultText(s.type)
          };
        })
      );
    }
  };

  const bringToFront = () => {
    if (selectedId) {
      const maxZIndex = Math.max(...shapes.map(s => safeNumber(s.zIndex)));
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
      const minZIndex = Math.min(...shapes.map(s => safeNumber(s.zIndex)));
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
            ? { ...s, text: text || getDefaultText(s.type) }
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
            },
            text: s.text || getDefaultText(s.type)
          };
        })
      );
      
      // Update in floor plan if saved
      if (currentFloorPlan?.id) {
        const updatedShapes = shapes.map(s => 
          s.id === selectedId 
            ? { 
                ...s, 
                metadata: { 
                  ...s.metadata, 
                  [key]: value 
                } 
              } 
            : s
        );
        
        // Auto-save the change
        if (autoSave) {
          floorPlansAPI.quickSave(currentFloorPlan.id, updatedShapes);
        }
      }
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
      case 'rectangle': return `Rectangle ${shapeCount}`;
      case 'square': return `Square ${shapeCount}`;
      case 'circle': return `Circle ${shapeCount}`;
      default: return shapeType.charAt(0).toUpperCase() + shapeType.slice(1);
    }
  };

  const getShapeIcon = (shapeType: ShapeType) => {
    const shape = exhibitionShapes.find(s => s.type === shapeType);
    return shape?.icon || Square;
  };

  const getShapeLabel = (shapeType: ShapeType): string => {
    const shape = exhibitionShapes.find(s => s.type === shapeType);
    return shape?.label || shapeType;
  };

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const pixels = Math.sqrt(dx * dx + dy * dy);
    return {
      pixels: Math.round(pixels),
      meters: Math.round(pixels * scale * 100) / 100
    };
  };

  const safeNumber = (num: number | undefined): number => {
    return num !== undefined && !isNaN(num) && isFinite(num) ? Number(num) : 0;
  };

  // Filter floor plans based on search query
  const filteredFloorPlans = floorPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (plan.description && plan.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (plan.tags && plan.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // ================= KEYBOARD SHORTCUTS =================

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
        case "n":
          if (e.ctrlKey) {
            e.preventDefault();
            handleNewFloorPlan();
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

  const selectedShape = shapes.find(s => s.id === selectedId);

  // ================= MODAL COMPONENTS =================

  const SaveFloorPlanModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Save Floor Plan</h3>
            <p className="text-sm text-gray-500">Save your floor plan to the server</p>
          </div>
          <button
            onClick={() => setIsSaveDialogOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Floor Plan Name *</label>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter floor plan name"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Description (Optional)</label>
              <textarea
                value={currentFloorPlan?.description || ''}
                onChange={(e) => setCurrentFloorPlan(prev => prev ? { ...prev, description: e.target.value } : null)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter description"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Scale (px/m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Auto-save</label>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => setAutoSave(!autoSave)}
                    className={`w-10 h-5 rounded-full transition-colors ${autoSave ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white transform transition-transform ${autoSave ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="ml-2 text-sm text-gray-600">Every 30 seconds</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={() => setIsSaveDialogOpen(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => saveFloorPlanToBackend()}
                disabled={!saveName.trim() || isLoading}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <SaveAll size={16} />}
                {currentFloorPlan?.id ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LoadFloorPlanModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Load Floor Plan</h3>
            <p className="text-sm text-gray-500">Select a floor plan to load</p>
          </div>
          <button
            onClick={() => setIsLoadDialogOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search floor plans..."
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="text-blue-500 animate-spin" />
                <span className="ml-2 text-gray-600">Loading floor plans...</span>
              </div>
            ) : filteredFloorPlans.length === 0 ? (
              <div className="text-center py-12">
                <FolderTree size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-medium text-gray-700 mb-2">No floor plans found</h3>
                <p className="text-sm text-gray-500 mb-6">
                  {searchQuery ? 'Try a different search term' : 'No floor plans saved yet'}
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredFloorPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Building2 size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{plan.name}</h4>
                            <p className="text-sm text-gray-500">
                              {plan.shapes?.length || 0} shapes • {plan.scale} px/m
                            </p>
                            {plan.description && (
                              <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                            )}
                            {plan.tags && plan.tags.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {plan.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => loadFloorPlanFromBackend(plan.id!)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2"
                          disabled={isLoading}
                        >
                          <FolderOpen size={14} />
                          Load
                        </button>
                        <button
                          onClick={() => duplicateFloorPlan(plan.id!)}
                          className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm"
                          disabled={isLoading}
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => deleteFloorPlanFromBackend(plan.id!)}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm"
                          disabled={isLoading}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {plan.updatedAt && (
                      <div className="text-xs text-gray-400 mt-2">
                        Last updated: {new Date(plan.updatedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={handleLoadFromFile}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                Load from File
              </button>
              <button
                onClick={loadFloorPlans}
                className="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <RotateCw size={16} className={isLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper function for border radius
  const getBorderRadius = (shapeType: ShapeType): string => {
    switch (shapeType) {
      case 'circle':
      case 'pillar':
        return '50%';
      case 'triangle':
        return '0';
      case 'hexagon':
        return '30%';
      case 'octagon':
        return '20%';
      default:
        return '6px';
    }
  };

  // Add Toaster component to the return statement
  return (
    <div className={`flex flex-col h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <Toaster />
      
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

          {/* Center: Floor Plan Info */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
              <Database size={14} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{currentFloorPlan?.name || 'Untitled Floor Plan'}</span>
              {currentFloorPlan?.id && (
                <span className="text-xs text-gray-500">(Saved)</span>
              )}
            </div>
            {lastSaved && (
              <div className="text-xs text-gray-500">
                Last saved: {lastSaved}
              </div>
            )}
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
                onClick={handleNewFloorPlan}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center gap-2"
                title="New (Ctrl+N)"
              >
                <FileText size={14} />
                <span className="hidden sm:inline">New</span>
              </button>
              <button
                onClick={handleLoad}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm flex items-center gap-2"
              >
                <CloudDownload size={14} />
                <span className="hidden sm:inline">Load</span>
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2"
                title="Save (Ctrl+S)"
              >
                <CloudUpload size={14} />
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
                onClick={() => exportFloorPlan('png')}
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
                              onClick={() => {
                                setCurrentShape(type as ShapeType);
                                setCurrentTool("draw");
                              }}
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
                .sort((a, b) => safeNumber(a.zIndex) - safeNumber(b.zIndex))
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

                      {/* Text Content - FIXED TEXT DISPLAY */}
                      {(shape.text || shape.type === "text") && (
                        <div className="w-full h-full flex items-center justify-center pointer-events-none p-2">
                          <span
                            className="text-center break-words leading-tight"
                            style={{
                              fontSize: Math.max(8, safeNumber(shape.fontSize)),
                              color: shape.type === 'text' ? shape.borderColor : '#1f2937',
                              fontWeight: shape.type === 'booth' ? '600' : '400',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word'
                            }}
                          >
                            {shape.text || getDefaultText(shape.type)}
                          </span>
                        </div>
                      )}

                      {/* Status Indicator */}
                      {shape.type === "booth" && shape.metadata?.status && (
                        <div 
                          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: statusColors[shape.metadata.status as keyof typeof statusColors] }}
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
                    <span className="text-xs font-medium text-blue-600 opacity-70">
                      {tempShape.text || getDefaultText(tempShape.type)}
                    </span>
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
                            onChange={e => updateBoothMetadata('boothNumber', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Status</label>
                          <select
                            value={selectedShape.metadata?.status || "available"}
                            onChange={e => updateBoothMetadata('status', e.target.value)}
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
                          onChange={e => updateBoothMetadata('companyName', e.target.value)}
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
                            onChange={e => updateBoothMetadata('contactPerson', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contact person"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Phone</label>
                          <input
                            type="tel"
                            value={selectedShape.metadata?.phone || ""}
                            onChange={e => updateBoothMetadata('phone', e.target.value)}
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

                      <div className="pt-4">
                        <button
                          onClick={deleteSelected}
                          className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete Booth
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="font-semibold text-gray-800">Shape Properties</h3>
                    
                    {/* Basic Properties */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block">Type</label>
                        <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const Icon = getShapeIcon(selectedShape.type);
                              return <Icon size={14} />;
                            })()}
                            <span className="capitalize">{selectedShape.type}</span>
                          </div>
                        </div>
                      </div>

                      {/* Position */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Position</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">X (m)</label>
                            <input
                              type="number"
                              value={Math.round(safeNumber(selectedShape.x) * scale * 100) / 100}
                              onChange={e => {
                                const meters = parseFloat(e.target.value);
                                const pixels = meters / scale;
                                setShapes(prev =>
                                  prev.map(s =>
                                    s.id === selectedId
                                      ? { ...s, x: pixels }
                                      : s
                                  )
                                );
                              }}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Y (m)</label>
                            <input
                              type="number"
                              value={Math.round(safeNumber(selectedShape.y) * scale * 100) / 100}
                              onChange={e => {
                                const meters = parseFloat(e.target.value);
                                const pixels = meters / scale;
                                setShapes(prev =>
                                  prev.map(s =>
                                    s.id === selectedId
                                      ? { ...s, y: pixels }
                                      : s
                                  )
                                );
                              }}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              step="0.1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Size */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Size</h4>
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

                      {/* Appearance */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Appearance</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Fill Color</label>
                            <input
                              type="color"
                              value={selectedShape.color}
                              onChange={e => {
                                setShapes(prev =>
                                  prev.map(s =>
                                    s.id === selectedId
                                      ? { ...s, color: e.target.value }
                                      : s
                                  )
                                );
                              }}
                              className="w-full h-10 cursor-pointer rounded-lg border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Border Color</label>
                            <input
                              type="color"
                              value={selectedShape.borderColor}
                              onChange={e => {
                                setShapes(prev =>
                                  prev.map(s =>
                                    s.id === selectedId
                                      ? { ...s, borderColor: e.target.value }
                                      : s
                                  )
                                );
                              }}
                              className="w-full h-10 cursor-pointer rounded-lg border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">
                              Border Width: {selectedShape.borderWidth}px
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              value={selectedShape.borderWidth}
                              onChange={e => {
                                setShapes(prev =>
                                  prev.map(s =>
                                    s.id === selectedId
                                      ? { ...s, borderWidth: parseInt(e.target.value) }
                                      : s
                                  )
                                );
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Text Content - FIXED TEXT INPUT */}
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Text Content</label>
                        <textarea
                          value={selectedShape.text || getDefaultText(selectedShape.type)}
                          onChange={e => {
                            setShapes(prev =>
                              prev.map(s =>
                                s.id === selectedId
                                  ? { ...s, text: e.target.value || getDefaultText(s.type) }
                                  : s
                              )
                            );
                          }}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter text here..."
                          rows={3}
                        />
                      </div>

                      {/* Font Size */}
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                          Font Size: {selectedShape.fontSize}px
                        </label>
                        <input
                          type="range"
                          min="8"
                          max="36"
                          value={selectedShape.fontSize}
                          onChange={e => {
                            setShapes(prev =>
                              prev.map(s =>
                                s.id === selectedId
                                  ? { ...s, fontSize: parseInt(e.target.value) }
                                  : s
                              )
                            );
                          }}
                          className="w-full"
                        />
                      </div>

                      {/* Delete Button */}
                      <div className="pt-4">
                        <button
                          onClick={deleteSelected}
                          className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete Shape
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Building2 size={48} className="text-gray-300 mb-4" />
                  <h3 className="font-medium text-gray-700 mb-2">No Selection</h3>
                  <p className="text-sm text-gray-500 mb-6">Select a shape to view and edit its properties</p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>• Click on any shape to select it</p>
                    <p>• Use the draw tool to add new shapes</p>
                    <p>• Customize colors, sizes, and text</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {deviceMode === "mobile" && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-50">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className={`flex flex-col items-center p-2 ${isToolsOpen ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <Settings size={20} />
              <span className="text-xs mt-1">Tools</span>
            </button>
            <button
              onClick={() => setCurrentTool("select")}
              className={`flex flex-col items-center p-2 ${currentTool === "select" ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <MousePointer size={20} />
              <span className="text-xs mt-1">Select</span>
            </button>
            <button
              onClick={() => setCurrentTool("draw")}
              className={`flex flex-col items-center p-2 ${currentTool === "draw" ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <Square size={20} />
              <span className="text-xs mt-1">Draw</span>
            </button>
            <button
              onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
              className={`flex flex-col items-center p-2 ${isPropertiesOpen ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <Layers size={20} />
              <span className="text-xs mt-1">Properties</span>
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