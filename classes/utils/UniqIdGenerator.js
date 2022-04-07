export default class idGenerator {
    #id = 0

    get newId() { return this.#id++ }
}