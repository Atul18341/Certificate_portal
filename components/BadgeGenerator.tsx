'use client';

import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';

interface BadgeProps {
  studentName: string;
  courseTitle: string;
  organizationName: string;
  verificationId: string;
}

export default function BadgeGenerator({
  studentName,
  courseTitle,
  organizationName,
  verificationId,
}: BadgeProps) {
  return (
    <div className="w-64 h-64 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-6 rounded-3xl border-2 border-indigo-500/40 shadow-2xl flex flex-col items-center justify-between text-center relative overflow-hidden group hover:scale-105 transition-transform">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/20 blur-2xl rounded-full pointer-events-none" />

      {/* Top Icon */}
      <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
        <Award className="w-8 h-8" />
      </div>

      {/* Badge Content */}
      <div className="my-auto">
        <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
          ✓ VERIFIED CREDENTIAL
        </span>
        <h3 className="text-sm font-black text-white uppercase tracking-tight line-clamp-2">
          {courseTitle}
        </h3>
        <p className="text-[10px] text-slate-400 font-medium mt-1 truncate max-w-[180px]">
          {studentName}
        </p>
      </div>

      {/* Bottom Footer */}
      <div className="w-full pt-2 border-t border-slate-800 flex justify-between items-center text-[8px] font-mono text-slate-500">
        <span className="truncate max-w-[100px]">{organizationName}</span>
        <span className="text-indigo-400 font-bold">{verificationId}</span>
      </div>
    </div>
  );
}