const appEvent = require('./_config');
const StreamService = require('../services/stream/stream');
const { NEW_STREAM_DATA, STREAM_RULE_UPDATE} = require('./constants/stream');

/** */
appEvent.on(NEW_STREAM_DATA, data => StreamService.handle_stream_data(data));

appEvent.on(STREAM_RULE_UPDATE, data => StreamService.handle_rule_change(data));
