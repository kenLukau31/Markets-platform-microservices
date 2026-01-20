const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notifications.controller.js');
// const {authenticateToken, authorizeRole} = require('../../users-service/controllers/auth.controller.js');

router.post("/", notificationController.createNotification);

router.get("/", notificationController.getAllNotifications);
router.get("/user/:userId", notificationController.getNotificationByUserId);
router.get("/:id", notificationController.getNotificationById);

router.delete("/:id", notificationController.deleteNotification);

module.exports = router;