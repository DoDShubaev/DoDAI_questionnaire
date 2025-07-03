
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import _ from 'lodash';

const COLORS = ['#34d399', '#94a3b8', '#f59e0b', '#86efac', '#cbd5e1', '#fcd34d'];

export default function DemographicsCharts({ data }) {
  const ageData = _.chain(data)
    .countBy('age_group')
    .map((count, name) => ({ name, count }))
    .sortBy('name')
    .value();

  const activityData = _.chain(data)
    .countBy('current_activity')
    .map((count, name) => ({ name, count }))
    .sortBy('count')
    .reverse()
    .value();

  return (
    <Card className="h-full bg-white shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-slate-900">פילוח דמוגרפי</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div>
          <h3 className="text-md font-semibold mb-4 text-center text-slate-700">לפי קבוצת גיל</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ageData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip wrapperStyle={{ direction: 'rtl' }} />
              <Bar dataKey="count">
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-4 text-center text-slate-700">לפי עיסוק</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={activityData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
              <Tooltip wrapperStyle={{ direction: 'rtl' }} />
              <Bar dataKey="count" barSize={20}>
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
