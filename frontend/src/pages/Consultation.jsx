import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { expertSystemAPI } from '../services/api';
import SymptomInput from '../components/SymptomInput';
import LoadingSpinner from '../components/LoadingSpinner';

const Consultation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [childData, setChildData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: ''
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      setLoading(true);
      const response = await expertSystemAPI.getSymptoms();
      setSymptoms(response.data.data);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      alert('Gagal mengambil data gejala');
    } finally {
      setLoading(false);
    }
  };

  const handleChildDataChange = (e) => {
    setChildData({
      ...childData,
      [e.target.name]: e.target.value
    });
  };

  const handleSymptomToggle = (symptomCode) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomCode)) {
        return prev.filter(code => code !== symptomCode);
      } else {
        return [...prev, symptomCode];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!childData.name || !childData.age || !childData.gender) {
      alert('Mohon lengkapi data balita');
      return;
    }
    
    if (selectedSymptoms.length === 0) {
      alert('Mohon pilih minimal satu gejala atau faktor risiko');
      return;
    }

    try {
      setLoading(true);
      const response = await expertSystemAPI.processDiagnosis({
        selectedSymptoms,
        childData
      });
      
      // Navigate to result page with data
      navigate('/result', {
        state: {
          result: response.data.data,
          childData,
          selectedSymptoms
        }
      });
    } catch (error) {
      console.error('Error processing diagnosis:', error);
      alert('Gagal memproses diagnosa');
    } finally {
      setLoading(false);
    }
  };

  if (loading && symptoms.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="consultation-page">
      <div className="container">
        <h2>Konsultasi Deteksi Stunting</h2>
        
        <form onSubmit={handleSubmit} className="consultation-form">
          {/* Child Data Section */}
          <div className="form-section">
            <h3>Data Balita</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Nama Balita *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={childData.name}
                  onChange={handleChildDataChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="age">Usia (bulan) *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={childData.age}
                  onChange={handleChildDataChange}
                  min="0"
                  max="60"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="gender">Jenis Kelamin *</label>
                <select
                  id="gender"
                  name="gender"
                  value={childData.gender}
                  onChange={handleChildDataChange}
                  required
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="height">Tinggi Badan (cm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={childData.height}
                  onChange={handleChildDataChange}
                  step="0.1"
                  min="30"
                  max="120"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="weight">Berat Badan (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={childData.weight}
                  onChange={handleChildDataChange}
                  step="0.1"
                  min="2"
                  max="30"
                />
              </div>
            </div>
          </div>

          {/* Symptoms Selection */}
          <SymptomInput
            symptoms={symptoms}
            selectedSymptoms={selectedSymptoms}
            onSymptomToggle={handleSymptomToggle}
          />

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Proses Diagnosa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Consultation;