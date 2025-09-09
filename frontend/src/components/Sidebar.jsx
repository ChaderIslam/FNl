// src/components/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/pictures/logo.png";
import { Home, BarChart2, Folder, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Overview", icon: Home, route: "/dashboard/overview" },
    { name: "Analytics", icon: BarChart2, route: "/dashboard/analytics" },
    { name: "Projects", icon: Folder, route: "/dashboard/projects" },
    { name: "Settings", icon: Settings, route: "/dashboard/settings" },
  ];

  const handleNavigation = (item) => {
    navigate(item.route);
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-20 bg-gradient-to-b from-green-950 via-green-800 to-green-600 text-white shadow-lg flex flex-col items-center py-6">
      <div className="mb-10">
        <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
      </div>

      <nav className="flex-1 flex flex-col items-center gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.route;
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item)}
              className={`flex items-center justify-center w-12 h-12 rounded-xl transition ${
                isActive
                  ? "bg-green-700 text-white shadow"
                  : "text-green-100 hover:bg-green-700/60"
              }`}
              title={item.name}
            >
              <Icon size={22} />
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-700 hover:bg-green-800"
          title="Logout"
          onClick={() => navigate("/")} // redirect to login
        >
          <LogOut size={22} />
        </button>
      </div>
    </aside>
  );
}
