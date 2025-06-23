import React, { useState } from 'react';

interface StoredFile {
  id: string;
  file: File;
}

export function DocumentsPage() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const quota = 1024 * 1024 * 1024;
  const used = files.reduce((acc, f) => acc + f.file.size, 0);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const totalSize = selected.reduce((acc, f) => acc + f.size, 0);
    if (used + totalSize > quota) {
      alert('Quota dépassé');
      return;
    }
    const mapped = selected.map(file => ({ id: Math.random().toString(36).substr(2, 9), file }));
    setFiles(prev => [...prev, ...mapped]);
    e.target.value = '';
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-dark mb-4">Documents</h1>
      <div className="mb-6 space-y-2">
        <input type="file" multiple onChange={handleUpload} />
        <div className="text-sm">
          <span className={`font-medium ${used / quota > 0.9 ? 'text-red-600' : ''}`}>{(used / 1024 / 1024).toFixed(0)} Mo</span> / 1 Go
        </div>
      </div>
      <ul className="space-y-2">
        {files.map((f) => (
          <li
            key={f.id}
            className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center"
          >
            <span className="text-sm">
              {f.file.name} ({(f.file.size / 1024).toFixed(1)} ko)
            </span>
            <div className="flex space-x-2">
              <a
                href={URL.createObjectURL(f.file)}
                download={f.file.name}
                className="bg-primary text-white px-2 py-1 rounded text-xs"
              >
                Télécharger
              </a>
              <button
                onClick={() => handleDelete(f.id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
