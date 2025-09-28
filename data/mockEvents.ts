import { Event } from "@/types/events";
import { EventsCaptain, Invoice } from "@/types/events";

export const mockEvents: Event[] = [
  {
    id: '1',
    code: 'BIOS 152,429',
    title: 'FL Forestry Assoc',
    time: '6:00 PM',
    location: 'Terrace',
    station: 'Station EB1 • Jay Soncha',
    status: 'LIVE',
    products: [
      { name: 'Whiskey', assign: 120, type: 'Liquor' },
      { name: 'Cabernet Sauvignon', assign: 80, type: 'Wine' },
      { name: 'IPA Beer', assign: 200, type: 'Beer' },
    ],
  },
  {
    id: '2',
    code: 'BIOS 162,310',
    title: 'Corporate Welcome',
    time: '8:30 PM',
    location: 'Terrace',
    station: 'Station EB2 • Alex',
    status: 'PENDING',
    products: [
      { name: 'Vodka', assign: 150, type: 'Liquor' },
      { name: 'Merlot', assign: 60, type: 'Wine' },
    ],
  },
  {
    id: '3',
    code: 'BIOS 149,880',
    title: 'Wedding Afterparty',
    time: '4:00 PM',
    location: 'Beach Bar',
    station: 'Station EB3 • Kim',
    status: 'CLOSED',
    products: [
      { name: 'Chardonnay', assign: 90, type: 'Wine' },
      { name: 'Lager Beer', assign: 300, type: 'Beer' },
    ],
  },
];


// export const mockEventsCaptain: EventsCaptain[] = [
//   {
//     id: '1',
//     title: 'BEO 152,429 • FL Forestry Assoc',
//     location: 'Ballroom A',
//     time: '6:00 PM',
//     room: 'EB1, EB2',
//     status: 'LIVE',
//   },
//   {
//     id: '2',
//     title: 'BEO 152,530 • Wedding - Hudson',
//     location: 'Beach Club',
//     time: '4:30 PM',
//     room: 'BC2',
//     status: 'PLANNED',
//   },
//   {
//     id: '3',
//     title: 'BEO 152,112 • Corporate Mixer',
//     location: 'Linkside',
//     time: '7:00 PM',
//     room: 'LK1',
//     status: 'LIVE',
//   },
//   {
//     id: '4',
//     title: 'BEO 152,678 • Tech Expo 2025',
//     location: 'Convention Center',
//     time: '9:00 AM',
//     room: 'CC1',
//     status: 'PLANNED',
//   },
//   {
//     id: '5',
//     title: 'BEO 152,789 • Charity Gala Dinner',
//     location: 'Grand Ballroom',
//     time: '8:00 PM',
//     room: 'GB1',
//     status: 'LIVE',
//   },
// ];

export const invoices : Invoice[] = [
  {
    id: "INV-001",
    title: "FL Forestry Association",
    location: "Ballroom A",
    date: "Thu Aug 28 • 6:00 PM",
    status: "DRAFT",
    total: "$10,738.65",
  },
  {
    id: "INV-002",
    title: "Wedding – Rivera",
    location: "Beach Club 1",
    date: "Fri Aug 29 • 5:00 PM",
    status: "WAITING CLOSEOUT",
    total: "$12,310.00",
  },
  {
    id: "INV-003",
    title: "Corporate – TechNova",
    location: "Grand Lawn",
    date: "Sat Aug 30 • 7:00 PM",
    status: "EXPORTED",
    total: "$18,942.40",
  },
  {
    id: "INV-004",
    title: "Birthday – Mia P.",
    location: "Ballroom B",
    date: "Sat Aug 30 • 1:00 PM",
    status: "READY",
    total: "$4,824.00",
  },
];

export const mockEventsCaptain : EventsCaptain[] = [
  {
    id: '1',
    beo: 'BEO-001',
    title: 'Corporate Gala 2024',
    venue: 'Grand Ballroom',
    date: new Date().toISOString().split('T')[0], // Hoy
    startTime: '18:00',
    endTime: '23:00',
    headcount: 250,
    tier: 'Premium',
    status: "LIVE",
    room: 'GB1',
  },
  {
    id: '2', 
    beo: 'BEO-002',
    title: 'Wedding Reception',
    venue: 'Garden Terrace',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Mañana
    startTime: '19:00',
    endTime: '01:00',
    headcount: 150,
    tier: 'Standard',
    status: 'PLANNED',
    room: 'GT1',
  },
  {
    id: '3',
    beo: 'BEO-003', 
    title: 'Tech Conference',
    venue: 'Convention Center',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // En 3 días
    startTime: '09:00',
    endTime: '17:00',
    headcount: 500,
    tier: 'Premium',
    status: 'LIVE',
    room: 'CC1'
  },
  {
    id: '4',
    beo: 'BEO-004',
    title: 'Birthday Party',
    venue: 'Private Room A',
    date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0], // En 10 días
    startTime: '15:00',
    endTime: '20:00', 
    headcount: 80,
    tier: 'Standard',
    status: 'PLANNED',
    room: 'PR1'
  }
];

import { InvoiceData } from '@/types/events';

export const invoicesDatabase: Record<string, InvoiceData> = {
  "INV-001": {
    invoiceId: "INV-001",
    companyName: "FL Forestry Association",
    eventDate: "May 28 • 6:30 PM",
    geo: "GEO 132,429",
    location: "Ballroom A",
    tier: "PREMIUM",
    serviceChargeRate: 0.20,
    taxRate: 0.07,
    items: [
      {
        id: '1',
        category: 'Spirits',
        sku: "Tito's",
        unitPrice: 9.00,
        quantity: 125,
        sales: 0, // Se calculará
        comp: 0,
        net: 0    // Se calculará
      },
      {
        id: '2',
        category: 'Champagne',
        sku: '#Drinks',
        unitPrice: 22.00,
        quantity: 5,
        sales: 0,
        comp: 0,
        net: 0
      },
      {
        id: '3',
        category: 'Beer',
        sku: '',
        unitPrice: 6.00,
        quantity: 20,
        sales: 0,
        comp: 2,
        net: 0
      },
      {
        id: '4',
        category: 'Wine',
        sku: '',
        unitPrice: 9.00,
        quantity: 0,
        sales: 0,
        comp: 0,
        net: 0
      },
      {
        id: '5',
        category: 'NA / Mixers',
        sku: '',
        unitPrice: 0.00,
        quantity: 0,
        sales: 0,
        comp: 0,
        net: 0
      }
    ]
  },
  "INV-002": {
    invoiceId: "INV-002",
    companyName: "Tech Conference Miami",
    eventDate: "June 15 • 7:00 PM",
    geo: "GEO 145,892",
    location: "Convention Hall B",
    tier: "STANDARD",
    serviceChargeRate: 0.18,
    taxRate: 0.075,
    items: [
      {
        id: '1',
        category: 'Spirits',
        sku: "Vodka Premium",
        unitPrice: 12.00,
        quantity: 80,
        sales: 0,
        comp: 5,
        net: 0
      },
      {
        id: '2',
        category: 'Wine',
        sku: 'Cabernet',
        unitPrice: 15.00,
        quantity: 30,
        sales: 0,
        comp: 2,
        net: 0
      }
    ]
  }
};