'use client';

import React, { useState } from 'react';
import { 
  Users, CheckCircle, Clock, Wallet, BarChart3, 
  Download, FileSpreadsheet, Eye, Globe, Award 
} from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  course: string;
  email: string;
  region?: string;
  badgeUrl?: string;
  status: 'pending' | 'success';
}

interface WorkspaceTabProps {
  studentsList: StudentData[];
  currentCount: number;
  successCount: number;
  pendingCount: number;
  walletBalance: number;
  isProcessing: boolean;
  onSendBulkEmails: () => void;
  onDownloadAllZIP: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectStudent: (student: StudentData) => void;
}

export default function WorkspaceTab({
  studentsList,
  currentCount,
  successCount,
  pendingCount,
  walletBalance,
  isProcessing,
  onSendBulkEmails,
  onDownloadAllZIP,
  onFileUpload,
  onSelectStudent,
}: WorkspaceTabProps) {
  // 🟢 1. Region Filter State
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('All');

  // 🟢 2. Extract unique regions list from students data
  const availableRegions = ['All', ...Array.from(new Set(studentsList.map(s => s.region || 'Global')))];

  // 🟢 3. Filtered students list based on selected region
  const filteredStudents = selectedRegionFilter === 'All' 
    ? studentsList 
    : studentsList.filter(s => (s.region || 'Global') === selectedRegionFilter);

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Offline Database</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {currentCount} <span className="text-xs font-normal text-slate-400">records</span>
            </h3>
          </div>
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Minted Assets</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{successCount}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Batch</span>
            <h3 className="text-2xl font-black text-amber-500 mt-1">{pendingCount}</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Wallet Balance</span>
            <h3 className="text-2xl font-black text-indigo-600 mt-1">₹{walletBalance.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action Toolbar with Region Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Region Filter Selector */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Globe className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Filter Region:</span>
          <select
            value={selectedRegionFilter}
            onChange={(e) => setSelectedRegionFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 cursor-pointer shadow-sm transition"
          >
            {availableRegions.map(reg => (
              <option key={reg} value={reg}>{reg}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2.5 items-center justify-end w-full sm:w-auto">
          <button
            type="button"
            onClick={onSendBulkEmails}
            disabled={isProcessing || studentsList.length === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
          >
            📧 Dispatch Student Emails
          </button>

          {currentCount > 0 && (
            <button
              type="button"
              onClick={onDownloadAllZIP}
              disabled={isProcessing}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export All Batch ZIP ({currentCount})
            </button>
          )}

          <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md transition active:scale-95">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Upload Roster Spreadsheet
            <input type="file" accept=".xlsx, .xls, .csv" onChange={onFileUpload} className="hidden" />
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
              <th className="p-4">Region / Branch</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right px-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-medium">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, idx) => (
                <tr key={`${student.id}-${idx}`} className="hover:bg-slate-50/60">
                  <td className="p-4 px-6 font-mono font-bold text-slate-500">{student.id}</td>
                  <td className="p-4 font-black text-slate-900">{student.name}</td>
                  <td className="p-4 text-slate-600">{student.course}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 text-[10px] font-bold uppercase">
                      {student.region || 'Global'}
                    </span>
                  </td>
                  <td className="p-4">
                    {student.status === 'success' ? (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 text-[10px] font-bold uppercase">
                        ✓ Minted
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200 text-[10px] font-bold uppercase">
                        ⏳ Cached
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectStudent(student)}
                        className="px-3 py-1.5 bg-slate-100 border border-slate-200 font-bold rounded-lg text-slate-600 hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition"
                      >
                        <Eye className="w-3 h-3" /> Preview
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectStudent(student)}
                        className="px-2.5 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold rounded-lg text-xs flex items-center gap-1 hover:bg-indigo-100 transition cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" /> Badge
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-12 text-slate-400 font-semibold">
                  No active records match the selected region filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}