class PubSub {
    #subscribers = {}

    /**
     * Publish an event with optionally some data
     * @param event
     * @param data
     */
    publish(event, data) {
        // If there is no subscriber yet, abort
        if (!this.#subscribers[event])
            return

        // Call all subscriber callbacks
        this.#subscribers[event].forEach(callback => callback(data))
    }

    /**
     * Register the callback of a subscriber
     * @param event
     * @param callback
     * @returns {{unsubscribe: unsubscribe}}
     */
    subscribe(event, callback) {
        // Create a new set if it's the first subscriber to this event
        if (!this.#subscribers[event])
            this.#subscribers[event] = new Set

        // Add the subscriber event
        this.#subscribers[event].add(callback)

        // Return an object containing the unsubscribe method
        return {
            unsubscribe: () => delete this.#subscribers[event].delete(callback)
        }
    }
}