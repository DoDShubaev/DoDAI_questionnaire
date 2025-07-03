
import React from 'react';
import _ from 'lodash';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HEBREW_STOP_WORDS = [
  'של', 'את', 'עם', 'על', 'כל', 'לא', 'כן', 'אני', 'אתה', 'הוא', 'היא', 'אנחנו', 'אתם',
  'הם', 'הן', 'לי', 'לך', 'לו', 'לה', 'לנו', 'לכם', 'להם', 'להן', 'ו', 'ב', 'ל', 'מ', 'ש',
  'כ', 'זה', 'זו', 'אלה', 'אלו', 'יש', 'אין', 'או', 'אם', 'אבל', 'כמו', 'רק', 'גם', 'אז',
  'מה', 'מי', 'איך', 'כמה', 'איפה', 'מתי', 'למה', 'כי', 'יותר', 'פחות', 'מאוד', 'קצת',
  'הרבה', 'שלי', 'שלך', 'שלו', 'שלה', 'שלנו', 'שלכם', 'שלהם', 'שלהן'
];

export default function WordAnalysis({ data, field, title }) {
  const wordFrequencies = _.chain(data)
    .flatMap(item => (item[field] || '').split(/[\s,.\-?!()"{}[\]:]+/))
    .map(word => word.trim())
    .filter(word => word.length > 2 && !HEBREW_STOP_WORDS.includes(word.toLowerCase()))
    .countBy()
    .toPairs()
    .sortBy(pair => -pair[1])
    .take(15)
    .value();

  if (wordFrequencies.length === 0) {
    return null;
  }
  
  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 justify-start">
          {wordFrequencies.map(([word, count]) => (
            <Badge key={word} variant="secondary" className="text-sm bg-slate-100 text-slate-800 hover:bg-slate-200">
              {word} <span className="mr-1.5 bg-emerald-200 text-emerald-800 text-xs font-bold px-1.5 rounded-full">{count}</span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
