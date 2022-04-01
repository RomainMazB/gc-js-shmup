export default class CollisionResolution {
    #vec
    #priority

    constructor (pVec, pPriority) {
        this.#vec = pVec
        this.#priority = pPriority
    }

    get priority() { return this.#priority }
    get vec() { return this.#vec }
    get x() { return this.#vec.x }
    get y() { return this.#vec.y }
}