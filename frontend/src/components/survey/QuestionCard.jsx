import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Mail, User, CheckCircle2 } from "lucide-react";

export default function QuestionCard({ 
  question, 
  responses, 
  onResponse, 
  onNext, 
  onPrevious, 
  canProceed, 
  showPrevious 
}) {
  const [otherText, setOtherText] = useState(responses[question.field_other] || "");
  const [isHovering, setIsHovering] = useState(null);

  const handleSingleChoice = (value) => {
    onResponse(question.field, value);
    if (value !== 'אחר' && question.field_other) {
      onResponse(question.field_other, '');
      setOtherText('');
    }
  };

  const handleMultipleChoice = (value) => {
    const current = responses[question.field] || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    onResponse(question.field, updated);

    if (value === 'אחר' && !updated.includes('אחר') && question.field_other) {
      onResponse(question.field_other, '');
      setOtherText('');
    }
  };

  const handleOtherInputChange = (value) => {
    setOtherText(value);
    onResponse(question.field_other, value);
  };

  const handleTextInput = (value) => {
    onResponse(question.field, value);
  };

  const handleContactField = (field, value) => {
    onResponse(field, value);
  };

  const renderOptions = () => {
    const isOtherSelectedSingle = question.type === 'single-with-other' && responses[question.field] === 'אחר';
    const isOtherSelectedMultiple = question.type === 'multiple' && (responses[question.field] || []).includes('אחר');

    if (question.type === 'single') {
      return (
        <div className="space-y-3" style={{ direction: "rtl", textAlign: "right" }}>
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setIsHovering(index)}
              onMouseLeave={() => setIsHovering(null)}
              onClick={() => handleSingleChoice(option)}
              className={`relative w-full p-4 text-right rounded-xl border-2 transition-all duration-300 ${
                responses[question.field] === option
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg transform scale-[1.02]'
                  : 'border-slate-200 hover:border-emerald-300 text-slate-700 hover:bg-slate-50'
              }`}
              style={{ direction: "rtl", textAlign: "right" }}
            >
              <div className="flex items-center justify-between flex-row-reverse" style={{ direction: "rtl", textAlign: "right" }}>
                <span className="text-sm sm:text-base font-medium" style={{ direction: "rtl", textAlign: "right" }}>{option}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                  responses[question.field] === option
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-slate-300'
                }`}>
                  {responses[question.field] === option && (
                    <CheckCircle2 className="w-3 h-3 text-white m-0.5" />
                  )}
                </div>
              </div>
              {isHovering === index && responses[question.field] !== option && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-emerald-50 rounded-xl border-2 border-emerald-200 -z-10"
                />
              )}
            </motion.button>
          ))}
        </div>
      );
    }

    if (question.type === 'single-with-other') {
      return (
        <div className="space-y-3" style={{ direction: "rtl", textAlign: "right" }}>
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setIsHovering(index)}
              onMouseLeave={() => setIsHovering(null)}
              onClick={() => handleSingleChoice(option)}
              className={`relative w-full p-4 text-right rounded-xl border-2 transition-all duration-300 ${
                responses[question.field] === option
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg transform scale-[1.02]'
                  : 'border-slate-200 hover:border-emerald-300 text-slate-700 hover:bg-slate-50'
              }`}
              style={{ direction: "rtl", textAlign: "right" }}
            >
              <div className="flex items-center justify-between flex-row-reverse" style={{ direction: "rtl", textAlign: "right" }}>
                <span className="text-sm sm:text-base font-medium" style={{ direction: "rtl", textAlign: "right" }}>{option}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                  responses[question.field] === option
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-slate-300'
                }`}>
                  {responses[question.field] === option && (
                    <CheckCircle2 className="w-3 h-3 text-white m-0.5" />
                  )}
                </div>
              </div>
              {isHovering === index && responses[question.field] !== option && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-emerald-50 rounded-xl border-2 border-emerald-200 -z-10"
                />
              )}
            </motion.button>
          ))}
          
          <AnimatePresence>
            {isOtherSelectedSingle && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Input
                  placeholder="פרט כאן..."
                  value={otherText}
                  onChange={(e) => handleOtherInputChange(e.target.value)}
                  className="mt-3 text-right text-sm sm:text-base border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                  style={{ direction: "rtl", textAlign: "right" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (question.type === 'multiple') {
      return (
        <div className="space-y-3" style={{ direction: "rtl", textAlign: "right" }}>
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setIsHovering(index)}
              onMouseLeave={() => setIsHovering(null)}
              onClick={() => handleMultipleChoice(option)}
              className={`relative w-full p-4 text-right rounded-xl border-2 transition-all duration-300 ${
                (responses[question.field] || []).includes(option)
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg transform scale-[1.02]'
                  : 'border-slate-200 hover:border-emerald-300 text-slate-700 hover:bg-slate-50'
              }`}
              style={{ direction: "rtl", textAlign: "right" }}
            >
              <div className="flex items-center justify-between flex-row-reverse" style={{ direction: "rtl", textAlign: "right" }}>
                <span className="text-sm sm:text-base font-medium" style={{ direction: "rtl", textAlign: "right" }}>{option}</span>
                <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 transition-colors ${
                  (responses[question.field] || []).includes(option)
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-slate-300'
                }`}>
                  {(responses[question.field] || []).includes(option) && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </div>
              </div>
              {isHovering === index && !(responses[question.field] || []).includes(option) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-emerald-50 rounded-xl border-2 border-emerald-200 -z-10"
                />
              )}
            </motion.button>
          ))}

          <AnimatePresence>
            {isOtherSelectedMultiple && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Input
                  placeholder="פרט כאן..."
                  value={otherText}
                  onChange={(e) => handleOtherInputChange(e.target.value)}
                  className="mt-3 text-right text-sm sm:text-base border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                  style={{ direction: "rtl", textAlign: "right" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (question.type === 'text') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Textarea
            placeholder={question.placeholder}
            value={responses[question.field] || ''}
            onChange={(e) => handleTextInput(e.target.value)}
            className="min-h-32 text-right resize-none text-sm sm:text-base border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            style={{ direction: "rtl", textAlign: "right" }}
          />
        </motion.div>
      );
    }

    if (question.type === 'contact') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
          style={{ direction: "rtl", textAlign: "right" }}
        >
          <div className="relative">
            <Label htmlFor="first_name" className="text-right block mb-3 text-base font-medium text-slate-700" style={{ direction: "rtl", textAlign: "right" }}>
              <div className="flex items-center gap-2 justify-end" style={{ direction: "rtl", textAlign: "right" }}>
                <User className="w-4 h-4 text-emerald-600" />
                <span style={{ direction: "rtl", textAlign: "right" }}>השם שלך</span>
              </div>
            </Label>
            <Input
              id="first_name"
              value={responses.first_name || ''}
              onChange={(e) => handleContactField('first_name', e.target.value)}
              className="text-right text-base border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 h-12"
              placeholder="איך קוראים לך?"
              style={{ direction: "rtl", textAlign: "right" }}
            />
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200" style={{ direction: "rtl", textAlign: "right" }}>
            <p className="text-sm text-slate-600" style={{ direction: "rtl", textAlign: "right" }}>
              💡 <strong>למה זה עוזר לנו?</strong><br />
              עם הפרטים האלה נוכל לשלוח לך עדכונים על כלים חדשים, טיפים מעשיים ולהזמין אותך לאירועים בלעדיים.
            </p>
          </div>
        </motion.div>
      );
    }
  };

  const canProceedLogic = () => {
    if (!question) return false;
    
    if (question.type === 'contact') {
      // For contact form, both fields are optional now
      return true;
    }
    
    const responseValue = responses[question.field];

    if (question.type === 'single' || question.type === 'single-with-other') {
      if (!responseValue) return false;
      if (responseValue === 'אחר' && question.field_other) {
        return !!responses[question.field_other];
      }
      return true;
    }
    if (question.type === 'multiple') {
      if (!responseValue || responseValue.length === 0) return false;
      if (responseValue.includes('אחר') && question.field_other) {
        return !!responses[question.field_other];
      }
      return true;
    }
    return true; 
  };

  return (
    <div style={{ direction: "rtl", textAlign: "right" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-2xl mx-auto px-4 sm:px-0"
      >
        <Card className="border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-right pb-6 px-6 sm:px-8" style={{ direction: "rtl", textAlign: "right" }}>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-tight"
              style={{ direction: "rtl", textAlign: "right" }}
            >
              {question.title}
            </motion.h2>
            {question.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 mt-3 text-base sm:text-lg"
                style={{ direction: "rtl", textAlign: "right" }}
              >
                {question.subtitle}
              </motion.p>
            )}
          </CardHeader>
          
          <CardContent className="px-6 sm:px-8 pb-8" style={{ direction: "rtl", textAlign: "right" }}>
            <div className="mb-8" style={{ direction: "rtl", textAlign: "right" }}>
              {renderOptions()}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-4" style={{ direction: "rtl", textAlign: "right" }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="order-1 sm:order-2"
              >
                <Button
                  onClick={onNext}
                  disabled={!canProceedLogic()}
                  className={`w-full sm:w-auto flex items-center justify-center gap-3 text-base font-semibold px-8 py-3 rounded-xl transition-all duration-300 ${ 
                    canProceedLogic() 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg hover:shadow-xl transform hover:scale-105' 
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                  style={{ direction: "rtl", textAlign: "right" }}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span style={{ direction: "rtl", textAlign: "right" }}>{question.id === 'details' ? 'סיים' : 'המשך'}</span>
                </Button>
              </motion.div>

              {showPrevious && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="order-2 sm:order-1"
                >
                  <Button
                    onClick={onPrevious}
                    variant="outline"
                    className="w-full sm:w-auto flex items-center justify-center gap-3 text-base font-medium px-8 py-3 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-300"
                    style={{ direction: "rtl", textAlign: "right" }}
                  >
                    <span style={{ direction: "rtl", textAlign: "right" }}>חזור</span>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}