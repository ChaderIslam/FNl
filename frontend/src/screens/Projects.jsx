import { useState } from "react";
import { Pencil, Shield, FileText } from "lucide-react";

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
  const [formData, setFormData] = useState({
    nin: "",
    lastNameAr: "",
    firstNameAr: "",
    lastNameLat: "",
    firstNameLat: "",
    wilaya: "",
    municipality: "",
  });
  const [savedRequest, setSavedRequest] = useState(null);

  const goToStep = (stepNumber) => {
    if (stepNumber <= maxStep) {
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step1: selections[1],
          step2: selections[2],
          ...formData,
        }),
      });

      if (!response.ok) throw new Error("Failed to save request");
      const result = await response.json();

      setSavedRequest(result);
      setSelections((prev) => ({ ...prev, [currentStep]: formData }));

      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxStep((prev) => Math.max(prev, nextStep));
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Could not save your request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center overflow-hidden p-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-12 gap-6 w-full max-w-3xl">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isUnlocked = stepNumber <= maxStep;

          return (
            <div key={index} className="flex-1 flex items-center">
              {index > 0 && (
                <div
                  className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                    stepNumber <= currentStep ? "bg-gradient-to-r from-green-500 to-green-700" : "bg-gray-300"
                  }`}
                ></div>
              )}

              <button
                type="button"
                disabled={!isUnlocked}
                onClick={() => goToStep(stepNumber)}
                className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg font-bold text-lg transition-all duration-500
                  ${isUnlocked
                    ? stepNumber === currentStep
                      ? "bg-gradient-to-r from-green-600 to-green-800 text-white scale-105"
                      : "bg-gradient-to-r from-green-500 to-green-700 text-white hover:scale-110"
                    : "bg-white border-2 border-gray-300 text-gray-400 cursor-not-allowed"}`}
              >
                {stepNumber}
              </button>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                    stepNumber < currentStep ? "bg-gradient-to-r from-green-500 to-green-700" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between w-full max-w-3xl mb-12 px-2">
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
                ${isUnlocked
                  ? "text-green-700 hover:underline"
                  : "text-gray-400 cursor-not-allowed"}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <h1 className="text-3xl font-bold text-gray-800 mb-12 mt-4 text-center">
        {stepData[currentStep - 1].title}
      </h1>

      {/* Cards */}
      {stepData[currentStep - 1].type === "cards" && (
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-7xl">
          {stepData[currentStep - 1].cards?.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center justify-between flex-1 min-w-[280px] max-w-[380px] hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => handleSelect(currentStep, card.title)}
              >
                <Icon className="text-green-600 w-20 h-20 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">
                  {card.title}
                </h2>
                <p className="text-gray-500 text-center text-base mb-6">{card.description}</p>
                <button
                  type="button"
                  className="w-full rounded-xl bg-gradient-to-r from-green-800 to-green-600 px-6 py-3 font-semibold text-white shadow-md transition hover:from-green-900 hover:to-green-700"
                >
                  {currentStep === stepData.length ? "Finish" : "Select"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Form */}
      {stepData[currentStep - 1].type === "form" && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-5xl"
        >
          {/* NIN field with Autofill button */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">NIN *</label>
              <input
                type="text"
                name="nin"
                value={formData.nin}
                onChange={handleFormChange}
                className="mt-1 w-full border rounded-md px-3 py-3"
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
              className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Autofill
            </button>
          </div>

          {/* Rest of the form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Last name (Arabic) *</label>
              <input
                type="text"
                name="lastNameAr"
                value={formData.lastNameAr}
                onChange={handleFormChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">First name (Arabic) *</label>
              <input
                type="text"
                name="firstNameAr"
                value={formData.firstNameAr}
                onChange={handleFormChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last name (Latin)</label>
              <input
                type="text"
                name="lastNameLat"
                value={formData.lastNameLat}
                onChange={handleFormChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">First name (Latin)</label>
              <input
                type="text"
                name="firstNameLat"
                value={formData.firstNameLat}
                onChange={handleFormChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Wilaya of birth *</label>
              <select
                name="wilaya"
                value={formData.wilaya}
                onChange={handleFormChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
                required
              >
                <option value="">Please select</option>
                <option value="Guelma">Guelma</option>
                <option value="Algiers">Algiers</option>
                <option value="Oran">Oran</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Municipality of birth *</label>
              <select
                name="municipality"
                value={formData.municipality}
                onChange={handleFormChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
                required
              >
                <option value="">Please select</option>
                <option value="Oued Zenati">Oued Zenati</option>
                <option value="Bab El Oued">Bab El Oued</option>
                <option value="Bir El Djir">Bir El Djir</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-green-800 to-green-600 px-6 py-3 font-semibold text-white shadow-md transition hover:from-green-900 hover:to-green-700"
          >
            Next
          </button>
        </form>
      )}

      {/* Review Step */}
      {stepData[currentStep - 1].type === "review" && savedRequest && (
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-3xl text-gray-800">
          <h2 className="text-2xl font-bold mb-6">Review Your Submission</h2>
          <ul className="space-y-3">
            <li><strong>Step 1:</strong> {savedRequest.step1}</li>
            <li><strong>Step 2:</strong> {savedRequest.step2}</li>
            <li><strong>NIN:</strong> {savedRequest.nin}</li>
            <li><strong>Last Name (Ar):</strong> {savedRequest.lastnamear}</li>
            <li><strong>First Name (Ar):</strong> {savedRequest.firstnamear}</li>
            <li><strong>Last Name (Lat):</strong> {savedRequest.lastnamelat}</li>
            <li><strong>First Name (Lat):</strong> {savedRequest.firstnamelat}</li>
            <li><strong>Wilaya:</strong> {savedRequest.wilaya}</li>
            <li><strong>Municipality:</strong> {savedRequest.municipality}</li>
          </ul>
          <button
            type="button"
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-green-700 to-green-500 px-6 py-3 font-semibold text-white shadow-md transition hover:from-green-800 hover:to-green-600"
          >
            Confirm & Submit
          </button>
        </div>
      )}
    </div>
  );
}
