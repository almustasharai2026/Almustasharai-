const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const requestRoutes = require('./request');
const adminRoutes = require('./admin');
const botRoutes = require('./botRoutes');

const router = express.Router();

router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/', requestRoutes);
router.use('/', botRoutes);
router.use('/admin', adminRoutes);

module.exports = router;