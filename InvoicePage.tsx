import React from 'react';
import { InvoiceWizard } from './InvoiceWizard';

export function InvoicePage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Factures</h1>
      <InvoiceWizard />
    </div>
  );
}
