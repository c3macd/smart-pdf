
'use client';
import React, { useState } from 'react';
import { Card, ScoreBar } from '@/components/UILib';
type Result = {
  ok: boolean;
  text?: string;
  ai?: { score: number; notes: string[]; improvements: string[] };
  heuristic?: { score: number; missing: string[]; detail: {label: string; got: boolean; pts: number}[] };
  error?: string;
};
export default function PDFPage() {
  const [res, setRes] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  async function handleUpload(ev: React.ChangeEvent<HTMLInputElement>) {
    const f = ev.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.append('file', f);
    setBusy(true); setRes(null);
    try {
      const r = await fetch('/api/pdf-score', { method: 'POST', body: fd });
      const data = await r.json();
      setRes(data);
    } catch (e:any) {
      setRes({ ok: false, error: 'حدث خطأ أثناء الرفع أو التحليل' });
    } finally { setBusy(false); }
  }
  return (
    <main className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-4">
      <section className="space-y-4">
        <Card title="رفع نموذج PDF">
          <input type="file" accept="application/pdf" onChange={handleUpload} className="block w-full" />
          <p className="text-xs text-slate-500 mt-2">ارفع نسخة PDF من نموذج المبادرة.</p>
        </Card>
        {res?.text && (
          <Card title="نص مستخرج (للمراجعة)">
            <div className="text-xs whitespace-pre-wrap leading-6 max-h-[360px] overflow-auto bg-slate-50 border rounded p-2">{res.text}</div>
          </Card>
        )}
      </section>
      <section className="space-y-4">
        <Card title="النتيجة">
          {busy && <div className="animate-pulse text-sm">... جارِ التحليل</div>}
          {!busy && res && res.ok && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-100">
                <div className="text-sm">الدرجة النهائية:</div>
                <div className="text-3xl font-bold">{(res.ai?.score ?? res.heuristic?.score)}/100</div>
              </div>
              {res.heuristic && (
                <div>
                  <ScoreBar label="درجة خوارزمية القواعد" val={res.heuristic.score} max={100} />
                  <ul className="text-sm list-disc pr-5">
                    {res.heuristic.detail.map((d) => (
                      <li key={d.label} className={d.got ? 'text-emerald-700' : 'text-rose-700'}>
                        {d.label} — {d.pts} نقطة {d.got ? '✓' : '✖'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {res.ai && (
                <div className="text-sm space-y-2">
                  <div className="font-bold">ملاحظات الذكاء:</div>
                  <ul className="list-disc pr-5">
                    {res.ai.notes.map((n, i) => <li key={i}>{n}</li>)}
                  </ul>
                  {res.ai.improvements?.length > 0 && (
                    <>
                      <div className="font-bold mt-2">تحسينات مقترحة:</div>
                      <ul className="list-disc pr-5">
                        {res.ai.improvements.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {!busy && res && !res.ok && <div className="text-sm text-rose-700">{res.error || 'فشل التحليل'}</div>}
          {!busy && !res && <div className="text-sm text-slate-500">لم يتم رفع ملف بعد.</div>}
        </Card>
      </section>
    </main>
  );
}
