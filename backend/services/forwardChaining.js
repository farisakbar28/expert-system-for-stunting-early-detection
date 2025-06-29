const pool = require("../config/database");

class ForwardChaining {
  async process(selectedSymptoms) {
    try {
      const rulesResult = await pool.query(
        "SELECT * FROM rules ORDER BY certainty_factor DESC"
      );
      const rules = rulesResult.rows;

      const firedRules = [];
      const conclusions = [];

      for (const rule of rules) {
        const conditions = rule.conditions;

        const allConditionsMet = conditions.every((condition) =>
          selectedSymptoms.includes(condition)
        );

        if (allConditionsMet) {
          firedRules.push(rule);
          conclusions.push({
            conclusion: rule.conclusion,
            certainty_factor: rule.certainty_factor,
            rule_name: rule.rule_name,
          });
        }
      }

      const finalResult = this.calculateFinalCertainty(conclusions);

      return {
        firedRules,
        finalResult,
        selectedSymptoms,
      };
    } catch (error) {
      throw new Error(`Forward chaining error: ${error.message}`);
    }
  }

  calculateFinalCertainty(conclusions) {
    if (conclusions.length === 0) {
      return {
        conclusion: "Tidak Ada Indikasi Stunting",
        certainty_factor: 0,
        certainty_percentage: 0,
      };
    }

    const grouped = {};

    for (const c of conclusions) {
      if (!grouped[c.conclusion]) {
        grouped[c.conclusion] = [];
      }
      grouped[c.conclusion].push(c.certainty_factor);
    }

    let bestConclusion = null;
    let highestCF = 0;

    for (const [conclusion, cfs] of Object.entries(grouped)) {
      let combinedCF = cfs[0];
      for (let i = 1; i < cfs.length; i++) {
        combinedCF = combinedCF + cfs[i] - combinedCF * cfs[i];
      }

      if (combinedCF > highestCF) {
        highestCF = combinedCF;
        bestConclusion = conclusion;
      }
    }

    return {
      conclusion: bestConclusion,
      certainty_factor: highestCF,
      certainty_percentage: Math.round(highestCF * 100),
    };
  }
}

module.exports = new ForwardChaining();
