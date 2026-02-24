const Notification = require('../models/Notification');

const getUserNotifications = async (userId) => {
    return Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
};

const markAsRead = async (userId, notificationId) => {
    return Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true },
        { new: true }
    );
};

const markAllAsRead = async (userId) => {
    return Notification.updateMany(
        { userId, read: false },
        { read: true }
    );
};

const createNotification = async (userId, data) => {
    return Notification.create({ userId, ...data });
};

module.exports = {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    createNotification
};
