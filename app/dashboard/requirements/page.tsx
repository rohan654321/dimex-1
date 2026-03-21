'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  CubeIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ComputerDesktopIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  TruckIcon,
  MapPinIcon,
  GlobeAltIcon,
  CurrencyRupeeIcon,
  CreditCardIcon,
  PrinterIcon,
  EyeIcon,
  MinusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
  ExclamationCircleIcon,
  MagnifyingGlassPlusIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';

// ============= API CONFIGURATION =============
const API_BASE_URL = 'https://diemex-backend.onrender.com';

// ============= INTERFACES =============
interface GeneralInfo {
  title: 'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Prof';
  firstName: string;
  lastName: string;
  designation: string;
  mobile: string;
  email: string;
  companyName: string;
  businessNature: string;
  gstNumber: string;
}

interface BoothDetails {
  boothNo: string;
  exhibitorName: string;
  sqMtrBooked: string;
  organisation: string;
  contactPerson: string;
  designation: string;
  mobile: string;
  email: string;
  contractorCompany: string;
  contractorPerson: string;
  contractorMobile: string;
  contractorEmail: string;
  contractorGST: string;
  contractorPAN: string;
}

interface MachineDisplay {
  srNo: number;
  machineName: string;
  width: string;
  length: string;
  height: string;
  weight: string;
}

interface Personnel {
  srNo: number;
  name: string;
  designation: string;
  organisation: string;
}

interface CompanyDetails {
  companyName: string;
  address: string;
  telephone: string;
  mobile: string;
  email: string;
  website: string;
  contactPerson: string;
  designation: string;
  productsServices: string;
}

interface SecurityDeposit {
  boothSq: string;
  amountINR: number;
  amountUSD: number;
  ddNo: string;
  bankName: string;
  branch: string;
  dated: string;
  amountWords: string;
}

interface ElectricalLoad {
  temporaryLoad: string;
  exhibitionLoad: string;
  temporaryTotal: number;
  exhibitionTotal: number;
}

interface FurnitureItem {
  id?: string;
  code: string;
  description: string;
  size: string | null;
  cost3Days: number;
  quantity: number;
  cost: number;
  image: string;
  imageUrl?: string;
  cloudinaryPublicId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface HostessRequirement {
  category: 'A' | 'B';
  quantity: number;
  noOfDays: number;
  amount: number;
  ratePerDay?: number;
}

interface CompressedAir {
  id?: string;
  selected: string;
  cfmRange: string;
  costPerConnection: number;
  qty: number;
  powerKW: number;
  costPerKW: number;
  totalCost: number;
}

interface WaterConnection {
  connections: number;
  costPerConnection: number;
  totalCost: number;
}

interface SecurityGuard {
  quantity: number;
  noOfDays: number;
  totalCost: number;
}

interface PaymentDetails {
  paymentMode: 'RTGS' | 'NEFT' | 'IMPS' | 'UPI' | 'Cheque' | 'DD' | 'Cash';
  bankName: string;
  transactionId: string;
  transactionDate: string;
  amount: number;
}

interface RentalItem {
  id?: string;
  description: string;
  costFor3Days: number;
  quantity: number;
  totalCost: number;
  image?: string;
  imageUrl?: string;
  category?: string;
  inStock?: boolean;
}

interface RentalItems {
  [key: string]: RentalItem;
}

interface HousekeepingStaff {
  quantity: number;
  category: 'Housekeeping';
  chargesPerShift: number;
  noOfDays: number;
  totalCost: number;
}

interface CompressedAirOption {
  id: string;
  cfmRange: string;
  costPerConnection: number;
  powerKW: number;
  isActive: boolean;
  displayOrder: number;
}

interface ElectricalRate {
  id: string;
  type: 'temporary' | 'exhibition';
  ratePerKW: number;
  description: string;
  isActive: boolean;
}

interface SecurityGuardConfig {
  ratePerGuardPerDay: number;
}

interface WaterConnectionConfig {
  costPerConnection: number;
  ratePerConnection: number;
}

interface HousekeepingConfig {
  ratePerShift: number;
}

interface HostessCategory {
  id: string;
  category: 'A' | 'B';
  ratePerDay: number;
  description: string;
  isActive: boolean;
}

interface SecurityDepositTier {
  id: string;
  category: '0-36' | '37-100' | '101+';
  minSqMtr: number;
  maxSqMtr: number;
  amountINR: number;
  amountUSD: number;
  displayOrder: number;
  isActive: boolean;
}

// ============= API SERVICE CLASS =============
class ApiService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = typeof window !== 'undefined' ? 
      localStorage.getItem('exhibitor_token') || localStorage.getItem('token') : null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        credentials: 'include',
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(responseData.error || responseData.message || `HTTP error! status: ${response.status}`);
      }

      return responseData as T;
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  }

  async getExhibitorProfile(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>(
      '/api/exhibitorDashboard/profile'
    );
  }

  async getFurniture(): Promise<{ success: boolean; data: FurnitureItem[] }> {
    return this.request('/api/admin/furniture');
  }

  async getCompressedAirOptions(): Promise<{ success: boolean; data: CompressedAirOption[] }> {
    return this.request('/api/admin/compressed-air');
  }

  async getElectricalRates(): Promise<{ success: boolean; data: ElectricalRate[] }> {
    return this.request('/api/admin/electrical-rates');
  }

  async getRentalItems(): Promise<{ success: boolean; data: RentalItem[] }> {
    return this.request('/api/admin/rental-items');
  }

  async getHostessCategories(): Promise<{ success: boolean; data: HostessCategory[] }> {
    return this.request('/api/admin/hostess-rates');
  }

  async getSecurityGuardConfig(): Promise<{ success: boolean; data: SecurityGuardConfig }> {
    return this.request('/api/admin/security-guard/config');
  }

  async getWaterConnectionConfig(): Promise<{ success: boolean; data: WaterConnectionConfig }> {
    return this.request('/api/admin/water-connection/config');
  }

  async getHousekeepingConfig(): Promise<{ success: boolean; data: HousekeepingConfig }> {
    return this.request('/api/admin/housekeeping/config');
  }

  async getSecurityDepositConfig(): Promise<{ success: boolean; data: SecurityDepositTier[] }> {
    return this.request('/api/admin/security-deposit/active');
  }

  async calculateWaterCost(connections: number): Promise<{ success: boolean; data: { totalCost: number } }> {
    return this.request('/api/admin/water-connection/calculate', {
      method: 'POST',
      body: JSON.stringify({ connections }),
    });
  }

  async calculateSecurityGuardCost(quantity: number, days: number): Promise<{ success: boolean; data: { totalCost: number } }> {
    return this.request('/api/admin/security-guard/calculate', {
      method: 'POST',
      body: JSON.stringify({ quantity, days }),
    });
  }

  async calculateHousekeepingCost(quantity: number, days: number): Promise<{ success: boolean; data: { totalCost: number } }> {
    return this.request('/api/admin/housekeeping/calculate', {
      method: 'POST',
      body: JSON.stringify({ quantity, days, category: 'Housekeeping' }),
    });
  }

  async calculateHostessCost(category: string, quantity: number, days: number): Promise<{ success: boolean; data: { totalCost: number } }> {
    return this.request('/api/admin/hostess-rates/calculate', {
      method: 'POST',
      body: JSON.stringify({ category, quantity, days }),
    });
  }

  async submitApplication(formData: FormData): Promise<{ success: boolean; message: string; data?: any }> {
    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/exhibitorDashboard/requirements`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Submission failed');
      }
      
      return {
        success: true,
        message: data.message || 'Application submitted successfully',
        data: data.data || data
      };
    } catch (error: any) {
      console.error('API submission error:', error);
      throw error;
    }
  }
}

export default function RequirementsPage() {
  const apiService = new ApiService();

  // ============= FORM STATES =============
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  // ============= FIELD-LEVEL READ-ONLY STATES =============
  const [readOnlyFields, setReadOnlyFields] = useState({
    generalInfo_title: false,
    generalInfo_firstName: false,
    generalInfo_lastName: false,
    generalInfo_designation: false,
    generalInfo_mobile: false,
    generalInfo_email: false,
    generalInfo_companyName: false,
    generalInfo_businessNature: false,
    generalInfo_gstNumber: false,
    boothDetails_boothNo: false,
    boothDetails_exhibitorName: false,
    boothDetails_sqMtrBooked: false,
    boothDetails_organisation: false,
    boothDetails_contactPerson: false,
    boothDetails_designation: false,
    boothDetails_mobile: false,
    boothDetails_email: false,
    companyDetails_companyName: false,
    companyDetails_address: false,
    companyDetails_telephone: false,
    companyDetails_mobile: false,
    companyDetails_email: false,
    companyDetails_website: false,
    companyDetails_contactPerson: false,
    companyDetails_designation: false,
    companyDetails_productsServices: false,
    personnel_0_name: false,
    personnel_0_designation: false,
    personnel_0_organisation: false,
  });

  // Form States
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>({
    title: 'Mr',
    firstName: '',
    lastName: '',
    designation: '',
    mobile: '',
    email: '',
    companyName: '',
    businessNature: '',
    gstNumber: ''
  });

  const [boothDetails, setBoothDetails] = useState<BoothDetails>({
    boothNo: '',
    exhibitorName: '',
    sqMtrBooked: '',
    organisation: '',
    contactPerson: '',
    designation: '',
    mobile: '',
    email: '',
    contractorCompany: '',
    contractorPerson: '',
    contractorMobile: '',
    contractorEmail: '',
    contractorGST: '',
    contractorPAN: ''
  });

  const [securityDeposit, setSecurityDeposit] = useState<SecurityDeposit>({
    boothSq: '',
    amountINR: 0,
    amountUSD: 0,
    ddNo: '',
    bankName: '',
    branch: '',
    dated: '',
    amountWords: ''
  });

  const [machines, setMachines] = useState<MachineDisplay[]>([
    { srNo: 1, machineName: '', width: '', length: '', height: '', weight: '' },
    { srNo: 2, machineName: '', width: '', length: '', height: '', weight: '' },
    { srNo: 3, machineName: '', width: '', length: '', height: '', weight: '' }
  ]);

  const [personnel, setPersonnel] = useState<Personnel[]>([
    { srNo: 1, name: '', designation: '', organisation: '' },
    { srNo: 2, name: '', designation: '', organisation: '' },
    { srNo: 3, name: '', designation: '', organisation: '' }
  ]);

  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    companyName: '',
    address: '',
    telephone: '',
    mobile: '',
    email: '',
    website: '',
    contactPerson: '',
    designation: '',
    productsServices: ''
  });

  const [electricalLoad, setElectricalLoad] = useState<ElectricalLoad>({
    temporaryLoad: '',
    exhibitionLoad: '',
    temporaryTotal: 0,
    exhibitionTotal: 0
  });

  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([]);
  const [hostessRequirements, setHostessRequirements] = useState<HostessRequirement[]>([
    { category: 'A', quantity: 0, noOfDays: 0, amount: 0, ratePerDay: 5000 },
    { category: 'B', quantity: 0, noOfDays: 0, amount: 0, ratePerDay: 4000 }
  ]);

  const [compressedAirOptions, setCompressedAirOptions] = useState<CompressedAirOption[]>([]);
  const [compressedAir, setCompressedAir] = useState<CompressedAir>({
    selected: '',
    cfmRange: '',
    costPerConnection: 0,
    qty: 1,
    powerKW: 0,
    costPerKW: 3500,
    totalCost: 0
  });

  const [waterConnection, setWaterConnection] = useState<WaterConnection>({
    connections: 0,
    costPerConnection: 15000,
    totalCost: 0
  });

  const [securityGuard, setSecurityGuard] = useState<SecurityGuard>({
    quantity: 0,
    noOfDays: 0,
    totalCost: 0
  });

  const [rentalItems, setRentalItems] = useState<RentalItems>({});
  const [housekeepingStaff, setHousekeepingStaff] = useState<HousekeepingStaff>({
    quantity: 0,
    category: 'Housekeeping',
    chargesPerShift: 2000,
    noOfDays: 0,
    totalCost: 0
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    paymentMode: 'RTGS',
    bankName: '',
    transactionId: '',
    transactionDate: '',
    amount: 0
  });

  const [electricalRates, setElectricalRates] = useState<ElectricalRate[]>([]);
  const [securityDepositTiers, setSecurityDepositTiers] = useState<SecurityDepositTier[]>([]);

  const hasData = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'number') return value !== 0;
    return true;
  };

  // Fetch Data Effect
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setApiError(null);

        const [
          furnitureRes,
          compressedAirRes,
          electricalRatesRes,
          rentalItemsRes,
          hostessCategoriesRes,
          waterConnectionConfigRes,
          housekeepingConfigRes,
          securityDepositRes
        ] = await Promise.allSettled([
          apiService.getFurniture(),
          apiService.getCompressedAirOptions(),
          apiService.getElectricalRates(),
          apiService.getRentalItems(),
          apiService.getHostessCategories(),
          apiService.getWaterConnectionConfig(),
          apiService.getHousekeepingConfig(),
          apiService.getSecurityDepositConfig()
        ]);

        if (furnitureRes.status === 'fulfilled' && furnitureRes.value.success) {
          setFurnitureItems(furnitureRes.value.data.map((item: any) => ({
            ...item,
            image: item.imageUrl || '',
            size: item.size || 'N/A',
            quantity: 0,
            cost: 0
          })));
        }

        if (compressedAirRes.status === 'fulfilled' && compressedAirRes.value.success) {
          setCompressedAirOptions(compressedAirRes.value.data);
        }

        if (electricalRatesRes.status === 'fulfilled' && electricalRatesRes.value.success) {
          setElectricalRates(electricalRatesRes.value.data);
        }

        if (rentalItemsRes.status === 'fulfilled' && rentalItemsRes.value.success) {
          const items = rentalItemsRes.value.data;
          const rentalItemsMap: RentalItems = {};
          
          items.forEach(item => {
            if (item.id) {
              let imageUrl = '';
              if (item.imageUrl) {
                imageUrl = item.imageUrl.startsWith('http') 
                  ? item.imageUrl 
                  : `${API_BASE_URL}${item.imageUrl}`;
              }
              
              rentalItemsMap[item.id] = {
                id: item.id,
                description: item.description,
                costFor3Days: item.costFor3Days,
                category: item.category,
                image: imageUrl,
                quantity: 0,
                totalCost: 0
              };
            }
          });
          
          setRentalItems(rentalItemsMap);
        }

        if (hostessCategoriesRes.status === 'fulfilled' && hostessCategoriesRes.value.success) {
          const categories = hostessCategoriesRes.value.data;
          const updatedHostess = [...hostessRequirements];
          
          categories.forEach(cat => {
            const index = updatedHostess.findIndex(h => h.category === cat.category);
            if (index !== -1) {
              updatedHostess[index] = {
                ...updatedHostess[index],
                ratePerDay: cat.ratePerDay
              };
            }
          });
          
          setHostessRequirements(updatedHostess);
        }

        if (waterConnectionConfigRes.status === 'fulfilled' && waterConnectionConfigRes.value.success) {
          const ratePerConnection = waterConnectionConfigRes.value.data?.costPerConnection || 15000;
          setWaterConnection(prev => ({ ...prev, costPerConnection: ratePerConnection }));
        }

        if (housekeepingConfigRes.status === 'fulfilled' && housekeepingConfigRes.value.success) {
          setHousekeepingStaff(prev => ({
            ...prev,
            chargesPerShift: housekeepingConfigRes.value.data.ratePerShift
          }));
        }

        if (securityDepositRes.status === 'fulfilled' && securityDepositRes.value.success) {
          setSecurityDepositTiers(securityDepositRes.value.data);
        }

        await fetchExhibitorProfile();
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setApiError(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const fetchExhibitorProfile = async () => {
    try {
      const result = await apiService.getExhibitorProfile();
      if (!result?.success || !result?.data) return;

      const apiData = result.data;
      let contactPersonObj = { name: '', jobTitle: '', email: '', phone: '', alternatePhone: '' };

      if (apiData.contactPerson) {
        if (typeof apiData.contactPerson === 'string') {
          try {
            contactPersonObj = JSON.parse(apiData.contactPerson);
          } catch (e) {}
        } else if (typeof apiData.contactPerson === 'object') {
          contactPersonObj = apiData.contactPerson;
        }
      }

      contactPersonObj.name = contactPersonObj.name || apiData.name || '';
      contactPersonObj.email = contactPersonObj.email || apiData.email || '';
      contactPersonObj.phone = contactPersonObj.phone || apiData.phone || '';
      contactPersonObj.jobTitle = contactPersonObj.jobTitle || apiData.contact_job_title || '';

      let title: 'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Prof' = 'Mr';
      let firstName = '', lastName = '';

      if (contactPersonObj.name) {
        const fullName = contactPersonObj.name;
        if (/^Dr\./i.test(fullName)) title = 'Dr';
        else if (/^Prof\./i.test(fullName)) title = 'Prof';
        else if (/^Mrs\./i.test(fullName)) title = 'Mrs';
        else if (/^Ms\./i.test(fullName)) title = 'Ms';

        const nameWithoutTitle = fullName.replace(/^(Dr\.|Prof\.|Mrs\.|Ms\.|Mr\.)\s*/i, '').trim();
        const parts = nameWithoutTitle.split(' ');
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
      }

      setGeneralInfo(prev => ({
        ...prev,
        title: hasData(title) ? title : prev.title,
        firstName: hasData(firstName) ? firstName : prev.firstName,
        lastName: hasData(lastName) ? lastName : prev.lastName,
        designation: contactPersonObj.jobTitle || prev.designation,
        mobile: contactPersonObj.phone || prev.mobile,
        email: contactPersonObj.email || prev.email,
        companyName: apiData.company || apiData.companyName || prev.companyName,
        businessNature: typeof apiData.sector === 'string' ? apiData.sector.split(',')[0] : Array.isArray(apiData.sector) ? apiData.sector[0] : prev.businessNature,
        gstNumber: apiData.registrationNumber || apiData.gstNumber || prev.gstNumber
      }));

      let street = '';
      if (apiData.address && typeof apiData.address === 'string') {
        street = apiData.address.split(',')[0]?.trim() || '';
      }

      setBoothDetails(prev => ({
        ...prev,
        boothNo: apiData.boothNumber || apiData.booth_number || prev.boothNo,
        exhibitorName: contactPersonObj.name || `${title} ${firstName} ${lastName}`.trim(),
        organisation: apiData.company || apiData.companyName || prev.organisation,
        contactPerson: contactPersonObj.name || `${firstName} ${lastName}`.trim(),
        designation: contactPersonObj.jobTitle || prev.designation,
        mobile: contactPersonObj.phone || prev.mobile,
        email: contactPersonObj.email || prev.email
      }));

      setCompanyDetails(prev => ({
        ...prev,
        companyName: apiData.company || apiData.companyName || prev.companyName,
        address: street || prev.address,
        telephone: apiData.telephone || prev.telephone,
        mobile: contactPersonObj.phone || prev.mobile,
        email: contactPersonObj.email || prev.email,
        website: apiData.website || prev.website,
        contactPerson: contactPersonObj.name || `${firstName} ${lastName}`.trim(),
        designation: contactPersonObj.jobTitle || prev.designation,
        productsServices: typeof apiData.sector === 'string' ? apiData.sector : Array.isArray(apiData.sector) ? apiData.sector.join(', ') : prev.productsServices
      }));

      setPersonnel(prev => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          name: contactPersonObj.name || `${firstName} ${lastName}`.trim(),
          designation: contactPersonObj.jobTitle || updated[0].designation,
          organisation: apiData.company || updated[0].organisation
        };
        return updated;
      });
    } catch (error) {
      console.error('Error fetching exhibitor profile:', error);
    }
  };

  const calculateTotals = () => {
    const furnitureTotal = furnitureItems.reduce((sum, item) => sum + item.cost, 0);
    const hostessTotal = hostessRequirements.reduce((sum, h) => sum + h.amount, 0);
    const electricalTotal = electricalLoad.temporaryTotal + electricalLoad.exhibitionTotal;
    const compressedAirTotal = compressedAir.totalCost || 0;
    const waterTotal = waterConnection.totalCost || 0;
    const securityTotal = securityGuard.totalCost || 0;
    const housekeepingTotal = housekeepingStaff.totalCost || 0;
    const rentalTotal = Object.values(rentalItems).reduce((sum, item) => sum + item.totalCost, 0);
    const depositAmount = securityDeposit.amountINR || 0;

    const servicesTotal = furnitureTotal + hostessTotal + electricalTotal + compressedAirTotal + waterTotal + securityTotal + rentalTotal + housekeepingTotal;
    const gst = servicesTotal * 0.18;
    const subtotal = servicesTotal + gst;
    const grandTotal = subtotal + depositAmount;

    return { furniture: furnitureTotal, hostess: hostessTotal, electrical: electricalTotal, compressedAir: compressedAirTotal, water: waterTotal, security: securityTotal, rental: rentalTotal, housekeeping: housekeepingTotal, deposit: depositAmount, servicesTotal, gst, subtotal, total: grandTotal };
  };

  const handleGeneralInfoChange = (field: keyof GeneralInfo, value: any) => {
    const readOnlyKey = `generalInfo_${field}` as keyof typeof readOnlyFields;
    if (readOnlyFields[readOnlyKey]) return;
    setGeneralInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleBoothDetailsChange = (field: keyof BoothDetails, value: any) => {
    const contractorFields = ['contractorCompany', 'contractorPerson', 'contractorMobile', 'contractorEmail', 'contractorGST', 'contractorPAN'];
    if (contractorFields.includes(field)) {
      setBoothDetails(prev => ({ ...prev, [field]: value }));
      return;
    }
    const readOnlyKey = `boothDetails_${field}` as keyof typeof readOnlyFields;
    if (readOnlyFields[readOnlyKey]) return;
    setBoothDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleCompanyDetailsChange = (field: keyof CompanyDetails, value: any) => {
    const readOnlyKey = `companyDetails_${field}` as keyof typeof readOnlyFields;
    if (readOnlyFields[readOnlyKey]) return;
    setCompanyDetails(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonnelChange = (index: number, field: keyof Personnel, value: string) => {
    if (index === 0) {
      const readOnlyKey = `personnel_0_${field}` as keyof typeof readOnlyFields;
      if (readOnlyFields[readOnlyKey]) return;
    }
    const updated = [...personnel];
    updated[index] = { ...updated[index], [field]: value };
    setPersonnel(updated);
  };

  const handleFurnitureQuantity = (index: number, quantity: number) => {
    const updated = [...furnitureItems];
    if (updated[index]) {
      updated[index].quantity = quantity;
      updated[index].cost = quantity * (updated[index].cost3Days || 0);
      setFurnitureItems(updated);
    }
  };

  const handleHostessChange = (index: number, field: string, value: number) => {
    const updated = [...hostessRequirements];
    updated[index] = { ...updated[index], [field]: value };
    const rate = updated[index].ratePerDay || (updated[index].category === 'A' ? 5000 : 4000);
    updated[index].amount = updated[index].quantity * updated[index].noOfDays * rate;
    setHostessRequirements(updated);
  };

  const handleAddMachine = () => {
    setMachines(prev => [...prev, { srNo: prev.length + 1, machineName: '', width: '', length: '', height: '', weight: '' }]);
  };

  const handleRemoveMachine = (index: number) => {
    const updated = machines.filter((_, i) => i !== index);
    const reIndexed = updated.map((machine, i) => ({ ...machine, srNo: i + 1 }));
    setMachines(reIndexed);
  };

  const handleCompressedAirSelect = (option: CompressedAirOption) => {
    const totalCost = (option.costPerConnection * compressedAir.qty) + (option.powerKW * 3500 * compressedAir.qty);
    setCompressedAir({ ...compressedAir, id: option.id, selected: option.cfmRange, cfmRange: option.cfmRange, costPerConnection: option.costPerConnection, powerKW: option.powerKW, totalCost });
  };

  const handleCompressedAirQuantity = (qty: number) => {
    setCompressedAir(prev => {
      const selectedOption = compressedAirOptions.find(opt => opt.cfmRange === prev.selected);
      if (selectedOption) {
        const totalCost = (selectedOption.costPerConnection * qty) + (selectedOption.powerKW * 3500 * qty);
        return { ...prev, qty, totalCost };
      }
      return { ...prev, qty };
    });
  };

  const handleElectricalLoadChange = (type: 'temporary' | 'exhibition', value: string) => {
    const loadValue = parseFloat(value) || 0;
    const rate = electricalRates.find(r => r.type === type && r.isActive)?.ratePerKW || 3500;
    const total = loadValue * rate;
    if (type === 'temporary') {
      setElectricalLoad(prev => ({ ...prev, temporaryLoad: value, temporaryTotal: total }));
    } else {
      setElectricalLoad(prev => ({ ...prev, exhibitionLoad: value, exhibitionTotal: total }));
    }
  };

  const handleRentalQuantity = (itemKey: string, quantity: number) => {
    setRentalItems(prev => {
      const updated = { ...prev };
      if (updated[itemKey]) {
        updated[itemKey].quantity = quantity;
        updated[itemKey].totalCost = quantity * updated[itemKey].costFor3Days;
      }
      return updated;
    });
  };

  const handleAddPersonnel = () => {
    setPersonnel(prev => [...prev, { srNo: prev.length + 1, name: '', designation: '', organisation: '' }]);
  };

  const handleRemovePersonnel = (index: number) => {
    if (index === 0 && (readOnlyFields.personnel_0_name || readOnlyFields.personnel_0_designation || readOnlyFields.personnel_0_organisation)) return;
    const updated = personnel.filter((_, i) => i !== index);
    const reIndexed = updated.map((person, i) => ({ ...person, srNo: i + 1 }));
    setPersonnel(reIndexed);
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      const totals = calculateTotals();
      
      // Filter and prepare data
      const machinesData = machines.filter(m => m.machineName.trim() !== '');
      const personnelData = personnel.filter(p => p.name.trim() !== '');
      const furnitureData = furnitureItems.filter(f => f.quantity > 0);
      const hostessData = hostessRequirements.filter(h => h.quantity > 0);
      const rentalData = Object.values(rentalItems).filter(item => item.quantity > 0).map(item => ({
        id: item.id,
        type: item.category || 'AV/IT Rental',
        description: item.description,
        costFor3Days: item.costFor3Days,
        quantity: item.quantity,
        totalCost: item.totalCost
      }));
      
      // Append all data
      formData.append('generalInfo', JSON.stringify(generalInfo));
      formData.append('boothDetails', JSON.stringify(boothDetails));
      formData.append('securityDeposit', JSON.stringify(securityDeposit));
      formData.append('machines', JSON.stringify(machinesData));
      formData.append('personnel', JSON.stringify(personnelData));
      formData.append('companyDetails', JSON.stringify(companyDetails));
      formData.append('electricalLoad', JSON.stringify(electricalLoad));
      formData.append('furnitureItems', JSON.stringify(furnitureData));
      formData.append('hostessRequirements', JSON.stringify(hostessData));
      formData.append('compressedAir', JSON.stringify(compressedAir.selected ? compressedAir : null));
      formData.append('waterConnection', JSON.stringify(waterConnection.connections > 0 ? waterConnection : null));
      formData.append('securityGuard', JSON.stringify(securityGuard.quantity > 0 ? securityGuard : null));
      formData.append('rentalItems', JSON.stringify(rentalData));
      formData.append('housekeepingStaff', JSON.stringify(housekeepingStaff.quantity > 0 ? housekeepingStaff : null));
      formData.append('paymentDetails', JSON.stringify({
        paymentMode: paymentDetails.paymentMode,
        bankName: paymentDetails.bankName,
        transactionId: paymentDetails.transactionId,
        transactionDate: paymentDetails.transactionDate,
        amount: paymentDetails.amount,
        notes: `Total Amount: ₹${totals.total.toLocaleString()}\nServices Total: ₹${totals.servicesTotal.toLocaleString()}\nGST (18%): ₹${totals.gst.toLocaleString()}\nSecurity Deposit: ₹${totals.deposit.toLocaleString()}`
      }));

      const result = await apiService.submitApplication(formData);

      if (result.success) {
        const requirementsId = result.data?.requirementsId || result.data?.id;
        
        if (!requirementsId) {
          throw new Error('No requirements ID returned from submission');
        }
        
        try {
          const invoiceData = await generateInvoice(requirementsId, totals);
          if (invoiceData.success) {
            const userConfirmed = confirm(
              `✅ Application submitted successfully!\n\nInvoice #: ${invoiceData.data.invoiceNumber}\nTotal Amount: ₹${totals.total.toLocaleString()}\nStatus: ${invoiceData.data.status.toUpperCase()}\n\nWould you like to view your invoice now?`
            );
            window.location.href = userConfirmed ? '/dashboard/invoice' : '/dashboard/requirements/success';
          } else {
            throw new Error('Invoice generation failed');
          }
        } catch (invoiceError) {
          alert(`✅ Application submitted successfully!\n\n⚠️ Note: There was an issue generating your invoice. Our team will send it to you via email shortly.\n\nReference ID: ${requirementsId}`);
          window.location.href = '/dashboard/requirements/success';
        }
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error: any) {
      let errorMessage = 'Failed to submit application. Please try again.';
      if (error.message.includes('authentication')) errorMessage = 'Your session has expired. Please login again.';
      else if (error.message.includes('duplicate')) errorMessage = 'You have already submitted an application for this exhibition.';
      else if (error.message.includes('payment')) errorMessage = 'Payment processing failed. Please verify your payment details and try again.';
      else if (error.message.includes('type') && error.message.includes('description')) errorMessage = 'Missing required information: Type and description are required for rental items.';
      else if (error.message) errorMessage = error.message;
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateInvoice = async (requirementsId: string, totals: any) => {
    try {
      const items = [];
      
      furnitureItems.filter(f => f.quantity > 0).forEach(item => {
        items.push({ description: `Furniture: ${item.description} (${item.code})`, quantity: item.quantity, unitPrice: item.cost3Days, total: item.cost });
      });
      
      hostessRequirements.filter(h => h.quantity > 0).forEach(hostess => {
        const ratePerDay = hostess.ratePerDay || (hostess.category === 'A' ? 5000 : 4000);
        items.push({ description: `Hostess Services - Category ${hostess.category}`, quantity: hostess.quantity * hostess.noOfDays, unitPrice: ratePerDay, total: hostess.amount });
      });
      
      if (electricalLoad.temporaryTotal > 0) {
        items.push({ description: 'Electrical Load - Temporary (Setup Days)', quantity: parseFloat(electricalLoad.temporaryLoad) || 0, unitPrice: electricalRates.find(r => r.type === 'temporary' && r.isActive)?.ratePerKW || 3500, total: electricalLoad.temporaryTotal });
      }
      
      if (electricalLoad.exhibitionTotal > 0) {
        items.push({ description: 'Electrical Load - Exhibition (Show Days)', quantity: parseFloat(electricalLoad.exhibitionLoad) || 0, unitPrice: electricalRates.find(r => r.type === 'exhibition' && r.isActive)?.ratePerKW || 3500, total: electricalLoad.exhibitionTotal });
      }
      
      if (compressedAir.selected && compressedAir.qty > 0) {
        items.push({ description: `Compressed Air Connection - ${compressedAir.cfmRange}`, quantity: compressedAir.qty, unitPrice: compressedAir.costPerConnection + (compressedAir.powerKW * 3500), total: compressedAir.totalCost });
      }
      
      if (waterConnection.connections > 0) {
        items.push({ description: 'Water Connection', quantity: waterConnection.connections, unitPrice: waterConnection.costPerConnection, total: waterConnection.totalCost });
      }
      
      if (securityGuard.quantity > 0 && securityGuard.noOfDays > 0) {
        items.push({ description: 'Security Guard Services', quantity: securityGuard.quantity * securityGuard.noOfDays, unitPrice: 2500, total: securityGuard.totalCost });
      }
      
      Object.values(rentalItems).filter(item => item.quantity > 0).forEach(item => {
        items.push({ description: `AV/IT Rental: ${item.description}`, quantity: item.quantity, unitPrice: item.costFor3Days, total: item.totalCost });
      });
      
      if (housekeepingStaff.quantity > 0 && housekeepingStaff.noOfDays > 0) {
        items.push({ description: 'Housekeeping Staff', quantity: housekeepingStaff.quantity * housekeepingStaff.noOfDays, unitPrice: housekeepingStaff.chargesPerShift, total: housekeepingStaff.totalCost });
      }
      
      if (totals.gst > 0) {
        items.push({ description: 'GST (18%) on Services', quantity: 1, unitPrice: totals.gst, total: totals.gst });
      }
      
      if (totals.deposit > 0) {
        items.push({ description: `Security Deposit - Booth Area: ${securityDeposit.boothSq}`, quantity: 1, unitPrice: totals.deposit, total: totals.deposit });
      }
      
      const exhibitorInfo = {
        name: `${generalInfo.title} ${generalInfo.firstName} ${generalInfo.lastName}`,
        companyName: generalInfo.companyName,
        email: generalInfo.email,
        phone: generalInfo.mobile,
        address: companyDetails.address || 'Not provided',
        gstNumber: generalInfo.gstNumber || 'Not provided',
        boothNumber: boothDetails.boothNo || 'Not assigned'
      };
      
      const paymentInfo = {
        transactionId: paymentDetails.transactionId,
        paymentMode: paymentDetails.paymentMode,
        paymentDate: paymentDetails.transactionDate,
        paidAmount: paymentDetails.amount,
        bankName: paymentDetails.bankName
      };
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      const exhibitorId = localStorage.getItem('exhibitor_id') || localStorage.getItem('user_id');
      
      const invoicePayload = {
        requirementsId, exhibitorId, exhibitorInfo, paymentInfo, items,
        totals: { subtotal: totals.servicesTotal, gst: totals.gst, total: totals.total, deposit: totals.deposit },
        invoiceNumber: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`,
        issueDate: new Date().toISOString(),
        dueDate: dueDate.toISOString(),
        status: 'pending',
        notes: `Thank you for your exhibition registration. This invoice includes all services requested.\n\nBooth Number: ${boothDetails.boothNo || 'To be assigned'}\nContractor: ${boothDetails.contractorCompany || 'N/A'}\n\nPlease make the payment via ${paymentDetails.paymentMode} using Transaction ID: ${paymentDetails.transactionId}`
      };
      
      const response = await fetch('/api/invoices/generate-from-requirements', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('exhibitor_token') || localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(invoicePayload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate invoice');
      }
      
      const invoiceResult = await response.json();
      
      try {
        await fetch('/api/invoices/send-email', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('exhibitor_token') || localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceId: invoiceResult.data.id, email: generalInfo.email, exhibitorName: `${generalInfo.title} ${generalInfo.firstName} ${generalInfo.lastName}` })
        });
      } catch (emailError) {
        console.warn('Failed to send invoice email:', emailError);
      }
      
      return invoiceResult;
    } catch (error: any) {
      console.error('Error generating invoice:', error);
      throw new Error(`Invoice generation failed: ${error.message}`);
    }
  };

  // Effects for calculations
  useEffect(() => {
    if (waterConnection.connections > 0) {
      setWaterConnection(prev => ({ ...prev, totalCost: prev.connections * prev.costPerConnection }));
    } else {
      setWaterConnection(prev => ({ ...prev, totalCost: 0 }));
    }
  }, [waterConnection.connections, waterConnection.costPerConnection]);

  useEffect(() => {
    if (securityGuard.quantity > 0 && securityGuard.noOfDays > 0) {
      setSecurityGuard(prev => ({ ...prev, totalCost: prev.quantity * prev.noOfDays * 2500 }));
    } else {
      setSecurityGuard(prev => ({ ...prev, totalCost: 0 }));
    }
  }, [securityGuard.quantity, securityGuard.noOfDays]);

  useEffect(() => {
    if (housekeepingStaff.quantity > 0 && housekeepingStaff.noOfDays > 0 && housekeepingStaff.chargesPerShift) {
      setHousekeepingStaff(prev => ({ ...prev, totalCost: prev.quantity * prev.noOfDays * prev.chargesPerShift }));
    } else {
      setHousekeepingStaff(prev => ({ ...prev, totalCost: 0 }));
    }
  }, [housekeepingStaff.quantity, housekeepingStaff.noOfDays, housekeepingStaff.chargesPerShift]);

  // ============= RENDER FUNCTIONS =============
  
  const renderGeneralInfo = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">General Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <select
            value={generalInfo.title}
            onChange={(e) => handleGeneralInfoChange('title', e.target.value as any)}
            disabled={readOnlyFields.generalInfo_title}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
            <option value="Prof">Prof</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            value={generalInfo.firstName}
            onChange={(e) => handleGeneralInfoChange('firstName', e.target.value)}
            disabled={readOnlyFields.generalInfo_firstName}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            value={generalInfo.lastName}
            onChange={(e) => handleGeneralInfoChange('lastName', e.target.value)}
            disabled={readOnlyFields.generalInfo_lastName}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
          <input
            type="text"
            value={generalInfo.designation}
            onChange={(e) => handleGeneralInfoChange('designation', e.target.value)}
            disabled={readOnlyFields.generalInfo_designation}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
          <input
            type="tel"
            value={generalInfo.mobile}
            onChange={(e) => handleGeneralInfoChange('mobile', e.target.value)}
            disabled={readOnlyFields.generalInfo_mobile}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={generalInfo.email}
            onChange={(e) => handleGeneralInfoChange('email', e.target.value)}
            disabled={readOnlyFields.generalInfo_email}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            value={generalInfo.companyName}
            onChange={(e) => handleGeneralInfoChange('companyName', e.target.value)}
            disabled={readOnlyFields.generalInfo_companyName}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Nature</label>
          <input
            type="text"
            value={generalInfo.businessNature}
            onChange={(e) => handleGeneralInfoChange('businessNature', e.target.value)}
            disabled={readOnlyFields.generalInfo_businessNature}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
          <input
            type="text"
            value={generalInfo.gstNumber}
            onChange={(e) => handleGeneralInfoChange('gstNumber', e.target.value)}
            disabled={readOnlyFields.generalInfo_gstNumber}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>
    </div>
  );

  const renderBoothDetails = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Booth Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Booth No</label>
          <input
            type="text"
            value={boothDetails.boothNo}
            onChange={(e) => handleBoothDetailsChange('boothNo', e.target.value)}
            disabled={readOnlyFields.boothDetails_boothNo}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exhibitor Name</label>
          <input
            type="text"
            value={boothDetails.exhibitorName}
            onChange={(e) => handleBoothDetailsChange('exhibitorName', e.target.value)}
            disabled={readOnlyFields.boothDetails_exhibitorName}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sq Mtr Booked</label>
          <input
            type="text"
            value={boothDetails.sqMtrBooked}
            onChange={(e) => handleBoothDetailsChange('sqMtrBooked', e.target.value)}
            disabled={readOnlyFields.boothDetails_sqMtrBooked}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
          <input
            type="text"
            value={boothDetails.organisation}
            onChange={(e) => handleBoothDetailsChange('organisation', e.target.value)}
            disabled={readOnlyFields.boothDetails_organisation}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
          <input
            type="text"
            value={boothDetails.contactPerson}
            onChange={(e) => handleBoothDetailsChange('contactPerson', e.target.value)}
            disabled={readOnlyFields.boothDetails_contactPerson}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
          <input
            type="text"
            value={boothDetails.designation}
            onChange={(e) => handleBoothDetailsChange('designation', e.target.value)}
            disabled={readOnlyFields.boothDetails_designation}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
          <input
            type="tel"
            value={boothDetails.mobile}
            onChange={(e) => handleBoothDetailsChange('mobile', e.target.value)}
            disabled={readOnlyFields.boothDetails_mobile}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={boothDetails.email}
            onChange={(e) => handleBoothDetailsChange('email', e.target.value)}
            disabled={readOnlyFields.boothDetails_email}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Contractor Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contractor Company</label>
          <input
            type="text"
            value={boothDetails.contractorCompany}
            onChange={(e) => handleBoothDetailsChange('contractorCompany', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contractor Person</label>
          <input
            type="text"
            value={boothDetails.contractorPerson}
            onChange={(e) => handleBoothDetailsChange('contractorPerson', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contractor Mobile</label>
          <input
            type="tel"
            value={boothDetails.contractorMobile}
            onChange={(e) => handleBoothDetailsChange('contractorMobile', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contractor Email</label>
          <input
            type="email"
            value={boothDetails.contractorEmail}
            onChange={(e) => handleBoothDetailsChange('contractorEmail', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contractor GST</label>
          <input
            type="text"
            value={boothDetails.contractorGST}
            onChange={(e) => handleBoothDetailsChange('contractorGST', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contractor PAN</label>
          <input
            type="text"
            value={boothDetails.contractorPAN}
            onChange={(e) => handleBoothDetailsChange('contractorPAN', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderSecurityDeposit = () => {
    // Auto-calculate deposit based on booth area
    useEffect(() => {
      const sqMtr = parseFloat(boothDetails.sqMtrBooked) || 0;
      let amount = 0;
      
      const tier = securityDepositTiers.find(t => 
        t.isActive && sqMtr >= t.minSqMtr && sqMtr <= t.maxSqMtr
      );
      
      if (tier) {
        amount = tier.amountINR;
      }
      
      setSecurityDeposit(prev => ({
        ...prev,
        boothSq: boothDetails.sqMtrBooked || '',
        amountINR: amount
      }));
    }, [boothDetails.sqMtrBooked, securityDepositTiers]);

    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Security Deposit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booth Area (sq mtr)</label>
            <input
              type="text"
              value={securityDeposit.boothSq}
              disabled
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount (INR)</label>
            <input
              type="text"
              value={`₹${securityDeposit.amountINR.toLocaleString()}`}
              disabled
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 font-semibold text-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DD/Cheque No</label>
            <input
              type="text"
              value={securityDeposit.ddNo}
              onChange={(e) => setSecurityDeposit({ ...securityDeposit, ddNo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input
              type="text"
              value={securityDeposit.bankName}
              onChange={(e) => setSecurityDeposit({ ...securityDeposit, bankName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <input
              type="text"
              value={securityDeposit.branch}
              onChange={(e) => setSecurityDeposit({ ...securityDeposit, branch: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dated</label>
            <input
              type="date"
              value={securityDeposit.dated}
              onChange={(e) => setSecurityDeposit({ ...securityDeposit, dated: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount in Words</label>
            <input
              type="text"
              value={securityDeposit.amountWords}
              onChange={(e) => setSecurityDeposit({ ...securityDeposit, amountWords: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderMachines = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Machine Display Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Sr No</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Machine Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Width (ft)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Length (ft)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Height (ft)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Weight (kg)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {machines.map((machine, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 text-sm">{machine.srNo}</td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={machine.machineName}
                    onChange={(e) => {
                      const updated = [...machines];
                      updated[idx].machineName = e.target.value;
                      setMachines(updated);
                    }}
                    className="w-full border border-gray-300 rounded p-1 text-sm"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={machine.width}
                    onChange={(e) => {
                      const updated = [...machines];
                      updated[idx].width = e.target.value;
                      setMachines(updated);
                    }}
                    className="w-20 border border-gray-300 rounded p-1 text-sm"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={machine.length}
                    onChange={(e) => {
                      const updated = [...machines];
                      updated[idx].length = e.target.value;
                      setMachines(updated);
                    }}
                    className="w-20 border border-gray-300 rounded p-1 text-sm"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={machine.height}
                    onChange={(e) => {
                      const updated = [...machines];
                      updated[idx].height = e.target.value;
                      setMachines(updated);
                    }}
                    className="w-20 border border-gray-300 rounded p-1 text-sm"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={machine.weight}
                    onChange={(e) => {
                      const updated = [...machines];
                      updated[idx].weight = e.target.value;
                      setMachines(updated);
                    }}
                    className="w-20 border border-gray-300 rounded p-1 text-sm"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleRemoveMachine(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleAddMachine}
        className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <PlusIcon className="h-5 w-5 mr-1" />
        Add Machine
      </button>
    </div>
  );

  const renderPersonnel = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Personnel Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Sr No</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Designation</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Organisation</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {personnel.map((person, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 text-sm">{person.srNo}</td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => handlePersonnelChange(idx, 'name', e.target.value)}
                    disabled={idx === 0 && readOnlyFields.personnel_0_name}
                    className="w-full border border-gray-300 rounded p-1 text-sm disabled:bg-gray-100"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={person.designation}
                    onChange={(e) => handlePersonnelChange(idx, 'designation', e.target.value)}
                    disabled={idx === 0 && readOnlyFields.personnel_0_designation}
                    className="w-full border border-gray-300 rounded p-1 text-sm disabled:bg-gray-100"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={person.organisation}
                    onChange={(e) => handlePersonnelChange(idx, 'organisation', e.target.value)}
                    disabled={idx === 0 && readOnlyFields.personnel_0_organisation}
                    className="w-full border border-gray-300 rounded p-1 text-sm disabled:bg-gray-100"
                  />
                </td>
                <td className="px-4 py-2">
                  {idx > 0 && (
                    <button
                      onClick={() => handleRemovePersonnel(idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MinusIcon className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleAddPersonnel}
        className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <PlusIcon className="h-5 w-5 mr-1" />
        Add Personnel
      </button>
    </div>
  );

  const renderCompanyDetails = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Company Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            value={companyDetails.companyName}
            onChange={(e) => handleCompanyDetailsChange('companyName', e.target.value)}
            disabled={readOnlyFields.companyDetails_companyName}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            value={companyDetails.address}
            onChange={(e) => handleCompanyDetailsChange('address', e.target.value)}
            disabled={readOnlyFields.companyDetails_address}
            rows={2}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
          <input
            type="tel"
            value={companyDetails.telephone}
            onChange={(e) => handleCompanyDetailsChange('telephone', e.target.value)}
            disabled={readOnlyFields.companyDetails_telephone}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
          <input
            type="tel"
            value={companyDetails.mobile}
            onChange={(e) => handleCompanyDetailsChange('mobile', e.target.value)}
            disabled={readOnlyFields.companyDetails_mobile}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={companyDetails.email}
            onChange={(e) => handleCompanyDetailsChange('email', e.target.value)}
            disabled={readOnlyFields.companyDetails_email}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input
            type="url"
            value={companyDetails.website}
            onChange={(e) => handleCompanyDetailsChange('website', e.target.value)}
            disabled={readOnlyFields.companyDetails_website}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
          <input
            type="text"
            value={companyDetails.contactPerson}
            onChange={(e) => handleCompanyDetailsChange('contactPerson', e.target.value)}
            disabled={readOnlyFields.companyDetails_contactPerson}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
          <input
            type="text"
            value={companyDetails.designation}
            onChange={(e) => handleCompanyDetailsChange('designation', e.target.value)}
            disabled={readOnlyFields.companyDetails_designation}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Products/Services</label>
          <textarea
            value={companyDetails.productsServices}
            onChange={(e) => handleCompanyDetailsChange('productsServices', e.target.value)}
            disabled={readOnlyFields.companyDetails_productsServices}
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>
    </div>
  );

  const renderElectricalLoad = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Electrical Load Requirements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Load (Setup Days) - KW</label>
          <input
            type="number"
            step="0.1"
            value={electricalLoad.temporaryLoad}
            onChange={(e) => handleElectricalLoadChange('temporary', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {electricalLoad.temporaryTotal > 0 && (
            <p className="text-sm text-green-600 mt-1">Cost: ₹{electricalLoad.temporaryTotal.toLocaleString()}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exhibition Load (Show Days) - KW</label>
          <input
            type="number"
            step="0.1"
            value={electricalLoad.exhibitionLoad}
            onChange={(e) => handleElectricalLoadChange('exhibition', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {electricalLoad.exhibitionTotal > 0 && (
            <p className="text-sm text-green-600 mt-1">Cost: ₹{electricalLoad.exhibitionTotal.toLocaleString()}</p>
          )}
        </div>
      </div>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Electrical charges are calculated at ₹3500 per KW. Total cost = Load (KW) × Rate (₹3500)
        </p>
      </div>
    </div>
  );

  const renderFurniture = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Furniture Requirements</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Size</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Cost (3 Days)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {furnitureItems.map((item, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 text-sm">{item.description}</td>
                <td className="px-4 py-2 text-sm">{item.size || 'N/A'}</td>
                <td className="px-4 py-2 text-sm">₹{item.cost3Days.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => handleFurnitureQuantity(idx, parseInt(e.target.value) || 0)}
                    className="w-20 border border-gray-300 rounded p-1 text-sm"
                  />
                </td>
                <td className="px-4 py-2 text-sm font-semibold">₹{item.cost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHostess = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Hostess Requirements</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Category</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Rate/Day</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">No. of Days</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {hostessRequirements.map((hostess, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 text-sm font-semibold">Category {hostess.category}</td>
                <td className="px-4 py-2 text-sm">₹{hostess.ratePerDay?.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    value={hostess.quantity}
                    onChange={(e) => handleHostessChange(idx, 'quantity', parseInt(e.target.value) || 0)}
                    className="w-20 border border-gray-300 rounded p-1 text-sm"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    value={hostess.noOfDays}
                    onChange={(e) => handleHostessChange(idx, 'noOfDays', parseInt(e.target.value) || 0)}
                    className="w-20 border border-gray-300 rounded p-1 text-sm"
                  />
                </td>
                <td className="px-4 py-2 text-sm font-semibold">₹{hostess.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCompressedAir = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Compressed Air Connection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Connection Type</label>
          <select
            value={compressedAir.selected}
            onChange={(e) => {
              const option = compressedAirOptions.find(opt => opt.cfmRange === e.target.value);
              if (option) handleCompressedAirSelect(option);
            }}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select CFM Range</option>
            {compressedAirOptions.map(opt => (
              <option key={opt.id} value={opt.cfmRange}>
                {opt.cfmRange} CFM - ₹{opt.costPerConnection.toLocaleString()} + {opt.powerKW}KW @ ₹3500/KW
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={compressedAir.qty}
            onChange={(e) => handleCompressedAirQuantity(parseInt(e.target.value) || 1)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      {compressedAir.totalCost > 0 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-lg font-semibold text-green-800">
            Total Cost: ₹{compressedAir.totalCost.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );

  const renderWaterConnection = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Water Connection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Connections</label>
          <input
            type="number"
            min="0"
            value={waterConnection.connections}
            onChange={(e) => setWaterConnection({ ...waterConnection, connections: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cost per Connection</label>
          <input
            type="text"
            value={`₹${waterConnection.costPerConnection.toLocaleString()}`}
            disabled
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
          />
        </div>
      </div>
      {waterConnection.totalCost > 0 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-lg font-semibold text-green-800">
            Total Cost: ₹{waterConnection.totalCost.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );

  const renderSecurityGuard = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Security Guard Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guards</label>
          <input
            type="number"
            min="0"
            value={securityGuard.quantity}
            onChange={(e) => setSecurityGuard({ ...securityGuard, quantity: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days</label>
          <input
            type="number"
            min="0"
            value={securityGuard.noOfDays}
            onChange={(e) => setSecurityGuard({ ...securityGuard, noOfDays: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      {securityGuard.totalCost > 0 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-lg font-semibold text-green-800">
            Total Cost: ₹{securityGuard.totalCost.toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-1">Rate: ₹2500 per guard per day</p>
        </div>
      )}
    </div>
  );

  const renderRentalItems = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">AV/IT Rental Items</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Cost (3 Days)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Object.entries(rentalItems).map(([key, item]) => (
              <tr key={key}>
                <td className="px-4 py-2 text-sm">{item.description}</td>
                <td className="px-4 py-2 text-sm">₹{item.costFor3Days.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => handleRentalQuantity(key, parseInt(e.target.value) || 0)}
                    className="w-20 border border-gray-300 rounded p-1 text-sm"
                  />
                </td>
                <td className="px-4 py-2 text-sm font-semibold">₹{item.totalCost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHousekeepingStaff = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Housekeeping Staff</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Staff</label>
          <input
            type="number"
            min="0"
            value={housekeepingStaff.quantity}
            onChange={(e) => setHousekeepingStaff({ ...housekeepingStaff, quantity: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days</label>
          <input
            type="number"
            min="0"
            value={housekeepingStaff.noOfDays}
            onChange={(e) => setHousekeepingStaff({ ...housekeepingStaff, noOfDays: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      {housekeepingStaff.totalCost > 0 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-lg font-semibold text-green-800">
            Total Cost: ₹{housekeepingStaff.totalCost.toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-1">Rate: ₹{housekeepingStaff.chargesPerShift.toLocaleString()} per staff per shift</p>
        </div>
      )}
    </div>
  );

  const renderImageModal = () => {
    if (!selectedImage) return null;
    return (
      <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
        <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 bg-white rounded-full p-1 shadow-lg z-10">
            <XCircleIcon className="h-8 w-8" />
          </button>
          <div className="p-4 bg-white">
            <img src={selectedImage.src} alt={selectedImage.alt} className="max-w-full max-h-[70vh] object-contain mx-auto" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }} />
            <p className="text-center mt-2 text-sm font-medium text-gray-700">{selectedImage.alt}</p>
          </div>
        </div>
      </div>
    );
  };

  const steps = [
    { number: 1, name: 'Basic Info', icon: UserIcon, mobileName: 'Basic' },
    { number: 2, name: 'Booth', icon: BuildingOfficeIcon, mobileName: 'Booth' },
    { number: 3, name: 'Security', icon: BanknotesIcon, mobileName: 'Deposit' },
    { number: 4, name: 'Machines', icon: CubeIcon, mobileName: 'Mach' },
    { number: 5, name: 'Personnel', icon: UserIcon, mobileName: 'Staff' },
    { number: 6, name: 'Company', icon: BuildingOfficeIcon, mobileName: 'Co' },
    { number: 7, name: 'Electrical', icon: BoltIcon, mobileName: 'Elec' },
    { number: 8, name: 'Furniture', icon: ComputerDesktopIcon, mobileName: 'Furn' },
    { number: 9, name: 'Hostess', icon: SparklesIcon, mobileName: 'Host' },
    { number: 10, name: 'Air', icon: WrenchScrewdriverIcon, mobileName: 'Air' },
    { number: 11, name: 'Water', icon: TruckIcon, mobileName: 'Water' },
    { number: 12, name: 'Security', icon: ShieldCheckIcon, mobileName: 'Guard' },
    { number: 13, name: 'AV Rentals', icon: ComputerDesktopIcon, mobileName: 'Rentals' },
    { number: 14, name: 'Housekeeping', icon: SparklesIcon, mobileName: 'House' }
  ];

  const totalSteps = steps.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your profile and available services...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Data</h2>
          <p className="text-gray-600 mb-6">{apiError}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try Again</button>
        </div>
      </div>
    );
  }

  // Payment Modal (without image upload)
  const renderPaymentModal = () => {
    const totals = calculateTotals();

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-10 sm:top-20 mx-3 sm:mx-auto p-4 sm:p-6 border w-full sm:w-11/12 max-w-2xl shadow-lg rounded-lg bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Details</h2>
            <button onClick={() => setShowPayment(false)} className="text-gray-400 hover:text-gray-600"><XCircleIcon className="h-6 w-6" /></button>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-blue-900">Total Amount:</span>
                <span className="text-xl font-bold text-blue-900">₹{totals.total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">Includes 18% GST on services + Security Deposit</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Bank Transfer Details</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-600">Account Name:</div><div className="font-medium">Maxx Business Media Pvt. Ltd.</div>
                <div className="text-gray-600">Account No:</div><div className="font-medium">272605000632</div>
                <div className="text-gray-600">IFSC:</div><div className="font-medium">ICIC0002726</div>
                <div className="text-gray-600">Bank:</div><div className="font-medium">ICICI Bank</div>
                <div className="text-gray-600">Branch:</div><div className="font-medium">New Delhi</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Payment Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Payment Mode</label>
                  <select value={paymentDetails.paymentMode} onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentMode: e.target.value as any })} className="w-full border border-gray-200 rounded-lg p-2 text-sm">
                    <option value="RTGS">RTGS</option><option value="NEFT">NEFT</option><option value="IMPS">IMPS</option>
                    <option value="UPI">UPI</option><option value="Cheque">Cheque</option><option value="DD">DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Transaction ID / UTR</label>
                  <input type="text" value={paymentDetails.transactionId} onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2 text-sm" placeholder="UTR / Transaction ID" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Amount Paid</label>
                  <input type="number" value={paymentDetails.amount || ''} onChange={(e) => setPaymentDetails({ ...paymentDetails, amount: parseFloat(e.target.value) || 0 })} className="w-full border border-gray-200 rounded-lg p-2 text-sm" placeholder="Enter amount" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Transaction Date</label>
                  <input type="date" value={paymentDetails.transactionDate} onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionDate: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2 text-sm" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button onClick={() => setShowPayment(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm">Back</button>
              <button onClick={handleSubmitApplication} disabled={isSubmitting} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-semibold disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Preview Modal
  const renderPreviewModal = () => {
    const totals = calculateTotals();

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-10 sm:top-20 mx-3 sm:mx-auto p-4 sm:p-6 border w-full sm:w-11/12 max-w-4xl shadow-lg rounded-lg bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Preview & Cost Summary</h2>
            <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600"><XCircleIcon className="h-6 w-6" /></button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Exhibitor</h3>
                <div className="space-y-1 text-xs">
                  <p><span className="font-medium">Name:</span> {`${generalInfo.title} ${generalInfo.firstName} ${generalInfo.lastName}`.trim() || "—"}</p>
                  <p><span className="font-medium">Company:</span> {generalInfo.companyName || "—"}</p>
                  <p><span className="font-medium">Email:</span> {generalInfo.email || "—"}</p>
                  <p><span className="font-medium">Mobile:</span> {generalInfo.mobile || "—"}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Booth Details</h3>
                <div className="space-y-1 text-xs">
                  <p><span className="font-medium">Booth No:</span> {boothDetails.boothNo || "—"}</p>
                  <p><span className="font-medium">Size:</span> {boothDetails.sqMtrBooked ? `${boothDetails.sqMtrBooked} sq.m` : "—"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden mb-6">
              <div className="bg-gray-800 px-4 py-2"><h3 className="text-sm font-semibold text-white">Cost Summary</h3></div>
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-4 py-2 text-xs">Furniture</td><td className="px-4 py-2 text-xs text-right">₹{totals.furniture.toLocaleString()}</td></tr>
                  <tr><td className="px-4 py-2 text-xs">Hostess</td><td className="px-4 py-2 text-xs text-right">₹{totals.hostess.toLocaleString()}</td></tr>
                  <tr><td className="px-4 py-2 text-xs">Electrical</td><td className="px-4 py-2 text-xs text-right">₹{totals.electrical.toLocaleString()}</td></tr>
                  <tr><td className="px-4 py-2 text-xs">Compressed Air</td><td className="px-4 py-2 text-xs text-right">₹{totals.compressedAir.toLocaleString()}</td></tr>
                  <tr><td className="px-4 py-2 text-xs">Water</td><td className="px-4 py-2 text-xs text-right">₹{totals.water.toLocaleString()}</td></tr>
                  <tr><td className="px-4 py-2 text-xs">Security Guard</td><td className="px-4 py-2 text-xs text-right">₹{totals.security.toLocaleString()}</td></tr>
                  <tr className="bg-yellow-50"><td className="px-4 py-2 text-xs font-semibold">AV & IT Rentals</td><td className="px-4 py-2 text-xs font-semibold text-right">₹{totals.rental.toLocaleString()}</td></tr>
                  <tr className="bg-green-50"><td className="px-4 py-2 text-xs font-semibold">Housekeeping Staff</td><td className="px-4 py-2 text-xs font-semibold text-right">₹{totals.housekeeping.toLocaleString()}</td></tr>
                  <tr><td className="px-4 py-2 text-xs">Services Total</td><td className="px-4 py-2 text-xs text-right">₹{totals.servicesTotal.toLocaleString()}</td></tr>
                  <tr><td className="px-4 py-2 text-xs">GST (18%)</td><td className="px-4 py-2 text-xs text-right">₹{totals.gst.toLocaleString()}</td></tr>
                  <tr className="bg-gray-50"><td className="px-4 py-2 text-xs font-semibold">Subtotal (Including GST)</td><td className="px-4 py-2 text-xs text-right">₹{totals.subtotal.toLocaleString()}</td></tr>
                  <tr><td className="px-4 py-2 text-xs font-semibold">Security Deposit</td><td className="px-4 py-2 text-xs text-right">₹{totals.deposit.toLocaleString()}</td></tr>
                  <tr className="bg-blue-50"><td className="px-4 py-2 text-sm font-bold">Grand Total</td><td className="px-4 py-2 text-sm font-bold text-blue-700 text-right">₹{totals.total.toLocaleString()}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row justify-end gap-3">
            <button onClick={() => setShowPreview(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm">Continue Editing</button>
            <button onClick={() => { setShowPreview(false); setShowPayment(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Proceed to Payment</button>
          </div>
        </div>
      </div>
    );
  };

  const renderNavigation = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
      <button onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1} className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center text-sm">
        <ChevronLeftIcon className="h-4 w-4 mr-1" /> Previous
      </button>
      <div className="flex gap-3 w-full sm:w-auto">
        <button onClick={() => setShowPreview(true)} className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center text-sm">
          <EyeIcon className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Preview & Totals</span><span className="sm:hidden">Preview</span>
        </button>
        {currentStep < totalSteps && (
          <button onClick={() => setCurrentStep(currentStep + 1)} className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm">
            <span className="sm:hidden">Next</span><span className="hidden sm:inline">Next</span><ChevronRightIcon className="h-4 w-4 ml-1" />
          </button>
        )}
        {currentStep === totalSteps && (
          <button onClick={() => setShowPreview(true)} className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center text-sm font-semibold">
            Review & Submit
          </button>
        )}
      </div>
    </div>
  );

  const renderProgressTracker = () => (
    <div className="mb-6 bg-white rounded-lg shadow p-4">
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-medium ${currentStep > step.number ? 'bg-green-600 border-green-600 text-white' : currentStep === step.number ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 bg-white text-gray-400'}`}>
                {currentStep > step.number ? '✓' : step.number}
              </div>
              {idx < steps.length - 1 && <div className={`w-6 h-0.5 mx-1 ${currentStep > step.number + 1 ? 'bg-green-600' : 'bg-gray-300'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map(step => <span key={step.number} className="text-xs text-gray-600">{step.name}</span>)}
        </div>
      </div>
      <div className="sm:hidden">
        <div className="flex items-center justify-between">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="flex items-center text-blue-600">
            <MenuIcon className="h-5 w-5 mr-2" /><span className="font-medium text-sm">Step {currentStep}: {steps[currentStep - 1]?.mobileName}</span>
          </button>
          <div className="text-sm text-gray-600">{currentStep} / {totalSteps}</div>
        </div>
        {isMobileMenuOpen && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {steps.map((step) => (
              <button key={step.number} onClick={() => { setCurrentStep(step.number); setIsMobileMenuOpen(false); }} className={`p-2 rounded-lg text-xs font-medium ${currentStep === step.number ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                {step.mobileName}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Exhibition Registration</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">Complete all sections to register your participation. All sections are optional.</p>
        </div>

        {renderProgressTracker()}
        {renderNavigation()}
        {renderImageModal()}

        <div className="mt-4">
          {currentStep === 1 && renderGeneralInfo()}
          {currentStep === 2 && renderBoothDetails()}
          {currentStep === 3 && renderSecurityDeposit()}
          {currentStep === 4 && renderMachines()}
          {currentStep === 5 && renderPersonnel()}
          {currentStep === 6 && renderCompanyDetails()}
          {currentStep === 7 && renderElectricalLoad()}
          {currentStep === 8 && renderFurniture()}
          {currentStep === 9 && renderHostess()}
          {currentStep === 10 && renderCompressedAir()}
          {currentStep === 11 && renderWaterConnection()}
          {currentStep === 12 && renderSecurityGuard()}
          {currentStep === 13 && renderRentalItems()}
          {currentStep === 14 && renderHousekeepingStaff()}
        </div>

        {renderNavigation()}
        {showPreview && renderPreviewModal()}
        {showPayment && renderPaymentModal()}
      </div>
    </div>
  );
}