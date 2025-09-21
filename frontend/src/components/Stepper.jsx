export default function Stepper({ steps, currentStep, maxStep, goToStep }) {
  return (
    <div className="sticky top-16 z-40 bg-gray-100 w-full border-b border-gray-200">
      {/* Step Circles */}
      <div className="flex items-center justify-center gap-6 w-full max-w-3xl mx-auto py-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isUnlocked = stepNumber <= maxStep;

          return (
            <div key={index} className="flex-1 flex items-center">
              {/* Line before circle */}
              {index > 0 && (
                <div
                  className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                    stepNumber <= currentStep
                      ? "bg-gradient-to-r from-green-500 to-green-700"
                      : "bg-gray-300"
                  }`}
                ></div>
              )}

              {/* Step circle */}
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

              {/* Line after circle */}
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

      {/* Step labels */}
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
              className={`text-sm font-semibold text-center w-14 transition ${
                isUnlocked ? "text-green-700 hover:underline" : "text-gray-400 cursor-not-allowed"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
