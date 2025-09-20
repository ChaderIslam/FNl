// src/dashboard/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar.jsx";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col ml-20">
        <header className="flex justify-between items-center 
                           bg-white/95 backdrop-blur-md 
                           shadow-md px-6 py-4 sticky top-0 z-50 
                           border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden sm:block">Hello, User</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="User Avatar"
              className="h-10 w-10 rounded-full border"
            />
          </div>
        </header>

        <section className="flex-1 p-4">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
