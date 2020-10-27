/**
 * @description Twitter User service helper functions
 */

module.exports.format_data_for_database = data => {
    return {
        ...data,
        tweep_id: data.user_id,
        username: data.screen_name,
        access_token: data.oauth_token,
        access_token_secret: data.oauth_token_secret,
        is_active: true,
        is_deleted: false,
    }
}

module.exports.format_dm_event_data = data => {
    const data_to_send = {
        userId: this.id,
        message: {
            id: message_id,
            body
        },
        sender: {
            id,
            name
        },
        reply: {
            userId: this._id,
            recipient: id,
            body: ''
        },
        orgId: this.orgId
    }

    return {

    }
}

// module.exports.format_

module.exports.split_query_params = (query) => {
    if (!query) return {};

    let splitted_params = {};

    const level_one_parts = query.split('&');
    level_one_parts.forEach( level_one_part => {
        const level_two_parts = level_one_part.split('=');
        splitted_params[level_two_parts[0]] = level_two_parts[1];
    });

    return splitted_params;
}