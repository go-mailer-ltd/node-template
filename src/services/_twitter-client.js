require('dotenv').config();
const TwitterClient = require('twitter-lite');
const {
    TWT_ACCESS_TOKEN,
    TWT_ACCESS_TOKEN_SECRET,
    TWT_CONSUMER_KEY,
    TWT_CONSUMER_SECRET,
} = process.env;

module.exports.TwitterClient = new TwitterClient({
    access_token_key: TWT_ACCESS_TOKEN,
    access_token_secret: TWT_ACCESS_TOKEN_SECRET,
    consumer_key: TWT_CONSUMER_KEY,
    consumer_secret: TWT_CONSUMER_SECRET,
});

module.exports.get_tweep_client = user_data => {
    const { access_token, access_token_secret } = user_data;
    return new TwitterClient({
        access_token_key: access_token,
        access_token_key_secret: access_token_secret,
        consumer_key: TWT_CONSUMER_KEY,
        consumer_secret: TWT_CONSUMER_SECRET,
    });
}