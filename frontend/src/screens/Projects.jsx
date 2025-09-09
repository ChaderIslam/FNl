import { Pencil, Shield, FileText } from "lucide-react";

export default function Overview() {
  const cards = [
    { 
      title: "Annotation", 
      description: "Apply for an annotation request to review, comment, or provide additional details on an existing dataset, document, or report. This ensures all information is accurately captured and validated.",
      icon: Pencil
    },
    { 
      title: "New Control", 
      description: "Request a new control process to introduce a new verification, monitoring, or compliance procedure within the system. This helps maintain proper governance and operational efficiency.",
      icon: Shield
    },
    { 
      title: "File Update", 
      description: "Submit a file update request to modify, replace, or upload documents, reports, or data files. This ensures that all stored files are current, accurate, and accessible to relevant team members.",
      icon: FileText
    },
  ];

  const steps = ["Step 1", "Step 2", "Step 3"];
  const currentStep = 1; // Change dynamically

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center overflow-hidden p-6">

      {/* Stylish Step Indicator */}
      <div className="flex items-center justify-center mb-12 gap-6 w-full max-w-3xl">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 flex items-center">
            {/* Left line */}
            {index > 0 && (
              <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                index <= currentStep ? "bg-gradient-to-r from-green-500 to-green-700" : "bg-gray-300"
              }`}></div>
            )}

            {/* Circle */}
            <div className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg text-white font-bold text-lg
              transition-all duration-500
              ${index + 1 <= currentStep ? "bg-gradient-to-r from-green-500 to-green-700" : "bg-white border-2 border-gray-300 text-gray-400"}
            `}>
              {index + 1}
            </div>

            {/* Right line */}
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                index + 1 < currentStep ? "bg-gradient-to-r from-green-500 to-green-700" : "bg-gray-300"
              }`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between w-full max-w-3xl mb-12 px-2">
        {steps.map((label, index) => (
          <span key={index} className={`text-sm font-semibold text-center w-14
            ${index + 1 <= currentStep ? "text-green-700" : "text-gray-400"}`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Question */}
      <h1 className="text-3xl font-bold text-gray-800 mb-12 mt-4 text-center">
        What type of request do you want to apply for?
      </h1>

      {/* Cards Row */}
      <div className="flex flex-wrap justify-center gap-8 w-full max-w-7xl">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center justify-between flex-1 min-w-[280px] max-w-[380px] hover:scale-105 transition-transform duration-300"
            >
              <Icon className="text-green-600 w-20 h-20 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">{card.title}</h2>
              <p className="text-gray-500 text-center text-base mb-6">{card.description}</p>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-green-800 to-green-600 px-6 py-3 font-semibold text-white shadow-md transition hover:from-green-900 hover:to-green-700"
              >
                Apply
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
