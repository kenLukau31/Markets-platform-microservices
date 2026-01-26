const cron = require("node-cron");
const mongoose = require("mongoose");

const Notification = require("../model/Notification");

const axios = require("axios");

const USERS_SERVICE_URL = "http://users-service:3000";

const pino = require("pino");

const logger = pino({
    transport: {
        target: "pino-pretty",
        options: { colorize: true }
    }
});



cron.schedule("0 9 * * *", async () => {

    try {
        
        logger.info("Cron job Notification: Trying to send a new promotion everyday at 9h.");

        const res= await axios.get(`${USERS_SERVICE_URL}/users?role=buyer`);
        const users= res.data;

        console.log("users:", users.length);

        const notifications = users.map(user => ({
            user_id: user._id,
            type: "promotion",
            content: "Special offer: 20% discount on all types of potatoes! Even the lazy ones..."
        }))

        await Notification.insertMany(notifications);
        logger.info("Cron job Notification: Notification sent.");

    } catch (error) {
        logger.error("Cron job Notification: Notification was NOT sent.")
    }

})