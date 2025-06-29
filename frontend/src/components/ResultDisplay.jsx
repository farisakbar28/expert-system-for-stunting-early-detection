import React from 'react';

const ResultDisplay = ({ result, childData, selectedSymptoms }) => {
  const getRiskLevel = (diagnosis) => {
    if (diagnosis.includes('Tinggi')) return 'high';
    if (diagnosis.includes('Sedang')) return 'medium';
    if (diagnosis.includes('Rendah')) return 'low';
    return 'none';
  };

  const riskLevel = getRiskLevel(result.diagnosis);

  return (
    <div className="result-display">
      {/* Child Information */}
      <div className="result-section">
        <h3>Informasi Balita</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Nama:</label>
            <span>{childData.name}</span>
          </div>
          <div className="info-item">
            <label>Usia:</label>
            <span>{childData.age} bulan</span>
          </div>
          <div className="info-item">
            <label>Jenis Kelamin:</label>
            <span>{childData.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
          </div>
          {childData.height && (
            <div className="info-item">
              <label>Tinggi Badan:</label>
              <span>{childData.height} cm</span>
            </div>
          )}
          {childData.weight && (
            <div className="info-item">
              <label>Berat Badan:</label>
              <span>{childData.weight} kg</span>
            </div>
          )}
        </div>
      </div>

      {/* Diagnosis Result */}
      <div className="result-section">
        <h3>Hasil Diagnosa</h3>
        <div className={`diagnosis-result ${riskLevel}`}>
          <div className="diagnosis-main">
            <h4>{result.diagnosis}</h4>
            <div className="certainty-percentage">
              Tingkat Kepastian: {result.certaintyPercentage}%
            </div>
          </div>
          <div className="certainty-bar">
            <div 
              className="certainty-fill"
              style={{ width: `${result.certaintyPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Selected Symptoms */}
      <div className="result-section">
        <h3>Gejala dan Faktor Risiko yang Ditemukan</h3>
        <div className="selected-symptoms">
          {selectedSymptoms.map((symptom, index) => (
            <span key={index} className="symptom-tag">
              {symptom}
            </span>
          ))}
        </div>
      </div>

      {/* Fired Rules */}
      {result.firedRules && result.firedRules.length > 0 && (
        <div className="result-section">
          <h3>Aturan yang Terpicu</h3>
          <div className="fired-rules">
            {result.firedRules.map((rule, index) => (
              <div key={index} className="rule-item">
                <div className="rule-name">{rule.name}</div>
                <div className="rule-conditions">
                  Kondisi: {rule.conditions.join(', ')}
                </div>
                <div className="rule-conclusion">
                  Kesimpulan: {rule.conclusion} (CF: {rule.certainty_factor})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="result-section">
        <h3>Rekomendasi</h3>
        <div className="recommendations">
          {result.recommendations.map((recommendation, index) => (
            <div key={index} className="recommendation-item">
              <span className="recommendation-number">{index + 1}</span>
              <span className="recommendation-text">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Important Note */}
      <div className="result-section important-note">
        <p><strong>Catatan Penting:</strong> Hasil ini merupakan langkah awal dalam proses identifikasi. Untuk diagnosis dan penanganan lebih lanjut, silakan konsultasikan dengan tenaga medis atau ahli kesehatan anak.</p>
      </div>
    </div>
  );
};

export default ResultDisplay;
