import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import _ from 'lodash';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ChartCard = ({ title, children }) => (
  <Card className="border-0 shadow-lg">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default function BarriersAnalysis({ data }) {
  const learningMethods = _.chain(data)
    .flatMap('ai_learning_method')
    .compact()
    .countBy()
    .map((count, name) => ({ name, count }))
    .sortBy('count')
    .reverse()
    .value();

  const mainGoals = _.chain(data)
    .countBy('main_ai_goal')
    .map((value, name) => ({ name, value }))
    .filter(item => item.name && item.name !== 'undefined')
    .sortBy('value')
    .reverse()
    .value();
    
  const specificHelp = _.chain(data)
    .countBy('specific_ai_help')
    .map((value, name) => ({ name, value }))
    .filter(item => item.name && item.name !== 'undefined')
    .sortBy('value')
    .reverse()
    .value();

  const investmentWillingness = _.chain(data)
    .countBy('investment_willingness')
    .map((value, name) => ({ name, value }))
    .filter(item => item.name && item.name !== 'undefined')
    .value();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">תובנות עומק: מטרות, צרכים ומניעים</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="מטרות עיקריות לשימוש ב-AI">
          <BarChart data={mainGoals} layout="vertical" margin={{ right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
            <Tooltip wrapperStyle={{ direction: 'rtl' }} formatter={(value) => [value, 'מספר תגובות']}/>
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ChartCard>

        <ChartCard title="דרכי למידה מועדפות">
           <BarChart data={learningMethods}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={60} />
            <YAxis />
            <Tooltip wrapperStyle={{ direction: 'rtl' }} formatter={(value) => [value, 'מספר תגובות']}/>
            <Bar dataKey="count">
              {learningMethods.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartCard>
        
        <ChartCard title="עזרה ספציפית נדרשת">
          <BarChart data={specificHelp} layout="vertical" margin={{ right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
            <Tooltip wrapperStyle={{ direction: 'rtl' }} formatter={(value) => [value, 'מספר תגובות']}/>
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ChartCard>

        <ChartCard title="נכונות להשקעה חודשית">
          <PieChart>
            <Pie
              data={investmentWillingness}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#ffc658"
              dataKey="value"
            >
              {investmentWillingness.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip wrapperStyle={{ direction: 'rtl' }} formatter={(value, name) => [value, name]}/>
            <Legend />
          </PieChart>
        </ChartCard>
      </div>
    </div>
  );
}