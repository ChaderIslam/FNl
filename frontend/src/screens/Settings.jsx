import { useEffect, useState, useMemo } from "react";
import {
  Loader2,
  Search,
  FileText,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import UpdateModal from "../components/UpdateModal/UpdateModal";
import ConfirmationModal from "../components/UpdateModal/ConfirmationModal";

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

  return (
    <div className="p-8 flex justify-center bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-8xl border border-white/40">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <FileText className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Update Housing National File
          </h1>
        </div>

        {/* Filters */}
<div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
  {/* Search Bar */}
  <div className="relative w-full md:w-1/3">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5" />
    <input
      type="text"
      placeholder="Search by name, NIN, or location..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-12 pr-4 py-3 w-full rounded-2xl border border-green-300 bg-white text-gray-800 placeholder-gray-400 shadow-lg focus:ring-4 focus:ring-green-300 focus:border-green-400 outline-none transition-all duration-300"
    />
  </div>

  {/* Filter Dropdowns */}
  <div className="flex flex-wrap gap-4 justify-center md:justify-end w-full md:w-auto">
    <div className="relative">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="appearance-none pl-4 pr-10 py-3 rounded-2xl bg-white border border-green-300 shadow-md text-gray-700 font-medium hover:bg-green-50 focus:bg-white focus:ring-4 focus:ring-green-300 outline-none transition-all duration-300 cursor-pointer"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 pointer-events-none">
        ▼
      </div>
    </div>

    <div className="relative">
      <select
        value={resultFilter}
        onChange={(e) => setResultFilter(e.target.value)}
        className="appearance-none pl-4 pr-10 py-3 rounded-2xl bg-white border border-green-300 shadow-md text-gray-700 font-medium hover:bg-green-50 focus:bg-white focus:ring-4 focus:ring-green-300 outline-none transition-all duration-300 cursor-pointer"
      >
        <option value="all">All Results</option>
        <option value="positive">Positive</option>
        <option value="negative">Negative</option>
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 pointer-events-none">
        ▼
      </div>
    </div>
  </div>
</div>


        {/* Requests Grid */}
        {filteredRequests.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            No matching requests found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="relative bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="p-6 flex flex-col justify-between h-full">
                  <div>
                    {/* Name + Status */}
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {req.firstnamear} {req.lastnamear}
                      </h2>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          req.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : req.status === "in-progress"
                            ? "bg-blue-100 text-blue-700"
                            : req.status === "done"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {req.status || "Unknown"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                      <span className="font-medium">NIN:</span> {req.nin}
                    </p>

                    {/* Info */}
                    <div className="space-y-2 text-gray-700">
                      <p className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span>
                          <span className="font-medium">Request Type:</span>{" "}
                          {req.step1}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span>
                          <span className="font-medium">Detail Level:</span>{" "}
                          {req.step2}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 text-green-600" />
                        Wilaya: {req.wilaya} — {req.municipality}
                      </p>
                    </div>
                  </div>

                  {/* Buttons & Result */}
                  <div className="flex justify-between items-end mt-6">
                    {/* ✅ Result */}
                    <div className="flex items-center gap-2">
                      {req.result === "positive" ? (
                        <CheckCircle2 className="text-green-600 w-5 h-5" />
                      ) : req.result === "negative" ? (
                        <XCircle className="text-red-600 w-5 h-5" />
                      ) : (
                        <Clock className="text-gray-400 w-5 h-5" />
                      )}
                      <span
                        className={`font-medium text-sm ${
                          req.result === "positive"
                            ? "text-green-700"
                            : req.result === "negative"
                            ? "text-red-600"
                            : "text-gray-400 italic"
                        }`}
                      >
                        {req.result ? req.result : "Pending"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium shadow-md hover:shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                      >
                        Start Update
                      </button>
                      <button
                        onClick={() => handleRefuse(req.id)}
                        className="px-5 py-2.5 rounded-xl border border-green-600 text-green-700 font-medium hover:bg-green-50 hover:shadow-md transition-all duration-300"
                      >
                        Refuse
                      </button>
                    </div>
                  </div>
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
          setConfirmData={setConfirmData}
        />
      )}
      {confirmData && (
        <ConfirmationModal
          data={confirmData}
          onClose={() => setConfirmData(null)}
          onSuccess={() => {
            setConfirmData(null);
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
}
