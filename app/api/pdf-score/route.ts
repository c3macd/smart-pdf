
import { NextRequest, NextResponse } from 'next/server'
import pdf from 'pdf-parse'
import { rubricFromText } from '@/lib/eval'
export const runtime = 'nodejs'
async function callOpenAI(text: string) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  try {
    const prompt = `
حلِّل نص نموذج مبادرة تعليمية مستخرج من PDF. قيِّم اكتمال الحقول الرئيسة (الهدف الاستراتيجي، KPI، الأهداف التفصيلية، وصف، التواريخ، الفئة المستهدفة، إجراءات التنفيذ مع المسؤول والجهة والموازنة والمخرجات والتواريخ، المخاطر ومعالجاتها، نسبة الإنجاز، المصادقة).
أعد نتيجة بصيغة JSON فقط:
{"score": 0, "notes": ["..."], "improvements": ["..."]}
النص:
-----
${text.slice(0, 8000)}
-----`.trim()
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'أنت مقيم مبادرات تعليمية. أعد JSON صالحًا فقط.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      })
    })
    if (!r.ok) return null
    const data = await r.json() as any
    const content = data?.choices?.[0]?.message?.content
    const parsed = content ? JSON.parse(content) : null
    if (!parsed) return null
    parsed.score = Math.max(0, Math.min(100, Number(parsed.score||0)))
    if (!Array.isArray(parsed.notes)) parsed.notes = []
    if (!Array.isArray(parsed.improvements)) parsed.improvements = []
    return parsed
  } catch { return null }
}
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ ok: false, error: 'لم يتم استلام ملف.' }, { status: 400 })
    const ab = await file.arrayBuffer()
    const buf = Buffer.from(ab)
    const parsed = await pdf(buf)
    const text = (parsed?.text || '').replace(/\u0000/g, '').trim()
    if (!text) return NextResponse.json({ ok: false, error: 'تعذر استخراج نص من الـ PDF.' }, { status: 400 })
    const heur = rubricFromText(text)
    const ai = await callOpenAI(text)
    return NextResponse.json({ ok: true, text, heuristic: heur, ai })
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: 'فشل تحليل الملف.' }, { status: 500 })
  }
}
