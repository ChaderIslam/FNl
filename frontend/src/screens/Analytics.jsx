import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from "recharts";

import { Users, Home, FileText, CheckCircle2, Bell, MapPin } from "lucide-react";

export default function Dashboard() {

  // Data
  const controlsByWilaya = [
    { wilaya: "Guelma", pending: 5, completed: 15 },
    { wilaya: "Algiers", pending: 8, completed: 12 },
    { wilaya: "Oran", pending: 2, completed: 18 },
    { wilaya: "Constantine", pending: 3, completed: 10 },
  ];

  const controlsByGroup = [
    { group: "Direction de logement", completed: 20 },
    { group: "ENPI", completed: 15 },
    { group: "BNH", completed: 12 },
    { group: "DUAC", completed: 10 },
    { group: "OPGI", completed: 8 },
    { group: "AADL", completed: 5 },
  ];

  const controlTypeData = [
    { name: "Basic", value: 60 },
    { name: "Advanced", value: 40 },
  ];

  const usersByRole = [
    { role: "SuperAdmin", count: 2 },
    { role: "Admin", count: 8 },
    { role: "User", count: 32 },
  ];

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  // KPI Card Data
  const kpis = [
    { icon: FileText, label: "Total Controls", value: 245, color: "text-blue-600" },
    { icon: CheckCircle2, label: "Completed Controls", value: 178, color: "text-green-600" },
    { icon: MapPin, label: "Pending Controls", value: 67, color: "text-yellow-600" },
    { icon: Users, label: "Total Users", value: 42, color: "text-red-600" },
    { icon: Bell, label: "Failed Controls", value: 5, color: "text-red-500" },
    { icon: Home, label: "Housing Updates", value: 32, color: "text-purple-600" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      <main className="flex-1 flex flex-col">
        <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 p-4">

          {/* KPI Cards */}
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow flex items-center p-4 space-x-4 hover:shadow-lg transition"
              >
                <div className={`p-3 rounded-xl bg-gray-100 ${kpi.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{kpi.label}</p>
                  <h3 className="text-lg font-bold">{kpi.value}</h3>
                </div>
              </div>
            );
          })}

          {/* Controls by Wilaya */}
          <div className="bg-white rounded-2xl shadow col-span-3 row-span-2 flex flex-col p-2">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Controls by Wilaya</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={controlsByWilaya}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="wilaya" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip />
                <Legend />
                <Bar dataKey="pending" fill="#f59e0b" radius={[6,6,0,0]} />
                <Bar dataKey="completed" fill="#10b981" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Controls by Group */}
          <div className="bg-white rounded-2xl shadow col-span-3 row-span-2 flex flex-col p-2">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Controls by Group</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={controlsByGroup}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="group" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip />
                <Bar dataKey="completed" fill="#3b82f6" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Control Types */}
          <div className="bg-white rounded-2xl shadow col-span-2 flex flex-col p-2">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Control Types</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={controlTypeData} dataKey="value" cx="50%" cy="50%" outerRadius={60} labelLine={false}>
                  {controlTypeData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Users by Role */}
          <div className="bg-white rounded-2xl shadow col-span-2 flex flex-col p-2">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Users by Role</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={usersByRole}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="role" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </section>
      </main>
    </div>
  );
}
