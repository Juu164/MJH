import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNotifications } from './useNotifications';
import { getItem, setItem } from './storage';

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
  const seqStr = localStorage.getItem('invoiceSeq');
  const seq = (seqStr ? parseInt(seqStr, 10) : 0) + 1;
  localStorage.setItem('invoiceSeq', seq.toString());
  return `${year}-${String(seq).padStart(4, '0')}`;
}

export function InvoicesProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  useEffect(() => {
    getItem<Invoice[]>('invoices').then(data => {
      if (data) setInvoices(data);
    });
  }, []);
  const { add, remove } = useNotifications();

  useEffect(() => {
    setItem('invoices', invoices);
    invoices.forEach(inv => {
      const notifId = `invoice-${inv.id}`;
      const due = new Date(inv.serviceDate);
      due.setDate(due.getDate() + 30);
      if (!inv.isPaid && new Date() > due) {
        add({
          id: notifId,
          message: `Facture ${inv.number} en retard`,
          date: new Date().toISOString(),
          link: `/invoice#inv-${inv.id}`,
        });
      } else {
        remove(notifId);
      }
    });
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
    const due = new Date(invoice.serviceDate);
    due.setDate(due.getDate() + 30);
    if (new Date() > due) {
      add({
        id: `invoice-${invoice.id}`,
        message: `Facture ${invoice.number} en retard`,
        date: new Date().toISOString(),
        link: `/invoice#inv-${invoice.id}`,
      });
    }
    return invoice;
  };

  const togglePaid = (id: string) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === id) {
          const updated = { ...inv, isPaid: !inv.isPaid };
          if (updated.isPaid) {
            remove(`invoice-${inv.id}`);
          }
          return updated;
        }
        return inv;
      })
    );
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
