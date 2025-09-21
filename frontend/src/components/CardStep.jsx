export default function CardStep({ cards, currentStep, selections, handleSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-8 w-full max-w-7xl my-12">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isSelected = selections[currentStep] === card.title;
        return (
          <div
            key={index}
            className={`rounded-3xl shadow-xl p-8 flex flex-col items-center justify-between flex-1 min-w-[280px] max-w-[380px] hover:scale-105 transition-transform duration-300 cursor-pointer ${
              isSelected ? "bg-green-100 border-4 border-green-600" : "bg-white"
            }`}
            onClick={() => handleSelect(currentStep, card.title)}
          >
            <Icon className={`w-20 h-20 mb-4 ${isSelected ? "text-green-800" : "text-green-600"}`} />
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">{card.title}</h2>
            <p className="text-gray-500 text-center text-base mb-6">{card.description}</p>
            <button
              type="button"
              className={`w-full rounded-xl px-6 py-3 font-semibold shadow-md transition ${
                isSelected
                  ? "bg-gradient-to-r from-green-900 to-green-700 text-white"
                  : "bg-gradient-to-r from-green-800 to-green-600 text-white hover:from-green-900 hover:to-green-700"
              }`}
            >
              {isSelected ? "Selected" : "Select"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
