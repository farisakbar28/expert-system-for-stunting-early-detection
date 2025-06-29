import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { consultationAPI } from '../services/api';
import ResultDisplay from '../components/ResultDisplay';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { result, childData, selectedSymptoms } = location.state || {};

  useEffect(() => {
    if (!result || !childData) {
      navigate('/consultation');
    }
  }, [result, childData, navigate]);

  const handleSaveResult = async () => {
    try {
      setSaving(true);
      await consultationAPI.saveConsultation({
        childName: childData.name,
        childAge: parseInt(childData.age),
        childGender: childData.gender,
        childHeight: parseFloat(childData.height) || null,
        childWeight: parseFloat(childData.weight) || null,
        selectedSymptoms,
        diagnosisResult: result.diagnosis,
        certaintyPercentage: result.certaintyPercentage,
        recommendations: result.recommendations
      });
      setSaved(true);
      alert('Hasil konsultasi berhasil disimpan!');
    } catch (error) {
      console.error('Error saving consultation:', error);
      alert('Gagal menyimpan hasil konsultasi');
    } finally {
      setSaving(false);
    }
  };

  const handleNewConsultation = () => {
    navigate('/consultation');
  };

  if (!result || !childData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="result-page">
      <div className="container">
        <h2>Hasil Diagnosa</h2>
        
        <ResultDisplay
          result={result}
          childData={childData}
          selectedSymptoms={selectedSymptoms}
        />
        
        <div className="result-actions">
          <button
            onClick={handleSaveResult}
            className="btn btn-primary"
            disabled={saving || saved}
          >
            {saving ? 'Menyimpan...' : saved ? 'Tersimpan' : 'Simpan Hasil'}
          </button>
          
          <button
            onClick={handleNewConsultation}
            className="btn btn-secondary"
          >
            Konsultasi Baru
          </button>
          
          <button
            onClick={() => window.print()}
            className="btn btn-outline"
          >
            Cetak Hasil
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;