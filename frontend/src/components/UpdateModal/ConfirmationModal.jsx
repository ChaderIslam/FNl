import { useState } from "react";
import { X, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";

export default function ConfirmationModal({ data, onClose, onSuccess }) {
  const { request, houseInfo } = data;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // 1️⃣ Update request status
      await fetch(`http://localhost:5000/api/requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "in-progress" }),
      });

      // 2️⃣ Add house info
      await fetch(`http://localhost:5000/api/requests/${request.id}/house`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(houseInfo),
      });

      // Simulate delay for user feedback
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 1200);
    } catch (err) {
      console.error("Error updating:", err);
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (success) {
      onSuccess?.();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg h-[60vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            Confirm Update
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-8">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-green-700">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="font-medium text-lg">Processing update...</p>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center gap-3 text-green-700">
              <CheckCircle2 className="w-14 h-14 text-green-600" />
              <h3 className="text-xl font-semibold">Update Successful!</h3>
              <p className="text-gray-600">
                The citizen’s record and house information were successfully updated.
              </p>
            </div>
          ) : (
            <>
              <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Are you sure you want to proceed?
              </h3>
              <p className="text-gray-600 text-sm max-w-md">
                Once confirmed, this action <span className="font-semibold text-red-600">cannot be undone</span>. 
                A record of this update — linking this house to the citizen — will be 
                permanently stored under your user history.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 px-8 py-4 border-t border-gray-200">
          {!loading && !success && (
            <>
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
            </>
          )}
          {success && (
            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
