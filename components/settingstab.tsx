'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface SettingsTabProps {
  orgDisplayName: string;
  setOrgDisplayName: (val: string) => void;
  signatoryName: string;
  setSignatoryName: (val: string) => void;
  signatoryRole: string;
  setSignatoryRole: (val: string) => void;
  companyLogoUrl: string;
  digitalSignatureUrl: string;
  onBrandingAssetUpload: (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'signature') => void;
  onSaveBrandingSettings: (e: React.FormEvent) => void;
}

export default function SettingsTab({
  orgDisplayName,
  setOrgDisplayName,
  signatoryName,
  setSignatoryName,
  signatoryRole,
  setSignatoryRole,
  companyLogoUrl,
  digitalSignatureUrl,
  onBrandingAssetUpload,
  onSaveBrandingSettings,
}: SettingsTabProps) {
  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-slate-800 animate-fade-in">
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h2 className="text-xl font-black text-slate-900">Organization & Certificate Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          All customization choices are permanently stored in IndexedDB browser storage.
        </p>
      </div>

      <form onSubmit={onSaveBrandingSettings} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">Institution Title</label>
            <input
              type="text"
              value={orgDisplayName}
              onChange={(e) => setOrgDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold uppercase outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Authorized Signatory Name</label>
            <input
              type="text"
              value={signatoryName}
              onChange={(e) => setSignatoryName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Signatory Designation / Role</label>
            <input
              type="text"
              value={signatoryRole}
              onChange={(e) => setSignatoryRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-700">Institution Logo</label>
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-slate-50 relative cursor-pointer hover:bg-slate-100 transition">
              <ImageIcon className="w-6 h-6 text-indigo-500 mb-1" />
              <span className="text-xs font-bold text-slate-700">Upload Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onBrandingAssetUpload(e, 'logo')}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {companyLogoUrl && <img src={companyLogoUrl} alt="Logo" className="h-10 object-contain self-start" />}
          </div>

          {/* Signature Upload */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-700">Digital Signature Image</label>
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-slate-50 relative cursor-pointer hover:bg-slate-100 transition">
              <ImageIcon className="w-6 h-6 text-indigo-500 mb-1" />
              <span className="text-xs font-bold text-slate-700">Upload Transparent Signature</span>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => onBrandingAssetUpload(e, 'signature')}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {digitalSignatureUrl && <img src={digitalSignatureUrl} alt="Signature" className="h-10 object-contain invert self-start" />}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md self-end mt-4 cursor-pointer transition active:scale-95"
        >
          Save Settings to IndexedDB
        </button>
      </form>
    </div>
  );
}