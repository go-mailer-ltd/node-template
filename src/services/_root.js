/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const appEvent = require('../events/_config');
const { build_query } = require('../utilities/query');

class RootService {
    constructor() {
        this.standard_metadata = {
            is_active: true,
            is_deleted: false,
        }

        this.dictionary = {
            0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9',

            'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'G', 'H': 'H',
            'I': 'I', 'J': 'J', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N', 'O': 'O', 'P': 'P',
            'Q': 'Q', 'R': 'R', 'S': 'S', 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X',
            'Y': 'Y', 'Z': 'Z', 'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'f': 'f',
            'g': 'g', 'h': 'h', 'i': 'i', 'j': 'j', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n',
            'o': 'o', 'p': 'p', 'q': 'q', 'r': 'r', 's': 's', 't': 't', 'u': 'u', 'v': 'v',
            'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z', '-': '-', '.': '.', '_': '_', '~': '~'
        }
    }

    convert_to_base16(num) {
        const char_representations = { 10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F' };
        let base_16_string = ``, dividend = num, remainder = 0;

        while (dividend > 0) {
            if (dividend >= 16) {
                dividend = Math.trunc(num / 16);
                remainder = num - (dividend * 16);
            } else {
                remainder = dividend;
                dividend = 0;
            }
            const b_16_val = remainder > 9 ? char_representations[remainder] : remainder;
            base_16_string = `${b_16_val}${base_16_string}`;
        }

        //
        return base_16_string;
    }

    create_dummy_request(body = {}, params = {}, query = {}) {
        return { body, params, query };
    }

    delete_record_metadata(record) {
        let record_to_mutate = { ...record };

        //
        delete record_to_mutate.timestamp;
        delete record_to_mutate.created_on;
        delete record_to_mutate.updated_on;
        delete record_to_mutate._v;

        //
        return { ...record_to_mutate };
    }

    encode_string(string) {
        if (string === undefined) return '';
        let encoded_string = ``;
        for (let i = 0; i < string.length; i++) {
            const current_character = string[i];
            if (this.dictionary[current_character] !== undefined) {
                encoded_string = `${encoded_string}${current_character}`;
                continue;
            }

            const percent_encoded_character = this.get_percent_encoding(current_character);
            encoded_string = `${encoded_string}${percent_encoded_character}`;
        }

        return encoded_string;
    }

    get_percent_encoding(character) {
        let percent_encoded_string = ``;
        const buff = Buffer.from(character);

        for (let i = 0; i < buff.length; i++) {
            const percent_character = `%${this.convert_to_base16(buff[i])}`;
            percent_encoded_string = `${percent_encoded_string}${percent_character}`;
        }

        return percent_encoded_string;
    }

    async handle_database_read(Controller, query_options, extra_options = {}) {
        const {
            count,
            fields_to_return,
            limit,
            seek_conditions,
            skip,
            sort_condition,
        } = build_query(query_options);

        if (count) {
            return {
                count: (await Controller.read_records({
                    ...seek_conditions,
                    ...extra_options,
                })).length
            }
        } else {
            return await Controller.read_records(
                { ...seek_conditions, ...extra_options },
                fields_to_return,
                sort_condition,
                skip,
                limit
            );
        }
    }

    process_single_read(result, event_name) {
        if (result && result.id) {
            if (event_name) {
                appEvent.emit(event_name, result);
            }
            return this.process_successful_response(result);
        }
        return this.process_failed_response(`Resource not found`, 404);
    }

    process_multiple_read_results(result) {
        if (result && (result.count || result.length >= 0)) return this.process_successful_response(result);
        return this.process_failed_response(`Resources not found`, 404);
    }

    process_update_result(result, event_name) {
        if (result && result.ok && result.nModified) {
            if (event_name) {
                appEvent.emit(event_name, result);
            }
            return this.process_successful_response(result);
        }
        if (result && result.ok && !result.nModified) return this.process_successful_response(result, 210);
        return this.process_failed_response(`Update failed`, 200);
    }

    process_delete_result(result, event_name) {
        if (result && result.nModified) {
            if (event_name) {
                appEvent.emit(event_name, result);
            }
            return this.process_successful_response(result);
        }
        return this.process_failed_response(`Deletion failed.`, 200);
    }

    /** */

    process_failed_response(message, code = 400) {
        return {
            error: message,
            payload: null,
            send_raw: false,
            status_code: code,
            success: false,
        }
    }

    process_successful_response(payload, code = 200, send_raw = false) {
        return {
            payload,
            error: null,
            send_raw,
            status_code: code,
            success: true,
        }
    }

    /** */
    validate_email(raw_email) {
        const email = raw_email.trim();
        if (email.length < 6) {
            return {
                is_valid: false,
                message: `Email address is too short.`,
            }
        }

        const email_pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const is_valid = email_pattern.test(email);

        return {
            is_valid,
            message: is_valid ? email : `Invalid email address.`
        }
    }
}

module.exports = RootService;