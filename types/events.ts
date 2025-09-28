// Tipos de datos para TypeScript
export interface Event {
  id: string;
  code: string;
  title: string;
  time: string;
  location: string;
  station: string;
  products : Products[]
  status: STATUS_EVENTS['status'];
}

export interface TabOption {
  key: string;
  label: string;
}

export interface Products {
  name: string,
  assign: number,
  type: 'Liquor' | 'Wine' | 'Beer';
}


export type EventsCaptain = {
  id: string;
  title: string;
  // location: string;
  // time: string;
  room: string;
  status: 'LIVE' | 'PLANNED';
  // Campos nuevos agregados
  beo: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  headcount: number;
  tier: string;
  service?: string;
  stations?: string;
};

export interface Invoice {
    id : string;
    status : STATUS_INVOICE['status'];
    title : string;
    location: string;
    date: string;
    total: string; 
}

export interface AccordionSection {
  id: string;
  title: string;
  subtitle: string;
  content?: React.ReactNode;
  isExpandable?: boolean;
}
export interface TeamMember {
  name: string;
  role: string;
  shift?: string;
}

export interface InventoryItem {
  name: string;
  status: 'in-stock' | 'under-par';
  category?: string;
}
export interface EventDetails {
  id: string;
  title: string;
  venue: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'LIVE' | 'PLANNED';
  guestCount: number;
  captain: string;
  eventType?: string;
  serviceStyle?: string;
  duration?: string;
}

//  export interface InvoiceItem {
//   id: string;
//   category: string;
//   sku: string;
//   unitPrice: string;
//   quantity: string;
//   sales: string;
//   comp: string;
//   net: string;
// }

export interface InvoiceItem {
  id: string;
  category: string;
  sku: string;
  unitPrice: number; // Cambiado a number para cálculos
  quantity: number;   // Cambiado a number para cálculos
  sales: number;      // Calculado automáticamente
  comp: number;       // Cambiado a number para cálculos
  net: number;        // Calculado automáticamente
}

export interface InvoiceData {
  invoiceId: string;
  companyName: string;
  eventDate: string;
  geo: string;
  location: string;
  tier: string;
  serviceChargeRate: number; // 0.20 para 20%
  taxRate: number;           // 0.07 para 7%
  items: InvoiceItem[];
}

export interface InvoiceSummary {
  subtotal: number;
  serviceCharge: number;
  tax: number;
  total: number;
}


export interface STATUS_INVOICE{
  status: 'EXPORTED' | 'WAITING CLOSEOUT' | 'READY' | 'DRAFT';
}
export interface STATUS_EVENTS{
  status: 'LIVE' | 'PENDING' | 'CLOSED' | 'PLANNED';
}

export interface InvoiceDetailData {
  invoiceId: string;
  companyName: string;
  eventDate: string;
  geo: string;
  location: string;
  tier: string;
  serviceChargeRate: number;
  taxRate: number;
  items: InvoiceItem[];
}