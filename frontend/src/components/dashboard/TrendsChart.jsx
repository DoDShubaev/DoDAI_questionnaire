import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import _ from 'lodash';
import { format, parseISO, startOfDay, subDays, isValid } from 'date-fns';

export default function TrendsChart({ data = [] }) {
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

  // Group responses by day for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return startOfDay(date);
  });

  const trendData = last30Days.map(date => {
    const dayResponses = data.filter(response => {
      const responseDate = safeParseDateString(response.created_date);
      if (!responseDate) return false;
      return startOfDay(responseDate).getTime() === date.getTime();
    });

    return {
      date: format(date, 'MM/dd'),
      responses: dayResponses.length,
      interestedInCommunity: dayResponses.filter(r => r.community_interest === "ברור שכן").length,
      platformRequests: dayResponses.filter(r => r.platform_access === "כן").length
    };
  });

  // Calculate weekly averages
  const weeklyData = [];
  for (let i = 0; i < trendData.length; i += 7) {
    const weekData = trendData.slice(i, i + 7);
    const weekStart = weekData[0]?.date;
    const weekEnd = weekData[weekData.length - 1]?.date;
    
    weeklyData.push({
      week: `${weekStart}-${weekEnd}`,
      avgResponses: (_.sumBy(weekData, 'responses') / 7).toFixed(1),
      totalResponses: _.sumBy(weekData, 'responses'),
      totalInterested: _.sumBy(weekData, 'interestedInCommunity'),
      totalPlatformRequests: _.sumBy(weekData, 'platformRequests')
    });
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>מגמות והתפתחות (30 ימים אחרונים)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                wrapperStyle={{ direction: 'rtl' }}
                labelFormatter={(label) => `תאריך: ${label}`}
                formatter={(value, name) => {
                  const labels = {
                    responses: 'תגובות',
                    interestedInCommunity: 'מעוניינים בקהילה',
                    platformRequests: 'בקשות גישה'
                  };
                  return [value, labels[name] || name];
                }}
              />
              <Line 
                type="monotone" 
                dataKey="responses" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="תגובות"
              />
              <Line 
                type="monotone" 
                dataKey="interestedInCommunity" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="מעוניינים בקהילה"
              />
              <Line 
                type="monotone" 
                dataKey="platformRequests" 
                stroke="#ffc658" 
                strokeWidth={2}
                name="בקשות גישה"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {weeklyData.map((week, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 mb-2">שבוע {index + 1}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>תגובות:</span>
                  <span className="font-medium">{week.totalResponses}</span>
                </div>
                <div className="flex justify-between">
                  <span>מעוניינים:</span>
                  <span className="font-medium">{week.totalInterested}</span>
                </div>
                <div className="flex justify-between">
                  <span>בקשות גישה:</span>
                  <span className="font-medium">{week.totalPlatformRequests}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}