'use check-clean';
'use client';
import LinkedInButton from "@/components/LinkedInButton";
import React, { useState, useEffect, useRef } from 'react';

import Script from "next/script";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { 
  ShieldCheck, Wallet, FileSpreadsheet, Download, Lock, User, 
  Briefcase, Zap, CheckCircle, CreditCard, Sparkles, BarChart3, 
  Users, Clock, Eye, X, Settings, Image as ImageIcon, Check, PlusCircle, WifiOff 
} from 'lucide-react';
import { db, StudentRecord } from './lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface StudentData {
  id: string;
  name: string;
  course: string;
  email: string;
  status: 'pending' | 'success';
}

export default function CredVantageApp() {
  const PUBLIC_RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_key"; 

  // Multi-Tab Router: 'workspace' | 'billing' | 'settings'
  const [activeTab, setActiveTab] = useState<'workspace' | 'billing' | 'settings'>('workspace');

  // Authentication Context
  const [activeSession, setActiveSession] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Branding States
  const [orgDisplayName, setOrgDisplayName] = useState<string>('CRED-VANTAGE GLOBAL REGISTRY NETWORK');
  const [signatoryName, setSignatoryName] = useState<string>('Dr. A. P. Sharma');
  const [signatoryRole, setSignatoryRole] = useState<string>('Dean / Controller of Certification');
  const [digitalSignatureUrl, setDigitalSignatureUrl] = useState<string>('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>('');

  // Subscriptions & Wallet Storage
  const [subscriptionTier, setSubscriptionTier] = useState<string>('15-Day Free Trial');
  const [daysRemaining, setDaysRemaining] = useState<number>(15);
  const [walletBalance, setWalletBalance] = useState<number>(5000.00); 

  // Operational States
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  
  const certRef = useRef<HTMLDivElement>(null);

  // 🔄 INDEXEDDB LIVE SYNC (Dexie Hook)
  const offlineStudents = useLiveQuery(() => db.students.toArray(), []);
  
  const studentsList: StudentData[] = (offlineStudents || []).map(s => ({
    id: s.trackingId,
    name: s.name,
    course: s.course,
    email: s.email,
    status: s.status
  }));

  // Load Saved Settings from IndexedDB on startup
  useEffect(() => {
    const loadSettingsFromDB = async () => {
      const savedUser = await db.settings.get('cred_session');
      const savedBalance = await db.settings.get('cred_wallet_balance');
      const savedTier = await db.settings.get('cred_subscription_tier');
      const savedDays = await db.settings.get('cred_trial_days');
      const savedOrgName = await db.settings.get('cred_org_display_name');
      const savedSigName = await db.settings.get('cred_signatory_name');
      const savedSigRole = await db.settings.get('cred_signatory_role');
      const savedSignature = await db.settings.get('cred_digital_signature');
      const savedLogo = await db.settings.get('cred_company_logo');

      if (savedUser) setActiveSession(savedUser.value);
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
  }, []);

  // Safe Off-screen QR Generator
  useEffect(() => {
    if (!selectedStudent) return;

    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const verificationUrl = `https://credvantage.com/verify/${encodeURIComponent(selectedStudent.id)}`;

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

  // 📧 Email Dispatch Handler (STEP 2: Auto-detect and send only to valid email holders)
  const handleSendBulkEmails = async () => {
    // Filter only students with a non-empty, valid email containing '@'
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
        certificateUrl: `https://credvantage.com/verify/${encodeURIComponent(student.id)}`,
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

  // Real User Wallet Top-Up via Razorpay
  const handleWalletTopUp = async (amount: number) => {
    setIsProcessing(true);
    setProgressStatus(`Initializing Razorpay Wallet Top-Up for ₹${amount}...`);

    try {
      const options = {
        key: PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, 
        currency: "INR",
        name: "CredVantage Networks Inc.",
        description: `Micro-Ledger Wallet Credit Top-Up (INR ${amount})`,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=credvantage",
        handler: async function () {
          await updateWalletBalance(walletBalance + amount);
          setIsProcessing(false);
          setProgressStatus('');
          alert(`🎉 Top-Up Successful! Added ₹${amount.toFixed(2)} to your IndexedDB wallet balance.`);
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

      if ((window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        await updateWalletBalance(walletBalance + amount);
        setIsProcessing(false);
        setProgressStatus('');
        alert(`🎉 Top-Up Successful! Added ₹${amount.toFixed(2)} to your IndexedDB wallet balance.`);
      }
    } catch {
      setIsProcessing(false);
      setProgressStatus('');
    }
  };

  // Subscription Plan Purchase
  const handleSubscriptionPurchase = async (tierName: string, amount: number, durationDays: number) => {
    setIsProcessing(true);
    setProgressStatus(`Routing secure subscription parameters...`);

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

      if ((window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await db.settings.put({ key: 'cred_subscription_tier', value: tierName });
        await db.settings.put({ key: 'cred_trial_days', value: durationDays.toString() });
        setSubscriptionTier(tierName);
        setDaysRemaining(durationDays);
        if (amount > 0) await updateWalletBalance(walletBalance + 1000.00);
        setIsProcessing(false);
        setProgressStatus('');
        setActiveTab('workspace');
      }
    } catch {
      setIsProcessing(false);
      setProgressStatus('');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signup') {
      const newUserData = {
        id: `usr_${Math.random().toString(36).substr(2, 9)}`,
        name: fullName,
        email: email,
        company: companyName
      };
      await db.settings.put({ key: `account_${email}`, value: { ...newUserData, password } });
      alert("🎉 Account configured! Switching to login.");
      setAuthMode('login');
      setPassword('');
    } else {
      const recordObj = await db.settings.get(`account_${email}`);
      if (!recordObj) return alert("Account not found!");
      if (recordObj.value.password !== password) return alert("Invalid password.");
      
      const userSession = { id: recordObj.value.id, name: recordObj.value.name, email: recordObj.value.email, company: recordObj.value.company };
      await db.settings.put({ key: 'cred_session', value: userSession });
      setActiveSession(userSession);
      if (recordObj.value.company) setOrgDisplayName(recordObj.value.company.toUpperCase());
    }
  };

  // 📊 Spreadsheet Import (STEP 1: Import ALL rows for display with smart email detection)
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
          
          // Smart Email Column Detection (Checks header keyword or direct cell string matching '@')
          let emailKey = rowKeys.find(k => /email/i.test(k));
          if (!emailKey) {
            emailKey = rowKeys.find(k => String(row[k] || '').includes('@'));
          }

          const trackingId = idKey && row[idKey] ? String(row[idKey]).trim() : `ID-${100 + idx}`;
          const rawName = nameKey && row[nameKey] ? String(row[nameKey]).trim() : '';
          const name = rawName === '' ? trackingId : rawName;
          const course = courseKey && row[courseKey] ? String(row[courseKey]).trim() : 'General Certification';
          const email = emailKey && row[emailKey] ? String(row[emailKey]).trim() : '';

          return { trackingId, name, course, email, status: 'pending' as const };
        });

        // Store ALL students into IndexedDB without dropping rows
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
        backgroundColor: '#0f172a',
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
            backgroundColor: '#0f172a',
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
  };

  const currentCount = studentsList.length;
  const successCount = studentsList.filter(s => s.status === 'success').length;
  const pendingCount = studentsList.filter(s => s.status === 'pending').length;

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col justify-center items-center font-sans relative text-slate-800 antialiased overflow-x-hidden pb-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />

      {isProcessing && progressStatus && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-indigo-500/30 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold font-mono tracking-wide">{progressStatus}</span>
        </div>
      )}

      {!activeSession ? (
        <div className="w-full max-w-[440px] bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl p-8 relative z-10 text-slate-100">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mt-2">CredVantage Pro</h2>
            <p className="text-xs text-slate-400 text-center flex items-center gap-1">
              <WifiOff className="w-3 h-3 text-indigo-400" /> Offline IndexedDB Registry Node
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
            {authMode === 'signup' && (
              <>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="Authorized Full Name" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800 text-white text-sm" />
                </div>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="Organization / College Name" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800 text-white text-sm" />
                </div>
              </>
            )}
            
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input type="email" placeholder="Corporate Email Address" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800 text-white text-sm" />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input type="password" placeholder="Account Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800 text-white text-sm" />
            </div>

            <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm uppercase flex items-center justify-center gap-2 shadow-md">
              <Zap className="w-4 h-4 fill-white" />
              {authMode === 'login' ? 'Authenticate Account' : 'Initialize Workspace'}
            </button>
          </form>

          <div className="text-center mt-6 pt-5 border-t border-slate-900 text-xs text-slate-400">
            {authMode === 'login' ? (
              <button type="button" onClick={() => { setAuthMode('signup'); setPassword(''); }} className="text-indigo-400 font-black underline">Create tenant account →</button>
            ) : (
              <button type="button" onClick={() => { setAuthMode('login'); setPassword(''); }} className="text-indigo-400 font-black underline">Sign in securely →</button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl min-h-screen bg-slate-50 p-6 flex flex-col gap-6 items-center text-slate-800 z-10">
          
          {/* Header Bar Navigation */}
          <div className="bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-sm w-full flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Client Workspace</span>
                <h3 className="text-base font-black text-slate-900 leading-none mt-1">{activeSession?.company || 'Organization Terminal'}</h3>
              </div>
              
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button type="button" onClick={() => setActiveTab('workspace')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'workspace' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                  Registry Deck
                </button>
                <button type="button" onClick={() => setActiveTab('billing')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'billing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                  <CreditCard className="w-3 h-3" /> Wallet & Subscriptions
                </button>
                <button type="button" onClick={() => setActiveTab('settings')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                  <Settings className="w-3 h-3" /> Branding & Signature
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                IndexedDB Active
              </span>
              <button onClick={handleSignOut} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold border border-slate-200">Sign Out</button>
            </div>
          </div>

          {/* TAB 1: WORKSPACE */}
          {activeTab === 'workspace' && (
            <div className="w-full flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Offline Database</span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">{currentCount} <span className="text-xs font-normal text-slate-400">records</span></h3>
                  </div>
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-xl"><Users className="w-5 h-5" /></div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Minted Assets</span>
                    <h3 className="text-2xl font-black text-emerald-600 mt-1">{successCount}</h3>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="w-5 h-5" /></div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Batch</span>
                    <h3 className="text-2xl font-black text-amber-500 mt-1">{pendingCount}</h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-5 h-5" /></div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Wallet Balance</span>
                    <h3 className="text-2xl font-black text-indigo-600 mt-1">₹{walletBalance.toFixed(2)}</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Wallet className="w-5 h-5" /></div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs uppercase flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5" /> IndexedDB Roster Cache
                </div>

                <div className="flex flex-wrap gap-2.5 items-center justify-end w-full sm:w-auto">
                  {/* 📧 Dispatch Student Emails Button */}
                  <button
                    type="button"
                    onClick={handleSendBulkEmails}
                    disabled={isProcessing || studentsList.length === 0}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
                  >
                    📧 Dispatch Student Emails
                  </button>

                  {currentCount > 0 && (
                    <button type="button" onClick={downloadAllZIP} disabled={isProcessing} className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow">
                      <Download className="w-3.5 h-3.5" /> Export All Batch ZIP ({currentCount})
                    </button>
                  )}
                  
                  <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Upload Roster Spreadsheet
                    <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400">
                      <th className="p-4 px-6">Tracking ID</th>
                      <th className="p-4">Recipient Name</th>
                      <th className="p-4">Course Title</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right px-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-medium">
                    {studentsList.length > 0 ? (
                      studentsList.map((student, idx) => (
                        <tr key={`${student.id}-${idx}`} className="hover:bg-slate-50/60">
                          <td className="p-4 px-6 font-mono font-bold text-slate-500">{student.id}</td>
                          <td className="p-4 font-black text-slate-900">{student.name}</td>
                          <td className="p-4 text-slate-600">{student.course}</td>
                          <td className="p-4">
                            {student.status === 'success' ? (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 text-[10px] font-bold uppercase">✓ Minted</span>
                            ) : (
                              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200 text-[10px] font-bold uppercase">⏳ Cached</span>
                            )}
                          </td>
                          <td className="p-4 text-right px-6">
                            <button type="button" onClick={() => { setSelectedStudent(student); setShowPreviewModal(true); }} className="px-3 py-1.5 bg-slate-100 border border-slate-200 font-bold rounded-lg text-slate-600 hover:text-indigo-600 flex items-center gap-1 ml-auto">
                              <Eye className="w-3 h-3" /> Preview
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center p-12 text-slate-400 font-semibold">
                          No active IndexedDB records found. Upload a roster spreadsheet to save offline.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: WALLET TOP-UP & SUBSCRIPTION PLANS */}
          {activeTab === 'billing' && (
            <div className="w-full flex flex-col gap-6 animate-fade-in">
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl border border-indigo-500/30">
                <div>
                  <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest block">IndexedDB Micro-Ledger Wallet</span>
                  <h3 className="text-3xl font-black text-white mt-1">Current Balance: ₹{walletBalance.toFixed(2)}</h3>
                  <p className="text-xs text-slate-400 mt-1">Wallet balance is stored locally in Dexie IndexedDB for uninterrupted offline processing.</p>
                </div>

                <div className="flex flex-wrap gap-3 items-center justify-end">
                  <button type="button" onClick={() => handleWalletTopUp(500)} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition active:scale-95 flex items-center gap-1.5">
                    <PlusCircle className="w-3.5 h-3.5 text-indigo-400" /> Top-Up ₹500
                  </button>
                  <button type="button" onClick={() => handleWalletTopUp(1000)} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition active:scale-95 flex items-center gap-1.5">
                    <PlusCircle className="w-3.5 h-3.5 text-indigo-400" /> Top-Up ₹1,000
                  </button>
                  <button type="button" onClick={() => handleWalletTopUp(5000)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-white" /> Top-Up ₹5,000
                  </button>
                </div>
              </div>

              <div className="text-center max-w-xl mx-auto py-2">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">Enterprise Packaging Infrastructure</h2>
                <p className="text-xs text-slate-500 mt-1">Scale up your institutional limits dynamically without runtime constraints via automated subscription layers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
                {/* Plan 1 */}
                <div className={`p-6 rounded-2xl bg-white border transition-all flex flex-col justify-between ${subscriptionTier === '15-Day Free Trial' ? 'border-slate-400 shadow-md ring-2 ring-slate-400/10' : 'border-slate-200 shadow-sm'}`}>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Onboarding</span>
                    <h4 className="text-lg font-black text-slate-900">15-Day Free Trial</h4>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Perfect sandbox environment to test single layouts before production mapping.</p>
                    <div className="text-2xl font-black text-slate-900 mt-4">₹0 <span className="text-xs font-normal text-slate-400">/ user trial</span></div>
                  </div>
                  <button type="button" onClick={() => handleSubscriptionPurchase("15-Day Free Trial", 0, 15)} disabled={subscriptionTier === '15-Day Free Trial'} className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:bg-emerald-50 disabled:text-emerald-800 text-slate-700 text-xs font-bold rounded-xl transition active:scale-95">
                    {subscriptionTier === '15-Day Free Trial' ? '✓ Standard Plan Active' : 'Initialize Trial'}
                  </button>
                </div>

                {/* Plan 2 */}
                <div className={`p-6 rounded-2xl bg-white border transition-all flex flex-col justify-between ${subscriptionTier === 'Weekly Growth Plan' ? 'border-indigo-400 shadow-md ring-2 ring-indigo-500/10' : 'border-slate-200 shadow-sm'}`}>
                  <div>
                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-1">Flexible Tier</span>
                    <h4 className="text-lg font-black text-slate-900">Weekly Fast Pack</h4>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Best suite option for urgent bootcamps or short curriculum batch releases.</p>
                    <div className="text-2xl font-black text-slate-900 mt-4">₹299 <span className="text-xs font-normal text-slate-400">/ 7 days</span></div>
                  </div>
                  <button type="button" onClick={() => handleSubscriptionPurchase("Weekly Growth Plan", 299, 7)} className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition active:scale-95 shadow-md shadow-indigo-600/10">
                    {subscriptionTier === 'Weekly Growth Plan' ? 'Renew Active Layer' : 'Subscribe Weekly'}
                  </button>
                </div>

                {/* Plan 3 */}
                <div className={`p-6 rounded-2xl border transition-all relative flex flex-col justify-between ${subscriptionTier === 'Monthly Pro Master' ? 'bg-gradient-to-b from-indigo-50/20 to-white border-indigo-500 shadow-lg ring-2 ring-indigo-500/20' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[8px] tracking-widest font-black px-3 py-1 rounded-bl-xl shadow-sm uppercase">Recommended</div>
                  <div>
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block mb-1">Most Preferred</span>
                    <h4 className="text-lg font-black text-slate-900">Monthly Pro Layer</h4>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Full bulk processing capability with priority cloud cache memory allocation.</p>
                    <div className="text-2xl font-black text-slate-900 mt-4">₹999 <span className="text-xs font-normal text-slate-400">/ 30 days master</span></div>
                  </div>
                  <button type="button" onClick={() => handleSubscriptionPurchase("Monthly Pro Master", 999, 30)} className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition active:scale-95 shadow-md shadow-indigo-600/20">
                    {subscriptionTier === 'Monthly Pro Master' ? 'Renew Pro Layer' : 'Subscribe Pro Monthly'}
                  </button>
                </div>

                {/* Plan 4 */}
                <div className={`p-6 rounded-2xl bg-white border transition-all flex flex-col justify-between ${subscriptionTier === 'Annual Enterprise Suite' ? 'border-amber-300 shadow-md ring-2 ring-amber-500/10' : 'border-slate-200 shadow-sm'}`}>
                  <div>
                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-1">Institutional</span>
                    <h4 className="text-lg font-black text-slate-900">Annual Suite Corp</h4>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Dedicated permanent registry logs mapping with 24/7 dedicated account support.</p>
                    <div className="text-2xl font-black text-amber-600 mt-4">₹7,999 <span className="text-xs font-normal text-slate-400">/ 365 days</span></div>
                  </div>
                  <button type="button" onClick={() => handleSubscriptionPurchase("Annual Enterprise Suite", 7999, 365)} className="w-full mt-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black rounded-xl transition active:scale-95 shadow-sm">
                    {subscriptionTier === 'Annual Enterprise Suite' ? 'Renew Suite' : 'Subscribe Annually'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BRANDING SETTINGS */}
          {activeTab === 'settings' && (
            <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-slate-800">
              <div className="border-b border-slate-200 pb-4 mb-6">
                <h2 className="text-xl font-black text-slate-900">Organization & Certificate Settings</h2>
                <p className="text-xs text-slate-500 mt-1">All customization choices are permanently stored in IndexedDB browser storage.</p>
              </div>

              <form onSubmit={handleSaveBrandingSettings} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Institution Title</label>
                    <input type="text" value={orgDisplayName} onChange={(e) => setOrgDisplayName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold uppercase" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Authorized Signatory Name</label>
                    <input type="text" value={signatoryName} onChange={(e) => setSignatoryName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Signatory Designation / Role</label>
                    <input type="text" value={signatoryRole} onChange={(e) => setSignatoryRole(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold" />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo Upload */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-slate-700">Institution Logo</label>
                    <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-slate-50 relative cursor-pointer">
                      <ImageIcon className="w-6 h-6 text-indigo-500 mb-1" />
                      <span className="text-xs font-bold text-slate-700">Upload Logo</span>
                      <input type="file" accept="image/*" onChange={(e) => handleBrandingAssetUpload(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    {companyLogoUrl && <img src={companyLogoUrl} alt="Logo" className="h-10 object-contain self-start" />}
                  </div>

                  {/* Signature Upload */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-slate-700">Digital Signature Image</label>
                    <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-slate-50 relative cursor-pointer">
                      <ImageIcon className="w-6 h-6 text-indigo-500 mb-1" />
                      <span className="text-xs font-bold text-slate-700">Upload Transparent Signature</span>
                      <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleBrandingAssetUpload(e, 'signature')} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    {digitalSignatureUrl && <img src={digitalSignatureUrl} alt="Signature" className="h-10 object-contain invert self-start" />}
                  </div>
                </div>

                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md self-end mt-4">
                  Save Settings to IndexedDB
                </button>
              </form>
            </div>
          )}

          {/* CERTIFICATE PREVIEW MODAL */}
          {showPreviewModal && selectedStudent && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-[850px] p-6 text-white shadow-2xl relative">
                
                <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-5">
                  <div>
                    <h4 className="text-sm font-bold">Dynamic Offline Inspection Engine</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Target: <span className="text-white font-mono font-bold">{selectedStudent.name}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Download Button */}
                    <button 
                      type="button" 
                      onClick={() => downloadSinglePNG(selectedStudent)} 
                      className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow transition active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Asset (PNG)
                    </button>

                    {/* 🚀 LinkedIn Button (Newly Added) */}
                    <LinkedInButton
                      certificateTitle={selectedStudent.course}
                      organizationName={orgDisplayName}
                      issueYear={new Date().getFullYear()}
                      issueMonth={new Date().getMonth() + 1}
                      certificateId={selectedStudent.id}
                      certificateUrl={`https://credvantage.com/verify/${encodeURIComponent(selectedStudent.id)}`}
                    />

                    {/* Close Modal Button */}
                    <button 
                      type="button" 
                      onClick={() => { setShowPreviewModal(false); setSelectedStudent(null); }} 
                      className="p-2 bg-slate-800 text-slate-400 rounded-xl hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="w-full bg-slate-950 p-6 rounded-2xl flex justify-center items-center border border-slate-800">
                  <div ref={certRef} className="relative w-full aspect-[1.414/1] bg-slate-900 p-[8%] border border-slate-800 flex flex-col justify-between items-center text-white shadow-2xl">
                    
                    {/* Header */}
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

                    {/* Content */}
                    <div className="w-full text-center flex flex-col items-center my-auto py-6">
                      <span className="text-[9px] font-black uppercase tracking-[0.35em] text-indigo-400 bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-500/20">Official Attestation</span>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mt-4 font-extralight leading-none">Certificate of Achievement</h1>
                      
                      <div className="w-12 h-[1px] bg-slate-800 my-6"></div>
                      
                      <p className="text-xs italic font-serif text-slate-400">This is to certify that</p>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl tracking-tight text-white mt-3.5 font-bold font-sans">{selectedStudent.name}</h2>
                      
                      <p className="text-xs font-serif text-slate-400 mt-6 max-w-md mx-auto leading-relaxed">
                        has successfully fulfilled all academic requirements and training parameters prescribed for the graduation course of study in
                      </p>
                      <h3 className="text-xs md:text-sm font-black text-indigo-200 mt-3.5 tracking-wider uppercase font-sans bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl shadow-sm">{selectedStudent.course}</h3>
                    </div>

                    {/* Footer */}
                    <div className="w-full border-t border-slate-800/60 pt-5 flex items-end justify-between mt-auto">
                      <div className="flex flex-col gap-1 text-[8.5px] font-mono text-slate-500 text-left max-w-[50%]">
                        <span className="text-slate-400 font-black uppercase text-[8px]">REGISTRY TRACE MATRIX</span>
                        <span className="truncate max-w-[280px] text-slate-400 font-semibold">VERIFICATION_HASH: 0X{Math.random().toString(16).substring(2,28).toUpperCase()}</span>
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
          )}

        </div>
      )}
    </div>
  );
}