import { useEffect, useState, useMemo } from "react";
import { Loader2, CheckCircle, XCircle, Search } from "lucide-react";

export default function Settings() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");

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

  const handleStartUpdate = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "in-progress" }),
      });
      alert(`Update process started for request #${id}`);
    } catch (err) {
      console.error("Error starting update:", err);
    }
  };

  const handleRefuse = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "done", result: "negative" }),
      });
      alert(`Request #${id} has been refused`);
    } catch (err) {
      console.error("Error refusing request:", err);
    }
  };

  // 🔍 Filtering + fuzzy search
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
    <div className="p-6 flex justify-center">
      <div className="bg-white shadow-2xl rounded-3xl p-12 w-full max-w-8xl">

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, NIN, wilaya..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
            >
              <option value="all">All Results</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>

        {/* Cards */}
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
                {/* Header */}
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
                    <span className="text-blue-600">{req.step2}</span>
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    Wilaya: {req.wilaya} — Municipality: {req.municipality}
                  </p>
                  <p className="text-gray-400 text-xs mb-6">
                    Created at: {new Date(req.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-medium text-sm">
                    Status:{" "}
                    <span
                      className={`${
                        req.status === "in-progress"
                          ? "text-blue-600"
                          : req.result === "positive"
                          ? "text-green-600"
                          : req.result === "negative"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {req.result === "positive"
                        ? "Positive"
                        : req.result === "negative"
                        ? "Negative"
                        : req.status || "Pending"}
                    </span>
                  </span>

                  {req.result === "positive" && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                  {req.result === "negative" && (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => handleStartUpdate(req.id)}
                    className="px-5 py-2 rounded-xl bg-green-600 text-white font-medium shadow-md hover:bg-green-700 transition"
                  >
                    Start Update
                  </button>
                  <button
                    onClick={() => handleRefuse(req.id)}
                    className="px-5 py-2 rounded-xl border border-green-600 text-green-600 font-medium shadow-sm hover:bg-green-50 transition"
                  >
                    Refuse
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
