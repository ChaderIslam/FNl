import { useState, useEffect } from "react";
import { Pencil, Shield, FileText } from "lucide-react";
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
    { title: "Step 3: Fill Applicant Form", type: "form" },
    { title: "Step 4: Finalize", type: "review" },
  ];

  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];

  const [currentStep, setCurrentStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [selections, setSelections] = useState({});
  const [citizens, setCitizens] = useState([]);
  const [citizenStatuses, setCitizenStatuses] = useState([]);

  // Navigation functions
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
  const handleDeleteCitizen = (idx) => setCitizens((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmitStep3 = () => setCurrentStep(4);

  // Step 4: Control simulation
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

  useEffect(() => {
    if (citizens.length && currentStep === 4) {
      setCitizenStatuses(
        citizens.map((c) => ({ ...c, status: "pending", progress: 0, result: null }))
      );
    }
  }, [citizens, currentStep]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Stepper */}
      <Stepper steps={steps} currentStep={currentStep} maxStep={maxStep} goToStep={goToStep} />

      {/* Step 1 & 2: Cards with title/question */}
      {stepData[currentStep - 1].type === "cards" && (
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

      {/* Step 3: Citizens Table + Navigation Buttons */}
      {stepData[currentStep - 1].type === "form" && (
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

      {/* Step 4: Review */}
      {stepData[currentStep - 1].type === "review" && (
        <ReviewStep citizenStatuses={citizenStatuses} startControl={startControl} />
      )}
    </div>
  );
}
