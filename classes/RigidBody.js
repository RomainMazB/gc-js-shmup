import { Vec2 } from "./Vec2.js";
import updater from "../utils/updater.js";

export default class RigidBody {
    #transform
    velocity = new Vec2(0, 0)

    constructor(pTransform) {
        this.#transform = pTransform
        updater.add(this)
    }

    update(pDt) {
        this.#transform.x += this.velocity.x * pDt
        this.#transform.y += this.velocity.y * pDt
    }
}