// src/dashboard/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar.jsx";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col ml-20">
        <header className="flex justify-between items-center bg-white shadow px-6 py-4 sticky top-0 z-10">
          {/* The header can be dynamic if needed */}
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
          {/* Dynamic content will be rendered here */}
          <Outlet />
        </section>
      </main>
    </div>
  );
}
