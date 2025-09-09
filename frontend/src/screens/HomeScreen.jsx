// src/dashboard/screens/HomeScreen.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/pictures/logo.png";
import { Home, BarChart2, Folder, Settings, LogOut } from "lucide-react";

export default function HomeScreen() {
  const [active, setActive] = useState("Overview");
  const navigate = useNavigate();

  const navItems = [
    { name: "Overview", icon: Home, route: "/" },
    { name: "Dashboard", icon: BarChart2, route: "/dashboard" },
    { name: "Projects", icon: Folder, route: "/projects" },
    { name: "Settings", icon: Settings, route: "/settings" },
  ];

  const handleNavigation = (item) => {
    setActive(item.name);
    navigate(item.route);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-20 bg-gradient-to-b from-green-950 via-green-800 to-green-600 text-white shadow-lg flex flex-col items-center py-6">
        <div className="mb-10">
          <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
        </div>
        <nav className="flex-1 flex flex-col items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={`flex items-center justify-center w-12 h-12 rounded-xl transition ${
                  active === item.name
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

        <section className="flex-1 p-4 flex items-center justify-center">
          <div className="text-gray-700 text-xl">
            {/* Example content, can replace with charts, stats, etc. */}
            Welcome to the Home Screen! Select an item from the sidebar.
          </div>
        </section>
      </main>
    </div>
  );
}


