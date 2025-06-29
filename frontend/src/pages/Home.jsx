import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="container">
        <section className="hero">
          <h1>Sistem Pakar Deteksi Dini Stunting</h1>
          <p className="hero-subtitle">
            Sistem cerdas untuk mendeteksi risiko stunting pada balita 
            menggunakan metode Forward Chaining dan Certainty Factor
          </p>
          <button 
            className="btn btn-primary btn-large"
            onClick={() => navigate('/consultation')}
          >
            Mulai Konsultasi
          </button>
        </section>

        <section className="features">
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Forward Chaining</h3>
              <p>
                Menggunakan metode forward chaining untuk melakukan inferensi 
                berdasarkan gejala dan faktor risiko yang ditemukan
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Certainty Factor</h3>
              <p>
                Menghitung tingkat kepastian diagnosa dengan metode certainty factor 
                untuk hasil yang lebih akurat
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👶</div>
              <h3>Deteksi Dini</h3>
              <p>
                Membantu deteksi dini risiko stunting pada balita 
                untuk pencegahan dan penanganan yang tepat
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>User Friendly</h3>
              <p>
                Interface yang mudah digunakan dan responsive 
                untuk kemudahan akses dari berbagai perangkat
              </p>
            </div>
          </div>
        </section>

        <section className="about">
          <h2>Tentang Stunting</h2>
          <div className="about-content">
            <p>
              Stunting adalah kondisi gagal tumbuh pada balita akibat kekurangan gizi 
              kronis terutama pada 1000 hari pertama kehidupan (HPK). Balita dikatakan 
              stunting jika panjang/tinggi badannya berada di bawah -2 standar deviasi 
              (SD) dari median panjang/tinggi badan anak seusianya berdasarkan standar WHO.
            </p>
            <p>
              Stunting tidak hanya berdampak pada pertumbuhan fisik, tetapi juga 
              mempengaruhi perkembangan kognitif dan motorik anak. Oleh karena itu, 
              deteksi dini dan penanganan yang tepat sangat penting untuk mencegah 
              dampak jangka panjang stunting.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;