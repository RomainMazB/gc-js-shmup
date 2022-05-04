class ObjectPool {
    #poolArray
    resetFunction = _ => {}
    constructorFunction = _ => {}

    constructor(
        pConstructorFunction,
        pResetFunction = o => o,
        pInitialSize = 100,
    ) {
        this.resetFunction = pConstructorFunction
        this.constructorFunction = pResetFunction
        this.#poolArray = new Array(pInitialSize)
            .fill(0)
            .map(_ => this.createObject())
    }

    /**
     * Create an object and return the object including the release callback
     * @returns {ObjectPoolMember}
     */
    createObject() {
        const data = this.resetFunction(this.constructorFunction())
        let opm = new ObjectPoolMember(data)
        opm.release = _ => this.releaseObject(opm)

        return opm
    }

    /**
     * Return the first free object and increase the pool size if none is free
     * @returns {ObjectPoolMember|*}
     */
    getObject() {
        let object = this.#poolArray.find(e => e.free)

        if (object === undefined)
            this.#poolArray.push(object = this.createObject())

        object.free = false

        return object
    }

    /**
     * Release and reset an of the pool object
     * @param pElement
     */
    releaseObject(pElement) {
        pElement.free = true
        this.resetFunction(pElement.data)
    }
}