'use client';

import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { Scan, Loader2, X, Check, FileSpreadsheet } from 'lucide-react';

interface RegisterScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudents: (students: { name: string; email: string; course: string }[]) => void;
  defaultCourse?: string;
}

export default function RegisterScannerModal({
  isOpen,
  onClose,
  onAddStudents,
  defaultCourse = 'General Course',
}: RegisterScannerModalProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedNames, setExtractedNames] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  // 📄 Image se Text Filter karne ka Logic
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setProgress(0);

    try {
      const worker = await createWorker('eng');
      
      const { data } = await worker.recognize(file);
      await worker.terminate();

      // Line-by-line Clean Extraction Logic
      const lines = data.text
        .split('\n')
        .map((line) => line.trim())
        // Serial numbers, short noise, and symbols filter out karte hain
        .map((line) => line.replace(/^[0-9]+[\.\-\)\s]+/, '')) 
        .filter((line) => line.length > 2 && /^[a-zA-Z\s]+$/.test(line));

      setExtractedNames(lines);

      // By default sabhi Extracted Names ko select kar dein
      const initialSelection: Record<string, boolean> = {};
      lines.forEach((name) => {
        initialSelection[name] = true;
      });
      setSelectedNames(initialSelection);

    } catch (err) {
      console.error('OCR Error:', err);
      alert('Photo se text read nahi ho paya. Clean photo try karein.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle selection
  const toggleName = (name: string) => {
    setSelectedNames((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Final Import Action
  const handleImport = () => {
    const finalStudents = extractedNames
      .filter((name) => selectedNames[name])
      .map((name) => ({
        name: name,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`, // Default email auto-generate
        course: defaultCourse,
      }));

    if (finalStudents.length === 0) {
      alert('Kamyab import ke liye kam se kam 1 naam select karein.');
      return;
    }

    onAddStudents(finalStudents);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 text-white shadow-2xl relative">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold flex items-center gap-2 text-indigo-400">
            <Scan className="w-5 h-5" /> Register / Paper Scanner (OCR)
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="my-5">
          {!loading && extractedNames.length === 0 && (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl cursor-pointer bg-slate-950/50 hover:bg-slate-800/50 transition">
              <FileSpreadsheet className="w-10 h-10 mb-2 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-300">
                Register ya Student List ki photo Upload karein
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                (PNG, JPG, JPEG supported)
              </span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          )}

          {/* Loader */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
              <p className="text-xs text-slate-300 font-mono">Register image scan ho rahi hai...</p>
            </div>
          )}

          {/* Extracted Names List */}
          {!loading && extractedNames.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 mb-3">
                Detected Names ({extractedNames.length}): Uncheck karein jo sahi nahi hain.
              </p>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {extractedNames.map((name, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleName(name)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                      selectedNames[name]
                        ? 'bg-indigo-950/40 border-indigo-500/50 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-500 line-through'
                    }`}
                  >
                    <span className="font-semibold">{name}</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${selectedNames[name] ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600'}`}>
                      {selectedNames[name] && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {extractedNames.length > 0 && !loading && (
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={() => setExtractedNames([])}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg"
            >
              Rescan
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Import Selected
            </button>
          </div>
        )}

      </div>
    </div>
  );
}