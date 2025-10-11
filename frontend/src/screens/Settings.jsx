import { useEffect, useState, useMemo } from "react";
import { Loader2, Search, X } from "lucide-react";

export default function Settings() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/requests");
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleRefuse = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "done", result: "negative" }),
      });
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "done", result: "negative" } : r
        )
      );
    } catch (err) {
      console.error("Error refusing request:", err);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        req.firstnamear?.toLowerCase().includes(term) ||
        req.lastnamear?.toLowerCase().includes(term) ||
        req.nin?.toLowerCase().includes(term) ||
        req.wilaya?.toLowerCase().includes(term) ||
        req.municipality?.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" || req.status === statusFilter;
      const matchesResult =
        resultFilter === "all" || req.result === resultFilter;

      return matchesSearch && matchesStatus && matchesResult;
    });
  }, [requests, searchTerm, statusFilter, resultFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <Loader2 className="animate-spin w-8 h-8 mr-2" /> Loading...
      </div>
    );
  }

  // 🏠 Update Modal
  const UpdateModal = ({ request, onClose }) => {
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

    const openConfirmation = () => {
      setConfirmData({ request, houseInfo });
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-6xl h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              Update Request Information
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Citizen Info */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Citizen Information
                </h3>
                <div className="space-y-4">
                  {[
                    ["Request ID", request.id],
                    ["Full Name", `${request.firstnamear} ${request.lastnamear}`],
                    ["NIN", request.nin],
                    ["Wilaya", request.wilaya],
                    ["Municipality", request.municipality],
                    ["Type", request.step1],
                    ["Detail Level", request.step2],
                    ["Status", request.status],
                    ["Result", request.result || "N/A"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={value}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Created At
                    </label>
                    <input
                      type="text"
                      value={new Date(request.created_at).toLocaleString()}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* House Info */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  House Information
                </h3>
                <div className="space-y-4">
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
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
                    />
                  ))}

                  <select
                    value={houseInfo.ownership}
                    onChange={(e) =>
                      setHouseInfo({ ...houseInfo, ownership: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
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
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
                  >
                    <option value="">Condition</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="needs renovation">Needs Renovation</option>
                  </select>

                  <div className="flex gap-6 mt-3">
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
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
                    rows={3}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 px-8 py-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl border border-green-600 text-green-700 font-semibold hover:bg-green-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={openConfirmation}
              className="px-6 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Start Update
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ✅ Confirmation Modal
  const ConfirmationModal = ({ data, onClose }) => {
    const { request, houseInfo } = data;

    const handleConfirm = async () => {
      try {
        await fetch(`http://localhost:5000/api/requests/${request.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "in-progress" }),
        });

        await fetch(`http://localhost:5000/api/requests/${request.id}/house`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(houseInfo),
        });

        setConfirmData(null);
        setSelectedRequest(null);
      } catch (err) {
        console.error("Error updating:", err);
      }
    };

    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-3xl h-[80vh] flex flex-col">
          <div className="flex justify-between items-center px-8 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              Confirm Update
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 text-gray-700">
            <p>
              <strong>Citizen:</strong> {request.firstnamear} {request.lastnamear}
            </p>
            <p>
              <strong>NIN:</strong> {request.nin}
            </p>
            <p>
              <strong>House Type:</strong> {houseInfo.type}
            </p>
            <p>
              <strong>Address:</strong> {houseInfo.address}
            </p>
            <p>
              <strong>Condition:</strong> {houseInfo.condition}
            </p>
            <p>
              <strong>Notes:</strong> {houseInfo.notes || "None"}
            </p>
          </div>

          <div className="flex justify-end gap-4 px-8 py-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl border border-green-600 text-green-700 font-semibold hover:bg-green-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Confirm Update
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 🧩 Main UI
  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white shadow-2xl rounded-3xl p-12 w-full max-w-8xl">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, NIN, wilaya..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
            >
              <option value="all">All Results</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>

        {/* Request Cards */}
        {filteredRequests.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            No matching requests found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-gray-50 rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col justify-between transition hover:shadow-lg hover:scale-[1.01]"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {req.firstnamear} {req.lastnamear}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">NIN: {req.nin}</p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Request Type:</span>{" "}
                    <span className="text-green-700">{req.step1}</span>
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Detail Level:</span>{" "}
                    <span className="text-green-700">{req.step2}</span>
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    Wilaya: {req.wilaya} — Municipality: {req.municipality}
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="px-5 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
                  >
                    Start Update
                  </button>
                  <button
                    onClick={() => handleRefuse(req.id)}
                    className="px-5 py-2 rounded-xl border border-green-600 text-green-700 font-medium hover:bg-green-50 transition"
                  >
                    Refuse
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedRequest && !confirmData && (
        <UpdateModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
      {confirmData && (
        <ConfirmationModal
          data={confirmData}
          onClose={() => setConfirmData(null)}
        />
      )}
    </div>
  );
}
