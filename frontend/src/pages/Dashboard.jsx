import React, { useState, useEffect } from "react";
import { SurveyResponse } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart as BarChartIcon } from "lucide-react";
import _ from "lodash";

import StatCard from "../components/dashboard/StatCard";
import DemographicsCharts from "../components/dashboard/DemographicsCharts";
import ToolsAndUsageCharts from "../components/dashboard/ToolsAndUsageCharts";
import WordAnalysis from "../components/dashboard/WordAnalysis";
import RecentResponses from "../components/dashboard/RecentResponses";
import TrendsChart from "../components/dashboard/TrendsChart";
import EngagementMetrics from "../components/dashboard/EngagementMetrics";
import BarriersAnalysis from "../components/dashboard/BarriersAnalysis";
import AllResponses from "../components/dashboard/AllResponses";

export default function Dashboard() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await SurveyResponse.list("-created_date");
        setResponses(data);
      } catch (e) {
        console.error("Failed to fetch survey responses:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const averageCompletionTime = responses.length > 0 
    ? (_.sumBy(responses, 'completion_time') / responses.length / 60).toFixed(1)
    : 0;
  
  const interestedInCommunity = responses.filter(r => r.community_interest === "ברור שכן").length;
  const wantsPlatformAccess = responses.filter(r => r.platform_access === "כן").length;
  const experiencedUsers = responses.filter(r => r.ai_usage_level === "כן – ואני משתמש באופן קבוע").length;

  if (isLoading) {
    return (
      <div className="p-8" dir="rtl" style={{ direction: 'rtl', textAlign: 'right' }}>
        <Skeleton className="h-8 w-1/4 mb-8" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>
    );
  }
  
  if (responses.length === 0) {
    return (
      <div className="p-8" dir="rtl" style={{ direction: 'rtl', textAlign: 'right' }}>
        <Alert>
          <BarChartIcon className="h-4 w-4" />
          <AlertTitle>אין עדיין נתונים</AlertTitle>
          <AlertDescription>
            עדיין לא התקבלו תגובות לשאלון. ברגע שיתחילו להצטבר נתונים, הם יופיעו כאן.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen" dir="rtl" style={{ direction: 'rtl', textAlign: 'right' }}>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">לוח בקרה - ניתוח תוצאות</h1>
      
      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <StatCard title="סך הכל משיבים" value={responses.length} />
        <StatCard title="מעוניינים בקהילה" value={interestedInCommunity} />
        <StatCard title="רוצים גישה לפלטפורמה" value={wantsPlatformAccess} />
        <StatCard title="משתמשים מנוסים" value={experiencedUsers} />
        <StatCard title="זמן מילוי ממוצע (דקות)" value={averageCompletionTime} />
      </div>

      {/* Engagement Metrics */}
      <div className="mb-8">
        <EngagementMetrics data={responses} />
      </div>

      {/* Trends Chart */}
      <div className="mb-8">
        <TrendsChart data={responses} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <DemographicsCharts data={responses} />
        <ToolsAndUsageCharts data={responses} />
      </div>

      {/* Barriers Analysis */}
      <div className="mb-8">
        <BarriersAnalysis data={responses} />
      </div>

      {/* Word Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
        <WordAnalysis data={responses} field="ai_creation_dream" title="חלומות ליצירה עם AI" />
        <WordAnalysis data={responses} field="biggest_ai_challenge" title="אתגרים נפוצים" />
        <WordAnalysis data={responses} field="future_ai_impact" title="שאיפות עתידיות" />
      </div>

      {/* Recent Responses */}
      <div className="mb-8">
        <RecentResponses data={responses} />
      </div>

      {/* All Responses */}
      <div>
        <AllResponses data={responses} />
      </div>
    </div>
  );
}
