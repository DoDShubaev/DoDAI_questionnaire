import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Users } from "lucide-react";
import _ from 'lodash';

export default function EngagementMetrics({ data }) {
  const totalResponses = data.length;
  
  // Calculate engagement metrics
  const completionRate = 100; // Since we only have completed responses
  const avgTimeMinutes = totalResponses > 0 ? _.sumBy(data, 'completion_time') / totalResponses / 60 : 0;
  
  // Interest levels
  const highInterest = data.filter(r => r.community_interest === "ברור שכן").length;
  const mediumInterest = data.filter(r => r.community_interest === "אולי - אם זה פשוט").length;
  const lowInterest = data.filter(r => r.community_interest === "לא מעניין").length;
  
  // Platform access requests
  const platformRequests = data.filter(r => r.platform_access === "כן").length;
  const platformRate = totalResponses > 0 ? (platformRequests / totalResponses * 100).toFixed(1) : 0;
  
  // Experience levels
  const experienced = data.filter(r => r.ai_usage_level === "כן – ואני משתמש באופן קבוע").length;
  const beginners = data.filter(r => r.ai_usage_level === "כן – ניסיתי אבל לא הבנתי איך").length;
  const interested = data.filter(r => r.ai_usage_level === "לא – אבל אני ממש רוצה ללמוד").length;
  const newcomers = data.filter(r => r.ai_usage_level === "לא מכיר בכלל").length;

  const metrics = [
    {
      title: "שיעור עניין בקהילה",
      value: `${((highInterest / totalResponses) * 100).toFixed(1)}%`,
      trend: "up",
      description: `${highInterest} מתוך ${totalResponses} מעוניינים בוודאות`,
      icon: Users,
      color: "green"
    },
    {
      title: "בקשות גישה לפלטפורמה",
      value: `${platformRate}%`,
      trend: "up",
      description: `${platformRequests} בקשות גישה`,
      icon: Target,
      color: "blue"
    },
    {
      title: "זמן מילוי ממוצע",
      value: `${avgTimeMinutes.toFixed(1)} דק'`,
      trend: avgTimeMinutes < 5 ? "up" : "down",
      description: "זמן אידיאלי: 3-5 דקות",
      icon: TrendingUp,
      color: avgTimeMinutes < 5 ? "green" : "orange"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">מדדי מעורבות</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${
                  metric.color === 'green' ? 'bg-green-100' :
                  metric.color === 'blue' ? 'bg-blue-100' : 'bg-orange-100'
                }`}>
                  <metric.icon className={`w-6 h-6 ${
                    metric.color === 'green' ? 'text-green-600' :
                    metric.color === 'blue' ? 'text-blue-600' : 'text-orange-600'
                  }`} />
                </div>
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-xs text-gray-500">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interest Breakdown */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>פילוח עניין בקהילה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">מעוניינים בוודאות</span>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">{highInterest}</Badge>
                <span className="text-sm text-gray-500">
                  {((highInterest / totalResponses) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">מעוניינים בתנאים</span>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-800">{mediumInterest}</Badge>
                <span className="text-sm text-gray-500">
                  {((mediumInterest / totalResponses) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">לא מעוניינים</span>
              <div className="flex items-center gap-2">
                <Badge className="bg-gray-100 text-gray-800">{lowInterest}</Badge>
                <span className="text-sm text-gray-500">
                  {((lowInterest / totalResponses) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience Level Breakdown */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>פילוח רמות ניסיון</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{experienced}</div>
              <div className="text-sm text-blue-800">מנוסים</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{beginners}</div>
              <div className="text-sm text-yellow-800">מתחילים</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{interested}</div>
              <div className="text-sm text-green-800">מעוניינים ללמוד</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{newcomers}</div>
              <div className="text-sm text-gray-800">חדשים לגמרי</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}