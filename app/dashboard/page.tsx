'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { CreditCard, Settings, Scan } from 'lucide-react'; // 👈 Scan Icon Added

import WorkspaceTab from "@/components/WorkspaceTab";
import BillingTab from "@/components/billingtab";
import SettingsTab from "@/components/settingstab";
import CertificateModal from "@/components/CertificatePreview";
import RegisterScannerModal from "@/components/RegisterScannerModal"; // 👈 Step 1: OCR Modal Imported

import { db, StudentRecord } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface StudentData {
  id: string;
  name: string;
  course: string;
  email: string;
  region?: string;
  badgeUrl?: string;
  status: 'pending' | 'success';
}

export default function DashboardPage() {
  const router = useRouter();
  const PUBLIC_RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1234567890abcdef"; 

  const [activeTab, setActiveTab] = useState<'workspace' | 'billing' | 'settings'>('workspace');

  const [activeSession, setActiveSession] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const [orgDisplayName, setOrgDisplayName] = useState<string>('CRED-VANTAGE GLOBAL REGISTRY NETWORK');
  const [signatoryName, setSignatoryName] = useState<string>('Dr. A. P. Sharma');
  const [signatoryRole, setSignatoryRole] = useState<string>('Dean / Controller of Certification');
  const [digitalSignatureUrl, setDigitalSignatureUrl] = useState<string>('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>('');

  const [certLang, setCertLang] = useState<'en' | 'hi'>('en');

  const [subscriptionTier, setSubscriptionTier] = useState<string>('15-Day Free Trial');
  const [daysRemaining, setDaysRemaining] = useState<number>(15);
  const [walletBalance, setWalletBalance] = useState<number>(5000.00); 

  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // 👈 Step 2: OCR State for Modal Open/Close
  const [isOcrOpen, setIsOcrOpen] = useState(false);
  
  const certRef = useRef<HTMLDivElement>(null);

  const offlineStudents = useLiveQuery(() => db.students.toArray(), []);
  
  const studentsList: StudentData[] = (offlineStudents || []).map(s => ({
    id: s.trackingId,
    name: s.name,
    course: s.course,
    email: s.email,
    status: s.status
  }));

  // 👈 Step 2: Auto-scanned Names ko IndexedDB/Dexie me Save karne ka Logic
  const handleAddScannedStudents = async (newStudents: { name: string; email: string; course: string }[]) => {
    try {
      const recordsToInsert: StudentRecord[] = newStudents.map((student) => ({
        trackingId: 'CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        name: student.name,
        course: student.course || 'General Certification',
        email: student.email,
        region: 'Global',
        status: 'pending' as const,
      }));

      await db.students.bulkAdd(recordsToInsert);

      if (recordsToInsert.length > 0 && !selectedStudent) {
        setSelectedStudent({
          id: recordsToInsert[0].trackingId,
          name: recordsToInsert[0].name,
          course: recordsToInsert[0].course,
          email: recordsToInsert[0].email,
          status: recordsToInsert[0].status,
        });
      }

      alert(`🎉 Successfully imported ${newStudents.length} student(s) from physical register!`);
    } catch (err) {
      console.error('Error adding scanned students:', err);
      alert('Failed to save scanned entries into database.');
    }
  };

  useEffect(() => {
    const loadSettingsFromDB = async () => {
      const savedUser = await db.settings.get('cred_session');

      if (!savedUser) {
        router.push('/login');
        return;
      }

      setActiveSession(savedUser.value);
      setIsLoadingSession(false);

      const savedBalance = await db.settings.get('cred_wallet_balance');
      const savedTier = await db.settings.get('cred_subscription_tier');
      const savedDays = await db.settings.get('cred_trial_days');
      const savedOrgName = await db.settings.get('cred_org_display_name');
      const savedSigName = await db.settings.get('cred_signatory_name');
      const savedSigRole = await db.settings.get('cred_signatory_role');
      const savedSignature = await db.settings.get('cred_digital_signature');
      const savedLogo = await db.settings.get('cred_company_logo');

      if (savedBalance) setWalletBalance(parseFloat(savedBalance.value));
      if (savedTier) setSubscriptionTier(savedTier.value);
      if (savedDays) setDaysRemaining(parseInt(savedDays.value));
      if (savedOrgName) setOrgDisplayName(savedOrgName.value);
      if (savedSigName) setSignatoryName(savedSigName.value);
      if (savedSigRole) setSignatoryRole(savedSigRole.value);
      if (savedSignature) setDigitalSignatureUrl(savedSignature.value);
      if (savedLogo) setCompanyLogoUrl(savedLogo.value);
    };

    loadSettingsFromDB();
  }, [router]);

  useEffect(() => {
    if (!selectedStudent) return;

    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const verificationUrl = `https://certibanao.com/verify/${encodeURIComponent(selectedStudent.id)}`;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 160, 160);
    ctx.fillStyle = '#1e293b';
    
    ctx.fillRect(10, 10, 40, 40);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(17, 17, 26, 26);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(23, 23, 14, 14);

    ctx.fillRect(110, 10, 40, 40);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(117, 17, 26, 26);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(123, 23, 14, 14);

    ctx.fillRect(10, 110, 40, 40);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(17, 117, 26, 26);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(23, 123, 14, 14);

    ctx.fillStyle = '#1e293b';
    for (let x = 55; x < 105; x += 8) {
      for (let y = 10; y < 150; y += 8) {
        if (Math.sin(x * y + verificationUrl.length) > 0) ctx.fillRect(x, y, 5, 5);
      }
    }

    setQrDataUrl(canvas.toDataURL('image/png'));
  }, [selectedStudent]);

  const updateWalletBalance = async (newBalance: number) => {
    setWalletBalance(newBalance);
    await db.settings.put({ key: 'cred_wallet_balance', value: newBalance.toFixed(2) });
  };

  const handleBrandingAssetUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'signature') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Str = event.target?.result as string;
      if (target === 'logo') {
        setCompanyLogoUrl(base64Str);
        await db.settings.put({ key: 'cred_company_logo', value: base64Str });
      } else {
        setDigitalSignatureUrl(base64Str);
        await db.settings.put({ key: 'cred_digital_signature', value: base64Str });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBrandingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.settings.put({ key: 'cred_org_display_name', value: orgDisplayName });
    await db.settings.put({ key: 'cred_signatory_name', value: signatoryName });
    await db.settings.put({ key: 'cred_signatory_role', value: signatoryRole });
    alert('🎉 Settings cached in IndexedDB successfully!');
    setActiveTab('workspace');
  };

  const handleSendBulkEmails = async () => {
    const validStudents = studentsList.filter(s => s.email && s.email.trim() !== '' && s.email.includes('@'));

    if (validStudents.length === 0) {
      alert("⚠️ Spreadsheet mein kisi bhi student ki valid Email ID nahi mili!");
      return;
    }

    setIsProcessing(true);
    setProgressStatus(`Dispatching certificate emails to ${validStudents.length} recipient(s)...`);

    try {
      const payload = validStudents.map((student) => ({
        email: student.email,
        name: student.name,
        certificateId: student.id,
        certificateUrl: `https://certibanao.com/verify/${encodeURIComponent(student.id)}`,
      }));

      const response = await fetch("/api/send-certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          students: payload,
          organizationName: orgDisplayName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`🎉 Successfully sent certificate email(s) to ${validStudents.length} student(s)!`);
      } else {
        alert(`❌ Error sending emails: ${data.error}`);
      }
    } catch (err: any) {
      alert("Failed to send emails. Make sure your RESEND_API_KEY is configured.");
    } finally {
      setIsProcessing(false);
      setProgressStatus('');
    }
  };

  const loadRazorpaySDK = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleWalletTopUp = async (amount: number) => {
    setIsProcessing(true);
    setProgressStatus(`Initializing Razorpay Wallet Top-Up for ₹${amount}...`);

    const loaded = await loadRazorpaySDK();
    if (!loaded) {
      setIsProcessing(false);
      setProgressStatus('');
      alert("❌ Razorpay SDK load nahi hua. Check internet connection.");
      return;
    }

    try {
      const options = {
        key: PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, 
        currency: "INR",
        name: "CredVantage Networks Inc.",
        description: `Micro-Ledger Wallet Credit Top-Up (INR ${amount})`,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=credvantage",
        handler: async function (response: any) {
          await updateWalletBalance(walletBalance + amount);
          setIsProcessing(false);
          setProgressStatus('');
          alert(`🎉 Top-Up Successful! Payment ID: ${response.razorpay_payment_id || 'LOCAL_SUCCESS'}`);
        },
        prefill: {
          name: activeSession?.name || "Corporate User",
          email: activeSession?.email || "billing@company.com"
        },
        theme: { color: "#4F46E5" },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            setProgressStatus('');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      setIsProcessing(false);
      setProgressStatus('');
      alert("Razorpay popup failed to launch.");
    }
  };

  const handleSubscriptionPurchase = async (tierName: string, amount: number, durationDays: number) => {
    setIsProcessing(true);
    setProgressStatus(`Routing secure subscription parameters...`);

    const loaded = await loadRazorpaySDK();
    if (!loaded) {
      setIsProcessing(false);
      setProgressStatus('');
      alert("❌ Razorpay SDK load nahi hua.");
      return;
    }

    try {
      const options = {
        key: PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, 
        currency: "INR",
        name: "CredVantage Networks Inc.",
        description: `Upgrade Plan Instance to ${tierName}`,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=credvantage",
        handler: async function () {
          await db.settings.put({ key: 'cred_subscription_tier', value: tierName });
          await db.settings.put({ key: 'cred_trial_days', value: durationDays.toString() });
          setSubscriptionTier(tierName);
          setDaysRemaining(durationDays);
          if (amount > 0) await updateWalletBalance(walletBalance + 1000.00); 
          setIsProcessing(false);
          setProgressStatus('');
          setActiveTab('workspace'); 
          alert(`🎉 Plan upgraded successfully to: ${tierName}`);
        },
        prefill: {
          name: activeSession?.name || "Corporate Admin",
          email: activeSession?.email || "billing@company.com"
        },
        theme: { color: "#4F46E5" },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            setProgressStatus('');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      setIsProcessing(false);
      setProgressStatus('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const bstr = event.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as any[];

        const formattedData: StudentRecord[] = json.map((row, idx) => {
          const rowKeys = Object.keys(row);
          const nameKey = rowKeys.find(k => /name/i.test(k) || /student/i.test(k));
          const idKey = rowKeys.find(k => /id/i.test(k) || /roll/i.test(k));
          const courseKey = rowKeys.find(k => /course/i.test(k) || /subject/i.test(k));
          const regionKey = rowKeys.find(k => /region/i.test(k) || /campus/i.test(k) || /branch/i.test(k) || /location/i.test(k));
          
          let emailKey = rowKeys.find(k => /email/i.test(k));
          if (!emailKey) {
            emailKey = rowKeys.find(k => String(row[k] || '').includes('@'));
          }

          const trackingId = idKey && row[idKey] ? String(row[idKey]).trim() : `ID-${100 + idx}`;
          const rawName = nameKey && row[nameKey] ? String(row[nameKey]).trim() : '';
          const name = rawName === '' ? trackingId : rawName;
          const course = courseKey && row[courseKey] ? String(row[courseKey]).trim() : 'General Certification';
          const email = emailKey && row[emailKey] ? String(row[emailKey]).trim() : '';
          const region = regionKey && row[regionKey] ? String(row[regionKey]).trim() : 'Global';

          return { trackingId, name, course, email, region, status: 'pending' as const };
        });

        await db.students.clear();
        await db.students.bulkAdd(formattedData);

        if (formattedData.length > 0) {
          setSelectedStudent({
            id: formattedData[0].trackingId,
            name: formattedData[0].name,
            course: formattedData[0].course,
            email: formattedData[0].email,
            status: formattedData[0].status
          });
        }

        const validEmailCount = formattedData.filter(s => s.email && s.email.includes('@')).length;
        alert(`🎉 Excel Loaded! ${formattedData.length} total record(s) imported (${validEmailCount} with email ID).`);
      } catch (err) {
        alert("Error parsing spreadsheet file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadSinglePNG = async (student: StudentData) => {
    if (!certRef.current || !student) return;

    setIsProcessing(true);
    setProgressStatus(`Extracting image for: ${student.name}...`);
    
    try {
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const canvas = await html2canvas(certRef.current, { 
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${student.name.replace(/\s+/g, '_')}_Certificate.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const rec = await db.students.where('trackingId').equals(student.id).first();
      if (rec && rec.id) {
        await db.students.update(rec.id, { status: 'success' });
      }

      setShowPreviewModal(false);
    } catch {
      alert("Canvas extraction error.");
    }
    setIsProcessing(false);
    setProgressStatus('');
  };

  const downloadAllZIP = async () => {
    if (studentsList.length === 0) return alert("List is empty!");

    setIsProcessing(true);
    const zip = new JSZip();
    const initialSelection = selectedStudent;
    window.scrollTo(0, 0);

    try {
      for (let i = 0; i < studentsList.length; i++) {
        setSelectedStudent(studentsList[i]);
        setProgressStatus(`Compiling certificate: [${i + 1}/${studentsList.length}]`);
        await new Promise(resolve => setTimeout(resolve, 400));
        
        if (certRef.current) {
          const canvas = await html2canvas(certRef.current, { 
            scale: 1.5, 
            useCORS: true, 
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false
          });
          const imgData = canvas.toDataURL('image/png', 0.9).split(',')[1];
          zip.file(`${studentsList[i].name.replace(/\s+/g, '_')}_${i + 1}.png`, imgData, { base64: true });

          const rec = await db.students.where('trackingId').equals(studentsList[i].id).first();
          if (rec && rec.id) {
            await db.students.update(rec.id, { status: 'success' });
          }
        }
      }

      setSelectedStudent(initialSelection);
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${(activeSession?.company || 'Enterprise').replace(/\s+/g, '_')}_Bulk_Certificates.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("ZIP compression failed.");
    }
    setIsProcessing(false);
    setProgressStatus('');
  };

  const handleSignOut = async () => {
    await db.settings.delete('cred_session');
    setActiveSession(null);
    setSelectedStudent(null);
    router.push('/login');
  };

  if (isLoadingSession) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex justify-center items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono font-bold">Authenticating Workspace...</span>
        </div>
      </div>
    );
  }

  const currentCount = studentsList.length;
  const successCount = studentsList.filter(s => s.status === 'success').length;
  const pendingCount = studentsList.filter(s => s.status === 'pending').length;

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col justify-start items-center font-sans relative text-slate-800 antialiased overflow-x-hidden p-4 sm:p-6 pb-12">
      
      {isProcessing && progressStatus && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-indigo-500/30 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold font-mono tracking-wide">{progressStatus}</span>
        </div>
      )}

      {/* Header Navigation */}
      <div className="bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-sm w-full max-w-[1600px] flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 z-10">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Client Workspace</span>
            <h3 className="text-base font-black text-slate-900 leading-none mt-1">{activeSession?.company || 'Organization Terminal'}</h3>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              type="button" 
              onClick={() => setActiveTab('workspace')} 
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'workspace' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              Registry Deck
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab('billing')} 
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${activeTab === 'billing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              <CreditCard className="w-3 h-3" /> Wallet & Subscriptions
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab('settings')} 
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${activeTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              <Settings className="w-3 h-3" /> Branding & Signature
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 👈 Step 3: Top Navigation bar me Scan Physical Register Button */}
          <button
            type="button"
            onClick={() => setIsOcrOpen(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer flex items-center gap-1.5"
          >
            <Scan className="w-3.5 h-3.5" /> Scan Register
          </button>

          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
            IndexedDB Active
          </span>
          <button onClick={handleSignOut} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold border border-slate-200 transition cursor-pointer">Sign Out</button>
        </div>
      </div>

      {/* 🚀 SPLIT-SCREEN LAYOUT CONTAINER */}
      <div className="w-full max-w-[1600px] min-h-[82vh] bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row z-10">
        
        {/* LEFT PANEL: Workspace Roster / Billing / Settings */}
        <div className={`transition-all duration-300 p-6 ${showPreviewModal && selectedStudent ? 'w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-slate-200' : 'w-full'}`}>
          {activeTab === 'workspace' && (
            <WorkspaceTab
              studentsList={studentsList}
              currentCount={currentCount}
              successCount={successCount}
              pendingCount={pendingCount}
              walletBalance={walletBalance}
              isProcessing={isProcessing}
              onSendBulkEmails={handleSendBulkEmails}
              onDownloadAllZIP={downloadAllZIP}
              onFileUpload={handleFileUpload}
              onSelectStudent={(student:any) => {
                setSelectedStudent(student);
                setShowPreviewModal(true);
              }}
            />
          )}

          {activeTab === 'billing' && (
            <BillingTab
              walletBalance={walletBalance}
              subscriptionTier={subscriptionTier}
              onWalletTopUp={handleWalletTopUp}
              onSubscriptionPurchase={handleSubscriptionPurchase}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              orgDisplayName={orgDisplayName}
              setOrgDisplayName={setOrgDisplayName}
              signatoryName={signatoryName}
              setSignatoryName={setSignatoryName}
              signatoryRole={signatoryRole}
              setSignatoryRole={setSignatoryRole}
              companyLogoUrl={companyLogoUrl}
              digitalSignatureUrl={digitalSignatureUrl}
              onBrandingAssetUpload={handleBrandingAssetUpload}
              onSaveBrandingSettings={handleSaveBrandingSettings}
            />
          )}
        </div>

        {/* RIGHT PANEL: Live Side-Drawer Certificate Preview */}
        {showPreviewModal && selectedStudent && (
          <CertificateModal
            selectedStudent={selectedStudent}
            certLang={certLang}
            setCertLang={setCertLang}
            orgDisplayName={orgDisplayName}
            companyLogoUrl={companyLogoUrl}
            digitalSignatureUrl={digitalSignatureUrl}
            signatoryName={signatoryName}
            signatoryRole={signatoryRole}
            qrDataUrl={qrDataUrl}
            certRef={certRef}
            onDownloadSinglePNG={downloadSinglePNG}
            onClose={() => {
              setShowPreviewModal(false);
              setSelectedStudent(null);
            }}
          />
        )}

      </div>

      {/* 👈 Step 3: OCR Register Scanner Modal Container */}
      <RegisterScannerModal
        isOpen={isOcrOpen}
        onClose={() => setIsOcrOpen(false)}
        onAddStudents={handleAddScannedStudents}
      />

    </div>
  );
}