import { useState } from "react";
import {
  X,
  User,
  Home,
  MapPin,
  FileText,
  ClipboardList,
  Calendar,
  Building2,
  KeyRound,
} from "lucide-react";

export default function UpdateModal({ request, onClose, setConfirmData }) {
  const [houseInfo, setHouseInfo] = useState({
    type: "",
    surface: "",
    rooms: "",
    address: "",
    constructionYear: "",
    ownership: "",
    condition: "",
    floors: "",
    hasGarden: false,
    hasGarage: false,
    notes: "",
  });

  const openConfirmation = () => setConfirmData({ request, houseInfo });

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-3xl shadow-xl w-[95%] max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-semibold text-green-600 flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-green-600" />
            Update Request Information
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
          {/* Citizen Info */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <User className="w-6 h-6 text-gray-700" />
              <h3 className="text-xl font-semibold text-gray-800">
                Citizen Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {[
                ["Request ID", request.id, FileText],
                [
                  "Full Name",
                  `${request.firstnamear} ${request.lastnamear}`,
                  User,
                ],
                ["NIN", request.nin, KeyRound],
                ["Wilaya", request.wilaya, MapPin],
                ["Municipality", request.municipality, Building2],
                ["Type", request.step1, ClipboardList],
                ["Detail Level", request.step2, ClipboardList],
                ["Status", request.status, ClipboardList],
                ["Result", request.result || "N/A", ClipboardList],
              ].map(([label, value, Icon]) => (
                <div key={label} className="col-span-1">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-gray-500" />
                    {label}
                  </label>
                  <input
                    type="text"
                    value={value}
                    disabled
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 cursor-not-allowed font-medium"
                  />
                </div>
              ))}

              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Created At
                </label>
                <input
                  type="text"
                  value={new Date(request.created_at).toLocaleString()}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 cursor-not-allowed font-medium"
                />
              </div>
            </div>
          </div>

          {/* House Info */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <Home className="w-6 h-6 text-gray-700" />
              <h3 className="text-xl font-semibold text-gray-800">
                House Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {[
                ["Type of House", "type"],
                ["Surface (m²)", "surface"],
                ["Number of Rooms", "rooms"],
                ["Address", "address"],
                ["Construction Year", "constructionYear"],
                ["Number of Floors", "floors"],
              ].map(([placeholder, key]) => (
                <input
                  key={key}
                  type="text"
                  placeholder={placeholder}
                  value={houseInfo[key]}
                  onChange={(e) =>
                    setHouseInfo({ ...houseInfo, [key]: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
                />
              ))}

              <select
                value={houseInfo.ownership}
                onChange={(e) =>
                  setHouseInfo({ ...houseInfo, ownership: e.target.value })
                }
                className="col-span-2 w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Ownership Type</option>
                <option value="owned">Owned</option>
                <option value="rented">Rented</option>
                <option value="family">Family Property</option>
              </select>

              <select
                value={houseInfo.condition}
                onChange={(e) =>
                  setHouseInfo({ ...houseInfo, condition: e.target.value })
                }
                className="col-span-2 w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="needs renovation">Needs Renovation</option>
              </select>

              <div className="col-span-2 flex justify-center gap-10 mt-3">
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={houseInfo.hasGarden}
                    onChange={(e) =>
                      setHouseInfo({
                        ...houseInfo,
                        hasGarden: e.target.checked,
                      })
                    }
                    className="accent-green-600 w-5 h-5"
                  />
                  Garden
                </label>
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={houseInfo.hasGarage}
                    onChange={(e) =>
                      setHouseInfo({
                        ...houseInfo,
                        hasGarage: e.target.checked,
                      })
                    }
                    className="accent-green-600 w-5 h-5"
                  />
                  Garage
                </label>
              </div>

              <textarea
                placeholder="Additional notes"
                value={houseInfo.notes}
                onChange={(e) =>
                  setHouseInfo({ ...houseInfo, notes: e.target.value })
                }
                className="col-span-2 w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
                rows={3}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-6 px-8 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-green-600 text-green-700 font-medium hover:bg-green-50 transition w-36 text-center"
          >
            Cancel
          </button>
          <button
            onClick={openConfirmation}
            className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-sm w-36 text-center"
          >
            Start Update
          </button>
        </div>
      </div>
    </div>
  );
}
