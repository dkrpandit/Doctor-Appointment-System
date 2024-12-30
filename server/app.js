const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require('dotenv').config();
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const financialReportRoutes = require("./routes/financialReportRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

// handling cors polices
const corsOptions = {
  origin: ["http://localhost:5173","http://192.168.0.101:5173"],
  methods: "GET,POST,DELETE,PUT,PATCH,HEAD",
  credentials: true
};
app.use(cors(corsOptions));

// Connect to database
connectDB();

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Doctor Appointment System API");
});

// Doctor routes
app.use("/api/doctors", doctorRoutes);

// Patient routes
app.use("/api/patients", patientRoutes);

// Financial report routes
app.use("/api/reports", financialReportRoutes);

// Appointment routes
app.use("/api/appointments", appointmentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});