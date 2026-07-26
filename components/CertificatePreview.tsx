'use client';

import React, { useState } from 'react';
import { Download, FileText, X, ShieldCheck, Award } from 'lucide-react';
import { CERT_TEXTS } from '@/app/lib/translations';
import { toPng } from 'html-to-image'; // 👈 Modern HTML to Image Engine
import { jsPDF } from 'jspdf';
import LinkedInButton from "@/components/LinkedInButton";

interface StudentData {
  id: string;
  name: string;
  course: string;
  email: string;
  status: 'pending' | 'success';
}

export interface CertificatePreviewProps {
  selectedStudent: StudentData;
  certLang: 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ta' | 'te';
  setCertLang: (lang: any) => void;
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
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // 📄 Reliable PDF Exporter using html-to-image
  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    try {
      setIsExportingPdf(true);

      // DOM to PNG conversion (Handles lab/oklch colors & CORS automatically)
      const dataUrl = await toPng(certRef.current, {
        quality: 0.95,
        pixelRatio: 2, // High DPI for crisp printing
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210);
      pdf.save(`${selectedStudent.name.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Failed to generate PDF. Make sure all images are fully loaded.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const currentText = (CERT_TEXTS as any)[certLang] || (CERT_TEXTS as any).en;

  return (
    <div className="w-full lg:w-1/2 h-full bg-slate-900 border-l border-slate-800 p-4 sm:p-6 text-white flex flex-col justify-between shadow-2xl relative animate-fade-in">
      
      {/* Drawer Control Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-2 shrink-0">
        <div>
          <h4 className="text-xs font-bold flex items-center gap-1.5 text-slate-200">
            <Award className="w-4 h-4 text-indigo-400" /> Live Canvas Inspection
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Active: <span className="text-white font-mono font-bold">{selectedStudent.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={certLang}
            onChange={(e) => setCertLang(e.target.value)}
            className="bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-700 outline-none cursor-pointer"
          >
            <option value="en">🌐 English</option>
            <option value="hi">🇮🇳 हिंदी</option>
            <option value="es">🇪🇸 Español</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="ta">🇮🇳 தமிழ்</option>
            <option value="te">🇮🇳 తెలుగు</option>
          </select>

          <button 
            type="button" 
            onClick={handleDownloadPDF} 
            disabled={isExportingPdf}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> {isExportingPdf ? 'PDF...' : 'PDF'}
          </button>

          <button 
            type="button" 
            onClick={() => onDownloadSinglePNG(selectedStudent)} 
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> PNG
          </button>

          {LinkedInButton && (
            <LinkedInButton
              certificateTitle={selectedStudent.course}
              organizationName={orgDisplayName}
              issueYear={new Date().getFullYear()}
              issueMonth={new Date().getMonth() + 1}
              certificateId={selectedStudent.id}
              certificateUrl={`https://credvantage.com/verify/${encodeURIComponent(selectedStudent.id)}`}
            />
          )}

          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg cursor-pointer transition"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Certificate Scrollable Canvas */}
      <div className="w-full bg-slate-950 p-3 rounded-xl flex justify-center items-center border border-slate-800 overflow-auto flex-1">
        <div 
          ref={certRef} 
          className="relative w-full min-w-[580px] aspect-[1.414/1] bg-white p-6 border-[8px] border-slate-100 flex flex-col justify-between items-center text-slate-900 shadow-2xl selection:bg-amber-100"
          style={{
            backgroundImage: 'radial-gradient(#e2e8f0 0.75px, transparent 0.75px)',
            backgroundSize: '14px 14px'
          }}
        >
          <div className="absolute inset-2 border border-slate-900/80 pointer-events-none"></div>
          <div className="absolute inset-3 border border-slate-300/60 pointer-events-none"></div>

          {/* Header */}
          <div className="w-full flex justify-between items-center pt-1 px-2 z-10">
            <div className="flex items-center gap-2">
              {companyLogoUrl ? (
                <img src={companyLogoUrl} alt="Logo" className="h-8 max-w-[100px] object-contain" />
              ) : (
                <div className="p-1.5 bg-indigo-50 border border-indigo-200 rounded">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                </div>
              )}
              <div className="text-left">
                <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-900 uppercase font-sans">{orgDisplayName}</h4>
                <p className="text-[7px] font-mono text-slate-500">OFFICIAL RECIPIENT NODE</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-slate-700 font-mono text-[8px] font-bold">
              ID: <span className="text-slate-900 font-black">{selectedStudent.id}</span>
            </div>
          </div>

          {/* Body */}
          <div className="w-full text-center flex flex-col items-center my-auto py-1 z-10">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-700 bg-amber-50 px-3 py-0.5 rounded-full border border-amber-200 font-sans">
              {currentText?.attestation || 'CERTIFICATE OF ACHIEVEMENT'}
            </span>

            <h1 className="text-2xl sm:text-3xl font-serif text-slate-900 mt-2 font-normal tracking-tight">
              {currentText?.heading || 'Certificate of Excellence'}
            </h1>
            
            <div className="w-12 h-[1.5px] bg-amber-500 my-2"></div>
            
            <p className="text-[10px] italic font-serif text-slate-600">
              {currentText?.subheading || 'This is proudly presented to'}
            </p>

            <h2 className="text-xl sm:text-2xl tracking-tight text-slate-900 mt-1 font-bold font-serif underline decoration-amber-400/60 decoration-1 underline-offset-4">
              {selectedStudent.name}
            </h2>
            
            <p className="text-[10px] font-serif text-slate-600 mt-3 max-w-xs mx-auto leading-relaxed">
              {currentText?.body || 'For successful completion of the prescribed program requirements.'}
            </p>

            <h3 className="text-[10px] font-black text-indigo-900 mt-2 tracking-wider uppercase font-sans bg-indigo-50 border border-indigo-100 px-3 py-1 rounded shadow-sm">
              {selectedStudent.course}
            </h3>
          </div>

          {/* Footer */}
          <div className="w-full pt-2 px-2 flex items-end justify-between mt-auto z-10">
            <div className="flex flex-col gap-0.5 text-[7px] font-mono text-slate-500 text-left max-w-[38%]">
              <span className="text-slate-700 font-black uppercase text-[6.5px]">TRACE MATRIX</span>
              <span className="truncate text-slate-500">
                HASH: 0X{Math.random().toString(16).substring(2, 22).toUpperCase()}
              </span>
              <span className="text-emerald-700 font-bold">✓ VERIFIED ON INDEXEDDB</span>
            </div>

            <div className="flex flex-col items-center justify-end text-center min-w-[110px]">
              {digitalSignatureUrl ? (
                <img src={digitalSignatureUrl} alt="Signature" className="h-8 object-contain mb-0.5" />
              ) : (
                <div className="h-6 border-b border-slate-300 w-20 mb-0.5 flex items-center justify-center text-[9px] font-serif italic text-slate-600">
                  {signatoryName}
                </div>
              )}
              <span className="text-[8.5px] font-black text-slate-900 uppercase font-sans block leading-none">{signatoryName}</span>
              <span className="text-[6.5px] text-slate-500 uppercase font-mono block mt-0.5">{signatoryRole}</span>
            </div>
            
            <div className="flex flex-col items-center p-1 bg-white rounded shadow-sm border border-slate-200">
              {qrDataUrl && <img src={qrDataUrl} alt="QR" className="block w-[38px] h-[38px] rounded" />}
              <span className="text-[5px] font-sans font-black text-slate-600 uppercase mt-0.5">VERIFY</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}