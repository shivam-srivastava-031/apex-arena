const notificationService = require('../services/notification.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/apiResponse');

const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    return ok(res, 'Notifications fetched successfully', notifications);
});

const markAsRead = asyncHandler(async (req, res) => {
    const notification = await notificationService.markAsRead(req.user.id, req.params.id);
    return ok(res, 'Notification marked as read', notification);
});

const markAllAsRead = asyncHandler(async (req, res) => {
    await notificationService.markAllAsRead(req.user.id);
    return ok(res, 'All notifications marked as read', {});
});

const createNotification = asyncHandler(async (req, res) => {
    const notification = await notificationService.createNotification(req.user.id, req.body);
    return created(res, 'Notification created successfully', notification);
});

module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    createNotification
};
