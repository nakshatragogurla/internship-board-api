const express = require("express");
const router = express.Router();
const db = require("../db/database");

// Validation function
function validateInternship(data) {
    const requiredFields = [
        "title",
        "company",
        "location",
        "description",
        "skills",
        "duration"
    ];

    for (const field of requiredFields) {
        if (!data[field] || String(data[field]).trim() === "") {
            return `${field} is required`;
        }
    }

    return null;
}

// GET /api/internships
// List internships with pagination
router.get("/", (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const offset = (page - 1) * limit;

    db.get(
        "SELECT COUNT(*) AS total FROM internships",
        [],
        (countErr, countRow) => {
            if (countErr) {
                return res.status(500).json({
                    success: false,
                    error: "Failed to count internships"
                });
            }

            db.all(
                `SELECT * FROM internships
                 ORDER BY created_at DESC
                 LIMIT ? OFFSET ?`,
                [limit, offset],
                (err, rows) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            error: "Failed to fetch internships"
                        });
                    }

                    res.status(200).json({
                        success: true,
                        data: rows,
                        pagination: {
                            page: page,
                            limit: limit,
                            total: countRow.total,
                            totalPages: Math.ceil(countRow.total / limit)
                        }
                    });
                }
            );
        }
    );
});

// GET /api/internships/:id
// Get one internship
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            error: "Invalid internship ID"
        });
    }

    db.get(
        "SELECT * FROM internships WHERE id = ?",
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: "Failed to fetch internship"
                });
            }

            if (!row) {
                return res.status(404).json({
                    success: false,
                    error: "Internship not found"
                });
            }

            res.status(200).json({
                success: true,
                data: row
            });
        }
    );
});

// POST /api/internships
// Create internship
router.post("/", (req, res) => {
    const error = validateInternship(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            error: error
        });
    }

    const {
        title,
        company,
        location,
        description,
        skills,
        duration,
        stipend,
        application_url
    } = req.body;

    const sql = `
        INSERT INTO internships
        (title, company, location, description, skills, duration, stipend, application_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            title.trim(),
            company.trim(),
            location.trim(),
            description.trim(),
            skills.trim(),
            duration.trim(),
            stipend || null,
            application_url || null
        ],
        function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: "Failed to create internship"
                });
            }

            db.get(
                "SELECT * FROM internships WHERE id = ?",
                [this.lastID],
                (getErr, row) => {
                    if (getErr) {
                        return res.status(500).json({
                            success: false,
                            error: "Internship created but could not be retrieved"
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: "Internship created successfully",
                        data: row
                    });
                }
            );
        }
    );
});

// PUT /api/internships/:id
// Update internship
router.put("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            error: "Invalid internship ID"
        });
    }

    const error = validateInternship(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            error: error
        });
    }

    const {
        title,
        company,
        location,
        description,
        skills,
        duration,
        stipend,
        application_url
    } = req.body;

    const sql = `
        UPDATE internships
        SET title = ?,
            company = ?,
            location = ?,
            description = ?,
            skills = ?,
            duration = ?,
            stipend = ?,
            application_url = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [
            title.trim(),
            company.trim(),
            location.trim(),
            description.trim(),
            skills.trim(),
            duration.trim(),
            stipend || null,
            application_url || null,
            id
        ],
        function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: "Failed to update internship"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    error: "Internship not found"
                });
            }

            db.get(
                "SELECT * FROM internships WHERE id = ?",
                [id],
                (getErr, row) => {
                    if (getErr) {
                        return res.status(500).json({
                            success: false,
                            error: "Internship updated but could not be retrieved"
                        });
                    }

                    res.status(200).json({
                        success: true,
                        message: "Internship updated successfully",
                        data: row
                    });
                }
            );
        }
    );
});

// DELETE /api/internships/:id
// Delete internship
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            error: "Invalid internship ID"
        });
    }

    db.run(
        "DELETE FROM internships WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: "Failed to delete internship"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    error: "Internship not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Internship deleted successfully"
            });
        }
    );
});

module.exports = router;