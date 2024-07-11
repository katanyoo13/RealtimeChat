const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

router.post('/submitReport', async (req, res) => {
    try {
        const { reportType, reportDescription } = req.body;
        console.log('Report Type:', reportType); // Log ข้อมูลที่ได้รับมา
        console.log('Report Description:', reportDescription); // Log ข้อมูลที่ได้รับมา

        const newReport = new Report({
            type: reportType,
            description: reportDescription,
            created_at: new Date()
        });
        await newReport.save();
        res.status(200).json({ message: 'Report submitted successfully' });
    } catch (error) {
        console.error('Error submitting report:', error); // เพิ่มการ log ข้อผิดพลาด
        res.status(500).json({ message: 'Error submitting report' });
    }
});


router.get('/reports', async (req, res) => {
    try {
        const reports = await Report.find({});
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error); // เพิ่มการ log ข้อผิดพลาด
        res.status(500).json({ message: 'Error fetching reports' });
    }
});

module.exports = router;
