/** 
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

module.exports = {
    process_failed_response(message, code = 400 ) {
        return {
            error: message,
            payload: null,
            status_code: code,
            success: false,
        }
    },

    process_successful_response(payload, code = 200) {
        return {
            payload,
            error: null,
            status_code: code,
            success: true,
        }
    },
}