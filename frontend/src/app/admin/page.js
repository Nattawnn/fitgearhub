'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
import './admin.css';

export default function AdminDashboard() {
  const [salesData, setSalesData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Sales',
      data: [12000, 19000, 15000, 25000, 22000, 30000],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  });

  const [ordersData, setOrdersData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Daily Orders',
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  });

  const stats = [
    { title: 'Total Revenue', value: '$89,000', change: '+20.1%' },
    { title: 'Active Users', value: '2,300', change: '+15.5%' },
    { title: 'New Orders', value: '156', change: '+5.8%' },
    { title: 'Product Stock', value: '1,245', change: '-2.3%' }
  ];

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <button className="btn-primary">Generate Report</button>
          <button className="btn-secondary">Settings</button>
        </div>
      </header>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3>{stat.title}</h3>
            <p className="stat-value">{stat.value}</p>
            <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h2>Revenue Overview</h2>
          <Bar data={salesData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Monthly Sales Performance' }
            }
          }} />
        </div>

        <div className="chart-card">
          <h2>Orders Trend</h2>
          <Line data={ordersData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Weekly Orders Analysis' }
            }
          }} />
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-time">2 hours ago</span>
            <p>New order #2458 received for Premium Yoga Mat</p>
          </div>
          <div className="activity-item">
            <span className="activity-time">3 hours ago</span>
            <p>Stock update: Running Shoes inventory low</p>
          </div>
          <div className="activity-item">
            <span className="activity-time">5 hours ago</span>
            <p>Customer review received for Fitness Tracker Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
}
