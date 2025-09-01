
export function rubricFromText(txt: string) {
  const has = (kw: string | RegExp) => (typeof kw === 'string' ? txt.includes(kw) : kw.test(txt));
  const sections = [
    { label: 'الهدف الاستراتيجي', kw: /الهدف\s+الاستراتيجي/ , pts: 10 },
    { label: 'مؤشر الأداء الرئيسي', kw: /(مؤشر\s+الأداء|KPI)/i , pts: 15 },
    { label: 'الأهداف التفصيلية', kw: /أهداف\s+المبادرة\s+التفصيلية/ , pts: 10 },
    { label: 'وصف المبادرة', kw: /وصف\s+المبادرة/ , pts: 5 },
    { label: 'المدد والتواريخ', kw: /(تاريخ\s+بداية|تاريخ\s+نهاية|مدة\s+المبادرة)/ , pts: 10 },
    { label: 'الفئة المستهدفة', kw: /الفئة\s+المستهدفة/ , pts: 5 },
    { label: 'إجراءات التنفيذ', kw: /(الإجراءات|المسؤول|الجهة\s+التابع)/ , pts: 25 },
    { label: 'الموازنة والمخرجات', kw: /(الموازنة\s+التقديرية|المخرجات)/ , pts: 10 },
    { label: 'المخاطر ومعالجاتها', kw: /(المخاطر\s+المتوقعة|طريقة\s+التغلب)/ , pts: 10 }
  ];
  let score = 0;
  const detail: {label: string; got: boolean; pts: number}[] = [];
  for (const s of sections) {
    const got = has(s.kw);
    score += got ? s.pts : 0;
    detail.push({label: s.label, got, pts: got ? s.pts : 0});
  }
  score = Math.max(0, Math.min(100, score));
  const missing = detail.filter(d => !d.got).map(d => d.label);
  return { score, detail, missing };
}
