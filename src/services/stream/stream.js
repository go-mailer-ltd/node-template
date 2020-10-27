/** */
require('dotenv').config();
const axios = require('axios').default;
const StreamClient = require('./client');
const StreamController = require('../../controllers/stream');

const { TWT_BEARER_TOKEN } = process.env;
const { logger } = require('../../utilities/logger');

class StreamService {
    constructor(
        stream_client,
    ) {

        /** */
        this.organisation_rules = new Map();
        this.stream_client = stream_client;
        this.stream_headers = {
            authorization: `Bearer ${TWT_BEARER_TOKEN}`,
        };
        this.stream_url = `https://api.twitter.com/2/tweets/search/stream`;

        /** */
        this.fetch_rules();
        stream_client.listen();
    }

    build_rule(data) {
        const { org_id, handles, hashtags } = data;

        const valid_handles = this.validate_rule_group(handles);
        const valid_hashtags = this.validate_rule_group(hashtags);

        const formatted_handles = valid_handles.map(handle => `form:@${handle} OR @${handle}`);
        const formatted_hashtags = valid_hashtags.map(hashtag => `#${hashtag}`);

        const value = [...formatted_handles, ...formatted_hashtags];
        return {
            tag: org_id,
            value: value.join(' OR '),
        }
    }

    async create_rule(org_id, rule) {
        return axios.post(`${this.stream_url}/rules`, { add: [rule] }, { headers: this.stream_headers })
            .then(response => {
                const { id } = response.data.data;
                this.organisation_rules.set(Number(org_id), id);
                return id;
            })
            .catch(e => {
                logger.error(`[StreamService Error] create_rule - ${e.message}`);
            })
    }

    async delete_rule(org_id, rule_id) {
        return axios.post(`${this.stream_url}/rules`, { delete: { ids: [rule_id] } }, { headers: this.stream_headers })
            .then(response => {
                this.organisation_rules.delete(Number(org_id))
            })
            .catch(e => {
                logger.error(`[StreamService Error] create_rule - ${e.message}`);
            })
    }

    async fetch_rules() {
        axios.get(`${this.stream_url}/rules`, { headers: this.stream_headers })
            .then(response => {
                const { data } = response.data;
                data.forEach(rule => {
                    const { id, tag } = rule;
                    this.organisation_rules.set(Number(tag), id);
                })
            })
            .catch(e => {
                logger.error(`[StreamService Error] fetch_rules - ${e.message}`);
            })
    }

    async handle_rule_change(data) {
        try {
            const { org_id } = data;
            const rule = this.build_rule(data);

            if (this.organisation_rules.has(Number(org_id))) {
                await this.delete_rule(org_id, this.organisation_rules.get(Number(org_id)));
            }

            await this.create_rule(org_id, rule);
        } catch (e) {
            logger.error(`[StreamService Error] handle_rule_change - ${e.message}`);
        }
    }

    async handle_stream_data(stream_data) {
        try {
            const tweet_str = Buffer.from(stream_data).toString();
            if (!tweet_str.trim()) return;

            const tweet = JSON.parse(tweet_str);
            const { data, includes, matching_rules, } = tweet;

            const event_data = {
                event: 'STREAM',
                tweet_id: data.id,
                created_at: data.created_at,
                text: data.text,
                author_id: data.author_id,
                author: includes.users[0],
            }

            matching_rules.forEach(rule => {
                const { tag } = rule;
                this.stream_client.pass_event_to_notification_service({ ...event_data, orgId: tag });
            });
            // console.log(event_data, matching_rules)
            // console.log('======');
        } catch (e) {
            logger.error(`[StreamService Error] handle_rule_change - ${e.message}`);
        }
    }

    validate_rule_group(rule_group = []) {
        let valid_rules = [];
        rule_group.forEach(rule => {
            if (rule) {
                valid_rules.push(rule.replace(/[#@]/gi, ''));
            }
        });

        return valid_rules;
    }
}

module.exports = new StreamService(StreamClient);