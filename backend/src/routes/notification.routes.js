const express = require('express');
const notificationController = require('../controllers/notification.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.route('/')
    .get(notificationController.getMyNotifications)
    .post(notificationController.createNotification);

router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
