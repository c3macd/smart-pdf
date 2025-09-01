
'use client';
import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/UILib';
export default function Page() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 grid gap-4">
      <Card title="مرحبًا">
        <p className="text-sm leading-7">
          استخدم صفحة <Link href="/pdf" className="underline">تحليل PDF</Link> لرفع ملف النموذج وسيتم استخراج النص واحتساب درجة من 100 مع ملاحظات.
        </p>
      </Card>
    </main>
  );
}
