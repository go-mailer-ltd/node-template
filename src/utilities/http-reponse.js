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

    process_response( request, response, next ) {
        if(!request.payload) return next();
        
        const { status_code } = request.payload;
        return response.status( status_code ).json(request.payload)
    },
}