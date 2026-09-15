import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';
import { TrendingUp, Users, DollarSign, Award, ShieldCheck } from 'lucide-react';
import { Registration } from '../../types';

interface AdminAnalyticsProps {
  analytics: any;
  registrations: Registration[];
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ analytics, registrations }) => {
  // Compute registrations by date
  const dateCounts: { [date: string]: number } = {};
  registrations.forEach((r) => {
    const d = new Date(r.createdAt).toLocaleDateString();
    dateCounts[d] = (dateCounts[d] || 0) + 1;
  });

  const timelineData = Object.keys(dateCounts).map((date) => ({
    date,
    squads: dateCounts[date],
  }));

  // Compute payment status breakdown
  const paymentStats = [
    { name: 'Verified', value: analytics?.verifiedPayments || 0, color: '#10b981' },
    { name: 'Pending Review', value: analytics?.pendingPayments || 0, color: '#f59e0b' },
    { name: 'Rejected', value: analytics?.rejectedPayments || 0, color: '#ef4444' },
  ];

  // Top Colleges
  const collegeCounts: { [col: string]: number } = {};
  registrations.forEach((r) => {
    if (r.college) {
      collegeCounts[r.college] = (collegeCounts[r.college] || 0) + 1;
    }
  });

  const collegeData = Object.entries(collegeCounts)
    .map(([college, count]) => ({ college, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
          Tournament Analytics & Metric Insights
        </h3>
        <p className="text-xs text-neutral-400 font-tech">
          Visual analysis of registrations velocity, revenue pipeline, and collegiate institution participation.
        </p>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="esports-glass p-4 rounded-xl border border-neutral-800">
          <span className="text-[10px] font-tech uppercase text-neutral-500 block">Total Squads</span>
          <span className="font-heading text-2xl font-bold text-white">{analytics?.totalRegistrations || 0}</span>
        </div>
        <div className="esports-glass p-4 rounded-xl border border-neutral-800">
          <span className="text-[10px] font-tech uppercase text-neutral-500 block">Verified Revenue</span>
          <span className="font-heading text-2xl font-bold text-emerald-400">
            Rs. {(analytics?.totalRevenue || 0).toLocaleString()}
          </span>
        </div>
        <div className="esports-glass p-4 rounded-xl border border-neutral-800">
          <span className="text-[10px] font-tech uppercase text-neutral-500 block">Verification Rate</span>
          <span className="font-heading text-2xl font-bold text-amber-400">
            {analytics?.totalRegistrations > 0
              ? `${Math.round(((analytics?.verifiedPayments || 0) / analytics.totalRegistrations) * 100)}%`
              : '0%'}
          </span>
        </div>
        <div className="esports-glass p-4 rounded-xl border border-neutral-800">
          <span className="text-[10px] font-tech uppercase text-neutral-500 block">Colleges Represented</span>
          <span className="font-heading text-2xl font-bold text-blue-400">
            {Object.keys(collegeCounts).length}
          </span>
        </div>
      </div>

      {/* Charts 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Timeline Chart */}
        <div className="esports-glass p-5 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading text-sm font-bold uppercase text-white tracking-wider flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Registration Trend Velocity</span>
            </h4>
            <span className="text-[10px] font-tech text-neutral-400">Daily submissions</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <XAxis dataKey="date" stroke="#737373" fontSize={10} />
                <YAxis stroke="#737373" fontSize={10} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: '11px', color: '#fff' }} 
                />
                <Line type="monotone" dataKey="squads" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Conversion Pie */}
        <div className="esports-glass p-5 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading text-sm font-bold uppercase text-white tracking-wider flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Payment Verification Breakdown</span>
            </h4>
            <span className="text-[10px] font-tech text-neutral-400">Receipt audit status</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top Participating Colleges Bar Chart */}
      <div className="esports-glass p-5 rounded-2xl border border-neutral-800 space-y-4">
        <h4 className="font-heading text-sm font-bold uppercase text-white tracking-wider flex items-center space-x-2">
          <Award className="w-4 h-4 text-purple-400" />
          <span>Top Participating Collegiate Institutions</span>
        </h4>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={collegeData} layout="vertical">
              <XAxis type="number" stroke="#737373" fontSize={10} allowDecimals={false} />
              <YAxis type="category" dataKey="college" stroke="#737373" fontSize={10} width={160} />
              <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: '11px', color: '#fff' }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
