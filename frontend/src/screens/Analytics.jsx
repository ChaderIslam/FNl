import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

import { Home, BarChart2, Folder, Settings, DollarSign, Users, TrendingUp, Briefcase } from "lucide-react";

export default function Analytics() {
  const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4780 },
    { month: "May", revenue: 5890 },
    { month: "Jun", revenue: 4390 },
    { month: "Jul", revenue: 6490 },
  ];

  const usersData = [
    { department: "Sales", users: 400 },
    { department: "Marketing", users: 300 },
    { department: "IT", users: 500 },
    { department: "HR", users: 200 },
  ];

  const pieData = [
    { name: "Chrome", value: 55 },
    { name: "Safari", value: 25 },
    { name: "Firefox", value: 15 },
    { name: "Others", value: 5 },
  ];

  const growthData = [
    { month: "Jan", growth: 20 },
    { month: "Feb", growth: 35 },
    { month: "Mar", growth: 28 },
    { month: "Apr", growth: 45 },
    { month: "May", growth: 50 },
    { month: "Jun", growth: 60 },
    { month: "Jul", growth: 80 },
  ];

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      <main className="flex-1 flex flex-col">
        <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 auto-rows-fr gap-4 p-4">

          {/* Stat Cards */}
          <div className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-4">
            <Users className="text-blue-600" size={24} />
            <p className="text-gray-500 text-sm">Users</p>
            <h3 className="text-xl font-bold">1,245</h3>
          </div>

          <div className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-4">
            <DollarSign className="text-green-600" size={24} />
            <p className="text-gray-500 text-sm">Revenue</p>
            <h3 className="text-xl font-bold">$24,500</h3>
          </div>

          <div className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-4">
            <Briefcase className="text-yellow-600" size={24} />
            <p className="text-gray-500 text-sm">Projects</p>
            <h3 className="text-xl font-bold">87</h3>
          </div>

          <div className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-4">
            <TrendingUp className="text-red-600" size={24} />
            <p className="text-gray-500 text-sm">Growth</p>
            <h3 className="text-xl font-bold">+15%</h3>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow sm:col-span-2 md:col-span-3 xl:col-span-2 flex flex-col p-2">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Revenue Over Time</h2>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#374151" />
                  <YAxis stroke="#374151" />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#047857" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="bg-white rounded-2xl shadow sm:col-span-2 md:col-span-1 xl:col-span-2 flex flex-col p-2">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Growth Trend</h2>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#374151" />
                  <YAxis stroke="#374151" />
                  <Tooltip />
                  <Area type="monotone" dataKey="growth" stroke="#3b82f6" fill="#93c5fd" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Users Bar Chart */}
          <div className="bg-white rounded-2xl shadow sm:col-span-2 md:col-span-1 xl:col-span-1 flex flex-col p-2">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Users by Department</h2>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="department" stroke="#374151" />
                  <YAxis stroke="#374151" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Browser Pie Chart */}
          <div className="bg-white rounded-2xl shadow flex flex-col justify-center p-2">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Browser Usage</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-2xl shadow xl:col-span-2 flex flex-col p-2">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Activity</h2>
            <ul className="space-y-1 text-gray-700 text-sm flex-1">
              <li>✅ User <b>John</b> created a new project.</li>
              <li>📊 Analytics report was generated.</li>
              <li>⚙️ Settings updated by <b>Alice</b>.</li>
              <li>📁 New files uploaded to project <b>Alpha</b>.</li>
            </ul>
          </div>

        </section>
      </main>
    </div>
  );
}
