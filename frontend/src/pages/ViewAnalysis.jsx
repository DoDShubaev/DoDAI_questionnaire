import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SavedAnalysis } from "@/api/entities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Sparkles, 
  Target, 
  Lightbulb, 
  Users, 
  Rocket,
  Share,
  Download,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

export default function ViewAnalysis() {
  const [searchParams] = useSearchParams();
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const shareToken = searchParams.get('token');

  useEffect(() => {
    const loadAnalysis = async () => {
      if (!shareToken) {
        setError('לא נמצא קישור תקין');
        setIsLoading(false);
        return;
      }

      try {
        const analyses = await SavedAnalysis.filter({ share_token: shareToken });
        if (analyses.length === 0) {
          setError('הניתוח לא נמצא או שפג תוקפו');
        } else {
          setAnalysis(analyses[0]);
        }
      } catch (e) {
        setError('שגיאה בטעינת הניתוח');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalysis();
  }, [shareToken]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `הניתוח של ${analysis.user_name || 'משתמש'} - DOD AI`,
        text: 'בדוק את הניתוח המותאם אישית שלי על שימוש ב-AI!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('הקישור הועתק ללוח');
    }
  };

  const downloadAnalysis = () => {
    const content = `
ניתוח אישי - DOD AI
===================

שם: ${analysis.user_name || 'לא צוין'}
תאריך: ${new Date(analysis.created_date).toLocaleDateString('he-IL')}

פרטים אישיים:
- גיל: ${analysis.responses.age_group}
- מצב נוכחי: ${Array.isArray(analysis.responses.current_activity) ? analysis.responses.current_activity.join(', ') : analysis.responses.current_activity}
- הגדרה עצמית: ${analysis.responses.self_definition}

הניתוח המלא:
${analysis.ai_analysis}

---
נוצר באמצעות DOD AI
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ניתוח-AI-${analysis.user_name || 'משתמש'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getPersonalityBadges = () => {
    const responses = analysis.responses;
    const badges = [];
    
    if (responses.self_definition?.includes('יצירתי')) badges.push('יצירתי');
    if (responses.self_definition?.includes('טכנולוגי')) badges.push('טכנולוגי');
    if (responses.self_definition?.includes('יזמי')) badges.push('יזמי');
    if (responses.ai_usage_level?.includes('קבוע')) badges.push('משתמש מתקדם');
    if (responses.community_interest === 'ברור שכן') badges.push('אוהב קהילה');
    
    return badges;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border-4 border-indigo-200 border-t-indigo-600 rounded-full"
            />
            <Brain className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">טוען ניתוח...</h2>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center" dir="rtl">
        <div className="max-w-md mx-auto p-8">
          <Alert variant="destructive">
            <AlertDescription className="text-right">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50" dir="rtl" style={{ direction: 'rtl' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-lg font-semibold text-indigo-600 mb-2">
              הניתוח שנשמר מבית DOD AI
            </p>
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {analysis.user_name ? `הניתוח של ${analysis.user_name}` : 'ניתוח אישי'} ✨
            </h1>
            <p className="text-gray-600 text-lg">
              ניתוח מותאם אישית בעזרת בינה מלאכותית
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center gap-4 flex-wrap"
          >
            <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
              <Share className="w-4 h-4" />
              שתף
            </Button>
            <Button onClick={downloadAnalysis} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              הורד כקובץ
            </Button>
          </motion.div>

          {/* Profile Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2" style={{ textAlign: 'right' }}>
                  <Target className="w-6 h-6 text-indigo-600" />
                  הפרופיל
                </h2>
              </CardHeader>
              <CardContent style={{ textAlign: 'right' }}>
                <div className="flex flex-wrap gap-2 mb-4 justify-end">
                  {getPersonalityBadges().map((badge, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-indigo-100 text-indigo-800 px-3 py-1"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div style={{ textAlign: 'right' }}>
                    <span className="font-medium text-gray-700">גיל:</span>
                    <p className="text-gray-600">{analysis.responses.age_group}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="font-medium text-gray-700">מצב נוכחי:</span>
                    <p className="text-gray-600">
                      {Array.isArray(analysis.responses.current_activity) 
                        ? analysis.responses.current_activity.join(', ') 
                        : analysis.responses.current_activity}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="font-medium text-gray-700">רמת AI:</span>
                    <p className="text-gray-600">
                      {analysis.responses.ai_usage_level?.includes('קבוע') ? 'מתקדם' : 
                       analysis.responses.ai_usage_level?.includes('ניסיתי') ? 'מתחיל' : 'חדש לגמרי'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2" style={{ textAlign: 'right' }}>
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  הניתוח המלא
                </h2>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line" style={{ textAlign: 'right' }}>
                  {analysis.ai_analysis}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* WhatsApp Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-6" style={{ textAlign: 'right' }}>
                <div className="p-4 bg-blue-100 rounded-xl border-r-4 border-blue-500">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    הצטרף לקהילת הוואטסאפ שלנו!
                  </h3>
                  <p className="text-blue-700 mb-3">
                    צור איתנו קשר ישיר, קבל עדכונים ותתחבר עם צעירים אחרים שמתקדמים בעולם ה-AI
                  </p>
                  <a 
                    href="https://chat.whatsapp.com/GhJcVkxE5lEE4TJiJEFaNq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                    </svg>
                    הצטרף לקבוצה
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-4">DOD AI ✨</h2>
            <p className="text-lg mb-6">
              מה שאתה עובר – הוא לא רק שלך.<br />
              אתה חלק מדור שלם שמתחיל ליצור לעצמו עתיד טוב יותר.<br />
              <strong>ואנחנו כאן כדי לצעוד איתך ביחד.</strong>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}