const express = require("express");
const db = require("./db/database");
const internshipRoutes = require("./routes/internships");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Internship Board REST API is running"
    });
});

// Internship routes
app.use("/api/internships", internshipRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found"
    });
});

// General error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        error: "Internal server error"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});