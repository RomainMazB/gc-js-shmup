import { Vector2 } from "./Vector2.js";
import updater from "../updater.js";

export default class RigidBody {
    #transform
    velocity = new Vector2(0, 0)

    constructor(pTransform) {
        this.#transform = pTransform
        updater.add(this)
    }

    update(pDt) {
        this.#transform.x += this.velocity.x * pDt
        this.#transform.y += this.velocity.y * pDt
    }
}