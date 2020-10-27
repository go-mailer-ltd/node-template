/** */


const extract_dm_sender = data => {
    const { for_user_id, users } = data;
    for (let user_id in users) {
        const user_data = users[user_id];
        if (user_id !== for_user_id) {
            return user_data;
        }
    };

    return null;
}

const extract_dm_data = data => {
    const message = data.direct_message_events[0];
    const { id, created_timestamp, message_create } = message;
    console.log(message_create);
}

const extract_dm_reply_metadata = data => {
    
}

module.exports.process_direct_message = event_data => {
    const message = extract_dm_data(event_data);
    const sender = extract_dm_sender(event_data);

    return {
        message,
        org_id,
        reply: {
            user_id: event_data.for_user_id,
            recipient: sender.id,
            body: ''
        },
        sender,
        user_id: data.for_user_id,
    }
}