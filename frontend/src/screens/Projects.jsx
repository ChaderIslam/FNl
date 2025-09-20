import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

import {
  Pencil,
  Shield,
  FileText,
  Plus,
  Edit,
  Trash,
  Search,
  User,
} from "lucide-react";
import Fuse from "fuse.js";
import ApplicantForm from "../components/ApplicantForm";

export default function Projects() {
  const stepData = [
    {
      title: "Step 1: Choose a request type",
      type: "cards",
      cards: [
        { title: "Annotation", description: "Apply for annotation.", icon: Pencil },
        { title: "New Control", description: "Request a new control process.", icon: Shield },
        { title: "File Update", description: "Submit a file update request.", icon: FileText },
      ],
    },
    {
      title: "Step 2: Choose a detail level",
      type: "cards",
      cards: [
        { title: "Basic", description: "Minimal details.", icon: Shield },
        { title: "Advanced", description: "Extended details with metadata.", icon: FileText },
      ],
    },
    {
      title: "Step 3: Fill Applicant Form",
      type: "form",
    },
    {
      title: "Step 4: Finalize",
      type: "review",
    },
  ];

  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [selections, setSelections] = useState({});
  const [citizens, setCitizens] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [savedRequest, setSavedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fuse = new Fuse(citizens, {
    keys: ["nin", "firstNameAr", "lastNameAr", "firstNameLat", "lastNameLat"],
    threshold: 0.3,
  });

  const filteredCitizens = searchQuery
    ? fuse.search(searchQuery).map((res) => res.item)
    : citizens;

  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= maxStep) {
      setCurrentStep(stepNumber);
    }
  };

  const handleSelect = (stepIndex, cardTitle) => {
    setSelections((prev) => ({ ...prev, [stepIndex]: cardTitle }));
    if (stepIndex < stepData.length) {
      const nextStep = stepIndex + 1;
      setCurrentStep(nextStep);
      setMaxStep((prev) => Math.max(prev, nextStep));
    }
  };

  const handleAddCitizen = (data) => {
    if (editingIndex !== null) {
      const updated = [...citizens];
      updated[editingIndex] = data;
      setCitizens(updated);
    } else {
      setCitizens((prev) => [...prev, data]);
    }
    setShowForm(false);
    setEditingIndex(null);
  };

  const handleDeleteCitizen = (index) => {
    setCitizens((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitStep3 = async () => {
    try {
      // only save request type info, not citizens yet
      const response = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step1: selections[1],
          step2: selections[2],
        }),
      });

      if (!response.ok) throw new Error("Failed to save request");
      const result = await response.json();

      setSavedRequest(result);

      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxStep((prev) => Math.max(prev, nextStep));
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Could not save your request. Please try again.");
    }
  };

  // Track progress for Step 4
  const [citizenStatuses, setCitizenStatuses] = useState([]);

  useEffect(() => {
    if (citizens.length > 0 && currentStep === 4) {
      setCitizenStatuses(
        citizens.map((c) => ({
          ...c,
          status: "pending",
          progress: 0,
          result: null,
        }))
      );
    }
  }, [citizens, currentStep]);

  // Start control simulation
  const startControl = (index) => {
    setCitizenStatuses((prev) => {
      const updated = [...prev];
      updated[index].status = "in-progress";
      updated[index].progress = 0;
      return updated;
    });

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setCitizenStatuses((prev) => {
        const updated = [...prev];
        if (updated[index].status === "in-progress") {
          updated[index].progress = progress;
          if (progress >= 100) {
            clearInterval(interval);
            updated[index].status = "done";
            updated[index].result =
              Math.random() > 0.5 ? "positive" : "negative"; // random result
          }
        }
        return updated;
      });
    }, 500);
  };


  // Add this state at the top of Projects.jsx
const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(7);

// Pagination logic
const totalPages = Math.ceil(filteredCitizens.length / rowsPerPage);
const paginatedCitizens = filteredCitizens.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);



  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Stepper Section */}
      <div className="sticky top-16 z-40 bg-gray-100 w-full border-b border-gray-200">
        {/* Step Circles */}
        <div className="flex items-center justify-center gap-6 w-full max-w-3xl mx-auto py-6">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isUnlocked = stepNumber <= maxStep;

            return (
              <div key={index} className="flex-1 flex items-center">
                {index > 0 && (
                  <div
                    className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                      stepNumber <= currentStep
                        ? "bg-gradient-to-r from-green-500 to-green-700"
                        : "bg-gray-300"
                    }`}
                  ></div>
                )}

                <button
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => goToStep(stepNumber)}
                  className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg font-bold text-lg transition-all duration-500
                    ${
                      isUnlocked
                        ? stepNumber === currentStep
                          ? "bg-gradient-to-r from-green-600 to-green-800 text-white scale-105"
                          : "bg-gradient-to-r from-green-500 to-green-700 text-white hover:scale-110"
                        : "bg-white border-2 border-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {stepNumber}
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                      stepNumber < currentStep
                        ? "bg-gradient-to-r from-green-500 to-green-700"
                        : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Labels */}
        <div className="flex justify-between w-full max-w-3xl mx-auto px-2 pb-4">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isUnlocked = stepNumber <= maxStep;
            return (
              <button
                key={index}
                type="button"
                disabled={!isUnlocked}
                onClick={() => goToStep(stepNumber)}
                className={`text-sm font-semibold text-center w-14 transition
                  ${
                    isUnlocked
                      ? "text-green-700 hover:underline"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

       {/* Step Content Title */}
      {stepData[currentStep - 1].type === "cards" && (
        <h1 className="text-3xl font-bold text-gray-800 mb-12 mt-12 text-center">
          {stepData[currentStep - 1].title}
        </h1>
      )}


      {/* Cards */}
      {stepData[currentStep - 1].type === "cards" && (
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-7xl">
          {stepData[currentStep - 1].cards?.map((card, index) => {
            const Icon = card.icon;
            const isSelected = selections[currentStep] === card.title; // check selection

            return (
              <div
                key={index}
                className={`rounded-3xl shadow-xl p-8 flex flex-col items-center justify-between flex-1 min-w-[280px] max-w-[380px] hover:scale-105 transition-transform duration-300 cursor-pointer
            ${
              isSelected
                ? "bg-green-100 border-4 border-green-600"
                : "bg-white"
            }`}
                onClick={() => handleSelect(currentStep, card.title)}
              >
                <Icon
                  className={`w-20 h-20 mb-4 ${
                    isSelected ? "text-green-800" : "text-green-600"
                  }`}
                />
                <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">
                  {card.title}
                </h2>
                <p className="text-gray-500 text-center text-base mb-6">
                  {card.description}
                </p>
                <button
                  type="button"
                  className={`w-full rounded-xl px-6 py-3 font-semibold shadow-md transition
              ${
                isSelected
                  ? "bg-gradient-to-r from-green-900 to-green-700 text-white"
                  : "bg-gradient-to-r from-green-800 to-green-600 text-white hover:from-green-900 hover:to-green-700"
              }`}
                >
                  {currentStep === stepData.length
                    ? "Finish"
                    : isSelected
                    ? "Selected"
                    : "Select"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Citizens list step (Step 3) */}
      {stepData[currentStep - 1].type === "form" && (
        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-6xl flex flex-col">
          {/* Top bar with search + add */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <User className="text-green-600" /> Citizens
            </h2>
            <div className="flex items-center gap-4">
              {/* Search bar */}
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Search citizens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 pl-10 shadow-md focus:ring-2 focus:ring-green-300 focus:border-green-400"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>

              {/* Add citizen button */}
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-green-700 to-green-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition flex items-center gap-1"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </div>
{/* Citizens Table */}
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
          <tr
            key={idx}
            className={`${
              idx % 2 === 0 ? "bg-gray-50" : "bg-white"
            } hover:bg-green-50 transition`}
          >
            <td className="px-6 py-4 font-semibold text-gray-800">{citizen.nin}</td>
            <td className="px-6 py-4 text-gray-700">{citizen.firstNameAr}</td>
            <td className="px-6 py-4 text-gray-700">{citizen.lastNameAr}</td>
            <td className="px-6 py-4 text-gray-700">{citizen.wilaya}</td>
            <td className="px-6 py-4 text-gray-700">{citizen.municipality}</td>
            <td className="px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setEditingIndex(idx);
                    setShowForm(true);
                  }}
                  className="p-2 rounded-lg hover:bg-green-100 text-green-700 transition"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteCitizen(idx)}
                  className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                  title="Delete"
                >
                  <Trash size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={6} className="text-center py-6 text-gray-500 italic">
            No citizens found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{/* Pagination Controls */}
<div className="flex items-center justify-between mt-4">
  <div className="flex items-center gap-2 text-gray-700">
    <span>Rows per page:</span>
    <select
      value={rowsPerPage}
      onChange={(e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="border border-gray-200 rounded-xl px-4 py-2 shadow-md bg-white
                 hover:border-green-400 focus:border-green-500 focus:ring-2 
                 focus:ring-green-300 transition"
    >
      {[5, 7, 10, 20].map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  </div>

  <div className="flex items-center gap-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      className="px-3 py-1 border border-gray-200 rounded-xl shadow-sm text-sm 
                 disabled:opacity-50 hover:bg-green-50 transition"
    >
      Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-1 border border-gray-200 rounded-xl shadow-sm text-sm transition
          ${page === currentPage ? "bg-green-600 text-white border-green-600" : "hover:bg-green-50"}`}
      >
        {page}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => p + 1)}
      className="px-3 py-1 border border-gray-200 rounded-xl shadow-sm text-sm 
                 disabled:opacity-50 hover:bg-green-50 transition"
    >
      Next
    </button>
  </div>
</div>


          {/* Modal with ApplicantForm */}
          {showForm && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl p-6">
                <ApplicantForm
                  initialData={editingIndex !== null ? citizens[editingIndex] : {}}
                  onSubmit={handleAddCitizen}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingIndex(null);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons (outside card) */}
      {stepData[currentStep - 1].type === "form" && (
        <div className="flex justify-between w-full max-w-6xl mt-6">
          {/* Previous */}
          <button
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 1}
            className="w-32 px-6 py-3 rounded-xl border-2 border-green-600 text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500 font-semibold shadow-sm hover:opacity-80 disabled:opacity-40"
          >
            Previous
          </button>

          {/* Next */}
          <button
            onClick={handleSubmitStep3}
            disabled={citizens.length === 0}
            className="w-32 px-6 py-3 rounded-xl bg-gradient-to-r from-green-800 to-green-600 font-semibold text-white shadow-md hover:from-green-900 hover:to-green-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

{/* Review Step */}
{stepData[currentStep - 1].type === "review" && savedRequest && (
  <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-5xl text-gray-800 flex flex-col">
    <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
      Finalize Control
    </h2>

    {/* Citizens List with Scroll */}
    <div className="flex-1 max-h-[400px] overflow-y-auto mb-6">
      <ul className="space-y-6 p-4">
        {citizenStatuses.map((c, i) => (
          <li
            key={i}
            className={`p-6 rounded-3xl shadow-md transition-colors duration-500 hover:scale-[1.01] flex flex-col gap-4
              ${
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

    {/* Action Buttons - Fixed at Bottom (no border) */}
    <div className="sticky bottom-0 left-0 right-0 bg-white pt-4 pb-2 flex justify-center gap-4">
      {/* Start All Controls */}
      {citizenStatuses.some((c) => c.status === "pending") && (
        <button
          onClick={() => citizenStatuses.forEach((_, i) => startControl(i))}
          className="w-40 px-6 py-3 rounded-xl bg-gradient-to-r from-green-800 to-green-600 
                     font-semibold text-white shadow-md hover:from-green-900 hover:to-green-700 
                     hover:scale-105 transition"
        >
          Start Controls
        </button>
      )}

      {/* Download CSV */}
      {citizenStatuses.every((c) => c.status === "done") && (
        <button
          onClick={() => {
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
          }}
          className="w-40 px-6 py-3 rounded-xl bg-gradient-to-r from-green-800 to-green-600 
                     font-semibold text-white shadow-md hover:from-green-900 hover:to-green-700 
                     hover:scale-105 transition"
        >
          Download CSV
        </button>
      )}

      {/* Finish Button */}
      {citizenStatuses.every((c) => c.status === "done") && (
        <button
          onClick={() => alert("✅ Control process completed!")}
          className="w-40 px-6 py-3 rounded-xl bg-gradient-to-r from-green-800 to-green-600 
                     font-semibold text-white shadow-md hover:from-green-900 hover:to-green-700 
                     hover:scale-105 transition"
        >
          Finish
        </button>
      )}
    </div>
  </div>
)}



    </div>
  );
}

