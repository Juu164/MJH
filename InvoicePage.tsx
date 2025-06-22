import React, { useState } from 'react';

export function InvoicePage() {
  const [form, setForm] = useState({
    providerName: '',
    providerAddress: '',
    providerSiret: '',
    clientName: '',
    clientAddress: '',
    description: '',
    date: '',
    amountHT: '',
    tva: '',
    amountTTC: '',
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-dark mb-6">Factures</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold mb-2">Prestataire</h2>
            <input
              type="text"
              name="providerName"
              placeholder="Nom"
              value={form.providerName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
              required
            />
            <input
              type="text"
              name="providerAddress"
              placeholder="Adresse"
              value={form.providerAddress}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
              required
            />
            <input
              type="text"
              name="providerSiret"
              placeholder="SIRET"
              value={form.providerSiret}
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
              required
            />
            <input
              type="text"
              name="clientAddress"
              placeholder="Adresse"
              value={form.clientAddress}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            rows={4}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Montant HT</label>
            <input
              type="number"
              step="0.01"
              name="amountHT"
              value={form.amountHT}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">TVA (%)</label>
            <input
              type="number"
              step="0.01"
              name="tva"
              value={form.tva}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Montant TTC</label>
            <input
              type="number"
              step="0.01"
              name="amountTTC"
              value={form.amountTTC}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-lg mt-2"
        >
          Générer la facture
        </button>
      </form>

      {showPreview && (
        <div className="mt-8 bg-white p-6 shadow border border-gray-200" id="invoice-preview">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Facture</h2>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Prestataire</h3>
            <p>{form.providerName}</p>
            <p>{form.providerAddress}</p>
            {form.providerSiret && <p>SIRET: {form.providerSiret}</p>}
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Client</h3>
            <p>{form.clientName}</p>
            <p>{form.clientAddress}</p>
          </div>
          <p className="mb-4 whitespace-pre-line">{form.description}</p>
          <table className="w-full text-left mb-4 border border-gray-300">
            <thead>
              <tr className="border-b">
                <th className="p-2">Date</th>
                <th className="p-2">Montant HT</th>
                <th className="p-2">TVA</th>
                <th className="p-2">Montant TTC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">{form.date}</td>
                <td className="p-2">{form.amountHT} €</td>
                <td className="p-2">{form.tva}%</td>
                <td className="p-2">{form.amountTTC} €</td>
              </tr>
            </tbody>
          </table>
          <div className="text-right">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              Imprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
