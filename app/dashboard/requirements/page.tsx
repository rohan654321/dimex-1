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
import { useRouter } from 'next/navigation';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import CashfreePayment from '@/components/CashfreePayment';

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
  uploadedReceipt: File | null;
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

  async calculateHousekeepingCost(quantity: number, days: number): Promise<{ success: boolean; data: { totalCost: number; ratePerShift: number } }> {
    return this.request('/api/admin/housekeeping/calculate', {
      method: 'POST',
      body: JSON.stringify({ quantity, days }),
    });
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

  async getInvoiceById(invoiceId: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/api/invoices/${invoiceId}`);
  }

  async downloadInvoicePdf(invoiceId: string): Promise<Blob> {
    const token = this.token;
    
    const response = await fetch(`${this.baseUrl}/api/invoices/${invoiceId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to download invoice: ${response.status}`);
    }
    
    return response.blob();
  }

  async getMyInvoices(): Promise<{ success: boolean; data: any[] }> {
    return this.request('/api/invoices/my-invoices');
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
        console.error('API Error Response:', data);
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
  const [showCashPayment, setShowCashPayment] = useState(false);
  const [showCashfree, setShowCashfree] = useState(false);
  const [cashfreeAmount, setCashfreeAmount] = useState(0);
  const [cashfreeInvoiceId, setCashfreeInvoiceId] = useState<string | null>(null);
  const [cashfreeRequirementsId, setCashfreeRequirementsId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [tempInvoiceId, setTempInvoiceId] = useState<string | null>(null);
  const [tempRequirementsId, setTempRequirementsId] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [cashPaymentDetails, setCashPaymentDetails] = useState({
    amountPaid: 0,
    paymentDate: '',
    paymentMode: 'cash' as 'cash' | 'cheque' | 'dd',
    chequeNumber: '',
    chequeDate: '',
    bankName: '',
    ddNumber: '',
    ddDate: '',
    remarks: ''
  });
  
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

  // Form 1 - General Information
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

  // Form 2 - Booth Details
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

  // Form 3 - Security Deposit
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

  // Form 4 - Machine Display (Optional)
  const [machines, setMachines] = useState<MachineDisplay[]>([
    { srNo: 1, machineName: '', width: '', length: '', height: '', weight: '' },
    { srNo: 2, machineName: '', width: '', length: '', height: '', weight: '' },
    { srNo: 3, machineName: '', width: '', length: '', height: '', weight: '' }
  ]);

  // Form 5 - Personnel (Required)
  const [personnel, setPersonnel] = useState<Personnel[]>([
    { srNo: 1, name: '', designation: '', organisation: '' },
    { srNo: 2, name: '', designation: '', organisation: '' },
    { srNo: 3, name: '', designation: '', organisation: '' }
  ]);

  // Form 6 - Company Details (Required)
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

  // Form 7 - Electrical Load (Optional)
  const [electricalLoad, setElectricalLoad] = useState<ElectricalLoad>({
    temporaryLoad: '',
    exhibitionLoad: '',
    temporaryTotal: 0,
    exhibitionTotal: 0
  });

  // Form 8 - Furniture (Optional)
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([]);

  // Form 9 - Hostess (Optional)
  const [hostessRequirements, setHostessRequirements] = useState<HostessRequirement[]>([
    { category: 'A', quantity: 0, noOfDays: 0, amount: 0, ratePerDay: 5000 },
    { category: 'B', quantity: 0, noOfDays: 0, amount: 0, ratePerDay: 4000 }
  ]);

  // Form 10 - Compressed Air (Optional)
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

  // Form 11 - Water Connection (Optional)
  const [waterConnection, setWaterConnection] = useState<WaterConnection>({
    connections: 0,
    costPerConnection: 15000,
    totalCost: 0
  });

  // Form 12 - Security Guard (Optional)
  const [securityGuard, setSecurityGuard] = useState<SecurityGuard>({
    quantity: 0,
    noOfDays: 0,
    totalCost: 0
  });

  // Form 13 - Rental Items (AV & IT) (Optional)
  const [rentalItems, setRentalItems] = useState<RentalItems>({});

  // Form 14 - Housekeeping Staff (Optional)
  const [housekeepingStaff, setHousekeepingStaff] = useState<HousekeepingStaff>({
    quantity: 0,
    category: 'Housekeeping',
    chargesPerShift: 2000,
    noOfDays: 0,
    totalCost: 0
  });

  // Payment Details
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    paymentMode: 'RTGS',
    bankName: '',
    transactionId: '',
    transactionDate: '',
    amount: 0,
    uploadedReceipt: null
  });

  // Electrical rates from API
  const [electricalRates, setElectricalRates] = useState<ElectricalRate[]>([]);
  
  // Security Deposit Tiers from API
  const [securityDepositTiers, setSecurityDepositTiers] = useState<SecurityDepositTier[]>([]);

  // ============= HELPER FUNCTION =============
  const hasData = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'number') return value !== 0;
    return true;
  };
  const router = useRouter();

  // ============= FETCH ALL DATA =============
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
          securityGuardConfigRes,
          waterConnectionConfigRes,
          housekeepingConfigRes,
          securityDepositRes
        ] = await Promise.allSettled([
          apiService.getFurniture(),
          apiService.getCompressedAirOptions(),
          apiService.getElectricalRates(),
          apiService.getRentalItems(),
          apiService.getHostessCategories(),
          apiService.getSecurityGuardConfig(),
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
          const configData = waterConnectionConfigRes.value.data;
          const ratePerConnection = configData?.costPerConnection || 15000;
          
          setWaterConnection(prev => ({
            ...prev,
            costPerConnection: ratePerConnection
          }));
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

      if (!result?.success || !result?.data) {
        return;
      }

      const apiData = result.data;

      let contactPersonObj = {
        name: '',
        jobTitle: '',
        email: '',
        phone: '',
        alternatePhone: ''
      };

      if (apiData.contactPerson) {
        if (typeof apiData.contactPerson === 'string') {
          try {
            contactPersonObj = JSON.parse(apiData.contactPerson);
          } catch (e) {
            console.error('Error parsing contactPerson JSON:', e);
          }
        } else if (typeof apiData.contactPerson === 'object') {
          contactPersonObj = apiData.contactPerson;
        }
      }

      contactPersonObj.name = contactPersonObj.name || apiData.name || '';
      contactPersonObj.email = contactPersonObj.email || apiData.email || '';
      contactPersonObj.phone = contactPersonObj.phone || apiData.phone || '';
      contactPersonObj.jobTitle = contactPersonObj.jobTitle || apiData.contact_job_title || '';

      let title: 'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Prof' = 'Mr';
      let firstName = '';
      let lastName = '';

      if (contactPersonObj.name) {
        const fullName = contactPersonObj.name;

        if (/^Dr\./i.test(fullName)) title = 'Dr';
        else if (/^Prof\./i.test(fullName)) title = 'Prof';
        else if (/^Mrs\./i.test(fullName)) title = 'Mrs';
        else if (/^Ms\./i.test(fullName)) title = 'Ms';

        const nameWithoutTitle = fullName
          .replace(/^(Dr\.|Prof\.|Mrs\.|Ms\.|Mr\.)\s*/i, '')
          .trim();

        const parts = nameWithoutTitle.split(' ');
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
      }

      setGeneralInfo(prev => {
        const newState = {
          ...prev,
          title: hasData(title) ? title : prev.title,
          firstName: hasData(firstName) ? firstName : prev.firstName,
          lastName: hasData(lastName) ? lastName : prev.lastName,
          designation: contactPersonObj.jobTitle || prev.designation,
          mobile: contactPersonObj.phone || prev.mobile,
          email: contactPersonObj.email || prev.email,
          companyName: apiData.company || apiData.companyName || prev.companyName,
          businessNature: typeof apiData.sector === 'string'
            ? apiData.sector.split(',')[0]
            : Array.isArray(apiData.sector)
            ? apiData.sector[0]
            : prev.businessNature,
          gstNumber: apiData.registrationNumber || apiData.gstNumber || prev.gstNumber
        };
        
        setReadOnlyFields(prevFlags => ({
          ...prevFlags,
          generalInfo_title: hasData(title),
          generalInfo_firstName: hasData(firstName),
          generalInfo_lastName: hasData(lastName),
          generalInfo_designation: hasData(contactPersonObj.jobTitle),
          generalInfo_mobile: hasData(contactPersonObj.phone),
          generalInfo_email: hasData(contactPersonObj.email),
          generalInfo_companyName: hasData(apiData.company || apiData.companyName),
          generalInfo_businessNature: hasData(apiData.sector),
          generalInfo_gstNumber: hasData(apiData.registrationNumber || apiData.gstNumber)
        }));
        
        return newState;
      });

      let street = '';

      if (apiData.address && typeof apiData.address === 'string') {
        const parts = apiData.address.split(',').map((p: string) => p.trim());
        street = parts[0] || '';
      }

      setBoothDetails(prev => {
        const newState = {
          ...prev,
          boothNo: apiData.boothNumber || apiData.booth_number || prev.boothNo,
          exhibitorName: contactPersonObj.name || `${title} ${firstName} ${lastName}`.trim(),
          organisation: apiData.company || apiData.companyName || prev.organisation,
          contactPerson: contactPersonObj.name || `${firstName} ${lastName}`.trim(),
          designation: contactPersonObj.jobTitle || prev.designation,
          mobile: contactPersonObj.phone || prev.mobile,
          email: contactPersonObj.email || prev.email
        };

        setReadOnlyFields(prevFlags => ({
          ...prevFlags,
          boothDetails_boothNo: hasData(apiData.boothNumber || apiData.booth_number),
          boothDetails_exhibitorName: hasData(contactPersonObj.name || `${title} ${firstName} ${lastName}`.trim()),
          boothDetails_organisation: hasData(apiData.company || apiData.companyName),
          boothDetails_contactPerson: hasData(contactPersonObj.name || `${firstName} ${lastName}`.trim()),
          boothDetails_designation: hasData(contactPersonObj.jobTitle),
          boothDetails_mobile: hasData(contactPersonObj.phone),
          boothDetails_email: hasData(contactPersonObj.email)
        }));

        return newState;
      });

      setCompanyDetails(prev => {
        const newState = {
          ...prev,
          companyName: apiData.company || apiData.companyName || prev.companyName,
          address: street || prev.address,
          telephone: apiData.telephone || prev.telephone,
          mobile: contactPersonObj.phone || prev.mobile,
          email: contactPersonObj.email || prev.email,
          website: apiData.website || prev.website,
          contactPerson: contactPersonObj.name || `${firstName} ${lastName}`.trim(),
          designation: contactPersonObj.jobTitle || prev.designation,
          productsServices: typeof apiData.sector === 'string'
            ? apiData.sector
            : Array.isArray(apiData.sector)
            ? apiData.sector.join(', ')
            : prev.productsServices
        };

        setReadOnlyFields(prevFlags => ({
          ...prevFlags,
          companyDetails_companyName: hasData(apiData.company || apiData.companyName),
          companyDetails_address: hasData(street),
          companyDetails_telephone: hasData(apiData.telephone),
          companyDetails_mobile: hasData(contactPersonObj.phone),
          companyDetails_email: hasData(contactPersonObj.email),
          companyDetails_website: hasData(apiData.website),
          companyDetails_contactPerson: hasData(contactPersonObj.name || `${firstName} ${lastName}`.trim()),
          companyDetails_designation: hasData(contactPersonObj.jobTitle),
          companyDetails_productsServices: hasData(apiData.sector)
        }));

        return newState;
      });

      setPersonnel(prev => {
        if (prev.length === 0) return prev;

        const updated = [...prev];
        const name = contactPersonObj.name || `${firstName} ${lastName}`.trim();
        const designation = contactPersonObj.jobTitle || updated[0].designation;
        const organisation = apiData.company || updated[0].organisation;

        updated[0] = {
          ...updated[0],
          name: name,
          designation: designation,
          organisation: organisation
        };

        setReadOnlyFields(prevFlags => ({
          ...prevFlags,
          personnel_0_name: hasData(name),
          personnel_0_designation: hasData(designation),
          personnel_0_organisation: hasData(organisation)
        }));

        return updated;
      });

    } catch (error) {
      console.error('Error fetching exhibitor profile:', error);
    }
  };

  // ============= AUTO-FILL EFFECT =============
  useEffect(() => {
    setBoothDetails(prev => ({
      ...prev,
      exhibitorName: (!readOnlyFields.boothDetails_exhibitorName && !prev.exhibitorName) ? `${generalInfo.title} ${generalInfo.firstName} ${generalInfo.lastName}`.trim() : prev.exhibitorName,
      organisation: (!readOnlyFields.boothDetails_organisation && !prev.organisation) ? generalInfo.companyName : prev.organisation,
      contactPerson: (!readOnlyFields.boothDetails_contactPerson && !prev.contactPerson) ? `${generalInfo.firstName} ${generalInfo.lastName}`.trim() : prev.contactPerson,
      mobile: (!readOnlyFields.boothDetails_mobile && !prev.mobile) ? generalInfo.mobile : prev.mobile,
      email: (!readOnlyFields.boothDetails_email && !prev.email) ? generalInfo.email : prev.email,
      designation: (!readOnlyFields.boothDetails_designation && !prev.designation) ? generalInfo.designation : prev.designation
    }));

    setCompanyDetails(prev => ({
      ...prev,
      companyName: (!readOnlyFields.companyDetails_companyName && !prev.companyName) ? generalInfo.companyName : prev.companyName,
      mobile: (!readOnlyFields.companyDetails_mobile && !prev.mobile) ? generalInfo.mobile : prev.mobile,
      email: (!readOnlyFields.companyDetails_email && !prev.email) ? generalInfo.email : prev.email,
      contactPerson: (!readOnlyFields.companyDetails_contactPerson && !prev.contactPerson) ? `${generalInfo.firstName} ${generalInfo.lastName}`.trim() : prev.contactPerson,
      designation: (!readOnlyFields.companyDetails_designation && !prev.designation) ? generalInfo.designation : prev.designation
    }));

    setPersonnel(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[0] = {
          ...updated[0],
          name: (!readOnlyFields.personnel_0_name && !updated[0].name) ? `${generalInfo.firstName} ${generalInfo.lastName}`.trim() : updated[0].name,
          designation: (!readOnlyFields.personnel_0_designation && !updated[0].designation) ? generalInfo.designation : updated[0].designation,
          organisation: (!readOnlyFields.personnel_0_organisation && !updated[0].organisation) ? generalInfo.companyName : updated[0].organisation
        };
      }
      return updated;
    });

  }, [generalInfo, readOnlyFields]);

  // ============= CALCULATIONS =============

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

    const servicesTotal =
      furnitureTotal +
      hostessTotal +
      electricalTotal +
      compressedAirTotal +
      waterTotal +
      securityTotal +
      rentalTotal +
      housekeepingTotal;

    const gst = servicesTotal * 0.18;
    const subtotal = servicesTotal + gst;
    const grandTotal = subtotal + depositAmount;

    return {
      furniture: furnitureTotal,
      hostess: hostessTotal,
      electrical: electricalTotal,
      compressedAir: compressedAirTotal,
      water: waterTotal,
      security: securityTotal,
      rental: rentalTotal,
      housekeeping: housekeepingTotal,
      deposit: depositAmount,
      servicesTotal,
      gst,
      subtotal,
      total: grandTotal
    };
  };

  // ============= HANDLERS =============

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
    setMachines(prev => [
      ...prev,
      {
        srNo: prev.length + 1,
        machineName: '',
        width: '',
        length: '',
        height: '',
        weight: ''
      }
    ]);
  };

  const handleRemoveMachine = (index: number) => {
    const updated = machines.filter((_, i) => i !== index);
    const reIndexed = updated.map((machine, i) => ({
      ...machine,
      srNo: i + 1
    }));
    setMachines(reIndexed);
  };

  const handleCompressedAirSelect = (option: CompressedAirOption) => {
    const totalCost = (option.costPerConnection * compressedAir.qty) + (option.powerKW * 3500 * compressedAir.qty);

    setCompressedAir({
      ...compressedAir,
      id: option.id,
      selected: option.cfmRange,
      cfmRange: option.cfmRange,
      costPerConnection: option.costPerConnection,
      powerKW: option.powerKW,
      totalCost
    });
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
      setElectricalLoad(prev => ({
        ...prev,
        temporaryLoad: value,
        temporaryTotal: total
      }));
    } else {
      setElectricalLoad(prev => ({
        ...prev,
        exhibitionLoad: value,
        exhibitionTotal: total
      }));
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
    setPersonnel(prev => [
      ...prev,
      {
        srNo: prev.length + 1,
        name: '',
        designation: '',
        organisation: ''
      }
    ]);
  };

  const handleRemovePersonnel = (index: number) => {
    if (index === 0) {
      if (readOnlyFields.personnel_0_name || readOnlyFields.personnel_0_designation || readOnlyFields.personnel_0_organisation) {
        return;
      }
    }
    const updated = personnel.filter((_, i) => i !== index);
    const reIndexed = updated.map((person, i) => ({
      ...person,
      srNo: i + 1
    }));
    setPersonnel(reIndexed);
  };

  const handlePaymentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setPaymentDetails(prev => ({ ...prev, uploadedReceipt: files[0] }));
    }
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);

    try {
      const totals = calculateTotals();

      const filteredMachines = machines.filter(m => m.machineName.trim() !== '');
      const filteredPersonnel = personnel.filter(p => p.name.trim() !== '');
      const filteredFurniture = furnitureItems.filter(f => f.quantity > 0);
      const filteredHostess = hostessRequirements.filter(h => h.quantity > 0);

      const filteredRentalItems = Object.values(rentalItems)
        .filter(item => item.quantity > 0)
        .map(item => ({
          id: item.id,
          type: item.category || 'AV/IT Rental',
          description: item.description || 'Rental Item',
          costFor3Days: item.costFor3Days,
          quantity: item.quantity,
          totalCost: item.totalCost
        }));

      const completeData = {
        type: 'exhibitor',
        description: 'Exhibitor requirement submission',
        generalInfo,
        boothDetails,
        securityDeposit,
        machines: filteredMachines,
        personnel: filteredPersonnel,
        companyDetails,
        electricalLoad,
        furnitureItems: filteredFurniture.map(item => ({
          id: item.id,
          code: item.code,
          description: item.description,
          quantity: item.quantity,
          cost: item.cost,
          cost3Days: item.cost3Days
        })),
        hostessRequirements: filteredHostess.map(item => ({
          category: item.category,
          quantity: item.quantity,
          noOfDays: item.noOfDays,
          amount: item.amount,
          ratePerDay: item.ratePerDay
        })),
        compressedAir: compressedAir.selected ? {
          selected: compressedAir.selected,
          cfmRange: compressedAir.cfmRange,
          costPerConnection: compressedAir.costPerConnection,
          qty: compressedAir.qty,
          powerKW: compressedAir.powerKW,
          totalCost: compressedAir.totalCost
        } : null,
        waterConnection: waterConnection.connections > 0 ? waterConnection : null,
        securityGuard: securityGuard.quantity > 0 ? securityGuard : null,
        rentalItems: filteredRentalItems,
        housekeepingStaff: housekeepingStaff.quantity > 0 ? housekeepingStaff : null,
        paymentDetails: {
          paymentMode: paymentDetails.paymentMode,
          bankName: paymentDetails.bankName,
          transactionId: paymentDetails.transactionId,
          transactionDate: paymentDetails.transactionDate,
          amount: paymentDetails.amount,
          notes: `Total: ₹${totals.total}`
        },
        totals: {
          servicesTotal: totals.servicesTotal,
          gst: totals.gst,
          subtotal: totals.subtotal,
          deposit: totals.deposit,
          total: totals.total
        }
      };

      const token = localStorage.getItem('exhibitor_token') || localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/exhibitorDashboard/requirements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(completeData)
      });
      
      const result = await response.json();

      if (response.ok && result.success) {
        const requirementsId = result.data?.id;
        
        if (!requirementsId) {
          throw new Error('No requirements ID returned');
        }
        
        localStorage.setItem('last_requirements_id', requirementsId);
        
        const invoiceResult = await generateInvoice(requirementsId, totals);
        
        let finalInvoiceId = null;
        
        if (invoiceResult && invoiceResult.data?.id) {
          finalInvoiceId = invoiceResult.data.id;
          localStorage.setItem('last_invoice_id', finalInvoiceId);
          
          setCashfreeInvoiceId(finalInvoiceId);
          setCashfreeRequirementsId(requirementsId);
          setCashfreeAmount(totals.total);
          
          setShowPayment(false);
          setShowCashfree(true);
          
        } else {
          console.warn('Invoice generation failed, but requirements saved');
          alert('Application submitted! However, invoice generation failed. Please contact support.');
        }
        
      } else {
        throw new Error(result.error || result.message || 'Submission failed');
      }

    } catch (error: any) {
      console.error('❌ Submission Error:', error);
      alert(error.message || 'Submission failed. Please check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCashPaymentSubmit = async () => {
    if (!tempRequirementsId) {
      alert('No requirement found. Please try again.');
      return;
    }

    if (cashPaymentDetails.paymentMode === 'cheque') {
      if (!cashPaymentDetails.chequeNumber || !cashPaymentDetails.chequeDate || !cashPaymentDetails.bankName) {
        alert('Please fill all cheque details (Cheque Number, Date, Bank Name)');
        return;
      }
    } else if (cashPaymentDetails.paymentMode === 'dd') {
      if (!cashPaymentDetails.ddNumber || !cashPaymentDetails.ddDate || !cashPaymentDetails.bankName) {
        alert('Please fill all DD details (DD Number, Date, Bank Name)');
        return;
      }
    } else {
      if (!cashPaymentDetails.amountPaid || cashPaymentDetails.amountPaid <= 0) {
        alert('Please enter the amount paid');
        return;
      }
      if (!cashPaymentDetails.paymentDate) {
        alert('Please select payment date');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('exhibitor_token') || localStorage.getItem('token');
      
      const paymentData = {
        requirementId: tempRequirementsId,
        invoiceId: tempInvoiceId,
        amount: paymentAmount,
        amountPaid: cashPaymentDetails.amountPaid || paymentAmount,
        paymentMode: cashPaymentDetails.paymentMode,
        paymentDate: cashPaymentDetails.paymentDate || new Date().toISOString().split('T')[0],
        chequeNumber: cashPaymentDetails.chequeNumber,
        chequeDate: cashPaymentDetails.chequeDate,
        bankName: cashPaymentDetails.bankName,
        ddNumber: cashPaymentDetails.ddNumber,
        ddDate: cashPaymentDetails.ddDate,
        remarks: cashPaymentDetails.remarks,
        status: 'pending_verification'
      };

      const response = await fetch(`${API_BASE_URL}/api/payments/cash-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPaymentReference(result.data.paymentReference);
        setShowCashPayment(false);
        window.location.href = `/dashboard/requirements/success?invoiceId=${tempInvoiceId}&paymentReference=${result.data.paymentReference}&status=pending`;
      } else {
        throw new Error(result.error || 'Payment submission failed');
      }

    } catch (error: any) {
      console.error('❌ Payment Submission Error:', error);
      alert(error.message || 'Failed to submit payment details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

const handleCashfreeSuccess = async (paymentData: { orderId: string; paymentId?: string }) => {
  console.log('Payment successful:', paymentData);
  setShowCashfree(false);
  
  localStorage.setItem('last_cashfree_order_id', paymentData.orderId);
  if (paymentData.paymentId) {
    localStorage.setItem('last_payment_id', paymentData.paymentId);
  }
  
  router.push(`/dashboard/requirements/success?order_id=${paymentData.orderId}&invoiceId=${cashfreeInvoiceId}`);
};
  const handleCashfreeFailure = (error: string) => {
    console.error('Payment failed:', error);
    setShowCashfree(false);
    
    const shouldRetry = window.confirm(
      `Payment failed: ${error}\n\nWould you like to try again?\n\nClick "OK" to retry or "Cancel" to use bank transfer.`
    );
    
    if (shouldRetry) {
      setShowCashfree(true);
    } else {
      setShowPayment(true);
    }
  };

  const resetCashPaymentForm = () => {
    setCashPaymentDetails({
      amountPaid: paymentAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: 'cash',
      chequeNumber: '',
      chequeDate: '',
      bankName: '',
      ddNumber: '',
      ddDate: '',
      remarks: ''
    });
  };

  const generateInvoice = async (requirementsId: string, totals: any) => {
    try {
      const items = [];
      
      const furnitureItemsWithQty = furnitureItems.filter(f => f.quantity > 0);
      if (furnitureItemsWithQty.length > 0) {
        furnitureItemsWithQty.forEach(item => {
          items.push({
            description: `Furniture: ${item.description} (${item.code})`,
            quantity: item.quantity,
            unitPrice: item.cost3Days,
            total: item.cost
          });
        });
      }
      
      const hostessItems = hostessRequirements.filter(h => h.quantity > 0);
      if (hostessItems.length > 0) {
        hostessItems.forEach(hostess => {
          const ratePerDay = hostess.ratePerDay || (hostess.category === 'A' ? 5000 : 4000);
          items.push({
            description: `Hostess Services - Category ${hostess.category}`,
            quantity: hostess.quantity * hostess.noOfDays,
            unitPrice: ratePerDay,
            total: hostess.amount
          });
        });
      }
      
      if (electricalLoad.temporaryTotal > 0) {
        items.push({
          description: 'Electrical Load - Temporary (Setup Days)',
          quantity: parseFloat(electricalLoad.temporaryLoad) || 0,
          unitPrice: electricalRates.find(r => r.type === 'temporary' && r.isActive)?.ratePerKW || 3500,
          total: electricalLoad.temporaryTotal
        });
      }
      
      if (electricalLoad.exhibitionTotal > 0) {
        items.push({
          description: 'Electrical Load - Exhibition (Show Days)',
          quantity: parseFloat(electricalLoad.exhibitionLoad) || 0,
          unitPrice: electricalRates.find(r => r.type === 'exhibition' && r.isActive)?.ratePerKW || 3500,
          total: electricalLoad.exhibitionTotal
        });
      }
      
      if (compressedAir.selected && compressedAir.qty > 0) {
        items.push({
          description: `Compressed Air Connection - ${compressedAir.cfmRange}`,
          quantity: compressedAir.qty,
          unitPrice: compressedAir.costPerConnection + (compressedAir.powerKW * 3500),
          total: compressedAir.totalCost
        });
      }
      
      if (waterConnection.connections > 0) {
        items.push({
          description: 'Water Connection',
          quantity: waterConnection.connections,
          unitPrice: waterConnection.costPerConnection,
          total: waterConnection.totalCost
        });
      }
      
      if (securityGuard.quantity > 0 && securityGuard.noOfDays > 0) {
        items.push({
          description: 'Security Guard Services',
          quantity: securityGuard.quantity * securityGuard.noOfDays,
          unitPrice: 2500,
          total: securityGuard.totalCost
        });
      }
      
      const rentalItemsWithQty = Object.values(rentalItems).filter(item => item.quantity > 0);
      if (rentalItemsWithQty.length > 0) {
        rentalItemsWithQty.forEach(item => {
          items.push({
            description: `AV/IT Rental: ${item.description}`,
            quantity: item.quantity,
            unitPrice: item.costFor3Days,
            total: item.totalCost
          });
        });
      }
      
      if (housekeepingStaff.quantity > 0 && housekeepingStaff.noOfDays > 0) {
        items.push({
          description: 'Housekeeping Staff',
          quantity: housekeepingStaff.quantity * housekeepingStaff.noOfDays,
          unitPrice: housekeepingStaff.chargesPerShift,
          total: housekeepingStaff.totalCost
        });
      }
      
      if (totals.deposit > 0) {
        items.push({
          description: `Security Deposit - Booth Area: ${securityDeposit.boothSq}`,
          quantity: 1,
          unitPrice: totals.deposit,
          total: totals.deposit
        });
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
        requirementsId: requirementsId,
        exhibitorId: exhibitorId,
        exhibitorInfo,
        paymentInfo,
        items,
        totals: {
          servicesTotal: totals.servicesTotal,
          gst: totals.gst,
          total: totals.total,
          deposit: totals.deposit,
          subtotal: totals.subtotal
        },
        invoiceNumber: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`,
        issueDate: new Date().toISOString(),
        dueDate: dueDate.toISOString(),
        notes: `Thank you for your exhibition registration. This invoice includes all services requested.\n\n` +
               `Booth Number: ${boothDetails.boothNo || 'To be assigned'}\n` +
               `Contractor: ${boothDetails.contractorCompany || 'N/A'}\n\n` +
               `Please complete payment to confirm your registration.`
      };
      
      const token = localStorage.getItem('exhibitor_token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/invoices/generate-from-requirements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoicePayload)
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response. Please check if the endpoint exists.');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const invoiceResult = await response.json();
      
      if (invoiceResult.data?.id) {
        localStorage.setItem('last_invoice_id', invoiceResult.data.id);
      }
      
      return invoiceResult;
      
    } catch (error: any) {
      console.error('❌ Error generating invoice:', error);
      console.warn('Invoice generation failed but submission was successful:', error.message);
      return null;
    }
  };

  // Effects for calculations
  useEffect(() => {
    if (waterConnection.connections > 0) {
      const total = waterConnection.connections * waterConnection.costPerConnection;
      setWaterConnection(prev => ({ ...prev, totalCost: total }));
    } else {
      setWaterConnection(prev => ({ ...prev, totalCost: 0 }));
    }
  }, [waterConnection.connections, waterConnection.costPerConnection]);

  useEffect(() => {
    if (securityGuard.quantity > 0 && securityGuard.noOfDays > 0) {
      const total = securityGuard.quantity * securityGuard.noOfDays * 2500;
      setSecurityGuard(prev => ({ ...prev, totalCost: total }));
    } else {
      setSecurityGuard(prev => ({ ...prev, totalCost: 0 }));
    }
  }, [securityGuard.quantity, securityGuard.noOfDays]);

  useEffect(() => {
    const calculateHousekeepingCost = async () => {
      if (housekeepingStaff.quantity > 0 && housekeepingStaff.noOfDays > 0) {
        try {
          const result = await apiService.calculateHousekeepingCost(
            housekeepingStaff.quantity,
            housekeepingStaff.noOfDays
          );
          
          if (result.success) {
            setHousekeepingStaff(prev => ({
              ...prev,
              totalCost: result.data.totalCost,
              chargesPerShift: result.data.ratePerShift || prev.chargesPerShift
            }));
          }
        } catch (error) {
          console.error('Error calculating housekeeping cost:', error);
          const total = housekeepingStaff.quantity * housekeepingStaff.noOfDays * housekeepingStaff.chargesPerShift;
          setHousekeepingStaff(prev => ({ ...prev, totalCost: total }));
        }
      } else {
        setHousekeepingStaff(prev => ({ ...prev, totalCost: 0 }));
      }
    };

    calculateHousekeepingCost();
  }, [housekeepingStaff.quantity, housekeepingStaff.noOfDays]);

  // ============= IMAGE MODAL =============
  const renderImageModal = () => {
    if (!selectedImage) return null;

    return (
      <div 
        className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
        onClick={() => setSelectedImage(null)}
      >
        <div 
          className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 bg-white rounded-full p-1 shadow-lg z-10"
          >
            <XCircleIcon className="h-8 w-8" />
          </button>
          
          <div className="p-4 bg-white">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[70vh] object-contain mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
              }}
            />
            <p className="text-center mt-2 text-sm font-medium text-gray-700">
              {selectedImage.alt}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ============= RENDER FUNCTIONS =============

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

  // Loading state
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

  // Error state
  if (apiError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Data</h2>
          <p className="text-gray-600 mb-6">{apiError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============= FORM 1: GENERAL INFO =============
  const renderGeneralInfo = () => (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg">
            <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">Basic Information</h2>
        </div>
        {Object.values(readOnlyFields).some(v => v) && (
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <LockClosedIcon className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Some fields auto-filled</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 sm:p-5 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
            Personal Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
              <select
                value={generalInfo.title}
                onChange={(e) => handleGeneralInfoChange('title', e.target.value as any)}
                disabled={readOnlyFields.generalInfo_title}
                className={`w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white ${
                  readOnlyFields.generalInfo_title ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="Mr">Mr.</option>
                <option value="Mrs">Mrs.</option>
                <option value="Ms">Ms.</option>
                <option value="Dr">Dr.</option>
                <option value="Prof">Prof.</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
              <input
                type="text"
                value={generalInfo.firstName}
                onChange={(e) => handleGeneralInfoChange('firstName', e.target.value)}
                disabled={readOnlyFields.generalInfo_firstName}
                className={`w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 ${
                  readOnlyFields.generalInfo_firstName ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="First"
              />
              {readOnlyFields.generalInfo_firstName && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                </p>
              )}
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
              <input
                type="text"
                value={generalInfo.lastName}
                onChange={(e) => handleGeneralInfoChange('lastName', e.target.value)}
                disabled={readOnlyFields.generalInfo_lastName}
                className={`w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 ${
                  readOnlyFields.generalInfo_lastName ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="Last"
              />
              {readOnlyFields.generalInfo_lastName && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                </p>
              )}
            </div>
            <div className="col-span-2 lg:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Designation</label>
              <input
                type="text"
                value={generalInfo.designation}
                onChange={(e) => handleGeneralInfoChange('designation', e.target.value)}
                disabled={readOnlyFields.generalInfo_designation}
                className={`w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 ${
                  readOnlyFields.generalInfo_designation ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="e.g. Manager"
              />
              {readOnlyFields.generalInfo_designation && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 sm:p-5 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <DevicePhoneMobileIcon className="h-4 w-4 mr-2 text-gray-500" />
            Contact
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mobile</label>
                <input
                  type="tel"
                  value={generalInfo.mobile}
                  onChange={(e) => handleGeneralInfoChange('mobile', e.target.value)}
                  disabled={readOnlyFields.generalInfo_mobile}
                  className={`w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 ${
                    readOnlyFields.generalInfo_mobile ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="98765 43210"
                />
                {readOnlyFields.generalInfo_mobile && (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={generalInfo.email}
                  onChange={(e) => handleGeneralInfoChange('email', e.target.value)}
                  disabled={readOnlyFields.generalInfo_email}
                  className={`w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 ${
                    readOnlyFields.generalInfo_email ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="name@company.com"
                />
                {readOnlyFields.generalInfo_email && (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 sm:p-5 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-500" />
            Company
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Company Name</label>
              <input
                type="text"
                value={generalInfo.companyName}
                onChange={(e) => handleGeneralInfoChange('companyName', e.target.value)}
                disabled={readOnlyFields.generalInfo_companyName}
                className={`w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 ${
                  readOnlyFields.generalInfo_companyName ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="Enter company name"
              />
              {readOnlyFields.generalInfo_companyName && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">GST</label>
              <input
                type="text"
                value={generalInfo.gstNumber}
                onChange={(e) => handleGeneralInfoChange('gstNumber', e.target.value)}
                disabled={readOnlyFields.generalInfo_gstNumber}
                className={`w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 ${
                  readOnlyFields.generalInfo_gstNumber ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="22AAAAA0000A1Z5"
              />
              {readOnlyFields.generalInfo_gstNumber && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                </p>
              )}
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Nature of Business</label>
              <input
                type="text"
                value={generalInfo.businessNature}
                onChange={(e) => handleGeneralInfoChange('businessNature', e.target.value)}
                disabled={readOnlyFields.generalInfo_businessNature}
                className={`w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 ${
                  readOnlyFields.generalInfo_businessNature ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="e.g. Manufacturing, Trading, Services"
              />
              {readOnlyFields.generalInfo_businessNature && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 italic">
          * Additional company details can be filled in the Company section (Step 6)
        </p>
      </div>
    </div>
  );

  // ============= FORM 2: BOOTH & CONTRACTOR DETAILS =============
  const renderBoothDetails = () => (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BuildingOfficeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">REGISTRATION OF CONTRACTOR
            <br /> <span className='text-[#4D4D4D] font-semibold text-[15px]'>FOR BARE SPACE EXHIBITORS</span>
          </h2>
        </div>
        {Object.values(readOnlyFields).some(v => v) && (
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <LockClosedIcon className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Some fields auto-filled</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Booth Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booth No.</label>
              <input
                type="text"
                value={boothDetails.boothNo}
                onChange={(e) => handleBoothDetailsChange('boothNo', e.target.value)}
                disabled={readOnlyFields.boothDetails_boothNo}
                className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
                  readOnlyFields.boothDetails_boothNo ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="Enter booth number"
              />
              {readOnlyFields.boothDetails_boothNo && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exhibitor Name</label>
              <input
                type="text"
                value={boothDetails.exhibitorName}
                onChange={(e) => handleBoothDetailsChange('exhibitorName', e.target.value)}
                disabled={readOnlyFields.boothDetails_exhibitorName}
                className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
                  readOnlyFields.boothDetails_exhibitorName ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="Auto-filled from basic info"
              />
              {readOnlyFields.boothDetails_exhibitorName && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sq. Mtr Booked</label>
              <input
                type="text"
                value={boothDetails.sqMtrBooked}
                onChange={(e) => handleBoothDetailsChange('sqMtrBooked', e.target.value)}
                disabled={readOnlyFields.boothDetails_sqMtrBooked}
                className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
                  readOnlyFields.boothDetails_sqMtrBooked ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="Enter square meters"
              />
              {readOnlyFields.boothDetails_sqMtrBooked && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
              <input
                type="text"
                value={boothDetails.organisation}
                onChange={(e) => handleBoothDetailsChange('organisation', e.target.value)}
                disabled={readOnlyFields.boothDetails_organisation}
                className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
                  readOnlyFields.boothDetails_organisation ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="Auto-filled from company name"
              />
              {readOnlyFields.boothDetails_organisation && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={boothDetails.contactPerson}
                onChange={(e) => handleBoothDetailsChange('contactPerson', e.target.value)}
                disabled={readOnlyFields.boothDetails_contactPerson}
                className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
                  readOnlyFields.boothDetails_contactPerson ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="Auto-filled from name"
              />
              {readOnlyFields.boothDetails_contactPerson && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <input
                type="text"
                value={boothDetails.designation}
                onChange={(e) => handleBoothDetailsChange('designation', e.target.value)}
                disabled={readOnlyFields.boothDetails_designation}
                className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
                  readOnlyFields.boothDetails_designation ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="Auto-filled from designation"
              />
              {readOnlyFields.boothDetails_designation && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={boothDetails.mobile}
                onChange={(e) => handleBoothDetailsChange('mobile', e.target.value)}
                disabled={readOnlyFields.boothDetails_mobile}
                className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
                  readOnlyFields.boothDetails_mobile ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="Auto-filled from contact"
              />
              {readOnlyFields.boothDetails_mobile && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
              <input
                type="email"
                value={boothDetails.email}
                onChange={(e) => handleBoothDetailsChange('email', e.target.value)}
                disabled={readOnlyFields.boothDetails_email}
                className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
                  readOnlyFields.boothDetails_email ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="Auto-filled from contact"
              />
              {readOnlyFields.boothDetails_email && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contractor Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contractor Company</label>
              <input
                type="text"
                value={boothDetails.contractorCompany}
                onChange={(e) => setBoothDetails({ ...boothDetails, contractorCompany: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Enter contractor company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contractor Person</label>
              <input
                type="text"
                value={boothDetails.contractorPerson}
                onChange={(e) => setBoothDetails({ ...boothDetails, contractorPerson: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Enter contractor name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contractor Mobile</label>
              <input
                type="tel"
                value={boothDetails.contractorMobile}
                onChange={(e) => setBoothDetails({ ...boothDetails, contractorMobile: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Enter contractor mobile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contractor Email</label>
              <input
                type="email"
                value={boothDetails.contractorEmail}
                onChange={(e) => setBoothDetails({ ...boothDetails, contractorEmail: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Enter contractor email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contractor GST</label>
              <input
                type="text"
                value={boothDetails.contractorGST}
                onChange={(e) => setBoothDetails({ ...boothDetails, contractorGST: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Enter GST number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contractor PAN</label>
              <input
                type="text"
                value={boothDetails.contractorPAN}
                onChange={(e) => setBoothDetails({ ...boothDetails, contractorPAN: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Enter PAN number"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-200 pt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Booth Fabrication Guidelines & Regulations
        </h3>
        <div className="bg-gray-50 rounded-xl p-5 space-y-4 text-sm text-gray-700 leading-relaxed">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-semibold">Height Limit:</span> The maximum allowable height for fabricated booths,
              including platform height, is 4 meters.
            </li>
            <li>
              <span className="font-semibold">Carpet Requirement:</span> Fabricators must lay a single-use carpet
              over the entire booth area before starting construction. Failure to comply will result
              in forfeiture of the refundable security deposit.
            </li>
            <li>
              <span className="font-semibold">No Storage Space:</span> Storing or retaining materials behind
              the booth is prohibited. Violating this rule will result in forfeiture of the performance bond.
            </li>
            <li>
              <span className="font-semibold">Housekeeping:</span> Organizers will not provide booth cleaning
              services during setup or show days. Fabricators must arrange their own housekeeping personnel
              to ensure final booth cleaning.
            </li>
            <li>
              <span className="font-semibold">Fire Extinguishers:</span> Each booth must have fire extinguishers.
              This requirement must be incorporated into the booth design for approval.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Damage & Performance Bond
        </h3>
        <div className="bg-red-50 border border-red-100 rounded-xl p-5 space-y-4 text-sm text-gray-700 leading-relaxed">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-semibold">Payment:</span> Booth contractors must pay a Damage & Performance
              Bond via demand draft to the organizers, <span className="font-medium">“Maxx Business Media Pvt. Ltd.”</span>,
              upon registering at the exhibition site.
            </li>
            <li>
              <span className="font-semibold">Waste Removal:</span> Contractors are responsible for removing
              all packing and waste materials during move-in and move-out.
            </li>
            <li>
              <span className="font-semibold">Refund of Security Deposit:</span> The Security Deposit DD will
              be refunded upon presentation of the receipt after the exhibition, provided the site
              is cleared without damage.
            </li>
            <li>
              <span className="font-semibold">Deductions:</span> Organizers reserve the right to deduct amounts
              for damages caused during build-up, show days, or dismantling.
            </li>
            <li>
              <span className="font-semibold">Contractor Access:</span> Upon submission of the form and deposit,
              CONTRACTOR BANDS will be issued.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  // ============= FORM 3: SECURITY DEPOSIT =============
  const renderSecurityDeposit = () => {
    const sortedTiers = [...securityDepositTiers].sort((a, b) => a.displayOrder - b.displayOrder);

    return (
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BanknotesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">CONTRACTOR SECURITY
            DEPOSIT FORM <br /> <span className='text-[#4D4D4D] font-semibold text-[15px]'>FORM 2 FOR BARE SPACE EXHIBITORS</span>
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Deposit Amount</h3>
            
            {sortedTiers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Loading security deposit options...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Booth Sq.</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount (INR)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount (USD)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTiers.map((tier, index) => {
                      let boothSqDisplay = '';
                      if (tier.category === '0-36') boothSqDisplay = '0 - 36';
                      else if (tier.category === '37-100') boothSqDisplay = '37 - 100';
                      else if (tier.category === '101+') boothSqDisplay = '101 and above';

                      return (
                        <tr key={tier.id} className="hover:bg-gray-100">
                          <td className="px-3 py-2 text-sm">{index + 1}</td>
                          <td className="px-3 py-2 text-sm">{boothSqDisplay}</td>
                          <td className="px-3 py-2 text-sm">₹{tier.amountINR.toLocaleString()}</td>
                          <td className="px-3 py-2 text-sm">USD {tier.amountUSD}</td>
                          <td className="px-3 py-2">
                            <input
                              type="radio"
                              name="securityDeposit"
                              checked={securityDeposit.boothSq === tier.category}
                              onChange={() => setSecurityDeposit({ 
                                ...securityDeposit, 
                                boothSq: tier.category, 
                                amountINR: tier.amountINR, 
                                amountUSD: tier.amountUSD 
                              })}
                              className="h-4 w-4 text-blue-600"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Important Notes</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
              <ul className="list-disc pl-5 space-y-3">
                <li>The Security Deposit should be submitted only by <span className="font-semibold">Demand Draft</span>.</li>
                <li>Refundable Security Deposit must be paid by Demand Draft in the name of <span className="font-semibold">“Maxx Business Media Pvt. Ltd.”</span>.</li>
                <li>If the contractor fails to submit the Security Deposit by Demand Draft, booth possession will not be given.</li>
                <li>The Security Deposit must be paid by the <span className="font-semibold">booth contractor</span>.</li>
                <li>If the booth contractor fails to meet the deadline, the complete Security Deposit will be <span className="font-semibold text-red-600">fully forfeited</span>.</li>
                <li>Kindly bring <span className="font-semibold">2 copies</span> of this form at the time of possession.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============= FORM 4: MACHINES (OPTIONAL) =============
  const renderMachines = () => (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg">
            <CubeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">
            MACHINE DISPLAY
            <br />
            <span className="text-[#4D4D4D] font-semibold text-[15px]">
              (OPTIONAL)
            </span>
          </h2>
        </div>

        <button
          type="button"
          onClick={handleAddMachine}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow transition"
        >
          <PlusIcon className="h-4 w-4" />
          Add Machine
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sr.</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Machine Name</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Width (m)</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Length (m)</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Height (m)</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Weight (Tons)</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {machines.map((machine, index) => (
              <tr key={machine.srNo} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm text-gray-900 font-medium">
                  {machine.srNo}
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={machine.machineName}
                    onChange={(e) => {
                      const updated = [...machines];
                      updated[index].machineName = e.target.value;
                      setMachines(updated);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter machine name"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={machine.width}
                    onChange={(e) => {
                      const updated = [...machines];
                      updated[index].width = e.target.value;
                      setMachines(updated);
                    }}
                    className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="W"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={machine.length}
                    onChange={(e) => {
                      const updated = [...machines];
                      updated[index].length = e.target.value;
                      setMachines(updated);
                    }}
                    className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="L"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={machine.height}
                    onChange={(e) => {
                      const updated = [...machines];
                      updated[index].height = e.target.value;
                      setMachines(updated);
                    }}
                    className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="H"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={machine.weight}
                    onChange={(e) => {
                      const updated = [...machines];
                      updated[index].weight = e.target.value;
                      setMachines(updated);
                    }}
                    className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Tons"
                  />
                </td>
                <td className="px-3 py-2">
                  {machines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMachine(index)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-4 italic">
        * Add all machines that will be displayed at your booth. (Optional)
      </p>
    </div>
  );

  // ============= FORM 5: PERSONNEL =============
  const renderPersonnel = () => (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg">
            <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">
            EXHIBITOR PASSES
            <br />
            <span className="text-[#4D4D4D] font-semibold text-[15px]">
              (OPTIONAL)
            </span>
          </h2>
        </div>
        {(readOnlyFields.personnel_0_name || readOnlyFields.personnel_0_designation || readOnlyFields.personnel_0_organisation) && (
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <LockClosedIcon className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Primary contact auto-filled</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleAddPersonnel}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow transition"
        >
          <PlusIcon className="h-4 w-4" />
          Add Exhibitor
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sr.</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Organisation</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {personnel.map((person, index) => (
              <tr key={person.srNo} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm font-medium text-gray-900">
                  {person.srNo}
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => handlePersonnelChange(index, 'name', e.target.value)}
                    disabled={index === 0 && readOnlyFields.personnel_0_name}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 ${
                      (index === 0 && readOnlyFields.personnel_0_name) ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder={index === 0 ? "Auto-filled from basic info" : "Enter name"}
                  />
                  {index === 0 && readOnlyFields.personnel_0_name && (
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                    </p>
                  )}
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={person.designation}
                    onChange={(e) => handlePersonnelChange(index, 'designation', e.target.value)}
                    disabled={index === 0 && readOnlyFields.personnel_0_designation}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 ${
                      (index === 0 && readOnlyFields.personnel_0_designation) ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder={index === 0 ? "Auto-filled" : "Designation"}
                  />
                  {index === 0 && readOnlyFields.personnel_0_designation && (
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                    </p>
                  )}
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={person.organisation}
                    onChange={(e) => handlePersonnelChange(index, 'organisation', e.target.value)}
                    disabled={index === 0 && readOnlyFields.personnel_0_organisation}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 ${
                      (index === 0 && readOnlyFields.personnel_0_organisation) ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder={index === 0 ? "Auto-filled" : "Organisation"}
                  />
                  {index === 0 && readOnlyFields.personnel_0_organisation && (
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
                    </p>
                  )}
                </td>
                <td className="px-3 py-2">
                  {personnel.length > 1 && (!readOnlyFields.personnel_0_name || index !== 0) && (
                    <button
                      type="button"
                      onClick={() => handleRemovePersonnel(index)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-4 italic">
        * Please enter all representatives who require exhibitor passes. (Optional)
      </p>
    </div>
  );

  // ============= FORM 6: COMPANY DETAILS =============
  const renderCompanyDetails = () => (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BuildingOfficeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">
            DATA FOR EXHIBITOR'S GUIDE
            <br />
            <span className="text-[#4D4D4D] font-semibold text-[15px]">
              (OPTIONAL)
            </span>
          </h2>
        </div>
        {Object.values(readOnlyFields).some(v => v) && (
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <LockClosedIcon className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Some fields auto-filled</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={companyDetails.companyName}
            onChange={(e) => handleCompanyDetailsChange('companyName', e.target.value)}
            disabled={readOnlyFields.companyDetails_companyName}
            className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
              readOnlyFields.companyDetails_companyName ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="Auto-filled from basic info"
          />
          {readOnlyFields.companyDetails_companyName && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            value={companyDetails.address}
            onChange={(e) =>
              handleCompanyDetailsChange('address', e.target.value)
            }
            disabled={readOnlyFields.companyDetails_address}
            rows={2}
            className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
              readOnlyFields.companyDetails_address ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="Enter complete address"
          />
          {readOnlyFields.companyDetails_address && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telephone
          </label>
          <input
            type="tel"
            value={companyDetails.telephone}
            onChange={(e) =>
              handleCompanyDetailsChange('telephone', e.target.value)
            }
            disabled={readOnlyFields.companyDetails_telephone}
            className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
              readOnlyFields.companyDetails_telephone ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="Enter telephone"
          />
          {readOnlyFields.companyDetails_telephone && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile
          </label>
          <input
            type="tel"
            value={companyDetails.mobile}
            onChange={(e) =>
              handleCompanyDetailsChange('mobile', e.target.value)
            }
            disabled={readOnlyFields.companyDetails_mobile}
            className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
              readOnlyFields.companyDetails_mobile ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="Auto-filled from contact"
          />
          {readOnlyFields.companyDetails_mobile && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={companyDetails.email}
            onChange={(e) =>
              handleCompanyDetailsChange('email', e.target.value)
            }
            disabled={readOnlyFields.companyDetails_email}
            className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
              readOnlyFields.companyDetails_email ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="Auto-filled from contact"
          />
          {readOnlyFields.companyDetails_email && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            value={companyDetails.website}
            onChange={(e) =>
              handleCompanyDetailsChange('website', e.target.value)
            }
            disabled={readOnlyFields.companyDetails_website}
            className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
              readOnlyFields.companyDetails_website ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="www.example.com"
          />
          {readOnlyFields.companyDetails_website && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Person
          </label>
          <input
            type="text"
            value={companyDetails.contactPerson}
            onChange={(e) =>
              handleCompanyDetailsChange('contactPerson', e.target.value)
            }
            disabled={readOnlyFields.companyDetails_contactPerson}
            className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
              readOnlyFields.companyDetails_contactPerson ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="Auto-filled from name"
          />
          {readOnlyFields.companyDetails_contactPerson && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Designation
          </label>
          <input
            type="text"
            value={companyDetails.designation}
            onChange={(e) =>
              handleCompanyDetailsChange('designation', e.target.value)
            }
            disabled={readOnlyFields.companyDetails_designation}
            className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
              readOnlyFields.companyDetails_designation ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="Auto-filled from designation"
          />
          {readOnlyFields.companyDetails_designation && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Products / Services
          </label>
          <textarea
            value={companyDetails.productsServices}
            onChange={(e) =>
              handleCompanyDetailsChange('productsServices', e.target.value)
            }
            disabled={readOnlyFields.companyDetails_productsServices}
            rows={3}
            className={`w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 ${
              readOnlyFields.companyDetails_productsServices ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="Enter products or services"
          />
          {readOnlyFields.companyDetails_productsServices && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <LockClosedIcon className="h-3 w-3 mr-1" /> Auto-filled
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-gray-700">
        <p className="font-semibold">Maxx Business Media Pvt. Ltd.</p>
        <p className="mt-2">This information will be published in the Exhibitor's Guide for visitors.</p>
      </div>
    </div>
  );

  // ============= FORM 7: ELECTRICAL LOAD (OPTIONAL) =============
  const renderElectricalLoad = () => {
    const tempRate = electricalRates.find(r => r.type === 'temporary' && r.isActive)?.ratePerKW || 3500;
    const exhRate = electricalRates.find(r => r.type === 'exhibition' && r.isActive)?.ratePerKW || 3500;

    return (
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BoltIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">Electrical Load</h2>
        </div>

        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Load (KW)</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 text-sm">Temporary (18-19 Nov)</td>
                  <td className="px-3 py-2 text-sm">₹{tempRate.toLocaleString()}/KW</td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={electricalLoad.temporaryLoad}
                      onChange={(e) => handleElectricalLoadChange('temporary', e.target.value)}
                      className="w-20 border border-gray-200 rounded px-2 py-1 text-sm"
                      placeholder="KW"
                    />
                  </td>
                  <td className="px-3 py-2 text-sm">₹{electricalLoad.temporaryTotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-sm">Exhibition (20-22 Nov)</td>
                  <td className="px-3 py-2 text-sm">₹{exhRate.toLocaleString()}/KW</td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={electricalLoad.exhibitionLoad}
                      onChange={(e) => handleElectricalLoadChange('exhibition', e.target.value)}
                      className="w-20 border border-gray-200 rounded px-2 py-1 text-sm"
                      placeholder="KW"
                    />
                  </td>
                  <td className="px-3 py-2 text-sm">₹{electricalLoad.exhibitionTotal.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm">
              <p className="font-semibold text-yellow-800 mb-2">Important Note:</p>
              <p>All prices are current and subject to change without prior notice. Orders must be placed by 7th November 2025.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============= FORM 8: FURNITURE (OPTIONAL) =============
  const renderFurniture = () => {
    const furnitureTotal = furnitureItems.reduce((sum, item) => sum + (item.cost || 0), 0);

    if (furnitureItems.length === 0) {
      return (
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ComputerDesktopIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">Furniture</h2>
          </div>
          <div className="text-center py-8 text-gray-500">
            No furniture items available at the moment.
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <ComputerDesktopIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">Furniture</h2>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cost (3 Days)</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {furnitureItems.map((item, index) => (
                <tr key={item.code || index} className="hover:bg-gray-50">
                  <td className="px-2 py-1.5">
                    <div 
                      className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        const imageUrl = item.image || item.imageUrl;
                        if (imageUrl) {
                          setSelectedImage({
                            src: imageUrl,
                            alt: item.description || 'Furniture item'
                          });
                        }
                      }}
                    >
                      {(item.image || item.imageUrl) ? (
                        <img
                          src={item.image || item.imageUrl || ''}
                          alt={item.description || 'Furniture item'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.jpg';
                          }}
                        />
                      ) : (
                        <PhotoIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                   </td>
                  <td className="px-2 py-1.5 text-xs font-mono text-blue-600">{item.code || 'N/A'}</td>
                  <td className="px-2 py-1.5 text-xs">{item.description || 'No description'}</td>
                  <td className="px-2 py-1.5 text-xs">{item.size && item.size !== 'null' ? item.size : 'N/A'}</td>
                  <td className="px-2 py-1.5 text-xs">₹{item.cost3Days?.toLocaleString() ?? '0'}</td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      min="0"
                      value={item.quantity || ''}
                      onChange={(e) => handleFurnitureQuantity(index, parseInt(e.target.value) || 0)}
                      className="w-16 border border-gray-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                   </td>
                  <td className="px-2 py-1.5 text-xs font-semibold">
                    ₹{item.cost?.toLocaleString() ?? '0'}
                   </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 sticky bottom-0">
              <tr>
                <td colSpan={6} className="px-2 py-2 text-right text-xs font-semibold">Total:</td>
                <td className="px-2 py-2 text-xs font-bold text-blue-600">
                  ₹{furnitureTotal?.toLocaleString() ?? '0'}
                 </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  // ============= FORM 9: HOSTESS (OPTIONAL) =============
  const renderHostess = () => {
    const hostessTotal = hostessRequirements.reduce((sum, h) => sum + h.amount, 0);

    return (
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">
            Temporary Staff / Hostess
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate/Day</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody>
              {hostessRequirements.map((hostess, index) => (
                <tr key={hostess.category}>
                  <td className="px-3 py-2 text-sm">Category {hostess.category}</td>
                  <td className="px-3 py-2 text-sm">
                    ₹{(hostess.ratePerDay || (hostess.category === 'A' ? 5000 : 4000)).toLocaleString()}
                   </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      value={hostess.quantity || ''}
                      onChange={(e) =>
                        handleHostessChange(index, 'quantity', parseInt(e.target.value) || 0)
                      }
                      className="w-16 border border-gray-200 rounded px-2 py-1 text-sm"
                    />
                   </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      value={hostess.noOfDays || ''}
                      onChange={(e) =>
                        handleHostessChange(index, 'noOfDays', parseInt(e.target.value) || 0)
                      }
                      className="w-16 border border-gray-200 rounded px-2 py-1 text-sm"
                    />
                   </td>
                  <td className="px-3 py-2 text-sm font-semibold">
                    ₹{hostess.amount.toLocaleString()}
                   </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={4} className="px-3 py-2 text-right text-sm font-semibold">Total:</td>
                <td className="px-3 py-2 text-sm font-bold text-blue-600">₹{hostessTotal.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm">
            <p className="font-semibold mb-3">Please Note:</p>
            <ul className="list-decimal pl-5 space-y-2">
              <li>All prices are current and subject to change without prior notice.</li>
              <li>The working hour for service is 8 hrs./person/day.</li>
              <li>No refund for any cancellation once the order is placed.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // ============= FORM 10: COMPRESSED AIR (OPTIONAL) =============
  const renderCompressedAir = () => {
    if (compressedAirOptions.length === 0) {
      return (
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <WrenchScrewdriverIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">Compressed Air</h2>
          </div>
          <div className="text-center py-8 text-gray-500">
            No compressed air options available at the moment.
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <WrenchScrewdriverIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">Compressed Air</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase"></th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">CFM Range</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Connection Cost</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Power</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total per Unit</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              {compressedAirOptions.map((option) => (
                <tr key={option.id} className="hover:bg-gray-50">
                  <td className="px-2 py-2">
                    <input
                      type="radio"
                      name="compressedAir"
                      checked={compressedAir.selected === option.cfmRange}
                      onChange={() => handleCompressedAirSelect(option)}
                      className="h-4 w-4 text-blue-600"
                    />
                   </td>
                  <td className="px-2 py-2 text-sm">{option.cfmRange}</td>
                  <td className="px-2 py-2 text-sm">₹{option.costPerConnection.toLocaleString()}</td>
                  <td className="px-2 py-2 text-sm">{option.powerKW} KW</td>
                  <td className="px-2 py-2 text-sm">₹{(option.costPerConnection + (option.powerKW * 3500)).toLocaleString()}</td>
                  <td className="px-2 py-2">
                    {compressedAir.selected === option.cfmRange && (
                      <input
                        type="number"
                        min="1"
                        value={compressedAir.qty}
                        onChange={(e) => handleCompressedAirQuantity(parseInt(e.target.value) || 1)}
                        className="w-16 border border-gray-200 rounded px-2 py-1 text-sm"
                      />
                    )}
                   </td>
                  <td className="px-2 py-2 text-sm">
                    {compressedAir.selected === option.cfmRange && (
                      <span className="font-semibold">₹{compressedAir.totalCost.toLocaleString()}</span>
                    )}
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ============= FORM 11: WATER CONNECTION (OPTIONAL) =============
  const renderWaterConnection = () => {
    const connections = waterConnection?.connections ?? 0;
    const costPerConnection = waterConnection?.costPerConnection ?? 0;
    const totalCost = waterConnection?.totalCost ?? 0;

    return (
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <TruckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">
            Water Connection
          </h2>
        </div>

        <div className="max-w-md">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. of Connections
              </label>
              <input
                type="number"
                min="0"
                value={connections || ''}
                onChange={(e) =>
                  setWaterConnection({
                    ...waterConnection,
                    connections: parseInt(e.target.value) || 0
                  })
                }
                className="w-24 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-sm">
              <p className="text-gray-600">Cost per connection: ₹{costPerConnection.toLocaleString()}</p>
              <p className="font-semibold text-blue-600 mt-1">Total: ₹{totalCost.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============= FORM 12: SECURITY GUARD (OPTIONAL) =============
  const renderSecurityGuard = () => (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">
          Security Guard
        </h2>
      </div>

      <div className="max-w-lg space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No. of Guards
            </label>
            <input
              type="number"
              min="0"
              value={securityGuard.quantity || ''}
              onChange={(e) =>
                setSecurityGuard({
                  ...securityGuard,
                  quantity: parseInt(e.target.value) || 0
                })
              }
              className="w-32 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Guards"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No. of Days
            </label>
            <input
              type="number"
              min="0"
              value={securityGuard.noOfDays || ''}
              onChange={(e) =>
                setSecurityGuard({
                  ...securityGuard,
                  noOfDays: parseInt(e.target.value) || 0
                })
              }
              className="w-32 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Days"
            />
          </div>
        </div>

        {securityGuard.quantity > 0 && securityGuard.noOfDays > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              Rate per guard per day: <span className="font-semibold">₹2,500</span>
            </p>
            <p className="mt-2 text-sm font-semibold">Total Cost: ₹{securityGuard.totalCost.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );

  // ============= FORM 13: RENTAL ITEMS (AV & IT) (OPTIONAL) =============
  const renderRentalItems = () => {
    const rentalTotal = Object.values(rentalItems).reduce((sum, item) => sum + (item.totalCost || 0), 0);

    if (Object.keys(rentalItems).length === 0) {
      return (
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ComputerDesktopIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">AV & IT Rentals</h2>
          </div>
          <div className="text-center py-8 text-gray-500">
            No rental items available at the moment.
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ComputerDesktopIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">AV & IT Rentals</h2>
          </div>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1.5 rounded-full">For 3 Days</span>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Cost for 3 Days</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total Cost</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(rentalItems).map(([key, item]) => (
                <tr key={key} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div 
                      className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        if (item.image) {
                          setSelectedImage({
                            src: item.image,
                            alt: item.description
                          });
                        }
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.description}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.jpg';
                          }}
                        />
                      ) : (
                        <PhotoIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                   </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">₹{(item.costFor3Days || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={item.quantity || ''}
                      onChange={(e) => handleRentalQuantity(key, parseInt(e.target.value) || 0)}
                      className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                   </td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                    ₹{(item.totalCost || 0).toLocaleString()}
                   </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={4} className="px-4 py-3 text-right text-sm font-bold text-gray-900">Total:</td>
                <td className="px-4 py-3 text-sm font-bold text-blue-600">₹{(rentalTotal || 0).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  // ============= FORM 14: HOUSEKEEPING STAFF (OPTIONAL) =============
  const renderHousekeepingStaff = () => {
    const chargesPerShift = housekeepingStaff?.chargesPerShift ?? 2000;
    const quantity = housekeepingStaff?.quantity ?? 0;
    const noOfDays = housekeepingStaff?.noOfDays ?? 0;
    const totalCost = housekeepingStaff?.totalCost ?? 0;

    return (
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">
              Housekeeping Staff
            </h2>
          </div>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full">
            Per Shift (10 Hrs)
          </span>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Charges per Shift</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">No. of Staff</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">No. of Days</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total Cost</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">Housekeeping</td>
                <td className="px-4 py-4 text-sm text-gray-900">₹{(chargesPerShift)?.toLocaleString() ?? '2,000'}</td>
                <td className="px-4 py-4">
                  <input
                    type="number"
                    min="0"
                    value={quantity || ""}
                    onChange={(e) =>
                      setHousekeepingStaff({
                        ...housekeepingStaff,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </td>
                <td className="px-4 py-4">
                  <input
                    type="number"
                    min="0"
                    value={noOfDays || ""}
                    onChange={(e) =>
                      setHousekeepingStaff({
                        ...housekeepingStaff,
                        noOfDays: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                                </td>
                <td className="px-4 py-4 text-sm font-semibold text-blue-600">
                  ₹{totalCost.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {quantity > 0 && noOfDays > 0 && (
          <div className="mt-4 bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              Calculation: {quantity} staff × {noOfDays} days × ₹{chargesPerShift.toLocaleString()} per shift = ₹{totalCost.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    );
  };

  // ============= PREVIEW & SUBMIT =============
  const renderPreview = () => {
    const totals = calculateTotals();

    return (
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <EyeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 ml-3">
              Preview & Submit
            </h2>
          </div>
          <button
            onClick={() => setShowPreview(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* General Information Summary */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p><span className="font-medium">Name:</span> {generalInfo.title} {generalInfo.firstName} {generalInfo.lastName}</p>
              <p><span className="font-medium">Designation:</span> {generalInfo.designation}</p>
              <p><span className="font-medium">Mobile:</span> {generalInfo.mobile}</p>
              <p><span className="font-medium">Email:</span> {generalInfo.email}</p>
              <p><span className="font-medium">Company:</span> {generalInfo.companyName}</p>
              <p><span className="font-medium">GST:</span> {generalInfo.gstNumber}</p>
              <p><span className="font-medium">Business Nature:</span> {generalInfo.businessNature}</p>
            </div>
          </div>

          {/* Booth Details Summary */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 mr-2 text-blue-500" />
              Booth & Contractor Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p><span className="font-medium">Booth No:</span> {boothDetails.boothNo}</p>
              <p><span className="font-medium">Sq Mtr Booked:</span> {boothDetails.sqMtrBooked}</p>
              <p><span className="font-medium">Exhibitor Name:</span> {boothDetails.exhibitorName}</p>
              <p><span className="font-medium">Organisation:</span> {boothDetails.organisation}</p>
              <p><span className="font-medium">Contact Person:</span> {boothDetails.contactPerson}</p>
              <p><span className="font-medium">Designation:</span> {boothDetails.designation}</p>
              <p><span className="font-medium">Mobile:</span> {boothDetails.mobile}</p>
              <p><span className="font-medium">Email:</span> {boothDetails.email}</p>
            </div>
            {(boothDetails.contractorCompany || boothDetails.contractorPerson) && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="font-medium text-gray-700 mb-2">Contractor Details:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium">Contractor Company:</span> {boothDetails.contractorCompany || 'N/A'}</p>
                  <p><span className="font-medium">Contractor Person:</span> {boothDetails.contractorPerson || 'N/A'}</p>
                  <p><span className="font-medium">Contractor Mobile:</span> {boothDetails.contractorMobile || 'N/A'}</p>
                  <p><span className="font-medium">Contractor Email:</span> {boothDetails.contractorEmail || 'N/A'}</p>
                  <p><span className="font-medium">Contractor GST:</span> {boothDetails.contractorGST || 'N/A'}</p>
                  <p><span className="font-medium">Contractor PAN:</span> {boothDetails.contractorPAN || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Security Deposit Summary */}
          {securityDeposit.boothSq && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <BanknotesIcon className="h-5 w-5 mr-2 text-blue-500" />
                Security Deposit
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium">Booth Sq Category:</span> {securityDeposit.boothSq}</p>
                <p><span className="font-medium">Amount (INR):</span> ₹{securityDeposit.amountINR.toLocaleString()}</p>
                <p><span className="font-medium">Amount (USD):</span> ${securityDeposit.amountUSD}</p>
              </div>
            </div>
          )}

          {/* Machines Summary */}
          {machines.filter(m => m.machineName.trim()).length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <CubeIcon className="h-5 w-5 mr-2 text-blue-500" />
                Machines Display
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1 text-left">Sr</th>
                      <th className="px-2 py-1 text-left">Machine Name</th>
                      <th className="px-2 py-1 text-left">Dimensions (W×L×H)</th>
                      <th className="px-2 py-1 text-left">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {machines.filter(m => m.machineName.trim()).map((m) => (
                      <tr key={m.srNo}>
                        <td className="px-2 py-1">{m.srNo}</td>
                        <td className="px-2 py-1">{m.machineName}</td>
                        <td className="px-2 py-1">{m.width}×{m.length}×{m.height} m</td>
                        <td className="px-2 py-1">{m.weight} Tons</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Personnel Summary */}
          {personnel.filter(p => p.name.trim()).length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
                Exhibitor Passes
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1 text-left">Sr</th>
                      <th className="px-2 py-1 text-left">Name</th>
                      <th className="px-2 py-1 text-left">Designation</th>
                      <th className="px-2 py-1 text-left">Organisation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personnel.filter(p => p.name.trim()).map((p) => (
                      <tr key={p.srNo}>
                        <td className="px-2 py-1">{p.srNo}</td>
                        <td className="px-2 py-1">{p.name}</td>
                        <td className="px-2 py-1">{p.designation}</td>
                        <td className="px-2 py-1">{p.organisation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Company Details Summary */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 mr-2 text-blue-500" />
              Company Details (Exhibitor's Guide)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p><span className="font-medium">Company Name:</span> {companyDetails.companyName}</p>
              <p><span className="font-medium">Address:</span> {companyDetails.address}</p>
              <p><span className="font-medium">Telephone:</span> {companyDetails.telephone}</p>
              <p><span className="font-medium">Mobile:</span> {companyDetails.mobile}</p>
              <p><span className="font-medium">Email:</span> {companyDetails.email}</p>
              <p><span className="font-medium">Website:</span> {companyDetails.website}</p>
              <p><span className="font-medium">Contact Person:</span> {companyDetails.contactPerson}</p>
              <p><span className="font-medium">Designation:</span> {companyDetails.designation}</p>
            </div>
            {companyDetails.productsServices && (
              <p className="mt-2 text-sm"><span className="font-medium">Products/Services:</span> {companyDetails.productsServices}</p>
            )}
          </div>

          {/* Services Summary */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <BoltIcon className="h-5 w-5 mr-2 text-blue-500" />
              Services & Add-ons
            </h3>
            
            {/* Electrical Load */}
            {(electricalLoad.temporaryTotal > 0 || electricalLoad.exhibitionTotal > 0) && (
              <div className="mb-3">
                <p className="font-medium text-gray-700">Electrical Load:</p>
                {electricalLoad.temporaryTotal > 0 && (
                  <p className="text-sm ml-4">Temporary Load: {electricalLoad.temporaryLoad} KW - ₹{electricalLoad.temporaryTotal.toLocaleString()}</p>
                )}
                {electricalLoad.exhibitionTotal > 0 && (
                  <p className="text-sm ml-4">Exhibition Load: {electricalLoad.exhibitionLoad} KW - ₹{electricalLoad.exhibitionTotal.toLocaleString()}</p>
                )}
              </div>
            )}

            {/* Furniture */}
            {furnitureItems.filter(f => f.quantity > 0).length > 0 && (
              <div className="mb-3">
                <p className="font-medium text-gray-700">Furniture:</p>
                {furnitureItems.filter(f => f.quantity > 0).map((f, idx) => (
                  <p key={idx} className="text-sm ml-4">{f.description} × {f.quantity} - ₹{f.cost.toLocaleString()}</p>
                ))}
              </div>
            )}

            {/* Hostess */}
            {hostessRequirements.filter(h => h.quantity > 0).length > 0 && (
              <div className="mb-3">
                <p className="font-medium text-gray-700">Hostess/Temporary Staff:</p>
                {hostessRequirements.filter(h => h.quantity > 0).map((h, idx) => (
                  <p key={idx} className="text-sm ml-4">Category {h.category}: {h.quantity} staff × {h.noOfDays} days - ₹{h.amount.toLocaleString()}</p>
                ))}
              </div>
            )}

            {/* Compressed Air */}
            {compressedAir.selected && compressedAir.qty > 0 && (
              <div className="mb-3">
                <p className="font-medium text-gray-700">Compressed Air:</p>
                <p className="text-sm ml-4">{compressedAir.cfmRange} - {compressedAir.qty} connection(s) - ₹{compressedAir.totalCost.toLocaleString()}</p>
              </div>
            )}

            {/* Water Connection */}
            {waterConnection.connections > 0 && (
              <div className="mb-3">
                <p className="font-medium text-gray-700">Water Connection:</p>
                <p className="text-sm ml-4">{waterConnection.connections} connection(s) - ₹{waterConnection.totalCost.toLocaleString()}</p>
              </div>
            )}

            {/* Security Guard */}
            {securityGuard.quantity > 0 && securityGuard.noOfDays > 0 && (
              <div className="mb-3">
                <p className="font-medium text-gray-700">Security Guard:</p>
                <p className="text-sm ml-4">{securityGuard.quantity} guard(s) × {securityGuard.noOfDays} days - ₹{securityGuard.totalCost.toLocaleString()}</p>
              </div>
            )}

            {/* Rental Items */}
            {Object.values(rentalItems).filter(r => r.quantity > 0).length > 0 && (
              <div className="mb-3">
                <p className="font-medium text-gray-700">AV & IT Rentals:</p>
                {Object.values(rentalItems).filter(r => r.quantity > 0).map((r, idx) => (
                  <p key={idx} className="text-sm ml-4">{r.description} × {r.quantity} - ₹{r.totalCost.toLocaleString()}</p>
                ))}
              </div>
            )}

            {/* Housekeeping */}
            {housekeepingStaff.quantity > 0 && housekeepingStaff.noOfDays > 0 && (
              <div className="mb-3">
                <p className="font-medium text-gray-700">Housekeeping Staff:</p>
                <p className="text-sm ml-4">{housekeepingStaff.quantity} staff × {housekeepingStaff.noOfDays} days - ₹{housekeepingStaff.totalCost.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <CreditCardIcon className="h-5 w-5 mr-2 text-blue-500" />
              Payment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p><span className="font-medium">Payment Mode:</span> {paymentDetails.paymentMode}</p>
              <p><span className="font-medium">Bank Name:</span> {paymentDetails.bankName || 'N/A'}</p>
              <p><span className="font-medium">Transaction ID:</span> {paymentDetails.transactionId || 'N/A'}</p>
              <p><span className="font-medium">Transaction Date:</span> {paymentDetails.transactionDate || 'N/A'}</p>
              <p><span className="font-medium">Amount Paid:</span> ₹{paymentDetails.amount?.toLocaleString() || '0'}</p>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Cost Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Services Total:</span>
                <span>₹{totals.servicesTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>₹{totals.gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal (Services + GST):</span>
                <span>₹{totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit:</span>
                <span>₹{totals.deposit.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">₹{totals.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
            <button
              onClick={() => setShowPreview(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Edit
            </button>
            <button
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============= PAYMENT MODAL =============
  const renderPaymentModal = () => {
    if (!showPayment) return null;

    const totals = calculateTotals();

    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Payment Details</h2>
            <button
              onClick={() => setShowPayment(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Amount Due</p>
              <p className="text-2xl font-bold text-blue-600">₹{totals.total.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentDetails.paymentMode}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentMode: e.target.value as any })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm"
                >
                  <option value="RTGS">RTGS</option>
                  <option value="NEFT">NEFT</option>
                  <option value="IMPS">IMPS</option>
                  <option value="UPI">UPI</option>
                  <option value="Cheque">Cheque</option>
                  <option value="DD">DD</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={paymentDetails.bankName}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, bankName: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm"
                  placeholder="Enter bank name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID / Reference No.
                </label>
                <input
                  type="text"
                  value={paymentDetails.transactionId}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm"
                  placeholder="Enter transaction ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={paymentDetails.transactionDate}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Paid
                </label>
                <input
                  type="number"
                  value={paymentDetails.amount || ''}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Payment Receipt
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handlePaymentFileUpload}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Upload screenshot or scan of payment proof</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit & Proceed'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============= CASHFREE PAYMENT MODAL =============
const renderCashfreePayment = () => {
  if (!showCashfree || !cashfreeInvoiceId || !cashfreeRequirementsId) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Complete Payment</h2>
          <button
            onClick={() => setShowCashfree(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <CashfreePayment
            invoiceId={cashfreeInvoiceId}
            amount={cashfreeAmount}
            requirementsId={cashfreeRequirementsId}
            onSuccess={handleCashfreeSuccess}
            onFailure={handleCashfreeFailure}
          />
        </div>
      </div>
    </div>
  );
};

  // ============= MAIN RENDER =============
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Exhibitor Requirements
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Fill in your requirements for the exhibition
              </p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <MenuIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Steps Navigation */}
          <div className={`lg:w-64 flex-shrink-0 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-20">
              <div className="flex flex-wrap lg:flex-col gap-2">
                {steps.map((step) => {
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;
                  const Icon = step.icon;

                  return (
                    <button
                      key={step.number}
                      onClick={() => {
                        setCurrentStep(step.number);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : isCompleted
                          ? 'text-green-600 hover:bg-gray-50'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isCompleted ? <CheckCircleIcon className="h-4 w-4" /> : step.number}
                      </div>
                      <span className="hidden sm:inline text-sm">{step.name}</span>
                      <span className="sm:hidden text-sm">{step.mobileName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {!showPreview ? (
              <>
                {/* Step Content */}
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

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Previous
                  </button>
                  {currentStep < totalSteps ? (
                    <button
                      onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Next
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowPreview(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <EyeIcon className="h-4 w-4" />
                      Preview & Submit
                    </button>
                  )}
                </div>
              </>
            ) : (
              renderPreview()
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {renderImageModal()}
      {renderPaymentModal()}
      {renderCashfreePayment()}
    </div>
  );
}