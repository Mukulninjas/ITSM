const ticketModel = require("../models/ticketModel");
const UserModel = require("../models/userModel");
const { sendCreateTicketEmail } = require("../services/mailService");
const { imageUploadQueue } = require("../services/queueService");
const { logger } = require("../utils/nodeMailerConfig");
const bcrypt = require("bcrypt");

const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            logger.error("No image file provided while uploading profile image", { error });
            return res.status(400).json({ message: 'No image file provided' });
        }

        if (!req.user.email) {
            logger.error("No email provided while uploading profile image", { error });
            return res.status(400).json({ message: 'No email provided' });
        }

        logger.info(`Uploading profile image for email: ${req.user.email}`);
        await imageUploadQueue.add('uploadProfileImage', {
            filePath: req.file.path,
            email: req.user.email,
            type: 'userProfile',
        });

        return res.status(201).json({ message: 'Image upload start successfully' });
    } catch (error) {
        logger.error("Error while uploading profile image", { error });
        return res.status(500).json({ message: error.message });
    }
};

const removeProfileImage = async (req, res) => {
    try {
        if (!req.user.email) {
            logger.error("No email provided while removing profile image", { error });
            return res.status(400).json({ message: 'No email provided' });
        }

        logger.info(`Removing profile image for email: ${req.user.email}`);
        await UserModel.findOneAndUpdate({ email: req.user.email }, { profileImage: null });
        return res.status(200).json({ message: 'Image removal successful' });

    } catch (error) {

        logger.error("Error while removing profile image", { error });
        return res.status(500).json({ message: error.message });

    }
};

const changePassword = async (req, res) => {
    try {
        const email = req.user.email;
        if (!email) {
            logger.error("No email provided while changing password", { error });
            return res.status(400).json({ message: 'No email provided' });
        }

        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(401).json({ message: 'Password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 6);
        await UserModel.findOneAndUpdate({ email }, { password: hashedNewPassword });

        logger.info(`Password changed for email: ${email}`);
        return res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {

        logger.error(`Error while updating password for ${req.user.email}: ${error.message}`);
        return res.status(500).json({ message: 'Internal Server Error', error });

    }
};

const createTicket = async (req, res) => {
    try {
        if (!req.user.email) {
            logger.error("No email provided while creating a ticket", { error });
            return res.status(400).json({ message: 'No email provided' });
        }

        const { title, description, status, assignee } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is a required field.' });
        }

        let assigneeUser = null;
        let includedMembers = [req.user.id];
        if (assignee) {
            assigneeUser = await UserModel.findOne({ email: assignee.toLowerCase() });
            if (!assigneeUser || assigneeUser.role !== "it") {
                return res.status(404).json({ message: 'Assignee not found or not in assignee list' });
            }else{
                includedMembers.push(assigneeUser._id);
            }
        }

        const newTicket = new ticketModel({
            title,
            description,
            status: status || 'Open',
            assignee: assigneeUser ? assigneeUser._id : null,
            reporter: req.user.id,
            comments: [],
            includedMembers: includedMembers
        });

        await newTicket.save();
        await sendCreateTicketEmail(includedMembers, req.user, newTicket);
        
        const jobs = req.files.map(({path}) => ({
            name: 'uploadImage',
            data: {
                filePath: path,
                type: 'ticket',
                ticketId: newTicket._id,
            },
        }));
        await imageUploadQueue.addBulk(jobs);

        res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });

    } catch (error) {
        logger.error(`Error while creating a ticket for ${req.user.email}: ${error.message}`);
        return res.status(500).json({ message: 'Internal Server Error', error });
    };
};

const getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketModel.find({ reporter: req.user.id });
        return res.status(200).json({ tickets });
    } catch (error) {
        logger.error(`Error getting tickets for ${req.user.email}`, error.message);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};

const postComment = async (req, res) => {
    try {
        if (!req.user.email) {
            logger.error("No email provided while creating a comment", { error });
            return res.status(400).json({ message: 'No email provided' });
        }
        const { ticketId, comment } = req.body;
        if (!ticketId ||!comment) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }
        const ticket = await ticketModel.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        ticket.comments.push({
            user: req.user.id,
            text: comment
        });

        const io = req.app.get("io");
        io.to(ticketId.toString()).emit("newComment", comment);
        
        await ticket.save();
        res.status(201).json({ message: 'Comment created successfully', comment: ticket.comments[ticket.comments.length - 1] });
    } catch (error) {
        logger.error(`Error while creating a comment for ${req.user.email}: ${error.message}`);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};

module.exports = {
    uploadProfileImage,
    removeProfileImage,
    changePassword,
    createTicket,
    getAllTickets,
    postComment
};