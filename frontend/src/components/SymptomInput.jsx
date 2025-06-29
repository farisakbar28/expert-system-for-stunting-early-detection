import React from "react";

const SymptomInput = ({ symptoms, selectedSymptoms, onSymptomToggle }) => {
  const groupedSymptoms = symptoms.reduce((acc, symptom) => {
    const type = symptom.type === "symptom" ? "Gejala" : "Faktor Risiko";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(symptom);
    return acc;
  }, {});

  return (
    <div className="symptom-input">
      {["Gejala", "Faktor Risiko"].map(
        (type) =>
          groupedSymptoms[type] && (
            <div key={type} className="symptom-group">
              <h3>{type}</h3>
              <div className="symptom-grid">
                {groupedSymptoms[type].map((symptom) => (
                  <div
                    key={symptom.code}
                    className={`symptom-card ${
                      selectedSymptoms.includes(symptom.code) ? "selected" : ""
                    }`}
                    onClick={() => onSymptomToggle(symptom.code)}
                  >
                    <div className="symptom-header">
                      <span className="symptom-code">{symptom.code}</span>
                      <input
                        type="checkbox"
                        checked={selectedSymptoms.includes(symptom.code)}
                        onChange={() => onSymptomToggle(symptom.code)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <h4>{symptom.name}</h4>
                    <p>{symptom.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default SymptomInput;
