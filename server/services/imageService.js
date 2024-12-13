const { Worker } = require('bullmq');
const cloudinary = require('cloudinary').v2;
const UserModel = require("../models/userModel");
const TicketModel = require("../models/ticketModel");
const logger = require("./logger");
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const createImageUploadWorker = () => {
    const worker = new Worker('imageUploadQueue', async job => {
        const { filePath, email, type, ticketId } = job.data;
        logger.info(`Uploading image for ${type}:`, { filePath, email, ticketId });

        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'uploads',
                resource_type: 'image',
            });

            if (type === 'userProfile') {
                await UserModel.findOneAndUpdate(
                    { email: email.toLowerCase() },
                    { $set: { profileImage: result.secure_url } },
                    { new: true }
                );
                logger.info(`Updated user profile image for email: ${email}`);
            }

            if (type === 'ticket') {
                const response = await TicketModel.findByIdAndUpdate(
                    ticketId,
                    { $push: { file: result.secure_url } },
                    { new: true }
                );
                logger.info(`Added image to ticket: ${ticketId}`);
            }

            fs.unlinkSync(filePath);
            logger.info(`Uploaded and removed file: ${filePath}`);
        } catch (error) {
            logger.error(`Failed to process job ${job.id}: ${error.message}`);
            throw new Error(`Image upload failed: ${error.message}`);
        }
    }, {
        connection: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
        },
    });

    worker.on('completed', (job) => {
        logger.info(`Job ${job.id} completed successfully!`);
    });

    worker.on('failed', (job, err) => {
        logger.error(`Job ${job.id} failed with error: ${err.message}`);
    });

    return worker;
};

module.exports = createImageUploadWorker;
