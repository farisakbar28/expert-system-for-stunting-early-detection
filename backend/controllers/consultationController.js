const pool = require('../config/database');

const consultationController = {
  saveConsultation: async (req, res) => {
    try {
      const {
        childName,
        childAge,
        childGender,
        childHeight,
        childWeight,
        selectedSymptoms,
        diagnosisResult,
        certaintyPercentage,
        recommendations
      } = req.body;
      
      const query = `
        INSERT INTO consultations 
        (child_name, child_age, child_gender, child_height, child_weight, 
         selected_symptoms, diagnosis_result, certainty_percentage, recommendations)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      
      const values = [
        childName,
        childAge,
        childGender,
        childHeight,
        childWeight,
        JSON.stringify(selectedSymptoms),
        diagnosisResult,
        certaintyPercentage,
        recommendations.join('; ')
      ];
      
      const result = await pool.query(query, values);
      
      res.json({
        success: true,
        message: 'Consultation saved successfully',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getConsultationHistory: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM consultations 
        ORDER BY created_at DESC 
        LIMIT 50
      `);
      
      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },
  
  getConsultationById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT * FROM consultations WHERE id = $1',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Consultation not found'
        });
      }
      
      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = consultationController;