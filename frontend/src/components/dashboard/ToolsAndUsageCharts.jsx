
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import _ from 'lodash';

const COLORS = ['#34d399', '#f59e0b', '#86efac', '#cbd5e1', '#94a3b8'];

export default function ToolsAndUsageCharts({ data }) {
  const usageLevelData = _.chain(data)
    .countBy('ai_usage_level')
    .map((value, name) => ({ name, value }))
    .value();

  const toolKnowledgeData = _.chain(data)
    .flatMap('known_ai_tools')
    .compact()
    .countBy()
    .map((count, name) => ({ name, count }))
    .sortBy('count')
    .reverse()
    .value();

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-slate-900">ידע ושימוש בכלים</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div>
          <h3 className="text-md font-semibold mb-4 text-center text-slate-700">רמת שימוש ב-AI</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={usageLevelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {usageLevelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip wrapperStyle={{ direction: 'rtl' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-4 text-center text-slate-700">הכלים המוכרים ביותר</h3>
          <ul className="space-y-2">
            {toolKnowledgeData.map((tool, index) => (
              <li key={index} className="flex justify-between items-center text-sm text-slate-600">
                <span>{tool.name}</span>
                <span className="font-bold text-slate-800">{tool.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
