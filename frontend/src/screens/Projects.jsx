import { useState, useEffect } from "react";
import { Pencil, Shield, FileText, Download, Upload } from "lucide-react";
import * as XLSX from "xlsx"; // install: npm install xlsx
import Stepper from "../components/Stepper";
import CardStep from "../components/CardStep";
import CitizensTable from "../components/CitizensTable";
import ReviewStep from "../components/ReviewStep";
import NavigationButtons from "../components/NavigationButtons";

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
    { title: "Step 3: Fill Applicant Form / Upload Data", type: "form" },
    { title: "Step 4: Finalize", type: "review" },
  ];

  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];

  const [currentStep, setCurrentStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [selections, setSelections] = useState({});
  const [citizens, setCitizens] = useState([]);
  const [citizenStatuses, setCitizenStatuses] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Navigation
  const goToStep = (step) => {
    if (step >= 1 && step <= maxStep) setCurrentStep(step);
  };

  const handleSelect = (stepIndex, cardTitle) => {
    setSelections((prev) => ({ ...prev, [stepIndex]: cardTitle }));
    const nextStep = stepIndex + 1;
    setCurrentStep(nextStep);
    setMaxStep((prev) => Math.max(prev, nextStep));
  };

  const handleAddCitizen = (data) => setCitizens((prev) => [...prev, data]);
  const handleDeleteCitizen = (idx) =>
    setCitizens((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmitStep3 = () => setCurrentStep(4);

  // ✅ Generate Excel template dynamically with headers + example row
  const generateExcelTemplate = () => {
    const headers = ["nin", "firstNameAr", "lastNameAr", "wilaya", "municipality"];
    const exampleRow = {
      nin: "123456789",
      firstNameAr: "جون", // John in Arabic
      lastNameAr: "دو",   // Doe in Arabic
      wilaya: "01",
      municipality: "الجزائر", // Algiers
    };

    const worksheet = XLSX.utils.json_to_sheet([exampleRow], { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    XLSX.writeFile(workbook, "advanced-template.xlsx");
  };

  // ✅ Excel Upload & Parse (keep all columns even if blank)
  const handleFileUpload = (file) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // enforce headers matching CitizensTable
      const rows = XLSX.utils.sheet_to_json(sheet, {
        header: ["nin", "firstNameAr", "lastNameAr", "wilaya", "municipality"],
        range: 1, // skip first row (headers row)
        defval: "", // fill empty cells with ""
      });

      setCitizens(rows);
    };
    reader.readAsArrayBuffer(file);
  };

  // Control simulation
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
              Math.random() > 0.5 ? "positive" : "negative";
          }
        }
        return updated;
      });
    }, 500);
  };

  // ✅ Handle Finish button (save to backend)
  const handleFinish = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: citizenStatuses.map((c) => ({
            step1: selections[1],
            step2: selections[2],
            ...c,
          })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("✅ Data saved successfully!");
        // Reset wizard after saving
        setCurrentStep(1);
        setMaxStep(1);
        setSelections({});
        setCitizens([]);
        setCitizenStatuses([]);
        setUploadedFile(null);
      } else {
        alert("⚠️ Failed to save data");
      }
    } catch (error) {
      console.error("Finish error:", error);
      alert("Server error");
    }
  };

  useEffect(() => {
    if (citizens.length && currentStep === 4) {
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <Stepper
        steps={steps}
        currentStep={currentStep}
        maxStep={maxStep}
        goToStep={goToStep}
      />

      {/* Step 1 & 2: Cards */}
      {stepData[currentStep - 1]?.type === "cards" && (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-12 mt-12 text-center">
            {stepData[currentStep - 1].title}
          </h1>
          <CardStep
            cards={stepData[currentStep - 1].cards}
            currentStep={currentStep}
            selections={selections}
            handleSelect={handleSelect}
          />
        </>
      )}

      {/* Step 3: Basic OR Advanced */}
      {currentStep === 3 && (
        <>
          {selections[2] === "Basic" && (
            <>
              <CitizensTable
                citizens={citizens}
                handleAdd={handleAddCitizen}
                handleDelete={handleDeleteCitizen}
              />
              <NavigationButtons
                currentStep={currentStep}
                goToStep={goToStep}
                handleNext={handleSubmitStep3}
                disableNext={citizens.length === 0}
              />
            </>
          )}

          {selections[2] === "Advanced" && (
            <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-3xl text-center border border-gray-200 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Upload Advanced Template
                </h2>
                <p className="text-gray-600 mb-6">
                  Download the Excel template, fill it with your data, then upload it here.
                </p>

                {/* Upload box */}
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed 
                                  rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <Upload className="w-12 h-12 text-green-600 mb-2" />
                  <span className="text-gray-700 font-medium">Click to upload or drag & drop</span>
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                  />
                </label>

                {/* File preview */}
                {uploadedFile && (
                  <div className="mt-6 px-6 py-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3 justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-semibold">{uploadedFile.name}</span>
                  </div>
                )}
              </div>

              {/* Buttons always at bottom */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <button
                  onClick={generateExcelTemplate}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl 
                             bg-gradient-to-r from-green-700 to-green-600 text-white font-semibold 
                             shadow-md hover:from-green-800 hover:to-green-700 transition"
                >
                  <Download className="w-5 h-5" /> Download Template
                </button>

                <button
                  onClick={() => {
                    if (citizens.length > 0) {
                      handleSubmitStep3();
                    } else {
                      alert("Please upload a valid file first.");
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl 
                             bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold 
                             shadow-md hover:from-green-700 hover:to-green-600 transition"
                >
                  <Upload className="w-5 h-5" /> Continue
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Step 4: Review */}
      {stepData[currentStep - 1]?.type === "review" && (
        <ReviewStep
          citizenStatuses={citizenStatuses}
          startControl={startControl}
          handleFinish={handleFinish}   // ✅ pass down Finish handler
        />
      )}
    </div>
  );
}
