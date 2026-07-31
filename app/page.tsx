'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, ArrowRight, FileSpreadsheet, Mail, 
  Globe, Lock, Sparkles, CheckCircle2, Zap, QrCode, Cpu, Layers,
  ChevronRight, Users, Award, Shield
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-48 w-[400px] h-[400px] bg-emerald-500/10 blur-3xl pointer-events-none -z-10" />

      {/* 🌐 Top Navigation Bar */}
      <header className="w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <nav className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-black text-white uppercase tracking-wider block leading-none">
                Certibanao
              </span>
              <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase block mt-1">
                Smart Blockchain powered Certificate Generation Platform.
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#security" className="hover:text-white transition-colors">Architecture</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/dashboard" 
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition active:scale-95 flex items-center gap-1.5"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* 🚀 Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-8 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> 
          <span>Smart Blockchain powered Certificate Generation Platform.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] max-w-4xl">
          Issue Tamper-Proof Credentials <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            In Seconds, At Scale.
          </span>
        </h1>

        <p className="text-slate-400 text-sm md:text-lg max-w-2xl mt-6 leading-relaxed">
          Upload student spreadsheets, generate bilingual certificates, dispatch automated email deliveries, and allow instant LinkedIn profile attestations.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition active:scale-95"
          >
            Launch Client Terminal <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/signup" 
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-sm rounded-2xl border border-slate-800 transition text-center"
          >
            Create Organization Account
          </Link>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-16 p-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-md">
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black text-white">100%</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase mt-1">Offline Caching</span>
          </div>
          <div className="flex flex-col items-center border-l border-slate-800">
            <span className="text-2xl md:text-3xl font-black text-indigo-400">Instant</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase mt-1">Spreadsheet Parsing</span>
          </div>
          <div className="flex flex-col items-center border-l border-slate-800">
            <span className="text-2xl md:text-3xl font-black text-emerald-400">Resend</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase mt-1">API Dispatch Engine</span>
          </div>
          <div className="flex flex-col items-center border-l border-slate-800">
            <span className="text-2xl md:text-3xl font-black text-purple-400">Bilingual</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase mt-1">English & Hindi</span>
          </div>
        </div>
      </section>

      {/* 🌟 Feature Showcase Section */}
      <section id="features" className="w-full max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest block mb-2">
            Enterprise Architecture
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Engineered For Higher Education & Enterprises
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Complete end-to-end credential management built for speed, security, and global recognition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-8 bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl relative overflow-hidden group hover:border-indigo-500/50 transition duration-300">
            <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl w-fit mb-6 border border-indigo-500/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Roster Spreadsheet Parser</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload XLSX/CSV rosters with intelligent column auto-matching for IDs, names, courses, and email addresses.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-indigo-400 font-bold gap-1 group-hover:translate-x-1 transition-transform">
              <span>Supports Excel & CSV</span> <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-8 bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl relative overflow-hidden group hover:border-emerald-500/50 transition duration-300">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit mb-6 border border-emerald-500/20">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Resend Email Delivery API</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dispatch official digital certificates straight to recipients' inboxes in bulk with zero email drop rates.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-emerald-400 font-bold gap-1 group-hover:translate-x-1 transition-transform">
              <span>Bulk Dispatch Engine</span> <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
          {/* Card 3 - Official LinkedIn Logo SVG */}
<div className="p-8 bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl relative overflow-hidden group hover:border-blue-500/50 transition duration-300">
  <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl w-fit mb-6 border border-blue-500/20">
    {/* Official LinkedIn Inline SVG */}
    <svg className="w-6 h-6 fill-current text-blue-400" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  </div>
  <h3 className="text-xl font-bold text-white mb-2">1-Click LinkedIn Integration</h3>
  <p className="text-xs text-slate-400 leading-relaxed">
    Allows students to seamlessly add earned achievements directly into their LinkedIn profile licenses section.
  </p>
  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-blue-400 font-bold gap-1 group-hover:translate-x-1 transition-transform">
    <span>Instant Attestation</span> <ChevronRight className="w-3.5 h-3.5" />
  </div>
</div>
          {/* Card 4 */}
          <div className="p-8 bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl relative overflow-hidden group hover:border-purple-500/50 transition duration-300">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 rounded-2xl w-fit mb-6 border border-purple-500/20">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Bilingual Certificate Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically switch certificate language renderings between English and Hindi on demand.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-purple-400 font-bold gap-1 group-hover:translate-x-1 transition-transform">
              <span>English & Hindi Ready</span> <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5 */}
          <div className="p-8 bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl relative overflow-hidden group hover:border-amber-500/50 transition duration-300">
            <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-2xl w-fit mb-6 border border-amber-500/20">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">On-Demand QR Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every certificate embeds a live vector QR code linking to verification matrices for instant employer audits.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-amber-400 font-bold gap-1 group-hover:translate-x-1 transition-transform">
              <span>Cryptographic Matrix</span> <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6 */}
          <div className="p-8 bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl relative overflow-hidden group hover:border-indigo-500/50 transition duration-300">
            <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl w-fit mb-6 border border-indigo-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Offline IndexedDB Registry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dexie-backed browser database guarantees offline work continuity without losing uploaded roster datasets.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-indigo-400 font-bold gap-1 group-hover:translate-x-1 transition-transform">
              <span>Zero-Downtime Cache</span> <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* 🔒 Security & Trust Banner */}
<section id="security" className="w-full max-w-6xl mx-auto px-6 py-12">
  <div className="p-10 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-500/30 rounded-3xl flex flex-col items-center text-center gap-3 shadow-2xl">
    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 justify-center">
      <CheckCircle2 className="w-4 h-4" /> Ready for High Volume Batches
    </span>
    <h3 className="text-2xl md:text-3xl font-black text-white uppercase">
      Start Minting Certificates Free
    </h3>
    <p className="text-xs text-slate-400 max-w-xl">
      Access the complete client terminal with pre-loaded trial credits and full export capability.
    </p>
  </div>
</section>
      {/* 🔒 Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="text-base font-black text-white uppercase tracking-wider">
              Certibanao<br/>
              <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase block mt-1">
              Smart Blockchain powered Certificate Generation Platform.
            </span>
            </div>
            
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secured by IndexedDB Local Registry Node</span>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 Certibanao | Powered by <a href="https://lyss.in" target="_blank" className="text-indigo-400 font-bold">LYSS TECHNOLOGY PVT. LTD.</a> | All Rights Reserved
          </p>
        </div>
      </footer>

    </div>
  );
}