import { useState } from "react";

export default function ApplicantForm({ initialData = {}, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nin: "",
    lastNameAr: "",
    firstNameAr: "",
    lastNameLat: "",
    firstNameLat: "",
    wilaya: "",
    municipality: "",
    ...initialData, // prefill if editing
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8">
      {/* NIN + Autofill */}
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label
            htmlFor="nin"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            NIN <span className="text-red-500">*</span>
          </label>
          <input
            id="nin"
            type="text"
            name="nin"
            value={formData.nin}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition"
            placeholder="Enter National ID Number"
            required
          />
        </div>
        <button
          type="button"
          onClick={() =>
            setFormData({
              nin: "123456789",
              lastNameAr: "بن عيسى",
              firstNameAr: "محمد",
              lastNameLat: "Ben Aissa",
              firstNameLat: "Mohamed",
              wilaya: "Guelma",
              municipality: "Oued Zenati",
            })
          }
          className="h-[52px] px-5 rounded-xl bg-gradient-to-r from-green-700 to-green-500 
                     text-white font-medium shadow hover:from-green-800 hover:to-green-600 transition"
        >
          Autofill
        </button>
      </div>

      {/* Grid fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="lastNameAr"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last name (Arabic) <span className="text-red-500">*</span>
          </label>
          <input
            id="lastNameAr"
            type="text"
            name="lastNameAr"
            value={formData.lastNameAr}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition"
            placeholder="أدخل اللقب بالعربية"
            required
          />
        </div>

        <div>
          <label
            htmlFor="firstNameAr"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First name (Arabic) <span className="text-red-500">*</span>
          </label>
          <input
            id="firstNameAr"
            type="text"
            name="firstNameAr"
            value={formData.firstNameAr}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition"
            placeholder="أدخل الاسم بالعربية"
            required
          />
        </div>

        <div>
          <label
            htmlFor="lastNameLat"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last name (Latin)
          </label>
          <input
            id="lastNameLat"
            type="text"
            name="lastNameLat"
            value={formData.lastNameLat}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition"
            placeholder="Enter last name in Latin"
          />
        </div>

        <div>
          <label
            htmlFor="firstNameLat"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First name (Latin)
          </label>
          <input
            id="firstNameLat"
            type="text"
            name="firstNameLat"
            value={formData.firstNameLat}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition"
            placeholder="Enter first name in Latin"
          />
        </div>

        <div>
          <label
            htmlFor="wilaya"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Wilaya of birth <span className="text-red-500">*</span>
          </label>
          <select
            id="wilaya"
            name="wilaya"
            value={formData.wilaya}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition"
            required
          >
            <option value="">Select Wilaya</option>
            <option value="Guelma">Guelma</option>
            <option value="Algiers">Algiers</option>
            <option value="Oran">Oran</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="municipality"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Municipality of birth <span className="text-red-500">*</span>
          </label>
          <select
            id="municipality"
            name="municipality"
            value={formData.municipality}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition"
            required
          >
            <option value="">Select Municipality</option>
            <option value="Oued Zenati">Oued Zenati</option>
            <option value="Bab El Oued">Bab El Oued</option>
            <option value="Bir El Djir">Bir El Djir</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl border-2 border-green-600 text-green-700 font-medium 
                     hover:bg-green-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-700 to-green-500 
                     font-semibold text-white shadow-md hover:from-green-800 hover:to-green-600 transition"
        >
          Save
        </button>
      </div>
    </form>
  );
}
