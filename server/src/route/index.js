const express = require('express');
const authRoute = require('./authRoute');
const patientRoute = require('./patientRoute');
const diagnosisRoutes = require('./diagnosisRoute');
const appointmentRoute = require('./appointmentRoute');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Hospital Management System API is running',
        timestamp: new Date().toISOString(),
    });
});

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/patients',
        route: patientRoute,
    },
    {
        path: '/diagnosis',
        route: diagnosisRoutes,
    },
    {
        path: '/appointments',
        route: appointmentRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;