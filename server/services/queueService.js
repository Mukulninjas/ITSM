const { Queue } = require('bullmq');

const connection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
};

const imageUploadQueue = new Queue('imageUploadQueue', { connection });
const emailQueue = new Queue('emailQueue', { connection });

module.exports = { imageUploadQueue, emailQueue };
