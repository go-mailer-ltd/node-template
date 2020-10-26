const appEvent = require('./_config');
const { TWT_ACCT_CONNECTED } = require('./constants/user');

/** */
appEvent.on(TWT_ACCT_CONNECTED, data => {
    console.log(`event`, data);
});