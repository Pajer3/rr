// Gedeelde types voor het factuursysteem.

export interface Company {
  name: string;
  tagline: string;
  contactName: string;
  addressLine: string;
  postcodeCity: string;
  phone: string;
  email: string;
  iban: string;
  accountHolder: string;
  btwNumber: string;
  kvkNumber: string;
  btwRate: number;
  numberPrefix: string;
  nextNumber: number;
  descriptions: Record<string, string>;
  tariefLabel: string;
  paymentTermDays: number;
  signatureRole?: string;
  logoDataUri?: string;
}

export interface Customer {
  id?: string;
  customerNo?: number | null;
  name: string;
  addressLines?: string[];
  email?: string;
  type?: string;
  emailMessage?: string;
}

export interface InvoiceItem {
  day?: number | null;
  month?: number | null;
  year?: number;
  dateText?: string;
  type?: string;
  amount: number;
  sortKey?: number;
}

export type InvoiceStatus = 'klaar' | 'verzonden' | 'betaald';

export interface InvoiceLog {
  number: string;
  date: string;
  customer: string;
  total: number;
  paymentTermDays?: number;
  file: string;
  status?: InvoiceStatus;
  createdAt?: string;
  sentAt?: string | null;
  paidAt?: string | null;
  recipient?: string;
}

export interface Totals {
  subtotal: number;
  btw: number;
  total: number;
}
