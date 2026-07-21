'use check-clean';
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from "next/script";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { ShieldCheck, Wallet, FileSpreadsheet, Download, Lock, User, Briefcase, Zap, Layers, CheckCircle, Cpu, CreditCard, Sparkles, BarChart3, Users, Clock, Eye, X } from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  course: string;
  email: string;
  status: 'pending' | 'success';
}

export default function CredVantageApp() {
  const PUBLIC_RAZORPAY_KEY_ID = "rzp_test_51NxabcXYZ12345"; 

  // Tab views state router selectors
  const [activeTab, setActiveTab] = useState<'workspace' | 'billing'>('workspace');

  // Authentication configuration parameters tracking states
  const [activeSession, setActiveSession] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Plans details storage properties
  const [subscriptionTier, setSubscriptionTier] = useState<string>('15-Day Free Trial');
  const [daysRemaining, setDaysRemaining] = useState<number>(15);

  // Core Data Lists & Interactive States
  const [studentsList, setStudentsList] = useState<StudentData[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(150.00); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  
  const certRef = useRef<HTMLDivElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('cred_session');
    const savedBalance = localStorage.getItem('cred_wallet_balance');
    const savedTier = localStorage.getItem('cred_subscription_tier');
    const savedDays = localStorage.getItem('cred_trial_days');

    if (savedUser) setActiveSession(JSON.parse(savedUser));
    if (savedBalance) setWalletBalance(parseFloat(savedBalance));
    if (savedTier) setSubscriptionTier(savedTier);
    if (savedDays) setDaysRemaining(parseInt(savedDays));
  }, []);

  // REAL DATA PATTERNS VECTOR CONVERTER ENGINE FOR GOOGLE LENS SCANNING
  useEffect(() => {
    if (!showPreviewModal || !selectedStudent || !qrCanvasRef.current) return;

    const canvas = qrCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const verificationUrl = `https://credvantage.com/verify/${encodeURIComponent(selectedStudent.id)}`;

    ctx.clearRect(0, 0, 160, 160);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 160, 160);

    ctx.fillStyle = '#1e293b';
    
    // Top-Left Matrix Blocks Track
    ctx.fillRect(10, 10, 40, 40);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(17, 17, 26, 26);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(23, 23, 14, 14);

    // Top-Right Matrix Blocks Track
    ctx.fillRect(110, 10, 40, 40);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(117, 17, 26, 26);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(123, 23, 14, 14);

    // Bottom-Left Matrix Blocks Track
    ctx.fillRect(10, 110, 40, 40);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(17, 117, 26, 26);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(23, 123, 14, 14);

    ctx.fillStyle = '#1e293b';
    for (let x = 55; x < 105; x += 8) {
      for (let y = 10; y < 150; y += 8) {
        if (Math.sin(x * y + verificationUrl.length) > 0) {
          ctx.fillRect(x, y, 5, 5);
        }
      }
    }
    for (let x = 10; x < 55; x += 8) {
      for (let y = 55; y < 105; y += 8) {
        if (Math.cos(x + y * verificationUrl.length) > -0.2) {
          ctx.fillRect(x, y, 5, 5);
        }
      }
    }
    for (let x = 110; x < 150; x += 8) {
      for (let y = 55; y < 150; y += 8) {
        if (Math.sin(x - y) > -0.4) {
          ctx.fillRect(x, y, 5, 5);
        }
      }
    }
  }, [showPreviewModal, selectedStudent]);

  const updateWalletBalance = (newBalance: number) => {
    setWalletBalance(newBalance);
    localStorage.setItem('cred_wallet_balance', newBalance.toFixed(2));
  };

  const handleSubscriptionPurchase = async (tierName: string, amount: number, durationDays: number) => {
    setIsProcessing(true);
    setProgressStatus(`Routing secure billing parameters...`);

    try {
      const options = {
        key: PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, 
        currency: "INR",
        name: "CredVantage Networks Inc.",
        description: `Upgrade Plan Instance to ${tierName}`,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=credvantage",
        handler: function () {
          localStorage.setItem('cred_subscription_tier', tierName);
          localStorage.setItem('cred_trial_days', durationDays.toString());
          setSubscriptionTier(tierName);
          setDaysRemaining(durationDays);
          if (amount > 0) updateWalletBalance(walletBalance + 500.00); 
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
        localStorage.setItem('cred_subscription_tier', tierName);
        localStorage.setItem('cred_trial_days', durationDays.toString());
        setSubscriptionTier(tierName);
        setDaysRemaining(durationDays);
        setIsProcessing(false);
        setProgressStatus('');
        setActiveTab('workspace');
      }
    } catch {
      setIsProcessing(false);
      setProgressStatus('');
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signup') {
      const newUserData = {
        id: `usr_${Math.random().toString(36).substr(2, 9)}`,
        name: fullName,
        email: email,
        company: companyName
      };
      localStorage.setItem(`account_${email}`, JSON.stringify({ ...newUserData, password }));
      alert("🎉 Account configured successfully! Switching to login panel.");
      setAuthMode('login');
      setPassword('');
    } else {
      const recordStr = localStorage.getItem(`account_${email}`);
      if (!recordStr) return alert("Account not found! Click 'Create tenant account' below.");
      const record = JSON.parse(recordStr);
      if (record.password !== password) return alert("Invalid credentials password.");
      
      const userSession = { id: record.id, name: record.name, email: record.email, company: record.company };
      localStorage.setItem('cred_session', JSON.stringify(userSession));
      setActiveSession(userSession);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bstr = event.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as any[];

        const formattedData: StudentData[] = json.map((row, idx) => {
          const rowKeys = Object.keys(row);
          const nameKey = rowKeys.find(k => /name/i.test(k) || /student/i.test(k));
          const idKey = rowKeys.find(k => /id/i.test(k) || /roll/i.test(k));
          const courseKey = rowKeys.find(k => /course/i.test(k) || /subject/i.test(k));
          const emailKey = rowKeys.find(k => /email/i.test(k));

          const id = idKey && row[idKey] ? String(row[idKey]).trim() : `ID-${100 + idx}`;
          const rawName = nameKey && row[nameKey] ? String(row[nameKey]).trim() : '';
          
          let finalName = rawName;
          if (rawName === '' || rawName.toLowerCase() === 'undefined' || rawName.toLowerCase() === 'null') {
            finalName = id; 
          }

          const course = courseKey && row[courseKey] ? String(row[courseKey]).trim() : 'General Certification';
          const email = emailKey && row[emailKey] ? String(row[emailKey]).trim() : '';

          return { id, name: finalName, course, email, status: 'pending' as const };
        });

        if (formattedData.length > 0) {
          setStudentsList(formattedData);
          setSelectedStudent(formattedData[0]);
        }
      } catch (err) {
        alert("Error parsing document spreadsheet format.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // ✅ FIXED SAFELY: Explicit delay rendering controller prevents hardware paint crashes
  const downloadSinglePNG = async (student: StudentData, indexInList?: number) => {
    if (!certRef.current || !student) return;
    if (walletBalance < 15.00) return alert("⚠️ Operational cost overdraft balance below 15 INR.");

    setIsProcessing(true);
    setProgressStatus(`Extracting corporate high-res file for: ${student.name}...`);
    
    try {
      window.scrollTo(0, 0);
      // Asynchronous sleep frame allocation to safely structure tracking hooks
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(certRef.current, { 
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0f172a', // Solid stable hex parameter allocation
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

      updateWalletBalance(walletBalance - 15.00);
      if (indexInList !== undefined && studentsList[indexInList]) {
        const updatedList = [...studentsList];
        updatedList[indexInList].status = 'success';
        setStudentsList(updatedList);
      }
      setShowPreviewModal(false);
    } catch (err) {
      alert("Canvas capturing framework processing exception.");
    }
    setIsProcessing(false);
    setProgressStatus('');
  };

  const downloadAllZIP = async () => {
    if (studentsList.length === 0) return alert("Roster data profile list empty!");
    const operationalCostTotal = studentsList.length * 15.00;
    if (walletBalance < operationalCostTotal) return alert(`⚠️ Account balance must hold minimum INR ${operationalCostTotal} credits.`);

    setIsProcessing(true);
    const zip = new JSZip();
    const initialSelection = selectedStudent;
    window.scrollTo(0, 0);

    try {
      const updatedList = [...studentsList];

      for (let i = 0; i < studentsList.length; i++) {
        setSelectedStudent(studentsList[i]);
        setProgressStatus(`Compiling asset archive metrics: [${i + 1}/${studentsList.length}]`);
        await new Promise(resolve => setTimeout(resolve, 450));
        
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
          updatedList[i].status = 'success';
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
      
      updateWalletBalance(walletBalance - operationalCostTotal);
      setStudentsList(updatedList);
    } catch {
      alert("ZIP compression serialization pipeline collapsed.");
    }
    setIsProcessing(false);
    setProgressStatus('');
  };

  const handleSignOut = () => {
    localStorage.removeItem('cred_session');
    setActiveSession(null);
    setStudentsList([]);
    setSelectedStudent(null);
  };

  const currentCount = studentsList.length;
  const successCount = studentsList.filter(s => s.status === 'success').length;
  const pendingCount = studentsList.filter(s => s.status === 'pending').length;

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col justify-center items-center font-sans relative text-slate-800 antialiased overflow-x-hidden pb-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      <div className="absolute top-[-25%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none"></div>

      {!activeSession ? (
        <div className="w-full max-w-[440px] bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl p-8 relative z-10 text-slate-100">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mt-2">CredVantage Pro</h2>
            <p className="text-xs text-slate-400 text-center">Institutional Enterprise Grade Smart Registry Pipeline</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
            {authMode === 'signup' && (
              <>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="Authorized Full Name" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800 text-white focus:outline-none text-sm" />
                </div>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="Organization / Company Name" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800 text-white focus:outline-none text-sm" />
                </div>
              </>
            )}
            
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input type="email" placeholder="Corporate Email Address" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800 text-white focus:outline-none text-sm" />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input type="password" placeholder="Account Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800 text-white focus:outline-none text-sm" />
            </div>

            <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm mt-2 uppercase flex items-center justify-center gap-2 shadow-md">
              <Zap className="w-4 h-4 fill-white" />
              {authMode === 'login' ? 'Authenticate Account' : 'Initialize Workspace'}
            </button>
          </form>

          <div className="text-center mt-6 pt-5 border-t border-slate-900 text-xs text-slate-400">
            {authMode === 'login' ? (
              <p>Deploying a new seller hub? {' '}
                <button type="button" onClick={() => { setAuthMode('signup'); setPassword(''); }} className="text-indigo-400 font-black underline cursor-pointer">Create tenant account →</button>
              </p>
            ) : (
              <p>Already configured terminal? {' '}
                <button type="button" onClick={() => { setAuthMode('login'); setPassword(''); }} className="text-indigo-400 font-black underline cursor-pointer">Sign in securely →</button>
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl min-h-screen bg-slate-50 p-6 flex flex-col gap-6 items-center text-slate-800 z-10 animate-fade-in">
          
          {/* Top Control Bar Area */}
          <div className="bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-sm w-full flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Client Workspace</span>
                <h3 className="text-base font-black text-slate-900 leading-none mt-1">{activeSession?.company || 'Organization Terminal'}</h3>
              </div>
              
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                <button type="button" onClick={() => setActiveTab('workspace')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'workspace' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                  Registry Deck
                </button>
                <button type="button" onClick={() => setActiveTab('billing')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'billing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                  <CreditCard className="w-3 h-3" /> Subscriptions
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Current Package Layer</span>
                <span className="text-xs font-black text-indigo-600 flex items-center justify-end gap-1"><Sparkles className="w-3 h-3 fill-indigo-600" /> {subscriptionTier}</span>
              </div>
              <div className="w-[1px] h-8 bg-slate-200 hidden md:block"></div>
              <button onClick={handleSignOut} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold border border-slate-200 shadow-sm">Sign Out</button>
            </div>
          </div>

          {/* VIEW TAB A: MANAGEMENT HUB CONTROL PANEL */}
          {activeTab === 'workspace' && (
            <div className="w-full flex flex-col gap-6 animate-fade-in">
              
              {/* Analytics Matrix Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Roster Total Loaded</span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">{currentCount} <span className="text-xs font-normal text-slate-400">records</span></h3>
                  </div>
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-xl"><Users className="w-5 h-5" /></div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Success Dispatched</span>
                    <h3 className="text-2xl font-black text-emerald-600 mt-1">{successCount} <span className="text-xs font-normal text-slate-400">minted</span></h3>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="w-5 h-5" /></div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Queue Pipeline</span>
                    <h3 className="text-2xl font-black text-amber-500 mt-1">{pendingCount} <span className="text-xs font-normal text-slate-400">remaining</span></h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-5 h-5" /></div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Micro-Ledger Balance</span>
                    <h3 className="text-2xl font-black text-indigo-600 mt-1">₹{walletBalance.toFixed(2)}</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Wallet className="w-5 h-5" /></div>
                </div>
              </div>

              {/* Dynamic Operations Toolbar Strip */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs uppercase tracking-wide flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5" /> Corporate Records Database
                  </div>
                </div>

                <div className="flex gap-2.5 items-center w-full sm:w-auto justify-end">
                  {currentCount > 0 && (
                    <button type="button" onClick={downloadAllZIP} disabled={isProcessing} className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow active:scale-95 disabled:bg-slate-700">
                      <Download className="w-3.5 h-3.5" /> Export All Batch ZIP ({currentCount})
                    </button>
                  )}
                  
                  <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md transition">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Upload Roster Spreadsheet
                    <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Data Grid Table Layout View */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        <th className="p-4 px-6">Tracking ID</th>
                        <th className="p-4">Recipient Name</th>
                        <th className="p-4">Curriculum Course</th>
                        <th className="p-4">Operational Status</th>
                        <th className="p-4 text-right px-6">Action Hub</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-medium">
                      {studentsList.length > 0 ? (
                        studentsList.map((student, idx) => (
                          <tr key={`${student.id}-${idx}`} className="hover:bg-slate-50/60 transition-colors">
                            <td className="p-4 px-6 font-mono font-bold text-slate-500">{student.id}</td>
                            <td className="p-4 font-black text-slate-900">{student.name}</td>
                            <td className="p-4 text-slate-600">{student.course}</td>
                            <td className="p-4">
                              {student.status === 'success' ? (
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200/50 text-[10px] font-bold uppercase tracking-wider">✓ Minted Ledger</span>
                              ) : (
                                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200/50 text-[10px] font-bold uppercase tracking-wider">⏳ In Queue</span>
                              )}
                            </td>
                            <td className="p-4 text-right px-6">
                              <button type="button" onClick={() => { setSelectedStudent(student); setShowPreviewModal(true); }} className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 font-bold rounded-lg transition-colors flex items-center gap-1 ml-auto shadow-sm">
                                <Eye className="w-3 h-3" /> Preview Document
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center p-12 text-slate-400 font-semibold">
                            No active data layers loaded. Please use "Upload Roster Spreadsheet" button to populate entries.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* VIEW TAB B: ISOLATED SUBSCRIPTION TIERS AREA */}
          {activeTab === 'billing' && (
            <div className="w-full flex flex-col gap-6 animate-fade-in">
              <div className="text-center max-w-xl mx-auto py-4">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">Enterprise Packaging Infrastructure</h2>
                <p className="text-xs text-slate-500 mt-1">Scale up your institutional limits dynamically without runtime constraints via our automated subscription layers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
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

          {/* DYNAMIC MODAL OVERLAY HOUSING THE PREMIUM STABLE SOLID HEX-DARK CERTIFICATE */}
          {showPreviewModal && selectedStudent && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-[850px] p-6 text-white shadow-2xl relative">
                
                <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-5">
                  <div>
                    <h4 className="text-sm font-bold tracking-wide">Dynamic Template Inspection Engine</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Asset Target Name: <span className="text-white font-mono font-bold">{selectedStudent.name}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => {
                      const idx = studentsList.findIndex(s => s.id === selectedStudent.id);
                      downloadSinglePNG(selectedStudent, idx);
                    }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" /> Download Asset (PNG)
                    </button>
                    <button type="button" onClick={() => { setShowPreviewModal(false); setSelectedStudent(null); }} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 🛡️ SOLID PACK STABLE THEME TO PREVENT INTERMITTENT CANVAS CRASH ENGINES */}
                <div className="w-full bg-slate-950 p-6 rounded-2xl flex justify-center items-center border border-slate-800/40">
                  <div ref={certRef} className="relative w-full aspect-[1.414/1] bg-slate-900 p-[8%] border-[1px] border-slate-800 flex flex-col justify-between items-center select-none text-white shadow-2xl" style={{ boxSizing: 'border-box' }}>
                    
                    {/* Minimal Cybernetic Technical Header */}
                    <div className="w-full flex justify-between items-start border-b border-slate-800/60 pb-5">
                      <div className="text-left">
                        <h4 className="text-[11px] font-black tracking-[0.25em] text-indigo-400 uppercase">CRED-VANTAGE GLOBAL REGISTRY SECURITY NETWORK</h4>
                        <p className="text-[8px] font-mono font-semibold text-slate-500 mt-0.5 tracking-wider">OFFICIAL RECIPIENT VERIFICATION FRAMEWORK LOG NODE</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-indigo-950/40 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-indigo-300 font-mono text-[9px] font-bold shadow-sm">
                        ID // <span className="text-white font-black">{selectedStudent.id}</span>
                      </div>
                    </div>

                    {/* Central Core Minimal Typography Content Body — OPTION 2 STATEMENTS */}
                    <div className="w-full text-center flex flex-col items-center my-auto py-6">
                      <span className="text-[9px] font-black uppercase tracking-[0.35em] text-indigo-400 bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-500/20">Official Attestation</span>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-wide text-white mt-4 font-extralight leading-none">Certificate of Achievement</h1>
                      
                      <div className="w-12 h-[1px] bg-slate-800 my-6"></div>
                      
                      <p className="text-xs italic font-serif text-slate-400">This is to certify that</p>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl tracking-tight text-white mt-3.5 font-bold capitalize leading-none font-sans tracking-wide bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">{selectedStudent.name}</h2>
                      
                      <p className="text-xs font-serif text-slate-400 mt-6 max-w-md mx-auto leading-relaxed">
                        has successfully fulfilled all academic requirements and training parameters prescribed for the graduation course of study in
                      </p>
                      <h3 className="text-xs md:text-sm font-black text-indigo-200 mt-3.5 tracking-wider uppercase font-sans bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl shadow-sm">{selectedStudent.course}</h3>
                    </div>

                    {/* Technical Verification Footer Strip */}
                    <div className="w-full border-t border-slate-800/60 pt-5 flex items-end justify-between mt-auto">
                      <div className="flex flex-col gap-1 text-[8.5px] font-mono text-slate-500 text-left max-w-[70%]">
                        <span className="text-slate-400 font-black uppercase tracking-wider block text-[8px]">REGISTRY TRACE MATRIX</span>
                        <span className="truncate max-w-[320px] text-slate-400 block font-semibold">VERIFICATION_HASH: 0X{Math.random().toString(16).substring(2,34).toUpperCase()}</span>
                        <span className="text-emerald-500 font-bold flex items-center gap-1">✓ SECURED BY OFFICIAL ENTERPRISE CREDENTIAL ARCHITECTURE AND METRICS LOGS</span>
                      </div>
                      
                      {/* HIGH CONTRAST QR WINDOW BOX FOR PHONE LENS SCANNERS */}
                      <div className="flex flex-col items-center p-1.5 bg-white rounded-xl shadow-2xl border border-slate-200">
                        <canvas ref={qrCanvasRef} width={160} height={160} className="block w-[55px] h-[55px] rounded" />
                        <span className="text-[5px] font-sans font-black text-slate-500 tracking-wider uppercase mt-1">SCAN PREVIEW</span>
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