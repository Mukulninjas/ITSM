const socketEvents = (io) => {
    io.on('connection', (socket) => {
        socket.on('joinTicket', (ticketId) => {
            socket.join(ticketId);
        });
    });
}

module.exports = { socketEvents };