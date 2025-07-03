import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Sparkles } from "lucide-react";
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { he } from 'date-fns/locale';

export default function RecentResponses({ data = [] }) {
  // Helper function to safely parse dates
  const safeParseDateString = (dateString) => {
    if (!dateString) return null;
    try {
      const parsed = parseISO(dateString);
      return isValid(parsed) ? parsed : null;
    } catch (error) {
      console.warn('Invalid date format:', dateString);
      return null;
    }
  };

  // Helper function to safely format distance
  const safeFormatDistance = (dateString) => {
    const date = safeParseDateString(dateString);
    if (!date) return 'זמן לא ידוע';
    try {
      return formatDistanceToNow(date, { addSuffix: true, locale: he });
    } catch (error) {
      return 'זמן לא ידוע';
    }
  };

  const recentResponses = data.slice(0, 10);

  const getExperienceColor = (level) => {
    switch (level) {
      case "כן – ואני משתמש באופן קבוע":
        return "bg-green-100 text-green-800";
      case "כן – ניסיתי אבל לא הבנתי איך":
        return "bg-yellow-100 text-yellow-800";
      case "לא – אבל אני ממש רוצה ללמוד":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getInterestColor = (interest) => {
    switch (interest) {
      case "ברור שכן":
        return "bg-green-100 text-green-800";
      case "אולי – אם זה פשוט ונגיש":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Clock className="w-5 h-5" />
          תגובות אחרונות
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentResponses.map((response, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-900">
                    {response.first_name || 'אנונימי'}
                  </span>
                  {response.age_group && (
                    <Badge variant="outline" className="text-xs border-slate-300">
                      {response.age_group}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  {safeFormatDistance(response.created_date)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <span className="text-xs text-slate-500">מצב נוכחי:</span>
                  <p className="text-sm text-slate-700">
                    {Array.isArray(response.current_activity) 
                      ? response.current_activity.join(', ') 
                      : response.current_activity || 'לא צוין'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">רמת ניסיון:</span>
                  <Badge className={`text-xs mt-1 ${getExperienceColor(response.ai_usage_level)}`}>
                    {response.ai_usage_level?.split(' – ')[0] || 'לא צוין'}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={`text-xs ${getInterestColor(response.community_interest)}`}>
                  {response.community_interest === "ברור שכן" ? "מעוניין בקהילה" :
                   response.community_interest === "אולי – אם זה פשוט ונגיש" ? "מעוניין בתנאים" : "לא מעוניין"}
                </Badge>
                {response.platform_access === "כן" && (
                  <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                    רוצה גישה לפלטפורמה
                  </Badge>
                )}
                {response.completion_time && (
                  <Badge variant="outline" className="text-xs border-slate-300">
                    {Math.round(response.completion_time / 60)} דק'
                  </Badge>
                )}
              </div>

              {response.ai_creation_dream && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-800">החלום שלו:</span>
                  </div>
                  <p className="text-sm text-emerald-700 italic">
                    "{response.ai_creation_dream.slice(0, 100)}
                    {response.ai_creation_dream.length > 100 ? '...' : ''}"
                  </p>
                </div>
              )}

              {response.known_ai_tools && Array.isArray(response.known_ai_tools) && response.known_ai_tools.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs text-slate-500">כלים מוכרים:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {response.known_ai_tools.slice(0, 4).map((tool, toolIndex) => (
                      <Badge key={toolIndex} variant="outline" className="text-xs border-slate-300">
                        {tool}
                      </Badge>
                    ))}
                    {response.known_ai_tools.length > 4 && (
                      <Badge variant="outline" className="text-xs border-slate-300">
                        +{response.known_ai_tools.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
