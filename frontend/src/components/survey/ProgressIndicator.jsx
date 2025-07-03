import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export default function ProgressIndicator({ current, total, progress }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8 px-4 sm:px-0"
      style={{ direction: 'rtl' }}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs sm:text-sm font-medium text-emerald-600">
          {Math.round(progress)}%
        </span>
        <span className="text-xs sm:text-sm font-medium text-slate-500">
          שאלה {current} מתוך {total}
        </span>
      </div>
      
      <div className="relative">
        <Progress 
          value={progress} 
          className="h-2 bg-slate-200"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute top-0 left-0 h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
        />
      </div>
      
      <div className="flex justify-between mt-2" style={{ direction: 'ltr' }}>
        {Array.from({ length: total }, (_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i < current ? 'bg-emerald-500' : 
              i === current - 1 ? 'bg-emerald-400' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}