
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Rocket, 
  ArrowLeft, 
  TrendingUp, 
  Brain,
  Target,
  Users,
  Award,
  Clock,
  CheckCircle2,
  Zap,
  ChevronDown,
  Lock,
  Flame,
  Home,
  X,
  Gift,
  Lightbulb
} from "lucide-react";

export default function WelcomeScreen({ onStart }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Luxury loading animation timer
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Show popup after loading animation
      setTimeout(() => setShowPopup(true), 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleStartSurvey = () => {
    setShowPopup(false);
    onStart();
  };

  const handleGoHome = () => {
    setShowPopup(false);
    // In a real app, this would navigate to the home page
  };

  // Elegant loading animation with emerald and white palette
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-slate-100 relative overflow-hidden flex items-center justify-center px-4" dir="rtl">
        {/* Subtle background particles in emerald and white */}
        <motion.div
          animate={{ x: [-20, 20, -20], y: [-30, 30, -30], opacity: [0, 0.2, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-40 sm:h-40 bg-emerald-300 rounded-full filter blur-2xl"
        />
        <motion.div
          animate={{ x: [25, -25, 25], y: [35, -35, 35], opacity: [0, 0.2, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 3 }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-56 sm:h-56 bg-white rounded-full filter blur-2xl"
        />
        <motion.div
          animate={{ x: [-15, 15, -15], y: [20, -20, 20], opacity: [0, 0.25, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear", delay: 6 }}
          className="absolute top-3/4 left-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-200 rounded-full filter blur-xl"
        />

        {/* Center Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center z-10 px-4"
        >
          <motion.div
            className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 sm:mb-8 relative flex items-center justify-center"
          >
            {/* Pulsing glow in emerald */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-emerald-400 rounded-full filter blur-xl"
            />
            {/* Secondary white glow */}
            <motion.div
              animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute inset-0 bg-white rounded-full filter blur-lg"
            />
            <Brain className="w-10 h-10 sm:w-14 sm:h-14 text-emerald-600 relative z-10" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.2 }}
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-emerald-700 mb-4 tracking-wide">DOD AI</h2>
            <motion.p 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-emerald-600 text-lg sm:text-xl font-medium"
            >
              מכין עבורך חוויה מותאמת אישית...
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100" 
        dir="rtl"
      >
        {/* Value Popup */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              dir="rtl"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="max-w-sm w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 sm:p-6 text-white text-center relative">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="absolute top-3 left-3 sm:top-4 sm:left-4 text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  >
                    <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ textAlign: 'center' }}>
                    זה לא עוד סתם שאלון
                  </h3>
                  <p className="text-emerald-100 text-sm sm:text-base" style={{ textAlign: 'center' }}>
                    זה שאלון עם ערך אמיתי
                  </p>
                </div>

                <div className="p-4 sm:p-6" style={{ direction: 'rtl', textAlign: 'right' }}>
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm sm:text-base">ניתוח אישי מדויק</h4>
                        <p className="text-xs sm:text-sm text-slate-600">מבוסס על השאלון שלך</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm sm:text-base">3 כלים מותאמים בדיוק לך</h4>
                        <p className="text-xs sm:text-sm text-slate-600">רק מה שרלוונטי למטרות שלך</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm sm:text-base">תוכנית פעולה ברורה</h4>
                        <p className="text-xs sm:text-sm text-slate-600">צעדים קונקרטיים להצלחה</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      onClick={handleStartSurvey}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                    >
                      <span>התחל את השאלון</span>
                      <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    </Button>

                    <Button
                      onClick={handleGoHome}
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base"
                    >
                      <Home className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                      <span>חזור לדף הבית</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rest of the welcome screen content */}
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            {/* Hero Section */}
            <div className="text-center mb-12 sm:mb-16">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-3xl sm:text-4xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight px-4"
              >
                מי שמבין AI היום
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  שולט במחר
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
              >
                אל תישאר מאחור. בעידן שבו AI משנה הכל,
                <br />
                הנכונים יקבלו את הכלים המדויקים <strong>עכשיו</strong>, לא מחר.
              </motion.p>

              {/* Key Promise */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-emerald-200 max-w-2xl mx-auto mx-4"
              >
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mx-auto mb-2 sm:mb-3" />
                <p className="text-emerald-800 font-semibold text-base sm:text-lg mb-2">
                  ⚡ תוך 5 דקות תקבל:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-center gap-2 text-emerald-700">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                    ניתוח אישי מדויק
                  </div>
                  <div className="flex items-center justify-center gap-2 text-emerald-700">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    3 כלים מותאמים לך
                  </div>
                  <div className="flex items-center justify-center gap-2 text-emerald-700">
                    <Rocket className="w-3 h-3 sm:w-4 sm:h-4" />
                    תוכנית פעולה ברורה
                  </div>
                </div>
              </motion.div>
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-center mb-8 sm:mb-12 px-4"
            >
              <Button 
                onClick={() => setShowPopup(true)}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:scale-105 w-full sm:w-auto max-w-sm"
              >
                <span className="group-hover:mr-2 transition-all">התחל שאלון</span>
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <p className="text-xs sm:text-sm text-slate-500 mt-3 sm:mt-4">
                🎯 מדויק אישית | 🔒 חינם לחלוטין | ⚡ תוצאות מיידיות
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
            >
              <ChevronDown className="w-8 h-8 text-slate-400 mx-auto"/>
            </motion.div>

            {/* Process Steps */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">זה לא עוד סתם שאלון, זה שאלון עם ערך</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  במקום עוד מידע כללי - תקבל המלצות מדויקות בדיוק עבורך
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                {/* Connection Line */}
                <div className="hidden lg:block absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200 transform -translate-x-1/2 -translate-y-1/2"></div>
                
                {[
                  {
                    icon: TrendingUp,
                    title: "נכיר אותך לעומק",
                    subtitle: "שלב 1",
                    description: "לא עוד שאלות גנריות. נבין את המטרות שלך, איפה אתה נמצא, ומה באמת מעניין אותך בעולם ה-AI",
                    features: ["המטרות האמיתיות שלך", "רמת הניסיון הנוכחית", "האתגרים הספציפיים שלך"],
                    color: "emerald"
                  },
                  {
                    icon: Brain,
                    title: "ניתוח חכם ומותאם",
                    subtitle: "שלב 2",
                    description: "האלגוריתם שלנו לא נותן המלצות גנריות. הוא מנתח את הפרופיל הייחודי שלך ויוצר המלצות מדויקות",
                    features: ["ניתוח פרופיל אישי", "התאמה לסגנון הלמידה שלך", "המלצות מבוססות נתונים"],
                    color: "amber"
                  },
                  {
                    icon: Rocket,
                    title: "תוכנית פעולה מעשית",
                    subtitle: "שלב 3",
                    description: "לא רק רעיונות - צעדים קונקרטיים. כלים ספציפיים, משאבי למידה, וקהילה שתתמוך בך בדרך",
                    features: ["כלים ספציפיים בדיוק עבורך", "צעדים ברורים וקלים ליישום", "קהילה פעילה לתמיכה"],
                    color: "green"
                  }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.7 + index * 0.2, duration: 0.6 }}
                    className="relative"
                  >
                    <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm overflow-hidden group">
                      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${
                        step.color === 'emerald' ? 'from-emerald-400 to-green-400' :
                        step.color === 'amber' ? 'from-amber-400 to-yellow-400' :
                        'from-green-400 to-emerald-400'
                      }`} />
                      
                      <CardContent className="p-8 text-center relative" style={{ direction: 'rtl', textAlign: 'right' }}>
                        <div className="relative mb-6">
                          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg ${
                            step.color === 'emerald' ? 'bg-gradient-to-br from-emerald-100 to-green-100' :
                            step.color === 'amber' ? 'bg-gradient-to-br from-amber-100 to-yellow-100' :
                            'bg-gradient-to-br from-green-100 to-emerald-100'
                          }`}>
                            <step.icon className={`w-10 h-10 ${
                              step.color === 'emerald' ? 'text-emerald-600' :
                              step.color === 'amber' ? 'text-amber-600' :
                              'text-green-600'
                            }`} />
                          </div>
                          <Badge className={`absolute -top-2 -right-2 ${
                            step.color === 'emerald' ? 'bg-emerald-500' :
                            step.color === 'amber' ? 'bg-amber-500' :
                            'bg-green-500'
                          } text-white`}>
                            {step.subtitle}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ textAlign: 'center' }}>{step.title}</h3>
                        <p className="text-slate-600 mb-6 leading-relaxed" style={{ textAlign: 'right' }}>{step.description}</p>
                        
                        <div className="space-y-2">
                          {step.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center justify-start gap-2 text-sm text-slate-700" style={{ direction: 'rtl' }}>
                              <CheckCircle2 className={`w-4 h-4 ${
                                step.color === 'emerald' ? 'text-emerald-500' :
                                step.color === 'amber' ? 'text-amber-500' :
                                'text-green-500'
                              }`} />
                              <span style={{ textAlign: 'right' }}>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Value Proposition */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3, duration: 0.8 }}
              className="mb-16"
            >
              <Card className="border-0 shadow-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white overflow-hidden">
                <CardContent className="p-8 sm:p-12 text-center relative">
                  <div className="absolute inset-0 bg-pattern-dots opacity-20" />
                  
                  <div className="relative">
                    <Sparkles className="w-12 h-12 mx-auto mb-6 text-emerald-200" />
                    <h2 className="text-3xl font-bold mb-4">התוצאה? תחסוך חודשים של בלבול</h2>
                    <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
                      במקום לנדוד בין עשרות כלים וקורסים, תקבל מסלול ברור שמתאים בדיוק לך
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                      {[
                        { icon: Target, title: "כלים מדויקים בלבד", desc: "לא עוד רשימות אינסופיות - רק מה שמתאים לך" },
                        { icon: Zap, title: "צעדים ברורים וקלים", desc: "תדע בדיוק מה לעשות ואיך להתחיל" },
                        { icon: Award, title: "מסלול למידה אישי", desc: "מותאם לקצב שלך ולסגנון הלמידה שלך" },
                        { icon: Users, title: "קהילה שמבינה אותך", desc: "אנשים שעוברים בדיוק את מה שאתה עובר" }
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-start gap-4" style={{ direction: 'rtl', textAlign: 'right' }}>
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <benefit.icon className="w-5 h-5 text-emerald-200" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-1" style={{ textAlign: 'right' }}>{benefit.title}</h4>
                            <p className="text-emerald-100 text-sm" style={{ textAlign: 'right' }}>{benefit.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Final CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7, duration: 0.8 }}
              className="text-center"
            >
              <div className="bg-slate-100 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">מוכן להתחיל?</h3>
                <p className="text-slate-600 mb-6">
                  5 דקות עכשיו יחסכו לך שבועות של חיפושים מיותרים
                </p>
                <Button 
                  onClick={() => setShowPopup(true)}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:scale-105"
                >
                  <span className="group-hover:mr-2 transition-all">בואו נבנה לך את המסלול</span>
                  <ArrowLeft className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
