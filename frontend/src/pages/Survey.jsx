import React, { useState, useEffect } from "react";
import { SurveyResponse } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Sparkles, Brain, Users, Rocket } from "lucide-react";

import QuestionCard from "../components/survey/QuestionCard";
import ProgressIndicator from "../components/survey/ProgressIndicator";
import AIAnalysis from "../components/survey/AIAnalysis";
import WelcomeScreen from "../components/survey/WelcomeScreen";
import ThankYouScreen from "../components/survey/ThankYouScreen";

const QUESTIONS = [
  {
    id: 'age',
    title: '👤 בן כמה אתה?',
    subtitle: 'בואו נכיר אותך יותר טוב',
    type: 'single',
    field: 'age_group',
    options: ['15–17', '18–21', '22–26', '27–30']
  },
  {
    id: 'activity',
    title: 'מה אתה עושה בימים אלו?',
    subtitle: 'ספר לנו על המצב הנוכחי שלך (אפשר לבחור כמה תשובות)',
    type: 'multiple',
    field: 'current_activity',
    options: ['תלמיד תיכון', 'חייל משוחרר', 'סטודנט', 'עובד במשרה מלאה', 'עצמאי / יזם', 'עדיין מחפש את עצמי']
  },
  {
    id: 'definition',
    title: 'איך היית מגדיר את עצמך?',
    subtitle: 'מה הכי מתאר אותך כאדם?',
    type: 'single-with-other',
    field: 'self_definition',
    field_other: 'self_definition_other',
    options: ['יצירתי', 'טכנולוגי', 'יזמי', 'מחפש משמעות', 'שילוב של כמה דברים', 'אחר']
  },
  {
    id: 'tools-knowledge',
    title: '🤖 שמעת על הכלים האלה?',
    subtitle: 'סמן את מה שאתה מכיר',
    type: 'multiple',
    field: 'known_ai_tools',
    options: ['ChatGPT', 'Midjourney', 'Runway', 'DALL·E', 'Leonardo', 'Make / Zapier', 'לא מכיר אף אחד מהם']
  },
  {
    id: 'usage-level',
    title: 'השתמשת פעם באחד מהכלים האלה?',
    subtitle: 'מה רמת הניסיון שלך?',
    type: 'single',
    field: 'ai_usage_level',
    options: ['כן – ואני משתמש באופן קבוע', 'כן – ניסיתי אבל לא הבנתי איך', 'לא – אבל אני ממש רוצה ללמוד', 'לא מכיר בכלל']
  },
  {
    id: 'experience',
    title: 'מה ניסית לעשות עם AI?',
    subtitle: 'ספר לנו על הניסיון שלך (אם היה)',
    type: 'text',
    field: 'ai_experience',
    placeholder: 'לדוגמה: יצירת תמונות, כתיבת תוכן, עזרה בלימודים...'
  },
  {
    id: 'learning-method',
    title: '💡 איך את/ה לומד/ת על AI וכלים חדשים?',
    subtitle: 'ניתן לסמן כמה אפשרויות',
    type: 'multiple',
    field: 'ai_learning_method',
    field_other: 'ai_learning_method_other',
    options: ['אונליין (קורסים, יוטיוב, בלוגים)', 'ניסוי וטעייה עצמאית', 'קהילות וקבוצות (וואטסאפ, פייסבוק)', 'סדנאות / וובינרים', 'חברים / עמיתים', 'אחר']
  },
  {
    id: 'main-goal',
    title: '🎯 מהי המטרה העיקרית שלך בשימוש ב-AI כיום?',
    subtitle: 'סמן/י את האפשרות המתאימה ביותר',
    type: 'single-with-other',
    field: 'main_ai_goal',
    field_other: 'main_ai_goal_other',
    options: ['לחסוך זמן ולשפר יעילות', 'לשפר פרודוקטיביות בעבודה/לימודים', 'להגביר יצירתיות ורעיונות', 'לרכוש מיומנות טכנולוגית', 'לפתור בעיות ספציפיות', 'להיות בחזית הטכנולוגיה', 'הזדמנויות עסקיות/הכנסה', 'אחר']
  },
  {
    id: 'spending',
    title: '💰 כמה אתה משלם בחודש על כלים טכנולוגיים?',
    subtitle: 'כולל AI, תוכנות, אפליקציות',
    type: 'single',
    field: 'monthly_spending',
    options: ['0 ש"ח', 'עד 20 ש"ח', '20–100 ש"ח', 'מעל 100 ש"ח', 'אני לא משלם – משתמש רק בכלים חינמיים']
  },
  {
    id: 'barriers',
    title: 'מה עוצר אותך מלהשתמש יותר ב-AI?',
    subtitle: 'אפשר לבחור כמה תשובות',
    type: 'multiple',
    field: 'ai_barriers',
    field_other: 'barriers_other',
    options: ['הכל באנגלית', 'אני לא מבין איך זה עובד', 'אין לי כסף להשקיע בזה', 'אני לבד ואין לי ממי ללמוד', 'אני לא סומך על זה', 'אחר']
  },
  {
    id: 'biggest-challenge',
    title: '🚧 מה האתגר הגדול ביותר שלך עם AI?',
    subtitle: 'נסה/י לתאר את האתגר הגדול ביותר שחווית כשניסית לשלב AI בחייך/בעבודתך, או כשניסית ללמוד אותו.',
    type: 'text',
    field: 'biggest_ai_challenge',
    placeholder: 'לדוגמה: קשה לי להבין איך ליישם את הכלים בפועל, אני מרגיש מוצף מכמות המידע...'
  },
  {
    id: 'dream',
    title: '🚀 אם היית יכול ליצור כל דבר עם AI – מה זה היה?',
    subtitle: 'בואו נחלום קצת יחד',
    type: 'text',
    field: 'ai_creation_dream',
    placeholder: 'תן לדמיון שלך לעוף...'
  },
  {
    id: 'future-impact',
    title: '🔮 איזה שינוי משמעותי היית רוצה לראות בחייך בזכות AI?',
    subtitle: 'תאר/י את ההשפעה שהיית רוצה שתהיה ל-AI על חייך האישיים או המקצועיים בשנה הקרובה.',
    type: 'text',
    field: 'future_ai_impact',
    placeholder: 'לדוגמה: למצוא עבודה טובה יותר, להקים עסק צדדי, להפוך את הלימודים לקלים יותר...'
  },
  {
    id: 'community',
    title: 'היית מצטרף לקהילה עם ליווי אישי ופרויקטים?',
    subtitle: 'מקום שנותן לך תגמול על כל עשייה',
    type: 'single',
    field: 'community_interest',
    options: ['ברור שכן', 'אולי – אם זה פשוט ונגיש', 'לא מעניין אותי']
  },
  {
    id: 'specific-help',
    title: '🤝 איזו עזרה ספציפית הכי תעזור לך כרגע?',
    type: 'single-with-other',
    field: 'specific_ai_help',
    field_other: 'specific_ai_help_other',
    options: ['הדרכה על כלי ספציפי', 'הבנת עקרונות AI בסיסיים', 'רעיונות ופרויקטים יישומיים', 'חיבור למנטור/מומחה', 'תמיכה טכנית', 'אחר']
  },
  {
    id: 'investment-willingness',
    title: '💸 כמה היית מוכן/ה להשקיע בחודש על פתרון שיקדם אותך משמעותית?',
    subtitle: 'בהנחה שתמצא פלטפורמה/קהילה שתפתור את רוב הקשיים שלך עם AI',
    type: 'single',
    field: 'investment_willingness',
    options: ['0 ש"ח', 'עד 20 ש"ח', '20-50 ש"ח', '50-100 ש"ח', 'מעל 100 ש"ח']
  },
  {
    id: 'access',
    title: '🔗 רוצה גישה ראשונית לפלטפורמה שלנו?',
    subtitle: 'תקבל פרויקטים ותבניות בלעדיות',
    type: 'single',
    field: 'platform_access',
    options: ['כן', 'לא']
  },
  {
    id: 'details',
    title: 'אם תרצה, תוכל להשאיר פרטים',
    subtitle: 'כדי שנוכל לחזור אליך ולשתף אותך בעדכונים (לא חובה)',
    type: 'contact',
    fields: ['first_name']
  }
];

const API_BASE_URL = "https://dodai-beckend.onrender.com";

export default function Survey() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 for welcome
  const [responses, setResponses] = useState({});
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

  const progress = currentStep >= 0 ? ((currentStep + 1) / QUESTIONS.length) * 100 : 0;
  const currentQuestion = currentStep >= 0 ? QUESTIONS[currentStep] : null;

  const handleStart = () => {
    setCurrentStep(0);
  };

  const handleResponse = (field, value) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeSurvey();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (currentStep === 0) {
      setCurrentStep(-1);
    }
  };

  const completeSurvey = async () => {
    setIsGeneratingAnalysis(true);
    
    try {
      // Generate AI analysis
      const analysisPrompt = `
        נתח את התשובות הבאות של משתמש בשאלון על שימוש ב-AI ותן המלצות מותאמות אישית:
        
        גיל: ${responses.age_group}
        עיסוק: ${responses.current_activity?.join(', ')}
        הגדרה עצמית: ${responses.self_definition} ${responses.self_definition === 'אחר' ? `(פירוט: ${responses.self_definition_other || ''})` : ''}
        כלים מוכרים: ${responses.known_ai_tools?.join(', ')}
        רמת שימוש: ${responses.ai_usage_level}
        ניסיון קודם: ${responses.ai_experience}
        דרך למידה מועדפת: ${responses.ai_learning_method?.join(', ')} ${responses.ai_learning_method?.includes('אחר') ? `(פירוט: ${responses.ai_learning_method_other || ''})` : ''}
        מטרה עיקרית בשימוש ב-AI: ${responses.main_ai_goal} ${responses.main_ai_goal === 'אחר' ? `(פירוט: ${responses.main_ai_goal_other || ''})` : ''}
        הוצאה חודשית על כלים: ${responses.monthly_spending}
        מחסומים ידועים: ${responses.ai_barriers?.join(', ')} ${responses.ai_barriers?.includes('אחר') ? `(פירוט: ${responses.barriers_other || ''})` : ''}
        האתגר הגדול ביותר: ${responses.biggest_ai_challenge}
        חלום יצירה עם AI: ${responses.ai_creation_dream}
        השפעה רצויה על החיים: ${responses.future_ai_impact}
        עניין בקהילה: ${responses.community_interest}
        עזרה ספציפית נדרשת: ${responses.specific_ai_help} ${responses.specific_ai_help === 'אחר' ? `(פירוט: ${responses.specific_ai_help_other || ''})` : ''}
        נכונות להשקעה חודשית: ${responses.investment_willingness}
        
        בהתבסס על כל המידע הזה, כתוב ניתוח מותאם אישית עם:
        1. פרופיל אישיותי קצר המבוסס על הגדרה עצמית, מטרות ואתגרים.
        2. המלצות ספציפיות ל-2-3 כלי AI שמתאימים למטרות ולניסיון שלו.
        3. נתיב למידה מותאם אישית המבוסס על דרך הלמידה המועדפת עליו והעזרה הספציפית שביקש.
        4. רעיון לפרויקט אישי שמתחבר לחלומות, לשאיפות ולאתגרים שהציג.
        
        כתוב בעברית, בטון חם, מעודד ומקצועי, באורך של כ-250 מילים.
      `;

      const analysis = await InvokeLLM({
        prompt: analysisPrompt,
        add_context_from_internet: false
      });

      setAiAnalysis(analysis);

      // Save to database - handle both logged in and anonymous users
      const completionTime = Math.round((Date.now() - startTime) / 1000);
      try {
        await SurveyResponse.create({
          ...responses,
          completion_time: completionTime,
          ai_analysis: analysis
        });
      } catch (saveError) {
        // If saving fails (user not logged in), that's okay - they still get the analysis
        console.log('Could not save response (user not logged in):', saveError);
      }

      setIsComplete(true);
    } catch (error) {
      console.error('Error generating analysis:', error);
      setIsComplete(true); // Still show thank you even if analysis fails
    }
    
    setIsGeneratingAnalysis(false);
  };

  const canProceed = () => {
    if (!currentQuestion) return false;
    
    const responseValue = responses[currentQuestion.field];

    if (currentQuestion.type === 'single' || currentQuestion.type === 'single-with-other') {
      if (!responseValue) return false;
      if (responseValue === 'אחר' && currentQuestion.field_other) {
        return !!responses[currentQuestion.field_other];
      }
      return true;
    }
    if (currentQuestion.type === 'multiple') {
      if (!responseValue || responseValue.length === 0) return false;
      if (responseValue.includes('אחר') && currentQuestion.field_other) {
        return !!responses[currentQuestion.field_other];
      }
      return true;
    }
    if (currentQuestion.type === 'contact') {
      return true;
    }
    return true; 
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-slate-50" dir="rtl">
        <div className="container mx-auto px-4 py-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <AIAnalysis analysis={aiAnalysis} responses={responses} />
        </div>
      </div>
    );
  }

  if (isGeneratingAnalysis) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 sm:p-8"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border-4 border-emerald-200 border-t-emerald-600 rounded-full"
            />
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">מכין עבורך ניתוח מותאם אישית</h2>
          <p className="text-slate-600 text-sm sm:text-base">ה-AI שלנו מנתח את התשובות שלך...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="container mx-auto px-4 py-6 sm:py-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {currentStep === -1 ? (
          <WelcomeScreen onStart={handleStart} />
        ) : (
          <div className="max-w-2xl mx-auto">
            <ProgressIndicator 
              current={currentStep + 1} 
              total={QUESTIONS.length} 
              progress={progress} 
            />
            
            <AnimatePresence mode="wait">
              <QuestionCard
                key={currentStep}
                question={currentQuestion}
                responses={responses}
                onResponse={handleResponse}
                onNext={handleNext}
                onPrevious={handlePrevious}
                canProceed={canProceed()}
                showPrevious={currentStep >= 0}
              />
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}