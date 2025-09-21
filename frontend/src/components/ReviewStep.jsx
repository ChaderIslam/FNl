import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function ReviewStep({ citizenStatuses, startControl }) {
  const allDone = citizenStatuses.every((c) => c.status === "done");
  const somePending = citizenStatuses.some((c) => c.status === "pending");

  const downloadCSV = () => {
    const headers = ["NIN", "FirstName", "LastName", "Status", "Result"];
    const rows = citizenStatuses.map((c) => [
      c.nin,
      c.firstNameAr,
      c.lastNameAr,
      c.status,
      c.result,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "citizens_results.csv";
    link.click();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-5xl text-gray-800 flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        Finalize Control
      </h2>

      {/* Citizens List */}
      <div className="flex-1 max-h-[400px] overflow-y-auto mb-6">
        <ul className="space-y-6 p-4">
          {citizenStatuses.map((c, i) => (
            <li
              key={i}
              className={`p-6 rounded-3xl shadow-md transition-colors duration-500 hover:scale-[1.01] flex flex-col gap-4 ${
                c.status === "done" && c.result === "positive"
                  ? "bg-green-50 hover:shadow-lg"
                  : c.status === "done" && c.result === "negative"
                  ? "bg-red-50 hover:shadow-lg"
                  : "bg-gray-50 hover:shadow-md"
              }`}
            >
              {/* Citizen Info */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-xl text-gray-800">
                    {c.firstNameAr} {c.lastNameAr}
                  </p>
                  <p className="text-sm text-gray-500">NIN: {c.nin}</p>
                </div>

                {/* Status / Result */}
                <div className="flex items-center gap-2">
                  {c.status === "pending" && (
                    <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700 font-medium">
                      Pending
                    </span>
                  )}
                  {c.status === "in-progress" && (
                    <span className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
                      <Loader2 className="w-4 h-4 animate-spin" /> In Progress
                    </span>
                  )}
                  {c.status === "done" && c.result === "positive" && (
                    <span className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
                      <CheckCircle className="w-5 h-5" /> Positive
                    </span>
                  )}
                  {c.status === "done" && c.result === "negative" && (
                    <span className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-red-100 text-red-700 font-medium">
                      <XCircle className="w-5 h-5" /> Negative
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {c.status === "in-progress" && (
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-600 via-green-500 to-green-400 h-3 transition-all duration-500"
                    style={{ width: `${c.progress}%` }}
                  ></div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 left-0 right-0 bg-white pt-4 pb-2 flex justify-center gap-4">
        {/* Start All Controls */}
        {somePending && (
          <button
            onClick={() => citizenStatuses.forEach((_, i) => startControl(i))}
            className="w-40 px-6 py-3 rounded-xl bg-gradient-to-r from-green-800 to-green-600 font-semibold text-white shadow-md hover:from-green-900 hover:to-green-700 hover:scale-105 transition"
          >
            Start Controls
          </button>
        )}

        {/* Download CSV */}
        {allDone && (
          <button
            onClick={downloadCSV}
            className="w-40 px-6 py-3 rounded-xl bg-gradient-to-r from-green-800 to-green-600 font-semibold text-white shadow-md hover:from-green-900 hover:to-green-700 hover:scale-105 transition"
          >
            Download CSV
          </button>
        )}

        {/* Finish Button */}
        {allDone && (
          <button
            onClick={() => alert("✅ Control process completed!")}
            className="w-40 px-6 py-3 rounded-xl bg-gradient-to-r from-green-800 to-green-600 font-semibold text-white shadow-md hover:from-green-900 hover:to-green-700 hover:scale-105 transition"
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
}
