export type ShapeType = "rectangle" | "square" | "circle" | "ellipse" | 
                       "triangle" | "hexagon" | "octagon" | "star" | 
                       "heart" | "line" | "arrow" | "text" | "booth" |
                       "table" | "chair" | "door" | "stairs" | "toilet" |
                       "register" | "stage" | "screen" | "speaker" | "cafe" |
                       "storage" | "truck" | "pillar" | "info" | "emergency";

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
    notes?: string;
  };
}

export interface FloorPlan {
  id?: string;
  name: string;
  description?: string;
  version: string;
  shapes: Shape[];
  image?: string;
  scale: number;
  createdAt?: string;
  updatedAt?: string;
  thumbnail?: string;
  isPublic?: boolean;
  tags?: string[];
  lastModifiedBy?: string;
}