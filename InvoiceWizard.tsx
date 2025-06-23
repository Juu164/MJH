import React, { useState } from 'react';
import { useInvoices } from './useInvoices';

export function InvoiceWizard() {
  const { createInvoice } = useInvoices();
  const [step, setStep] = useState(1);
  const [advanced, setAdvanced] = useState(false);
  const [form, setForm] = useState({
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
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createInvoice(form);
    setStep(1);
    setForm({
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
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {step === 1 && (
        <div className="space-y-2">
          <h2 className="font-semibold">Prestataire</h2>
          <input type="text" name="providerName" placeholder="Nom" value={form.providerName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <input type="text" name="providerAddress" placeholder="Adresse" value={form.providerAddress} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <input type="text" name="providerSiret" placeholder="SIRET" value={form.providerSiret} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <input type="text" name="providerVat" placeholder="TVA" value={form.providerVat} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
      )}
      {step === 2 && (
        <div className="space-y-2">
          <h2 className="font-semibold">Client</h2>
          <input type="text" name="clientName" placeholder="Nom" value={form.clientName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <input type="text" name="clientAddress" placeholder="Adresse" value={form.clientAddress} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <button type="button" onClick={() => setAdvanced(a => !a)} className="text-sm text-primary underline">
            Options avancées
          </button>
          {advanced && (
            <div className="space-y-2 mt-2">
              <input type="text" name="clientSiret" placeholder="SIRET" value={form.clientSiret} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              <input type="text" name="clientVat" placeholder="TVA" value={form.clientVat} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          )}
        </div>
      )}
      {step === 3 && (
        <div className="space-y-2">
          <h2 className="font-semibold">Prestation</h2>
          <input type="text" name="serviceTitle" placeholder="Titre" value={form.serviceTitle} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <input type="text" name="location" placeholder="Lieu" value={form.location} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <input type="date" name="serviceDate" value={form.serviceDate} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <input type="text" name="time" placeholder="Horaires" value={form.time} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <input type="text" name="attendees" placeholder="Effectif" value={form.attendees} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
      )}
      {step === 4 && (
        <div className="space-y-2">
          <h2 className="font-semibold">Montants</h2>
          <input type="number" step="0.01" name="amountHT" placeholder="Montant HT" value={form.amountHT} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <select name="vatRate" value={form.vatRate} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="0">0 %</option>
            <option value="2.1">2,1 %</option>
            <option value="5.5">5,5 %</option>
            <option value="10">10 %</option>
            <option value="20">20 %</option>
          </select>
          <input type="number" step="0.01" name="amountTTC" placeholder="Montant TTC" value={form.amountTTC} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
      )}
      {step === 5 && (
        <div className="space-y-4">
          <h2 className="font-semibold">Aperçu</h2>
          <div id="invoice-printable" className="p-4 bg-white border rounded shadow space-y-4">
            <div className="flex justify-between items-start">
              <div className="text-2xl font-bold">CalZik</div>
              <div className="text-right text-sm space-y-1">
                <div>Date : {form.serviceDate}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-semibold mb-1">Prestataire</h3>
                <div>{form.providerName}</div>
                <div>{form.providerAddress}</div>
                {form.providerSiret && <div>SIRET : {form.providerSiret}</div>}
                {form.providerVat && <div>TVA : {form.providerVat}</div>}
              </div>
              <div>
                <h3 className="font-semibold mb-1">Client</h3>
                <div>{form.clientName}</div>
                <div>{form.clientAddress}</div>
                {form.clientSiret && <div>SIRET : {form.clientSiret}</div>}
                {form.clientVat && <div>TVA : {form.clientVat}</div>}
              </div>
            </div>
            <table className="w-full text-sm border mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Prestation</th>
                  <th className="p-2 text-right">Montant HT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">
                    {form.serviceTitle} - {form.location}
                  </td>
                  <td className="p-2 text-right">{form.amountHT} €</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="p-2 text-right font-semibold">Sous-total</td>
                  <td className="p-2 text-right">{form.amountHT} €</td>
                </tr>
                <tr>
                  <td className="p-2 text-right">TVA {form.vatRate}%</td>
                  <td className="p-2 text-right">
                    {(
                      parseFloat(form.amountTTC || '0') -
                      parseFloat(form.amountHT || '0')
                    ).toFixed(2)}{' '}
                    €
                  </td>
                </tr>
                <tr>
                  <td className="p-2 text-right font-bold">Total TTC</td>
                  <td className="p-2 text-right font-bold">{form.amountTTC} €</td>
                </tr>
              </tfoot>
            </table>
            <div className="text-xs mt-4">
              Conditions de paiement : règlement à réception.<br />
              Mentions légales : association loi 1901.
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-2 bg-primary text-white px-4 py-2 rounded"
          >
            Imprimer
          </button>
        </div>
      )}
      <div className="flex justify-between pt-4">
        {step > 1 && <button type="button" onClick={handlePrev} className="px-4 py-2">Précédent</button>}
        {step < 5 && <button type="button" onClick={handleNext} className="ml-auto bg-primary text-white px-4 py-2 rounded">Suivant</button>}
        {step === 5 && <button type="submit" className="ml-auto bg-primary text-white px-4 py-2 rounded">Enregistrer</button>}
      </div>
    </form>
  );
}
