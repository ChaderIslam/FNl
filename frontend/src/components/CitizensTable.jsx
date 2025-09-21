import { useState } from "react";
import { User, Plus, Search, Edit, Trash } from "lucide-react";
import Pagination from "./Pagination";
import ApplicantForm from "./ApplicantForm";

export default function CitizensTable({
  citizens,
  handleAdd,
  handleDelete
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const filteredCitizens = searchQuery
    ? citizens.filter(c =>
        [c.nin, c.firstNameAr, c.lastNameAr].some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : citizens;

  const totalPages = Math.ceil(filteredCitizens.length / rowsPerPage);
  const paginatedCitizens = filteredCitizens.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-6xl flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <User className="text-green-600" /> Citizens
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search citizens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 pl-10 shadow-md focus:ring-2 focus:ring-green-300 focus:border-green-400"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-green-700 to-green-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-green-700 to-green-500 text-white">
              <th className="px-6 py-3 text-left">NIN</th>
              <th className="px-6 py-3 text-left">First Name (Ar)</th>
              <th className="px-6 py-3 text-left">Last Name (Ar)</th>
              <th className="px-6 py-3 text-left">Wilaya</th>
              <th className="px-6 py-3 text-left">Municipality</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCitizens.length > 0 ? (
              paginatedCitizens.map((citizen, idx) => (
                <tr key={idx} className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-50 transition`}>
                  <td className="px-6 py-4 font-semibold text-gray-800">{citizen.nin}</td>
                  <td className="px-6 py-4 text-gray-700">{citizen.firstNameAr}</td>
                  <td className="px-6 py-4 text-gray-700">{citizen.lastNameAr}</td>
                  <td className="px-6 py-4 text-gray-700">{citizen.wilaya}</td>
                  <td className="px-6 py-4 text-gray-700">{citizen.municipality}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-3">
                    <button
                      onClick={() => { setEditingIndex(idx); setShowForm(true); }}
                      className="p-2 rounded-lg hover:bg-green-100 text-green-700 transition"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 italic">No citizens found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />

      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl p-6">
            <ApplicantForm
              initialData={editingIndex !== null ? citizens[editingIndex] : {}}
              onSubmit={(data) => { handleAdd(data); setShowForm(false); setEditingIndex(null); }}
              onCancel={() => { setShowForm(false); setEditingIndex(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
