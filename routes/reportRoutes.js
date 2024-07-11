const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// API สำหรับส่งรายงาน
router.post('/submitReport', async (req, res) => {
    try {
        const { reportType, reportDescription } = req.body;
        const newReport = new Report({
            type: reportType,
            description: reportDescription,
            created_at: new Date()
        });
        await newReport.save();
        res.status(200).json({ message: 'Report submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting report' });
    }
});

// API สำหรับดึงรายงานทั้งหมด
router.get('/reports', async (req, res) => {
    try {
        const reports = await Report.find({});
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports' });
    }
});

module.exports = router;
