// src/dashboard/screens/Dashboard.jsx
import { useState } from "react"
import logo from "../../assets/pictures/logo.png"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, AreaChart, Area
} from "recharts"

import { Home, BarChart2, Folder, Settings, LogOut, DollarSign, Users, TrendingUp, Briefcase } from "lucide-react"

export default function Dashboard() {
  const [active, setActive] = useState("Overview")

  const navItems = [
    { name: "Overview", icon: Home },
    { name: "Analytics", icon: BarChart2 },
    { name: "Projects", icon: Folder },
    { name: "Settings", icon: Settings },
  ]

  const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4780 },
    { month: "May", revenue: 5890 },
    { month: "Jun", revenue: 4390 },
    { month: "Jul", revenue: 6490 },
  ]

  const usersData = [
    { department: "Sales", users: 400 },
    { department: "Marketing", users: 300 },
    { department: "IT", users: 500 },
    { department: "HR", users: 200 },
  ]

  const pieData = [
    { name: "Chrome", value: 55 },
    { name: "Safari", value: 25 },
    { name: "Firefox", value: 15 },
    { name: "Others", value: 5 },
  ]

  const growthData = [
    { month: "Jan", growth: 20 },
    { month: "Feb", growth: 35 },
    { month: "Mar", growth: 28 },
    { month: "Apr", growth: 45 },
    { month: "May", growth: 50 },
    { month: "Jun", growth: 60 },
    { month: "Jul", growth: 80 },
  ]

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-20 bg-gradient-to-b from-green-950 via-green-800 to-green-600 text-white shadow-lg flex flex-col items-center py-6">
        <div className="mb-10">
          <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
        </div>
        <nav className="flex-1 flex flex-col items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.name}
                onClick={() => setActive(item.name)}
                className={`flex items-center justify-center w-12 h-12 rounded-xl transition ${
                  active === item.name
                    ? "bg-green-700 text-white shadow"
                    : "text-green-100 hover:bg-green-700/60"
                }`}
                title={item.name}
              >
                <Icon size={22} />
              </button>
            )
          })}
        </nav>
        <div className="mt-auto">
          <button
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-700 hover:bg-green-800"
            title="Logout"
          >
            <LogOut size={22} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col ml-20">
        <header className="flex justify-between items-center bg-white shadow px-6 py-4 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">{active}</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden sm:block">Hello, User</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="User Avatar"
              className="h-10 w-10 rounded-full border"
            />
          </div>
        </header>

        <section className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
          {/* Stat Cards */}
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center gap-1">
            <Users className="text-blue-600" size={24} />
            <p className="text-gray-500 text-sm">Users</p>
            <h3 className="text-xl font-bold">1,245</h3>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center gap-1">
            <DollarSign className="text-green-600" size={24} />
            <p className="text-gray-500 text-sm">Revenue</p>
            <h3 className="text-xl font-bold">$24,500</h3>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center gap-1">
            <Briefcase className="text-yellow-600" size={24} />
            <p className="text-gray-500 text-sm">Projects</p>
            <h3 className="text-xl font-bold">87</h3>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center gap-1">
            <TrendingUp className="text-red-600" size={24} />
            <p className="text-gray-500 text-sm">Growth</p>
            <h3 className="text-xl font-bold">+15%</h3>
          </div>

          {/* Compact Line Chart */}
          <div className="bg-white rounded-2xl shadow p-4 sm:col-span-2 md:col-span-3 xl:col-span-2">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Revenue Over Time</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#047857" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Compact Area Chart */}
          <div className="bg-white rounded-2xl shadow p-4 sm:col-span-2 md:col-span-1 xl:col-span-2">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Growth Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip />
                <Area type="monotone" dataKey="growth" stroke="#3b82f6" fill="#93c5fd" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Compact Bar Chart */}
          <div className="bg-white rounded-2xl shadow p-4 sm:col-span-2 md:col-span-1 xl:col-span-1">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Users by Department</h2>
            <ResponsiveContainer width="100%" height={180}>
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


          {/* Compact Pie Chart */}
          <div className="bg-white rounded-2xl shadow p-4">
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
          <div className="bg-white rounded-2xl shadow p-4 xl:col-span-2">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Activity</h2>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>✅ User <b>John</b> created a new project.</li>
              <li>📊 Analytics report was generated.</li>
              <li>⚙️ Settings updated by <b>Alice</b>.</li>
              <li>📁 New files uploaded to project <b>Alpha</b>.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
