import React, { useState } from 'react';
import { useInvoices } from './useInvoices';

interface FormState {
  providerName: string;
  providerAddress: string;
  providerSiret: string;
  providerVat: string;
  clientName: string;
  clientAddress: string;
  clientSiret: string;
  clientVat: string;
  serviceTitle: string;
  location: string;
  serviceDate: string;
  time: string;
  attendees: string;
  amountHT: string;
  vatRate: string;
  amountTTC: string;
}

const emptyForm: FormState = {
  providerName: '',
  providerAddress: '',
  providerSiret: '',
  providerVat: '',
  clientName: '',
  clientAddress: '',
  clientSiret: '',
  clientVat: '',
  serviceTitle: '',
  location: '',
  serviceDate: '',
  time: '',
  attendees: '',
  amountHT: '',
  vatRate: '20',
  amountTTC: '',
};

export function InvoicePage() {
  const { invoices, createInvoice, togglePaid } = useInvoices();
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState<ReturnType<typeof createInvoice> | null>(null);
  const [activeTab, setActiveTab] = useState<'unpaid' | 'paid'>('unpaid');

  const updateFromHT = (htValue: string, rateValue: string) => {
    const ht = parseFloat(htValue);
    const rate = parseFloat(rateValue) || 0;
    if (!isNaN(ht)) {
      const ttc = ht + (ht * rate) / 100;
      setForm(prev => ({ ...prev, amountHT: htValue, amountTTC: ttc.toFixed(2) }));
    } else {
      setForm(prev => ({ ...prev, amountHT: htValue, amountTTC: '' }));
    }
  };

  const updateFromTTC = (ttcValue: string, rateValue: string) => {
    const ttc = parseFloat(ttcValue);
    const rate = parseFloat(rateValue) || 0;
    if (!isNaN(ttc)) {
      const ht = ttc / (1 + rate / 100);
      setForm(prev => ({ ...prev, amountTTC: ttcValue, amountHT: ht.toFixed(2) }));
    } else {
      setForm(prev => ({ ...prev, amountTTC: ttcValue, amountHT: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'amountHT') {
      updateFromHT(value, form.vatRate);
    } else if (name === 'amountTTC') {
      updateFromTTC(value, form.vatRate);
    } else if (name === 'vatRate') {
      updateFromHT(form.amountHT, value);
      setForm(prev => ({ ...prev, vatRate: value }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const required = ['providerName','providerAddress','clientName','clientAddress','serviceTitle','location','serviceDate','time','amountHT'];
    const newErrors: Record<string, boolean> = {};
    required.forEach(f => { if (!form[f as keyof FormState]) newErrors[f] = true; });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    const invoice = createInvoice(form);
    setPreview(invoice);
    setShowPreview(true);
    setForm({ ...emptyForm });
  };

  const filtered = invoices.filter(i => i.isPaid === (activeTab === 'paid'));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Factures</h1>
      <div className="flex border-b mb-6 space-x-4">
        <button
          className={`pb-2 ${activeTab==='unpaid'?'border-b-2 border-primary font-semibold':''}`}
          onClick={() => setActiveTab('unpaid')}
        >Factures non acquittées</button>
        <button
          className={`pb-2 ${activeTab==='paid'?'border-b-2 border-primary font-semibold':''}`}
          onClick={() => setActiveTab('paid')}
        >Factures acquittées</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold mb-2">Prestataire</h2>
            <input
              type="text"
              name="providerName"
              placeholder="Nom"
              value={form.providerName}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 mb-2 ${errors.providerName?'border-red-500':'border-gray-300'}`}
            />
            <input
              type="text"
              name="providerAddress"
              placeholder="Adresse"
              value={form.providerAddress}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 mb-2 ${errors.providerAddress?'border-red-500':'border-gray-300'}`}
            />
            <input
              type="text"
              name="providerSiret"
              placeholder="SIRET"
              value={form.providerSiret}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
            />
            <input
              type="text"
              name="providerVat"
              placeholder="TVA"
              value={form.providerVat}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <h2 className="font-semibold mb-2">Client</h2>
            <input
              type="text"
              name="clientName"
              placeholder="Nom"
              value={form.clientName}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 mb-2 ${errors.clientName?'border-red-500':'border-gray-300'}`}
            />
            <input
              type="text"
              name="clientAddress"
              placeholder="Adresse"
              value={form.clientAddress}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 mb-2 ${errors.clientAddress?'border-red-500':'border-gray-300'}`}
            />
            <input
              type="text"
              name="clientSiret"
              placeholder="SIRET"
              value={form.clientSiret}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
            />
            <input
              type="text"
              name="clientVat"
              placeholder="TVA"
              value={form.clientVat}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold mb-2">Prestation</h2>
            <input
              type="text"
              name="serviceTitle"
              placeholder="Titre"
              value={form.serviceTitle}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 mb-2 ${errors.serviceTitle?'border-red-500':'border-gray-300'}`}
            />
            <input
              type="text"
              name="location"
              placeholder="Lieu"
              value={form.location}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 mb-2 ${errors.location?'border-red-500':'border-gray-300'}`}
            />
            <input
              type="date"
              name="serviceDate"
              value={form.serviceDate}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 mb-2 ${errors.serviceDate?'border-red-500':'border-gray-300'}`}
            />
            <input
              type="text"
              name="time"
              placeholder="Horaires"
              value={form.time}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 mb-2 ${errors.time?'border-red-500':'border-gray-300'}`}
            />
            <input
              type="text"
              name="attendees"
              placeholder="Effectif"
              value={form.attendees}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <h2 className="font-semibold mb-2">Facturation</h2>
            <input
              type="number"
              step="0.01"
              name="amountHT"
              placeholder="Montant HT"
              value={form.amountHT}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 mb-2 ${errors.amountHT?'border-red-500':'border-gray-300'}`}
            />
            <select
              name="vatRate"
              value={form.vatRate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
            >
              <option value="0">0 %</option>
              <option value="5.5">5,5 %</option>
              <option value="10">10 %</option>
              <option value="20">20 %</option>
            </select>
            <input
              type="number"
              step="0.01"
              name="amountTTC"
              placeholder="Montant TTC"
              value={form.amountTTC}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">Prévisualiser</button>
      </form>

      {showPreview && preview && (
        <div className="bg-white p-6 shadow border mb-8" id="invoice-preview">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Facture {preview.number}</h2>
            <span>Date: {preview.serviceDate}</span>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Prestataire</h3>
            <p>{preview.providerName}</p>
            <p>{preview.providerAddress}</p>
            {preview.providerSiret && <p>SIRET: {preview.providerSiret}</p>}
            {preview.providerVat && <p>TVA: {preview.providerVat}</p>}
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Client</h3>
            <p>{preview.clientName}</p>
            <p>{preview.clientAddress}</p>
            {preview.clientSiret && <p>SIRET: {preview.clientSiret}</p>}
            {preview.clientVat && <p>TVA: {preview.clientVat}</p>}
          </div>
          <p className="mb-2"><strong>Prestation:</strong> {preview.serviceTitle} - {preview.location}</p>
          <p className="mb-4">Horaire: {preview.time} - Effectif: {preview.attendees}</p>
          <table className="w-full text-left mb-4 border border-gray-300">
            <thead>
              <tr className="border-b">
                <th className="p-2">HT</th>
                <th className="p-2">TVA ({preview.vatRate}%)</th>
                <th className="p-2">TTC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">{preview.amountHT} €</td>
                <td className="p-2">{preview.vatAmount} €</td>
                <td className="p-2">{preview.amountTTC} €</td>
              </tr>
            </tbody>
          </table>
          <div className="text-right">
            <button type="button" onClick={() => window.print()} className="bg-primary text-white px-4 py-2 rounded-lg">Imprimer</button>
          </div>
        </div>
      )}

      <div>
        {filtered.map(inv => (
          <div key={inv.id} className="flex items-center justify-between border-b py-2">
            <span>{inv.number} - {inv.clientName} - {inv.amountTTC} €</span>
            <button
              onClick={() => togglePaid(inv.id)}
              className="text-sm text-primary"
            >{inv.isPaid ? 'Marquer non acquittée' : 'Marquer comme acquittée'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
