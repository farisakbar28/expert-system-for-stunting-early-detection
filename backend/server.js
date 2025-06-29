const express = require("express");
const cors = require("cors");
require("dotenv").config();

const consultationRoutes = require("./routes/consultation");
const expertSystemRoutes = require("./routes/expertSystem");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/consultation", consultationRoutes);
app.use("/api/expert-system", expertSystemRoutes);

app.get("/", (req, res) => {
  res.send(
    "✅ Selamat datang di Expert System API! Silakan akses /api untuk melihat daftar endpoint yang tersedia."
  );
});

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the Expert System API",
    endpoints: {
      consultation: {
        save: "/api/consultation/save",
        history: "/api/consultation/history",
        byId: "/api/consultation/:id",
      },
      expertSystem: {
        symptoms: "/api/expert-system/symptoms",
        rules: "/api/expert-system/rules",
        diagnose: "/api/expert-system/diagnose",
      },
      health: "/api/health",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log("🚀 Server is running!");
  console.log(`🔗 Base URL:        http://localhost:${PORT}`);
  console.log(`📡 Health Check:    http://localhost:${PORT}/api/health`);
  console.log(`📚 API Entry Point: http://localhost:${PORT}/api`);
});
