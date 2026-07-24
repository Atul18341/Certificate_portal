'use client';

import React from 'react';
import { Download, X } from 'lucide-react';
import LinkedInButton from "@/components/LinkedInButton";
import { CERT_TEXTS } from '@/app/lib/translations';
interface StudentData {
  id: string;
  name: string;
  course: string;
  email: string;
  status: 'pending' | 'success';
}

export interface CertificatePreviewProps {
  selectedStudent: StudentData;
  certLang: 'en' | 'hi';
  setCertLang: (lang: 'en' | 'hi') => void;
  orgDisplayName: string;
  companyLogoUrl: string;
  digitalSignatureUrl: string;
  signatoryName: string;
  signatoryRole: string;
  qrDataUrl: string;
  certRef: React.RefObject<HTMLDivElement | null>;
  onDownloadSinglePNG: (student: StudentData) => void;
  onClose: () => void;
}

export default function CertificatePreview({
  selectedStudent,
  certLang,
  setCertLang,
  orgDisplayName,
  companyLogoUrl,
  digitalSignatureUrl,
  signatoryName,
  signatoryRole,
  qrDataUrl,
  certRef,
  onDownloadSinglePNG,
  onClose,
}: CertificatePreviewProps) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-[850px] p-6 text-white shadow-2xl relative">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-5">
          <div>
            <h4 className="text-sm font-bold">Dynamic Offline Inspection Engine</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Target: <span className="text-white font-mono font-bold">{selectedStudent.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
  value={certLang}
  onChange={(e) => setCertLang(e.target.value as any)}
  className="bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 outline-none cursor-pointer"
>
  <option value="en">🌐 English</option>
  <option value="hi">🇮🇳 हिंदी (Hindi)</option>
  <option value="es">🇪🇸 Español (Spanish)</option>
  <option value="fr">🇫🇷 Français (French)</option>
  <option value="de">🇩🇪 Deutsch (German)</option>
  <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
  <option value="te">🇮🇳 తెలుగు (Telugu)</option>
</select>

            <button 
              type="button" 
              onClick={() => onDownloadSinglePNG(selectedStudent)} 
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow transition active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Asset (PNG)
            </button>

            <LinkedInButton
              certificateTitle={selectedStudent.course}
              organizationName={orgDisplayName}
              issueYear={new Date().getFullYear()}
              issueMonth={new Date().getMonth() + 1}
              certificateId={selectedStudent.id}
              certificateUrl={`https://credvantage.com/verify/${encodeURIComponent(selectedStudent.id)}`}
            />

            <button 
              type="button" 
              onClick={onClose} 
              className="p-2 bg-slate-800 text-slate-400 rounded-xl hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Display Card */}
        <div className="w-full bg-slate-950 p-6 rounded-2xl flex justify-center items-center border border-slate-800">
          <div ref={certRef} className="relative w-full aspect-[1.414/1] bg-slate-900 p-[8%] border border-slate-800 flex flex-col justify-between items-center text-white shadow-2xl">
            
            {/* Certificate Header */}
            <div className="w-full flex justify-between items-start border-b border-slate-800/60 pb-5">
              <div className="text-left flex items-center gap-3">
                {companyLogoUrl && <img src={companyLogoUrl} alt="Logo" className="h-9 max-w-[120px] object-contain" />}
                <div>
                  <h4 className="text-[11px] font-black tracking-[0.2em] text-indigo-400 uppercase">{orgDisplayName}</h4>
                  <p className="text-[8px] font-mono text-slate-500 mt-0.5">OFFICIAL RECIPIENT VERIFICATION NODE</p>
                </div>
              </div>
              <div className="bg-indigo-950/40 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-indigo-300 font-mono text-[9px] font-bold">
                ID // <span className="text-white font-black">{selectedStudent.id}</span>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="w-full text-center flex flex-col items-center my-auto py-6">
              <span className="text-[9px] font-black uppercase tracking-[0.35em] text-indigo-400 bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-500/20">
                {CERT_TEXTS[certLang].attestation}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mt-4 font-extralight leading-none">
                {CERT_TEXTS[certLang].heading}
              </h1>
              
              <div className="w-12 h-[1px] bg-slate-800 my-6"></div>
              
              <p className="text-xs italic font-serif text-slate-400">
                {CERT_TEXTS[certLang].subheading}
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl tracking-tight text-white mt-3.5 font-bold font-sans">{selectedStudent.name}</h2>
              
              <p className="text-xs font-serif text-slate-400 mt-6 max-w-md mx-auto leading-relaxed">
                {CERT_TEXTS[certLang].body}
              </p>
              <h3 className="text-xs md:text-sm font-black text-indigo-200 mt-3.5 tracking-wider uppercase font-sans bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl shadow-sm">{selectedStudent.course}</h3>
            </div>

            {/* Certificate Footer */}
            <div className="w-full border-t border-slate-800/60 pt-5 flex items-end justify-between mt-auto">
              <div className="flex flex-col gap-1 text-[8.5px] font-mono text-slate-500 text-left max-w-[50%]">
                <span className="text-slate-400 font-black uppercase text-[8px]">REGISTRY TRACE MATRIX</span>
                <span className="truncate max-w-[280px] text-slate-400 font-semibold">
                  VERIFICATION_HASH: 0X{Math.random().toString(16).substring(2,28).toUpperCase()}
                </span>
                <span className="text-emerald-500 font-bold flex items-center gap-1">✓ SECURED BY INDEXEDDB CACHE LAYER</span>
              </div>

              {/* Signature Box */}
              <div className="flex flex-col items-center justify-end text-center min-w-[130px]">
                {digitalSignatureUrl ? (
                  <img src={digitalSignatureUrl} alt="Signature" className="h-9 object-contain invert brightness-200 mb-1" />
                ) : (
                  <div className="h-7 border-b border-indigo-400/50 w-24 mb-1 flex items-center justify-center text-[9px] font-serif italic text-indigo-300">
                    {signatoryName}
                  </div>
                )}
                <span className="text-[9px] font-bold text-white uppercase font-sans block leading-none">{signatoryName}</span>
                <span className="text-[7px] text-slate-400 uppercase font-mono block mt-0.5">{signatoryRole}</span>
              </div>
              
              {/* QR Box */}
              <div className="flex flex-col items-center p-1.5 bg-white rounded-xl shadow-2xl border border-slate-200">
                {qrDataUrl && <img src={qrDataUrl} alt="Scan QR" className="block w-[50px] h-[50px] rounded" />}
                <span className="text-[5px] font-sans font-black text-slate-600 uppercase mt-1">SCAN PREVIEW</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}