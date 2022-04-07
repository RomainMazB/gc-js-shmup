import { Vec2 } from "../utils/Vec2.js"
import updater from "../../utils/updater.js"
import Component from "../Component.js"

export default class RigidBody extends Component {
    velocity = new Vec2(0, 0)
    isActive = true

    fixedUpdate(pFixedDt) {
        this.gameObject.transform.x += this.velocity.x * pFixedDt
        this.gameObject.transform.y += this.velocity.y * pFixedDt
    }

    destroy() {
        updater.remove(this.gameObject.id)
    }
}