import { useState, useEffect } from "react";
import { Pencil, Shield, FileText, Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import Stepper from "../components/Stepper";
import CardStep from "../components/CardStep";
import CitizensTable from "../components/CitizensTable";
import ReviewStep from "../components/ReviewStep";
import NavigationButtons from "../components/NavigationButtons";

export default function Projects() {
  const stepData = [
    {
      title: "Step 1: Choose a control type",
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

  // ✅ Excel Template
  const generateExcelTemplate = () => {
    const headers = ["nin", "first_name_ar", "last_name_ar", "wilaya", "municipality"];
    const exampleRow = {
      nin: "123456789",
      first_name_ar: "محمد",
      last_name_ar: "بن عيسى",
      wilaya: "Guelma",
      municipality: "Oued Zenati",
    };

    const worksheet = XLSX.utils.json_to_sheet([exampleRow], { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "citizens-template.xlsx");
  };

  // ✅ Excel Upload
  const handleFileUpload = (file) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, {
        header: ["nin", "first_name_ar", "last_name_ar", "wilaya", "municipality"],
        range: 1,
        defval: "",
      });
      setCitizens(rows);
    };
    reader.readAsArrayBuffer(file);
  };

  // Simulate control progress
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
            updated[index].result = Math.random() > 0.5 ? "positive" : "negative";
          }
        }
        return updated;
      });
    }, 500);
  };

  // ✅ Final Save (uses updated API)
  const handleFinish = async () => {
    try {
      // 1️⃣ Create Control List
      const listResponse = await fetch("http://localhost:5000/api/control-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selections[1] || "Unnamed Control List",
          description: `Created via ${selections[2]} details`,
          created_by: 1,
        }),
      });

      const controlList = await listResponse.json();
      const controlListId = controlList.control_list_id;

      if (!controlListId) {
        alert("⚠️ Control list creation failed.");
        return;
      }

      // 2️⃣ Create Citizens + Controls
      for (const c of citizenStatuses) {
        const citizenPayload = {
          nin: c.nin?.toString().trim() || "",
          lastname_ar: c.last_name_ar || c.lastNameAr || "غير معروف",
          firstname_ar: c.first_name_ar || c.firstNameAr || "غير معروف",
          lastname_lat: c.last_name_lat || c.lastNameLat || "",
          firstname_lat: c.first_name_lat || c.firstNameLat || "",
          wilaya: c.wilaya || "غير معروف",
          municipality: c.municipality || "غير معروف",
        };

        if (!citizenPayload.nin || citizenPayload.lastname_ar === "غير معروف") continue;

        // ✅ Updated: API automatically reuses existing citizens by NIN
        const citizenResponse = await fetch("http://localhost:5000/api/citizens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(citizenPayload),
        });

        const citizen = await citizenResponse.json();
        const citizenId = citizen?.citizen_id;

        if (!citizenId) {
          console.warn("⚠️ Skipping control creation for citizen:", citizenPayload);
          continue;
        }

        // ✅ Create Control linked to Citizen and Control List
        const controlPayload = {
          citizen_id: citizenId,
          control_list_id: controlListId,
          type: selections[1] || "General",
          status: c.status || "Pending",
          progress: c.progress || 0,
          result: c.result || null,
        };

        await fetch("http://localhost:5000/api/controls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(controlPayload),
        });
      }

      alert("✅ All citizens and controls have been saved successfully!");
      // Reset
      setCurrentStep(1);
      setMaxStep(1);
      setSelections({});
      setCitizens([]);
      setCitizenStatuses([]);
      setUploadedFile(null);
    } catch (error) {
      console.error("❌ Error during final save:", error);
      alert("Server error while saving data.");
    }
  };

  // Prepare citizen statuses at Step 4
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
      <Stepper steps={steps} currentStep={currentStep} maxStep={maxStep} goToStep={goToStep} />

      {/* Step 1 & 2 */}
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

      {/* Step 3 */}
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

                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed 
                                  rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <Upload className="w-12 h-12 text-green-600 mb-2" />
                  <span className="text-gray-700 font-medium">
                    Click to upload or drag & drop
                  </span>
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                  />
                </label>

                {uploadedFile && (
                  <div className="mt-6 px-6 py-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3 justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-semibold">
                      {uploadedFile.name}
                    </span>
                  </div>
                )}
              </div>

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

      {/* Step 4 */}
      {stepData[currentStep - 1]?.type === "review" && (
        <ReviewStep
          citizenStatuses={citizenStatuses}
          startControl={startControl}
          handleFinish={handleFinish}
        />
      )}
    </div>
  );
}
