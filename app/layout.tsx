
import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'بوابة مبادرات — تحليل PDF بالذكاء',
  description: 'رفع وتحليل نموذج المبادرة بصيغة PDF والحصول على تقييم آلي'
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="font-bold">بوابة مبادرات</div>
            <nav className="text-sm flex gap-4">
              <Link href="/" className="hover:underline">الرئيسية</Link>
              <Link href="/pdf" className="hover:underline">تحليل PDF</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
