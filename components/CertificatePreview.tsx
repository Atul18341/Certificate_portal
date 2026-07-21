'use check-clean';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from "next/script";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

interface StudentData {
  id: string;
  name: string;
  course: string;
  email: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  txHash?: string;
  error?: string;
}

export default function CertificatePreview() {
  const [studentsList, setStudentsList] = useState<StudentData[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [tenantOrgId, setTenantOrgId] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('mock_seller_user_id_uuid'); // Real Auth me direct Clerk/NextAuth user id yahan bypass hogi
  const [isProcessing, setIsProcessing] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  // 1. Dynamic Session Management Integration Layer
  useEffect(() => {
    const fetchTenantProfile = async () => {
      try {
        // Multi-tenant safe fetch passing user identification payload context
        const res = await fetch("/api/v1/issue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkBalanceOnly: true, user_id: currentUserId })
        });
        const data = await res.json();
        if (data && data.remaining_balance) {
          setWalletBalance(parseFloat(data.remaining_balance.replace("INR ", "")));
          setTenantOrgId(data.org_id);
        }
      } catch (err) {
        console.error("Multi-tenant user profile loading crash:", err);
      }
    };
    fetchTenantProfile();
  }, [currentUserId]);

  // 2. Real-World Razorpay Multi-Tenant Secure Recharge Order Bridge
  const handleWalletRecharge = async (amount: number) => {
    if (!tenantOrgId) return alert("Session expired! Please re-login.");
    try {
      const res = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, orgId: tenantOrgId }),
      });
      const data = await res.json();

      if (!data.success) {
        alert("SaaS Order Creation Engine failed context error.");
        return;
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "CertiSaaS Platform Engine",
        description: `B2B Top-up Account Refill: ${tenantOrgId.substring(0,8)}`,
        order_id: data.order_id,
        handler: function () {
          alert("🎉 Balance recharged successfully! Webhook database update sync triggered.");
          window.location.reload();
        },
        theme: { color: "#4F46E5" },
      };

      if ((window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        alert("Payment secure gateway assets loading in backend browser engine. Try again!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Smart Dynamic Excel Column Extractor mapping
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target?.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet) as any[];

      const formattedData: StudentData[] = json.map((row, idx) => {
        const rowKeys = Object.keys(row);
        
        const nameKey = rowKeys.find(k => /name/i.test(k) || /student/i.test(k) || /full.*name/i.test(k));
        const idKey = rowKeys.find(k => /id/i.test(k) || /roll/i.test(k) || /reg/i.test(k) || /s\.?no/i.test(k));
        const courseKey = rowKeys.find(k => /course/i.test(k) || /program/i.test(k) || /subject/i.test(k) || /department/i.test(k));
        const emailKey = rowKeys.find(k => /email/i.test(k) || /mail/i.test(k));

        const rawId = idKey && row[idKey] ? String(row[idKey]).trim() : '';
        const id = (rawId === '' || rawId.toLowerCase() === 'undefined' || rawId.toLowerCase() === 'null') ? `CERT-${100 + idx}` : rawId;

        const rawName = nameKey && row[nameKey] ? String(row[nameKey]).trim() : '';
        let finalName = rawName;
        if (rawName === '' || rawName.toLowerCase() === 'undefined' || rawName.toLowerCase() === 'null' || rawName.toLowerCase() === 'nan') {
          finalName = ''; 
        }

        const rawCourse = courseKey && row[courseKey] ? String(row[courseKey]).trim() : '';
        const course = (rawCourse === '' || rawCourse.toLowerCase() === 'undefined' || rawCourse.toLowerCase() === 'null') ? 'General Program' : rawCourse;

        const rawEmail = emailKey && row[emailKey] ? String(row[emailKey]).trim() : '';
        const email = (rawEmail === '' || rawEmail.toLowerCase() === 'undefined' || rawEmail.toLowerCase() === 'null') ? '' : rawEmail;

        return { id, name: finalName, course, email, status: 'pending' as const };
      });

      const validData = formattedData.filter(s => s.id !== '');
      setStudentsList(validData);
      if (validData.length > 0) setSelectedStudent(validData[0]);
    };
    reader.readAsBinaryString(file);
  };

  // 4. Isolated Single Process Mint Execution Logic Loop Engine
  const sendEmailToSingleStudent = async (student: StudentData) => {
    if (!student) return;
    if (walletBalance < 15) return alert("Insufficient account credits! Click recharge.");

    setIsProcessing(true);
    const updatedRecords = [...studentsList];
    const targetIdx = updatedRecords.findIndex(s => s.id === student.id);
    
    if (targetIdx !== -1) {
      updatedRecords[targetIdx].status = 'processing';
      setStudentsList([...updatedRecords]);
    }

    const nameToSubmit = student.name ? student.name : student.id;
    const mockHash = `0x${student.id}${Date.now()}00000000000000000000000000000000`.substring(0, 66);

    try {
      const billingRes = await fetch("/api/v1/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          name: nameToSubmit,
          course: student.course,
          certHash: mockHash,
          studentId: student.id
        })
      });

      const billingData = await billingRes.json();
      if (billingRes.ok && targetIdx !== -1) {
        updatedRecords[targetIdx].status = 'success';
        updatedRecords[targetIdx].txHash = billingData.txHash;
        setSelectedStudent({ ...updatedRecords[targetIdx] });
        if (billingData.remaining_balance) {
          setWalletBalance(parseFloat(billingData.remaining_balance.replace("INR ", "")));
        }
        alert(`🎉 Certificate securely dispatched!`);
      } else if (targetIdx !== -1) {
        updatedRecords[targetIdx].status = 'failed';
      }
    } catch {
      if (targetIdx !== -1) updatedRecords[targetIdx].status = 'failed';
    }
    setStudentsList([...updatedRecords]);
    setIsProcessing(false);
  };

  const downloadSinglePNG = async (student: StudentData) => {
    if (!certRef.current || !student) return;
    setIsProcessing(true);
    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${(student.name ? student.name : student.id).replace(/\s+/g, '_')}_Certificate.png`;
    link.click();
    setIsProcessing(false);
  };

  const sendEmailToAllStudents = async () => {
    const records = studentsList || [];
    if (records.length === 0) return alert("Import spreadsheet data matrix profile file first.");
    if (walletBalance < (records.length * 15)) return alert("Bulk run error: Insufficient account wallet token balance.");

    setIsProcessing(true);
    const updatedRecords = [...records];

    for (let i = 0; i < updatedRecords.length; i++) {
      if (updatedRecords[i].status === 'success') continue;
      updatedRecords[i].status = 'processing';
      setStudentsList([...updatedRecords]);

      const nameToSubmit = updatedRecords[i].name ? updatedRecords[i].name : updatedRecords[i].id;
      const mockHash = `0x${updatedRecords[i].id}${Date.now()}00000000000000000000000000000000`.substring(0, 66);

      try {
        const billingRes = await fetch("/api/v1/issue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUserId,
            name: nameToSubmit,
            course: updatedRecords[i].course,
            certHash: mockHash,
            studentId: updatedRecords[i].id
          })
        });

        const billingData = await billingRes.json();
        if (billingRes.ok) {
          updatedRecords[i].status = 'success';
          updatedRecords[i].txHash = billingData.txHash;
          if (billingData.remaining_balance) {
            setWalletBalance(parseFloat(billingData.remaining_balance.replace("INR ", "")));
          }
        } else {
          updatedRecords[i].status = 'failed';
        }
      } catch {
        updatedRecords[i].status = 'failed';
      }
      setStudentsList([...updatedRecords]);
    }
    setIsProcessing(false);
  };

  const downloadAllZIP = async () => {
    const records = studentsList || [];
    if (records.length === 0) return alert("Data registry query empty!");
    setIsProcessing(true);
    const zip = new JSZip();
    const currentSelection = selectedStudent;

    for (const student of records) {
      setSelectedStudent(student);
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (certRef.current) {
        const canvas = await html2canvas(certRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png').split(',')[1];
        zip.file(`${(student.name ? student.name : student.id).replace(/\s+/g, '_')}_Certificate.png`, imgData, { base64: true });
      }
    }

    setSelectedStudent(currentSelection);
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `Bulk_SaaS_Certificates_Export.zip`;
    link.click();
    setIsProcessing(false);
  };

  const currentCount = (studentsList || []).length;
  
  // Real world Dynamic Hosted Verification framework URL routing parameters
  const targetVerificationUrl = selectedStudent?.txHash 
    ? `https://amoy.polygonscan.com/tx/${selectedStudent.txHash}`
    : `https://certisaas-verification.vercel.app/verify/${selectedStudent?.id || 'preview'}`;

  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${encodeURIComponent(targetVerificationUrl)}`;

  return (
    <div className="w-full max-w-6xl min-h-screen bg-slate-50 p-6 font-sans text-slate-800 flex flex-col gap-6 items-center">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />

      {/* Dynamic isolated Wallet Top bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm w-full flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Workspace Tenant Balance</h3>
          <h2 className="text-3xl font-black text-slate-900 mt-1">INR {(walletBalance || 0).toFixed(2)}</h2>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end items-center">
          {currentCount > 0 && (
            <select 
              value={selectedStudent?.id || ''} 
              onChange={(e) => {
                const found = studentsList.find(s => s.id === e.target.value);
                if (found) setSelectedStudent(found);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 max-w-[200px]"
            >
              {studentsList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name ? s.name : `ID: ${s.id}`} {s.status === 'success' ? '✅' : ''}
                </option>
              ))}
            </select>
          )}

          <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 cursor-pointer transition">
            📁 Import Data File
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
          </label>
          <button onClick={downloadAllZIP} disabled={currentCount === 0 || isProcessing} className="px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl transition">📥 Download ZIP ({currentCount})</button>
          <button onClick={sendEmailToAllStudents} disabled={currentCount === 0 || isProcessing} className="px-4 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl transition">⚡ Process All Bulk</button>
          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
          <button onClick={() => handleWalletRecharge(500)} className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold transition">+ Topup ₹500</button>
        </div>
      </div>

      {/* Main Framework View grid */}
      <div className="w-full flex flex-col justify-center items-center bg-slate-200/50 rounded-3xl p-8 border border-slate-300/40 shadow-inner min-h-[550px] gap-4">
        
        {selectedStudent && (
          <div className="w-full max-w-[840px] flex justify-end gap-3 mb-1">
            <button onClick={() => downloadSinglePNG(selectedStudent)} disabled={isProcessing} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow transition">📥 Download Single Image</button>
            <button onClick={() => sendEmailToSingleStudent(selectedStudent)} disabled={isProcessing || selectedStudent.status === 'success'} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow transition disabled:bg-slate-300">
              {selectedStudent.status === 'success' ? '✓ Dispatched Success' : '⚡ Mint & Dispatch This'}
            </button>
          </div>
        )}

        {selectedStudent ? (
          <div className="w-full max-w-[840px] shadow-2xl rounded-sm overflow-hidden bg-white border border-slate-300 transition-all duration-300">
            <div ref={certRef} className="relative w-full aspect-[1.414/1] bg-white p-[6%] border-[20px] border-double border-amber-600 flex flex-col justify-between items-center select-none shadow-sm" style={{ boxSizing: 'border-box' }}>
              <div className="absolute top-4 left-4 w-3 h-3 bg-amber-600 transform rotate-45"></div>
              <div className="absolute top-4 right-4 w-3 h-3 bg-amber-600 transform rotate-45"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 bg-amber-600 transform rotate-45"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-amber-600 transform rotate-45"></div>

              <div className="w-full text-center flex flex-col items-center mt-[4%]">
                <h1 className="text-3xl md:text-4xl font-serif font-black tracking-widest text-amber-900 uppercase">Certificate of Completion</h1>
                <div className="w-32 h-[2px] bg-amber-600 mt-3"></div>
              </div>

              <div className="w-full max-w-[90%] text-center flex flex-col items-center my-[3%] px-4 min-h-[80px] justify-center">
                <p className="text-sm md:text-base italic font-serif text-slate-400">This is proudly presented to</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-slate-900 mt-3 tracking-wide capitalize break-words max-w-full leading-tight min-h-[50px]">
                  {selectedStudent.name}
                </h2>
              </div>

              <div className="w-full text-center flex flex-col items-center mb-[3%] px-4">
                <p className="text-sm md:text-base font-serif text-slate-500 max-w-[85%] leading-relaxed break-words">for successfully completing the prescribed course of study in</p>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold font-serif text-amber-800 mt-2 tracking-wide uppercase break-words max-w-full leading-snug">{selectedStudent.course}</h3>
              </div>

              {/* Secure Multi-tenant QR verification footer template */}
              <div className="w-full border-t border-slate-200 pt-5 flex items-center justify-between px-2 mt-auto">
                <div className="flex flex-col gap-1 text-[11px] font-mono text-slate-400 max-w-[75%]">
                  <span>MINT IDENTITY SIGNATURE: {selectedStudent.id}</span>
                  <span className="truncate">LEDGER TRANSACTION HASH: {selectedStudent.txHash || '0x_unverified_blockchain_ledger_context'}</span>
                </div>
                
                <div className="flex flex-col items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrCodeImageUrl} alt="Verification QR Code" width={70} height={70} className="block border border-slate-100" />
                  <span className="text-[7px] font-sans font-bold text-slate-400 tracking-wider uppercase">Scan to Verify</span>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 flex flex-col items-center gap-3">
            <p className="text-base font-semibold">Workspace authenticated. Click "Import Data File" above to test transactions matrix execution.</p>
          </div>
        )}
      </div>
    </div>
  );
}