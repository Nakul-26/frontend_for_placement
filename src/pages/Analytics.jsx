import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import './Analytics.css';

const kpiData = [
  { title: 'Total Placements', value: '1,234', change: '+12%' },
  { title: 'Companies Onboarded', value: '56', change: '+5' },
  { title: 'Avg. Salary Package', value: '$85,000', change: '+3%' },
  { title: 'Students Registered', value: '2,500', change: '+150' },
];

const placementsByDept = [
  { name: 'CompSci', Placements: 400 },
  { name: 'Mechanical', Placements: 250 },
  { name: 'Electrical', Placements: 300 },
  { name: 'Civil', Placements: 200 },
  { name: 'Chemical', Placements: 150 },
];

const placementTrend = [
  { name: 'Jan', Placements: 120 },
  { name: 'Feb', Placements: 150 },
  { name: 'Mar', Placements: 200 },
  { name: 'Apr', Placements: 180 },
  { name: 'May', Placements: 250 },
  { name: 'Jun', Placements: 300 },
];

const Analytics = () => {
  return (
    <div className="analytics-container">
      <div className="header-section">
        <h1>Placement Analytics</h1>
        <p>Insights and trends from the placement data.</p>
      </div>

      <div className="kpi-grid">
        {kpiData.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-title">{kpi.title}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-change">{kpi.change} vs last month</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3 className="chart-title">Placements by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={placementsByDept}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Placements" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Placement Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={placementTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Placements" stroke="#1976d2" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;