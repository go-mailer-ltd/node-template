const appEvent = require('./_config');
const StreamService = require('../services/stream/stream');
const { NEW_STREAM_DATA, STREAM_RULE_UPDATE} = require('./constants/stream');

/** */
appEvent.on(NEW_STREAM_DATA, data => {
    console.log(`New Event: `, NEW_STREAM_DATA);
    StreamService.handle_stream_data(data);
});

appEvent.on(STREAM_RULE_UPDATE, data => {
    console.log(`New Event: `, STREAM_RULE_UPDATE);
    StreamService.handle_rule_change(data);
});
