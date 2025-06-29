const pool = require("../config/database");
const forwardChaining = require("../services/forwardChaining");

const expertSystemController = {
  getSymptoms: async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM symptoms ORDER BY type, code"
      );
      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  getRules: async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM rules ORDER BY certainty_factor DESC"
      );
      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  processDiagnosis: async (req, res) => {
    try {
      const { selectedSymptoms, childData } = req.body;

      if (!selectedSymptoms || selectedSymptoms.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No symptoms selected",
        });
      }

      const result = await forwardChaining.process(selectedSymptoms);

      const recommendations = generateRecommendations(
        result.finalResult.conclusion,
        childData
      );

      res.json({
        success: true,
        data: {
          diagnosis: result.finalResult.conclusion,
          certaintyPercentage: result.finalResult.certainty_percentage,
          firedRules: result.firedRules,
          recommendations,
          selectedSymptoms,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

function generateRecommendations(conclusion, childData = {}) {
  const { childAge, childGender } = childData;

  const baseRecommendations = {
    "Risiko Sangat Tinggi Stunting": [
      "SEGERA konsultasi ke dokter spesialis anak dalam 24-48 jam",
      "Lakukan pemeriksaan komprehensif (antropometri, lab, dll)",
      "Ikuti program terapi gizi intensif sesuai anjuran medis",
      "Berikan suplementasi mikronutrien sesuai resep dokter",
      "Evaluasi dan tangani kondisi penyerta (infeksi, malabsorpsi)",
      "Pantau tumbuh kembang setiap minggu",
      "Perbaiki sanitasi lingkungan secara menyeluruh",
      "Terapkan pola asuh responsif dengan bimbingan ahli",
      "Pertimbangkan rujukan ke rumah sakit jika diperlukan",
    ],

    "Risiko Tinggi Stunting": [
      "Segera konsultasi ke dokter anak atau puskesmas dalam 1-2 minggu",
      "Lakukan pemeriksaan antropometri dan skrining gizi",
      "Perbaiki asupan gizi dengan makanan bergizi seimbang tinggi protein",
      "Berikan suplementasi vitamin dan mineral sesuai anjuran medis",
      "Tangani infeksi berulang dengan pengobatan yang tepat",
      "Pantau tumbuh kembang setiap 2 minggu",
      "Perbaiki sanitasi air, makanan, dan lingkungan",
      "Terapkan pola asuh yang responsif dan stimulatif",
      "Ikuti program pemulihan gizi di fasilitas kesehatan",
    ],

    "Risiko Sedang Stunting": [
      "Konsultasi ke tenaga kesehatan terdekat dalam 2-4 minggu",
      "Tingkatkan asupan protein hewani, sayur, dan buah-buahan",
      "Perbaiki kualitas dan kuantitas MP-ASI",
      "Berikan stimulasi tumbuh kembang sesuai usia",
      "Jaga kebersihan makanan dan minuman",
      "Pantau pertumbuhan setiap bulan di posyandu",
      "Cegah dan tangani infeksi ringan dengan cepat",
      "Perbaiki pola tidur dan aktivitas fisik anak",
      "Edukasi keluarga tentang gizi dan kesehatan anak",
    ],

    "Risiko Rendah Stunting": [
      "Konsultasi rutin ke posyandu atau puskesmas",
      "Pertahankan pola makan bergizi seimbang",
      "Lanjutkan pemberian ASI eksklusif hingga 6 bulan",
      "Berikan MP-ASI yang bervariasi setelah 6 bulan",
      "Jaga kebersihan lingkungan dan personal hygiene",
      "Lakukan pemantauan tumbuh kembang setiap bulan",
      "Berikan stimulasi yang sesuai perkembangan usia",
      "Terapkan pola hidup sehat dalam keluarga",
      "Tingkatkan pengetahuan tentang gizi balita",
    ],

    "Tidak Ada Indikasi Stunting": [
      "Pertahankan pola asuh dan asupan gizi yang sudah baik",
      "Lanjutkan pemantauan tumbuh kembang rutin di posyandu",
      "Jaga konsistensi pemberian makanan bergizi seimbang",
      "Pertahankan kebersihan dan sanitasi lingkungan",
      "Berikan stimulasi yang bervariasi sesuai tahap perkembangan",
      "Lakukan imunisasi lengkap sesuai jadwal",
      "Jaga pola tidur dan aktivitas yang sehat",
      "Tetap waspada terhadap tanda-tanda gangguan tumbuh kembang",
    ],
  };

  let rec =
    baseRecommendations[conclusion] ||
    baseRecommendations["Tidak Ada Indikasi Stunting"];

  if (childAge !== undefined && !isNaN(childAge)) {
    if (childAge < 6) {
      rec.push(
        "Fokus pada pemberian ASI eksklusif dan pemantauan pertumbuhan ketat"
      );
    } else if (childAge < 24) {
      rec.push(
        "Fokus pada pemberian ASI dan MP-ASI yang tepat dengan variasi makanan"
      );
    } else if (childAge < 60) {
      rec.push(
        "Berikan makanan keluarga yang dimodifikasi dengan protein tinggi dan zat besi"
      );
    } else {
      rec.push("Pastikan kecukupan gizi saat persiapan dan masuk usia sekolah");
    }
  }

  if (childGender === "Laki-laki") {
    rec.push(
      "Pantau asupan kalori karena kebutuhan energi anak laki-laki cenderung lebih tinggi"
    );
  } else if (childGender === "Perempuan") {
    rec.push(
      "Perhatikan asupan zat besi untuk mencegah anemia, terutama saat menstruasi nanti"
    );
  }

  return rec;
}

module.exports = expertSystemController;
