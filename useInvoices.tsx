import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Invoice {
  id: string;
  number: string;
  providerName: string;
  providerAddress: string;
  providerSiret?: string;
  providerVat?: string;
  clientName: string;
  clientAddress: string;
  clientSiret?: string;
  clientVat?: string;
  serviceTitle: string;
  location: string;
  serviceDate: string;
  time: string;
  attendees: string;
  amountHT: string;
  vatRate: string;
  vatAmount: string;
  amountTTC: string;
  isPaid: boolean;
}

interface InvoicesCtx {
  invoices: Invoice[];
  createInvoice: (data: Omit<Invoice, 'id' | 'number' | 'isPaid' | 'vatAmount'>) => Invoice;
  togglePaid: (id: string) => void;
}

const InvoicesContext = createContext<InvoicesCtx | undefined>(undefined);

function generateNumber() {
  const year = new Date().getFullYear();
  const seq = parseInt(localStorage.getItem('invoiceSeq') || '0', 10) + 1;
  localStorage.setItem('invoiceSeq', seq.toString());
  return `${year}-${String(seq).padStart(4, '0')}`;
}

export function InvoicesProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const stored = localStorage.getItem('invoices');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const createInvoice = (data: Omit<Invoice, 'id' | 'number' | 'isPaid' | 'vatAmount'>): Invoice => {
    const ht = parseFloat(data.amountHT);
    const rate = parseFloat(data.vatRate);
    const vatAmount = (ht * rate) / 100;
    const invoice: Invoice = {
      ...data,
      vatAmount: vatAmount.toFixed(2),
      id: Math.random().toString(36).slice(2, 9),
      number: generateNumber(),
      isPaid: false,
    };
    setInvoices(prev => [...prev, invoice]);
    return invoice;
  };

  const togglePaid = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, isPaid: !inv.isPaid } : inv));
  };

  return (
    <InvoicesContext.Provider value={{ invoices, createInvoice, togglePaid }}>
      {children}
    </InvoicesContext.Provider>
  );
}

export function useInvoices() {
  const ctx = useContext(InvoicesContext);
  if (!ctx) throw new Error('useInvoices must be used within InvoicesProvider');
  return ctx;
}
