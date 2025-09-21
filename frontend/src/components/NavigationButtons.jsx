export default function NavigationButtons({ currentStep, goToStep, handleNext, disableNext }) {
  return (
    <div className="flex justify-between w-full max-w-6xl mt-6">
      <button
        onClick={() => goToStep(currentStep - 1)}
        disabled={currentStep === 1}
        className="w-32 px-6 py-3 rounded-xl border-2 border-green-600 text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500 font-semibold shadow-sm hover:opacity-80 disabled:opacity-40"
      >
        Previous
      </button>

      <button
        onClick={handleNext}
        disabled={disableNext}
        className="w-32 px-6 py-3 rounded-xl bg-gradient-to-r from-green-800 to-green-600 font-semibold text-white shadow-md hover:from-green-900 hover:to-green-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
