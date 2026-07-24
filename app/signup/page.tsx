'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, User, Briefcase, Lock, Zap, WifiOff } from 'lucide-react';
import { db } from '../lib/db';

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUserData = {
      id: `usr_${Math.random().toString(36).substring(2, 11)}`,
      name: fullName,
      email: email,
      company: companyName,
    };

    await db.settings.put({ key: `account_${email}`, value: { ...newUserData, password } });
    alert("🎉 Account configured successfully! Redirecting to login...");
    router.push('/login');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col justify-center items-center font-sans text-slate-100 p-4 antialiased">
      <div className="w-full max-w-[440px] bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl p-8 relative z-10">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider mt-2">CredVantage Pro</h2>
          <p className="text-xs text-slate-400 text-center flex items-center gap-1">
            <WifiOff className="w-3 h-3 text-indigo-400" /> Offline IndexedDB Registry Node
          </p>
        </div>

        <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Authorized Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800 text-white text-sm outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="relative">
            <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Organization / College Name"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800 text-white text-sm outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="relative">
            <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="email"
              placeholder="Corporate Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800 text-white text-sm outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="password"
              placeholder="Account Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800 text-white text-sm outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm uppercase flex items-center justify-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            Initialize Workspace
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-slate-800/80 text-xs text-slate-400">
          <Link href="/login" className="text-indigo-400 font-black underline cursor-pointer">
            Sign in securely →
          </Link>
        </div>
      </div>
    </div>
  );
}