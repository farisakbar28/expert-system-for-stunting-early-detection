import React, { useState, useEffect } from "react";
import { consultationAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const History = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConsultationHistory();
  }, []);

  const fetchConsultationHistory = async () => {
    try {
      setLoading(true);
      const response = await consultationAPI.getHistory();
      setConsultations(response.data.data);
    } catch (error) {
      console.error("Error fetching consultation history:", error);
      alert("Gagal mengambil riwayat konsultasi");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRiskLevelClass = (diagnosis) => {
    if (diagnosis.includes("Tinggi")) return "high";
    if (diagnosis.includes("Sedang")) return "medium";
    if (diagnosis.includes("Rendah")) return "low";
    return "none";
  };

  // Fungsi untuk parsing selected_symptoms yang bisa berupa JSON string atau CSV string
  const parseSymptoms = (symptomsInput) => {
    if (!symptomsInput) return [];

    if (Array.isArray(symptomsInput)) {
      return symptomsInput;
    }

    if (typeof symptomsInput !== "string") {
      symptomsInput = String(symptomsInput);
    }

    try {
      if (symptomsInput.trim().startsWith("[")) {
        return JSON.parse(symptomsInput);
      }
      return symptomsInput.split(",");
    } catch (error) {
      console.error("Gagal parsing selected_symptoms:", error);
      return [];
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="history-page">
      <div className="container">
        <h2>Riwayat Konsultasi</h2>

        {consultations.length === 0 ? (
          <div className="no-data">
            <p>Belum ada riwayat konsultasi</p>
          </div>
        ) : (
          <div className="consultation-list">
            {consultations.map((consultation) => (
              <div key={consultation.id} className="consultation-card">
                <div className="consultation-header">
                  <h3>{consultation.child_name}</h3>
                  <span className="consultation-date">
                    {formatDate(consultation.created_at)}
                  </span>
                </div>

                <div className="consultation-details">
                  <div className="detail-item">
                    <span className="label">Usia:</span>
                    <span>{consultation.child_age} bulan</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Jenis Kelamin:</span>
                    <span>
                      {consultation.child_gender === "L"
                        ? "Laki-laki"
                        : "Perempuan"}
                    </span>
                  </div>
                  {consultation.child_height && (
                    <div className="detail-item">
                      <span className="label">Tinggi:</span>
                      <span>{consultation.child_height} cm</span>
                    </div>
                  )}
                  {consultation.child_weight && (
                    <div className="detail-item">
                      <span className="label">Berat:</span>
                      <span>{consultation.child_weight} kg</span>
                    </div>
                  )}
                </div>

                <div className="consultation-result">
                  <div
                    className={`diagnosis ${getRiskLevelClass(
                      consultation.diagnosis_result
                    )}`}
                  >
                    {consultation.diagnosis_result}
                  </div>
                  <div className="certainty">
                    Kepastian: {consultation.certainty_percentage}%
                  </div>
                </div>

                <div className="consultation-symptoms">
                  <span className="label">Gejala yang dipilih:</span>
                  <div className="symptoms-list">
                    {parseSymptoms(consultation.selected_symptoms).map(
                      (symptom, index) => (
                        <span key={index} className="symptom-tag">
                          {symptom}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
