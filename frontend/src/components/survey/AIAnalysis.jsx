import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SavedAnalysis } from "@/api/entities";
import { createPageUrl } from "@/utils";
import {
  Brain,
  Sparkles,
  Target,
  Lightbulb,
  Users,
  Rocket,
  Download,
  Share,
  Link as LinkIcon,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft, // Added ArrowLeft for new UI elements
  Zap,
  TrendingUp
} from "lucide-react";

export default function AIAnalysis({ analysis, responses }) {
  const [isSaving, setIsSaving] = useState(false);
  const [shareLink, setShareLink] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'הניתוח שלי על שימוש ב-AI',
        text: 'בדיוק סיימתי שאלון מעניין על AI וקיבלתי ניתוח מותאם אישית!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('הקישור הועתק ללוח');
    }
  };

  const saveAndGenerateLink = async () => {
    setIsSaving(true);
    try {
      const shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const analysisId = `analysis_${Date.now()}`;

      await SavedAnalysis.create({
        analysis_id: analysisId,
        user_name: responses.first_name || 'משתמש',
        responses: responses,
        ai_analysis: analysis,
        share_token: shareToken
      });

      const link = `${window.location.origin}${createPageUrl('ViewAnalysis')}?token=${shareToken}`;
      setShareLink(link);
    } catch (error) {
      console.error('Error saving analysis:', error);
      alert('שגיאה בשמירת הניתוח');
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const downloadAnalysis = () => {
    const content = `
ניתוח אישי - DOD AI
===================

שם: ${responses.first_name || 'לא צוין'}
תאריך: ${new Date().toLocaleDateString('he-IL')}

פרטים אישיים:
- גיל: ${responses.age_group}
- מצב נוכחי: ${Array.isArray(responses.current_activity) ? responses.current_activity.join(', ') : responses.current_activity}
- הגדרה עצמית: ${responses.self_definition} ${responses.self_definition === 'אחר' ? `(${responses.self_definition_other})` : ''}

הניתוח המלא:
${analysis}

---
נוצר באמצעות DOD AI
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ניתוח-AI-${responses.first_name || 'משתמש'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getPersonalityBadges = () => {
    const badges = [];

    if (responses.self_definition?.includes('יצירתי')) badges.push('יצירתי');
    if (responses.self_definition?.includes('טכנולוגי')) badges.push('טכנולוגי');
    if (responses.self_definition?.includes('יזמי')) badges.push('יזמי');
    if (responses.ai_usage_level?.includes('קבוע')) badges.push('משתמש מתקדם');
    if (responses.community_interest === 'ברור שכן') badges.push('אוהב קהילה');

    return badges;
  };

  const getRecommendedTools = () => {
    const tools = [];

    // More comprehensive tool recommendations based on user profile
    if (responses.self_definition?.includes('יצירתי')) {
      tools.push(
        { name: 'Midjourney', desc: 'ליצירת תמונות מרהיבות באיכות מקצועית', category: 'יצירה ויזואלית', url: 'https://midjourney.com' },
        { name: 'RunwayML', desc: 'לעריכת וידאו מתקדמת עם AI', category: 'וידאו ואנימציה', url: 'https://runwayml.com' },
        { name: 'Adobe Firefly', desc: 'כלי יצירה משולב באקוסיסטם Adobe', category: 'יצירה ועיצוב', url: 'https://firefly.adobe.com' }
      );
    }

    if (responses.self_definition?.includes('טכנולוגי')) {
      tools.push(
        { name: 'GitHub Copilot', desc: 'עזרה בכתיבת קוד ופתרון בעיות תכנות', category: 'פיתוח וקוד', url: 'https://github.com/features/copilot' },
        { name: 'ChatGPT Plus', desc: 'לפתרון בעיות טכניות מורכבות', category: 'פתרון בעיות', url: 'https://chat.openai.com' },
        { name: 'Claude 3', desc: 'לניתוח מסמכים טכניים ותכנות', category: 'ניתוח ותכנות', url: 'https://claude.ai' }
      );
    }

    if (responses.self_definition?.includes('יזמי')) {
      tools.push(
        { name: 'Jasper AI', desc: 'ליצירת תוכן שיווקי ועסקי מקצועי', category: 'שיווק ותוכן', url: 'https://jasper.ai' },
        { name: 'Copy.ai', desc: 'לכתיבת קופי למודעות ואתרים', category: 'קופירייטינג', url: 'https://copy.ai' },
        { name: 'Gamma', desc: 'ליצירת מצגות עסקיות מרשימות', category: 'מצגות עסקיות', url: 'https://gamma.app' }
      );
    }

    if (Array.isArray(responses.current_activity) ? responses.current_activity.includes('סטודנט') : responses.current_activity?.includes('סטודנט')) {
      tools.push(
        { name: 'Notion AI', desc: 'לארגון הלימודים והכנת מטלות', category: 'למידה וארגון', url: 'https://www.notion.so/product/ai' },
        { name: 'Grammarly', desc: 'לשיפור הכתיבה האקדמית', category: 'כתיבה אקדמית', url: 'https://www.grammarly.com/' },
        { name: 'Perplexity', desc: 'למחקר ואיסוף מידע מקצועי', category: 'מחקר למידה', url: 'https://www.perplexity.ai/' }
      );
    }

    // Add general productivity tools if no specific category matches
    if (tools.length === 0) {
      tools.push(
        { name: 'ChatGPT', desc: 'עוזר AI רב-תכליתי לכל משימה', category: 'כללי', url: 'https://chat.openai.com' },
        { name: 'Claude', desc: 'לניתוח מסמכים וכתיבה מתקדמת', category: 'כתיבה וניתוח', url: 'https://claude.ai' },
        { name: 'Canva AI', desc: 'ליצירת עיצובים מקצועיים בקלות', category: 'עיצוב גרפי', url: 'https://www.canva.com/ai/' }
      );
    }

    return tools.slice(0, 3);
  };

  const getPersonalizedModels = () => {
    const models = [];

    // Recommend specific AI models based on user goals and experience
    if (responses.main_ai_goal?.includes('יצירתיות')) {
      models.push(
        { name: 'DALL-E 3', type: 'מודל יצירת תמונות', strength: 'הבנת הוראות מורכבות בעברית', use: 'ליצירת איורים ועיצובים ייחודיים' },
        { name: 'Stable Diffusion XL', type: 'מודל יצירה חופשי', strength: 'גמישות ושליטה מלאה', use: 'לניסויים יצירתיים ללא הגבלות' }
      );
    }

    if (responses.main_ai_goal?.includes('פרודוקטיביות')) {
      models.push(
        { name: 'GPT-4 Turbo', type: 'מודל שפה מתקדם', strength: 'עבודה עם מסמכים ארוכים', use: 'לעיבוד מידע ופרויקטים מורכבים' },
        { name: 'Claude 3 Opus', type: 'מודל ניתוח וכתיבה', strength: 'דיוק ואמינות גבוהים', use: 'למשימות עסקיות קריטיות' }
      );
    }

    if (responses.ai_usage_level?.includes('מתחיל')) {
      models.push(
        { name: 'ChatGPT-3.5', type: 'מודל ידידותי למתחילים', strength: 'קל לשימוש וחינמי', use: 'להתחלה ולמידה בסיסית' },
        { name: 'Google Bard', type: 'מודל עם חיבור לאינטרנט', strength: 'מידע עדכני ואמיתי', use: 'לחיפוש מידע ומחקר בסיסי' }
      );
    }

    return models.slice(0, 3);
  };

  const personalGoals = [
    "ללמוד כלי AI חדש השבוע",
    "לייצר פרויקט ראשון עם AI",
    "להצטרף לקהילה פעילה",
    "לשפר פרודוקטיביות בעבודה",
    "לפתח מיומנות חדשה"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8" style={{ direction: 'rtl' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-lg font-semibold text-emerald-600 mb-2">
          הניתוח שלך מבית DOD AI
        </p>
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" style={{ textAlign: 'center' }}>
          🎉 הניתוח האישי שלך מוכן! ✨
        </h1>
        <p className="text-slate-600 text-lg" style={{ textAlign: 'center' }}>
          בהתבסס על התשובות שלך, הכנו עבורך המלצות מותאמות אישית
        </p>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 text-center"
      >
        <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-green-800 mb-2">🚀 ברכות! זכית בגישה מוקדמת!</h3>
        <p className="text-green-700">
          כחלק מ-100 הראשונים, תקבל גישה בלעדית לפלטפורמת DoD AI כשתושק
        </p>
      </motion.div>

      {/* WhatsApp Community - Now First and Most Prominent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white overflow-hidden">
          <CardContent className="p-8 text-center" style={{ textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Users className="w-10 h-10 text-white" />
            </motion.div>
            
            <h3 className="text-3xl font-bold mb-4">
              🚀 הצטרף לקהילת DoD Beta עכשיו!
            </h3>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6" style={{ textAlign: 'right' }}>
              <div className="space-y-3 text-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-200 flex-shrink-0" />
                  <span>ליווי אישי ממני צמוד</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-200 flex-shrink-0" />
                  <span>עדכונים על כלים חדשים</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-200 flex-shrink-0" />
                  <span>תמיכה ומשוב ממשתמשים אחרים</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-200 flex-shrink-0" />
                  <span>גישה בלעדית לתכנים חדשים</span>
                </div>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="mb-4"
            >
              <a
                href="https://chat.whatsapp.com/GhJcVkxE5lEE4TJiJEFaNq"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-green-700 px-8 py-4 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
                הצטרף לקבוצת Beta עכשיו
                <ArrowLeft className="w-6 h-6" />
              </a>
            </motion.div>
            
            <p className="text-green-100 text-sm">
              ⭐ זה הצעד הכי חשוב שתעשה היום עבור המסע שלך ב-AI
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save and Share Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center gap-4 flex-wrap"
      >
        {!shareLink ? (
          <Button
            onClick={saveAndGenerateLink}
            disabled={isSaving}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                שומר...
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4" />
                שמור וצור קישור
              </>
            )}
          </Button>
        ) : (
          <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg border border-green-200">
            <span className="text-sm text-green-700">הניתוח נשמר בהצלחה!</span>
            <Button onClick={copyLink} size="sm" variant="outline" className="flex items-center gap-1">
              {showCopied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
              {showCopied ? 'הועתק!' : 'העתק קישור'}
            </Button>
          </div>
        )}

        <Button onClick={downloadAnalysis} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          הורד כקובץ
        </Button>

        <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
          <Share className="w-4 h-4" />
          שתף
        </Button>
      </motion.div>

      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-0 shadow-xl bg-slate-50">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2" style={{ direction: 'rtl', textAlign: 'right' }}>
              <Target className="w-6 h-6 text-emerald-600" />
              הפרופיל שלך
            </h2>
          </CardHeader>
          <CardContent style={{ direction: 'rtl', textAlign: 'right' }}>
            <div className="flex flex-wrap gap-2 mb-4 justify-end">
              {getPersonalityBadges().map((badge, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-800 px-3 py-1"
                >
                  {badge}
                </Badge>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div style={{ textAlign: 'right' }}>
                <span className="font-medium text-slate-700">גיל:</span>
                <p className="text-slate-600">{responses.age_group}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="font-medium text-slate-700">מצב נוכחי:</span>
                <p className="text-slate-600">
                  {Array.isArray(responses.current_activity)
                    ? responses.current_activity.join(', ')
                    : responses.current_activity}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="font-medium text-slate-700">רמת AI:</span>
                <p className="text-slate-600">
                  {responses.ai_usage_level?.includes('קבוע') ? 'מתקדם' :
                    responses.ai_usage_level?.includes('ניסיתי') ? 'מתחיל' : 'חדש לגמרי'}
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
        transition={{ delay: 0.5 }}
      >
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2" style={{ direction: 'rtl', textAlign: 'right' }}>
              <Sparkles className="w-6 h-6 text-amber-500" />
              הניתוח המלא שלך
            </h2>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-line" style={{ direction: 'rtl', textAlign: 'right' }}>
              {analysis ? analysis : (
                <span className="text-red-500 font-bold">\n⚠️ לא הצלחנו להפיק עבורך ניתוח AI כרגע. התשובות שלך נשמרו בהצלחה! תוכל לנסות שוב מאוחר יותר.\n</span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommended Tools & Models */}
      {(getRecommendedTools().length > 0 || getPersonalizedModels().length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {getRecommendedTools().length > 0 && (
            <Card className="border-0 shadow-xl mb-8">
              <CardHeader>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2" style={{ direction: 'rtl', textAlign: 'right' }}>
                  <Lightbulb className="w-6 h-6 text-amber-500" />
                  הכלים המומלצים עבורך - התחל עכשיו!
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-1 gap-4">
                  {getRecommendedTools().map((tool, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-xl border-r-4 border-emerald-500 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                      style={{ direction: 'rtl', textAlign: 'right' }}
                      onClick={() => window.open(tool.url, '_blank')}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-700">{tool.category}</Badge>
                          <Zap className="w-4 h-4 text-emerald-600" />
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 15 }}
                          className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center"
                        >
                          <ArrowLeft className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2 text-lg">{tool.name}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{tool.desc}</p>
                      <div className="mt-3 text-xs text-emerald-600 font-medium">
                        👆 לחץ כדי לנסות עכשיו
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Models Section */}
          {getPersonalizedModels().length > 0 && (
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2" style={{ direction: 'rtl', textAlign: 'right' }}>
                  <Brain className="w-6 h-6 text-purple-500" />
                  המודלים המתאימים לך
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getPersonalizedModels().map((model, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-r-4 border-purple-500"
                      style={{ direction: 'rtl', textAlign: 'right' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-purple-100 text-purple-800 text-xs">{model.type}</Badge>
                        <h3 className="font-bold text-slate-900">{model.name}</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-purple-700">החוזק: </span>
                          <span className="text-slate-600">{model.strength}</span>
                        </div>
                        <div>
                          <span className="font-medium text-purple-700">מתאים ל: </span>
                          <span className="text-slate-600">{model.use}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {/* Personal Goal Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-50 to-green-50">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2" style={{ direction: 'rtl', textAlign: 'right' }}>
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              בחר מטרה אחת להתקדמות
            </h2>
            <p className="text-slate-600" style={{ textAlign: 'right' }}>
              איזו מטרה אתה מתחייב להשיג השבוע הקרוב?
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {personalGoals.map((goal, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedGoal(goal)}
                  className={`w-full p-4 text-right rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${
                    selectedGoal === goal
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg'
                      : 'border-slate-200 hover:border-emerald-300 text-slate-700 hover:bg-white'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                    selectedGoal === goal
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-300'
                  }`}>
                    {selectedGoal === goal && (
                      <CheckCircle2 className="w-3 h-3 text-white m-0.5" />
                    )}
                  </div>
                  <span className="font-medium">{goal}</span>
                </button>
              ))}
            </div>

            {selectedGoal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-4 bg-emerald-100 rounded-xl border border-emerald-200"
              >
                <p className="text-emerald-800 font-medium mb-3" style={{ textAlign: 'right' }}>
                  מעולה! בחרת: "{selectedGoal}"
                </p>
                <p className="text-emerald-700 text-sm" style={{ textAlign: 'right' }}>
                  🎯 נעקוב אחרי ההתקדמות שלך ונעזור לך להשיג את המטרה בקבוצת הוואטסאפ!
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Thank You Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center bg-gradient-to-r from-emerald-600 to-green-600 text-white p-8 rounded-2xl"
        style={{ textAlign: 'center' }}
      >
        <h2 className="text-2xl font-bold mb-4">DoD AI ✨</h2>
        <p className="text-lg mb-6">
          מה שאתה עובר – הוא לא רק שלך.<br />
          אתה חלק מדור שלם שמתחיל ליצור לעצמו עתיד טוב יותר.<br />
          <strong>ואנחנו כאן כדי לצעוד איתך ביחד.</strong>
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={handleShare}
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Share className="w-4 h-4 ml-2" />
            שתף עם חברים
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
