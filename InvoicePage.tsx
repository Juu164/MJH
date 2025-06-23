import React from 'react';
import { InvoiceWizard } from './InvoiceWizard';
import { useInvoices } from './useInvoices';

export function InvoicePage() {
  const { invoices, togglePaid } = useInvoices();
  const unpaid = invoices.filter(i => !i.isPaid);
  const paid = invoices.filter(i => i.isPaid);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Factures</h1>
      <InvoiceWizard />

      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Factures non acquittées</h2>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 text-left">Numéro</th>
              <th className="p-2 text-left">Client</th>
              <th className="p-2 text-left">Montant TTC</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {unpaid.map(inv => (
              <tr key={inv.id} className="border-t">
                <td className="p-2">{inv.number}</td>
                <td className="p-2">{inv.clientName}</td>
                <td className="p-2">{inv.amountTTC} €</td>
                <td className="p-2">{inv.serviceDate}</td>
                <td className="p-2 text-right">
                  <button
                    onClick={() => togglePaid(inv.id)}
                    className="text-sm text-primary underline"
                  >
                    Marquer acquittée
                  </button>
                </td>
              </tr>
            ))}
            {!unpaid.length && (
              <tr>
                <td colSpan={5} className="p-2 text-center text-gray-500">
                  Aucune facture
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <details>
        <summary className="cursor-pointer text-xl font-semibold mt-4">
          Factures acquittées
        </summary>
        <table className="w-full border text-sm mt-2">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 text-left">Numéro</th>
              <th className="p-2 text-left">Client</th>
              <th className="p-2 text-left">Montant TTC</th>
              <th className="p-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {paid.map(inv => (
              <tr key={inv.id} className="border-t">
                <td className="p-2">{inv.number}</td>
                <td className="p-2">{inv.clientName}</td>
                <td className="p-2">{inv.amountTTC} €</td>
                <td className="p-2">{inv.serviceDate}</td>
              </tr>
            ))}
            {!paid.length && (
              <tr>
                <td colSpan={4} className="p-2 text-center text-gray-500">
                  Aucune facture
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </details>
    </div>
  );
}
