class UniqIdGenerator {
    #id = 0

    get newId() { return this.#id++ }
}