import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sparkles } from "lucide-react";

export default function ThankYouScreen() {
  return (
    <div style={{ direction: "rtl", textAlign: "right" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
        style={{ direction: "rtl", textAlign: "right" }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-12" style={{ direction: "rtl", textAlign: "center" }}>
            <p className="text-lg font-semibold text-indigo-600 mb-4" style={{ direction: "rtl", textAlign: "center" }}>
              DOD AI
            </p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-4"
              style={{ direction: "rtl", textAlign: "center" }}
            >
              תודה רבה! ✨
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-700 space-y-4"
              style={{ direction: "rtl", textAlign: "center" }}
            >
              <p style={{ direction: "rtl", textAlign: "center" }}>
                התשובות שלך נשמרו בהצלחה!
              </p>
              <p style={{ direction: "rtl", textAlign: "center" }}>
                מה שאתה עובר – הוא לא רק שלך.<br />
                אתה חלק מדור שלם שמתחיל ליצור לעצמו עתיד טוב יותר.
              </p>
              <p className="font-semibold text-indigo-600" style={{ direction: "rtl", textAlign: "center" }}>
                ואנחנו כאן כדי לצעוד איתך ביחד.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex justify-center"
            >
              <Sparkles className="w-8 h-8 text-purple-500" />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}