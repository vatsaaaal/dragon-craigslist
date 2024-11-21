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

// Store message to the database
const saveMessageToDatabase = async (message) => {
    const { content, user, room_id, receiver_id } = message;
    try {
        const query = `
            INSERT INTO message (sender_id, receiver_id, content, room_id, timestamp)
            VALUES ($1, $2, $3, $4, NOW()) RETURNING *;
        `;
        const values = [user, receiver_id, content, room_id];
        const result = await client.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error saving message to database:', error);
        throw new Error('Database error');
    }
};

export const handleSendMessage = async (socket, io, data) => {
    // Validate the data
    const { valid, error } = validateMessageData(data);
    if (!valid) {
        socket.emit('error_message', { error });
        return;
    }

    try {
        // Save message to DB
        const savedMessage = await saveMessageToDatabase(data);

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