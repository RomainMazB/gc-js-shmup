export default class {
    #subscribers = {}

    publish(event, data) {
        if (!this.#subscribers[event]) return

        this.#subscribers[event].forEach(callback => callback(data))
    }

    subscribe(event, callback) {
        if (!this.#subscribers[event]) {
            this.#subscribers[event] = new Set()
        }

        this.#subscribers[event].add(callback)

        return {
            unsubscribe: () => {
                delete this.#subscribers[event].delete(callback)
            }
        }
    }
}