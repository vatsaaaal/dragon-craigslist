import { client } from '../server.js';

// Validate incoming message
const validateMessageData = (data) => {
    const { content, sender_id, receiver_id } = data;
    if (!content || typeof content !== 'string' || content.trim() === '') {
        return { valid: false, error: 'Content must be a non-empty string.' };
    }
    if (!sender_id || typeof sender_id !== 'number') {
        return { valid: false, error: 'Sender ID must exist in the database.' };
    }
    if (!receiver_id || typeof receiver_id !== 'number') {
        return { valid: false, error: 'Receiver ID must exist in the database.' };
    }
    return { valid: true };
}

export const handleSendMessage = async (socket, io, data) => {
    // Validate the data
    const { valid, error } = validateMessageData(data);
    if (!valid) {
        socket.emit('error_message', { error });
        return;
    }

    try {
        // Emit the message to the room
        const { user, content, room_id } = savedMessage;
        io.in(room_id).emit('receive_message', {
            user,
            content,
            room_id,
            timestamp: new Date(),
        });
    } catch (error) {
        socket.emit('error_message', { error: 'Failed to save message.' });
    }
};