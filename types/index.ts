// types/index.ts
export interface ExhibitorProfile {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  logo?: string;
  industry: string;
  description: string;
  status: 'active' | 'pending' | 'inactive';
}

export interface Stall {
  id: string;
  stallNumber: string;
  location: string;
  size: string;
  type: 'standard' | 'premium' | 'corner';
  price: number;
  bookedDate: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  amenities: string[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  amount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ExtraRequirement {
  id: string;
  type: 'electrical' | 'furniture' | 'display' | 'other';
  description: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  cost?: number;
}

export interface ManualSection {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'setup' | 'rules' | 'contact';
}