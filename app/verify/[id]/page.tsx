'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function VerifyPage() {
  const params = useParams();
  const certId = params.id as string;
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      if (!certId) return;
      try {
        const res = await fetch(`/api/v1/verify/${encodeURIComponent(certId)}`);
        const data = await res.json();
        if (data.valid) {
          setStudent(data.certificate);
        } else {
          setStudent(null);
        }
      } catch (err) {
        setStudent(null);
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [certId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center font-mono text-sm">
        Verifying Certificate ID: {certId}...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl">
        {student ? (
          <>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit mx-auto mb-4 border border-emerald-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
              Official Verified Credential
            </span>
            <h2 className="text-2xl font-black mt-4 text-white">{student.name}</h2>
            <p className="text-xs text-slate-400 mt-1">{student.course}</p>
            <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500 font-mono">
              <span>Certificate ID:</span>
              <span className="text-white font-bold">{student.trackingId}</span>
            </div>
          </>
        ) : (
          <>
            <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl w-fit mx-auto mb-4 border border-red-500/20">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Record Not Found</h2>
            <p className="text-xs text-slate-400 mt-2">
              Certificate ID <span className="font-mono text-amber-400">{certId}</span> was not found in the database.
            </p>
          </>
        )}
      </div>
    </div>
  );
}