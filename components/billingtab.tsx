'use client';

import React from 'react';
import { PlusCircle, Zap } from 'lucide-react';

interface BillingTabProps {
  walletBalance: number;
  subscriptionTier: string;
  onWalletTopUp: (amount: number) => void;
  onSubscriptionPurchase: (tierName: string, amount: number, durationDays: number) => void;
}

export default function BillingTab({
  walletBalance,
  subscriptionTier,
  onWalletTopUp,
  onSubscriptionPurchase,
}: BillingTabProps) {
  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* WALLET CREDIT TOP-UP BOX */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl border border-indigo-500/30">
        <div>
          <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest block">
            IndexedDB Micro-Ledger Wallet
          </span>
          <h3 className="text-3xl font-black text-white mt-1">
            Current Balance: ₹{walletBalance.toFixed(2)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Wallet balance is stored locally in Dexie IndexedDB for uninterrupted offline processing.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-end">
          <button
            type="button"
            onClick={() => onWalletTopUp(500)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-400" /> Top-Up ₹500
          </button>
          <button
            type="button"
            onClick={() => onWalletTopUp(1000)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-400" /> Top-Up ₹1,000
          </button>
          <button
            type="button"
            onClick={() => onWalletTopUp(5000)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white" /> Top-Up ₹5,000
          </button>
        </div>
      </div>

      <div className="text-center max-w-xl mx-auto py-2">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">
          Enterprise Packaging Infrastructure
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Scale up your institutional limits dynamically without runtime constraints via automated subscription layers.
        </p>
      </div>

      {/* SUBSCRIPTION PLANS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
        {/* Plan 1: Free Trial */}
        <div
          className={`p-6 rounded-2xl bg-white border transition-all flex flex-col justify-between ${
            subscriptionTier === '15-Day Free Trial'
              ? 'border-slate-400 shadow-md ring-2 ring-slate-400/10'
              : 'border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
              Onboarding
            </span>
            <h4 className="text-lg font-black text-slate-900">15-Day Free Trial</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Perfect sandbox environment to test single layouts before production mapping.
            </p>
            <div className="text-2xl font-black text-slate-900 mt-4">
              ₹0 <span className="text-xs font-normal text-slate-400">/ user trial</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSubscriptionPurchase("15-Day Free Trial", 0, 15)}
            disabled={subscriptionTier === '15-Day Free Trial'}
            className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:bg-emerald-50 disabled:text-emerald-800 text-slate-700 text-xs font-bold rounded-xl transition active:scale-95 cursor-pointer"
          >
            {subscriptionTier === '15-Day Free Trial' ? '✓ Standard Plan Active' : 'Initialize Trial'}
          </button>
        </div>

        {/* Plan 2: Weekly Pack */}
        <div
          className={`p-6 rounded-2xl bg-white border transition-all flex flex-col justify-between ${
            subscriptionTier === 'Weekly Growth Plan'
              ? 'border-indigo-400 shadow-md ring-2 ring-indigo-500/10'
              : 'border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-1">
              Flexible Tier
            </span>
            <h4 className="text-lg font-black text-slate-900">Weekly Fast Pack</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Best suite option for urgent bootcamps or short curriculum batch releases.
            </p>
            <div className="text-2xl font-black text-slate-900 mt-4">
              ₹299 <span className="text-xs font-normal text-slate-400">/ 7 days</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSubscriptionPurchase("Weekly Growth Plan", 299, 7)}
            className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition active:scale-95 shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            {subscriptionTier === 'Weekly Growth Plan' ? 'Renew Active Layer' : 'Subscribe Weekly'}
          </button>
        </div>

        {/* Plan 3: Monthly Pro */}
        <div
          className={`p-6 rounded-2xl border transition-all relative flex flex-col justify-between ${
            subscriptionTier === 'Monthly Pro Master'
              ? 'bg-gradient-to-b from-indigo-50/20 to-white border-indigo-500 shadow-lg ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[8px] tracking-widest font-black px-3 py-1 rounded-bl-xl shadow-sm uppercase">
            Recommended
          </div>
          <div>
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block mb-1">
              Most Preferred
            </span>
            <h4 className="text-lg font-black text-slate-900">Monthly Pro Layer</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Full bulk processing capability with priority cloud cache memory allocation.
            </p>
            <div className="text-2xl font-black text-slate-900 mt-4">
              ₹999 <span className="text-xs font-normal text-slate-400">/ 30 days master</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSubscriptionPurchase("Monthly Pro Master", 999, 30)}
            className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition active:scale-95 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            {subscriptionTier === 'Monthly Pro Master' ? 'Renew Pro Layer' : 'Subscribe Pro Monthly'}
          </button>
        </div>

        {/* Plan 4: Annual Enterprise Suite */}
        <div
          className={`p-6 rounded-2xl bg-white border transition-all flex flex-col justify-between ${
            subscriptionTier === 'Annual Enterprise Suite'
              ? 'border-amber-300 shadow-md ring-2 ring-amber-500/10'
              : 'border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-1">
              Institutional
            </span>
            <h4 className="text-lg font-black text-slate-900">Annual Suite Corp</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Dedicated permanent registry logs mapping with 24/7 dedicated account support.
            </p>
            <div className="text-2xl font-black text-amber-600 mt-4">
              ₹7,999 <span className="text-xs font-normal text-slate-400">/ 365 days</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSubscriptionPurchase("Annual Enterprise Suite", 7999, 365)}
            className="w-full mt-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black rounded-xl transition active:scale-95 shadow-sm cursor-pointer"
          >
            {subscriptionTier === 'Annual Enterprise Suite' ? 'Renew Suite' : 'Subscribe Annually'}
          </button>
        </div>
      </div>
    </div>
  );
}