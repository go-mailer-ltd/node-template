/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

class Observable {
    constructor() {
        this.events = new Map();
    }

    /**
     * removes all handlers for all events or a specific event. 
     * If event_name is specified only handlers for that event are removed.
     * Otherwise, all handlers and events are cleared.
     * 
     * @param {string} event_name an optional event name.
     */
    clear(event_name = '') {
        if (!event_name) {
            this.events.clear();
            return;
        }

        this.events.delete(event_name);
    }

    /**
     * Send data to the observers upon an event's occurrence.
     * @param {*} event_name The event triggered.
     * @param {*} payload  The data to be handled.
     */
    emit(event_name, payload) {
        (this.events.get(event_name)).forEach( handler => handler(payload));
    }

    /**
     * Subscribe a handler to an event
     * @param {string} event_name the name of the event to register to
     * @param {function} event_handler a function reference to be called with the event
     */
    subscribe(event_name, event_handler = f => f) {
        const handlers = this.events.get(event_name);
        if (!handlers) {
            this.events.set(event_name, [event_handler]);
            return;
        }

        this.events.set(event_name, [...handlers, event_handler]);
    }

    /**
     * Unsubscribe a handler from an event
     * @param {string} event_name name of event to unregister from
     * @param {function} event_handler function ref to be removed from event
     */
    unsubscribe(event_name, event_handler) {
        const handlers = (this.events.get(event_name))
            .filter(handler => handler != event_handler );
    }
}

module.exports = new Observable;