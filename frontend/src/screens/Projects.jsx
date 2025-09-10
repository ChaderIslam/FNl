import { useState } from "react";
import { Pencil, Shield, FileText } from "lucide-react";

export default function Overview() {
  // Steps with their own card choices or forms
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
      type: "cards",
      cards: [
        { title: "Confirm", description: "Review your choices and confirm submission.", icon: Pencil },
      ],
    },
  ];

  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleSelect = (stepIndex, cardTitle) => {
    setSelections((prev) => ({ ...prev, [stepIndex]: cardTitle }));
    if (stepIndex < stepData.length) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSelections((prev) => ({ ...prev, [currentStep]: formData }));
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center overflow-hidden p-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-12 gap-6 w-full max-w-3xl">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 flex items-center">
            {index > 0 && (
              <div
                className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                  index + 1 <= currentStep
                    ? "bg-gradient-to-r from-green-500 to-green-700"
                    : "bg-gray-300"
                }`}
              ></div>
            )}
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg text-white font-bold text-lg
                transition-all duration-500
                ${index + 1 <= currentStep
                  ? "bg-gradient-to-r from-green-500 to-green-700"
                  : "bg-white border-2 border-gray-300 text-gray-400"}`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                  index + 1 < currentStep
                    ? "bg-gradient-to-r from-green-500 to-green-700"
                    : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between w-full max-w-3xl mb-12 px-2">
        {steps.map((label, index) => (
          <span
            key={index}
            className={`text-sm font-semibold text-center w-14
            ${index + 1 <= currentStep ? "text-green-700" : "text-gray-400"}`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Step Content */}
      <h1 className="text-3xl font-bold text-gray-800 mb-12 mt-4 text-center">
        {stepData[currentStep - 1].title}
      </h1>

      {stepData[currentStep - 1].type === "cards" && (
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-7xl">
          {stepData[currentStep - 1].cards.map((card, index) => {
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


      {/* Debug selected path */}
      <div className="mt-10 text-gray-700">
        <strong>Your selections:</strong>{" "}
        {Object.entries(selections)
          .map(([step, choice]) =>
            typeof choice === "string" ? `Step ${step}: ${choice}` : `Step ${step}: [Form filled]`
          )
          .join(" → ")}
      </div>
    </div>
  );
}
