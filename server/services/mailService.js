const { Worker } = require('bullmq');
const transporter = require("../utils/nodeMailerConfig.js");
const logger = require("../services/logger.js");
const emailTemplates = require("../templates/emailtemplates.js");
const { emailQueue } = require("./queueService.js");
const UserModel = require('../models/userModel.js');

const sendMail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: Array.isArray(to) ? to.join(',') : to,
        subject,
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
};

const sendPasswordResetEmail = async (user, resetToken) => {
    const subject = 'Password Reset Request for IT Ticketing';
    const htmlContent = emailTemplates.passwordReset(user, resetToken);
    await emailQueue.add('email', {
        email: user.email, 
        subject, 
        htmlContent
    });
};

const sendOnboardingEmail = async (user) => {
    const subject = 'Welcome to IT Ticketing!';
    const htmlContent = emailTemplates.onboarding(user);
    await emailQueue.add('email', {
        email: user.email, 
        subject, 
        htmlContent
    });
}

const sendCreateTicketEmail = async (includedMembers, user, ticket) => {
    const subject = 'New Ticket Created - IT Ticketing';
    const htmlContent = emailTemplates.createTicket(user, ticket);
    const emails = await Promise.all(
        includedMembers.map(async member => {
            const user = await UserModel.findById(member._id);
            return user.email;
        })
    );
    await emailQueue.add('email', {
        email: emails, 
        subject, 
        htmlContent
    });
};

const createEmailWorker = () => {
    const worker = new Worker('emailQueue', async job => {
        const { email, subject, htmlContent } = job.data;
        logger.info("Sending Email to:", email," For: ", subject);

        try {
            await sendMail(email, subject, htmlContent);
            logger.info(`Email Sent to:  ${email} For: ${subject}`);
        } catch (error) {
            logger.error(`Failed to process job ${job.id}: ${error.message}`);
            throw new Error(`Email Sent Failed: ${error.message}`);
        }
    }, {
        connection: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD
        },
    });

    worker.on('completed', (job) => {
        logger.info(`Job ${job.id} completed successfully!`);
    });

    worker.on('failed', (job, err) => {
        logger.error(`Job ${job.id} failed with error: ${err.message}`);
    });

    return worker;
}

module.exports = {
    sendPasswordResetEmail,
    sendOnboardingEmail,
    createEmailWorker,
    sendCreateTicketEmail
};