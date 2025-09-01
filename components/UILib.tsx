
'use client';
import React from 'react';
export function Card({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return <div className="bg-white rounded-2xl shadow p-4"><h2 className="text-base md:text-lg font-bold mb-3">{title}</h2>{children}</div>;
}
export function ScoreBar({ label, val, max }:{ label: string; val: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (val / max) * 100));
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-sm"><span>{label}</span><span className="tabular-nums">{val}/{max}</span></div>
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden"><div className="h-2 bg-slate-900" style={{ width: pct + '%' }} /></div>
    </div>
  );
}
