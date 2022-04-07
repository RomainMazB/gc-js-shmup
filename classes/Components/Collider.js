import {DEFAULT} from "../../utils/constants.js"
import physics from "../../utils/physics.js"
import Component from "../Component.js"

export default class Collider extends Component {
    isTrigger = false
    isStatic = false
    layer = DEFAULT
    isActive = true
    triggerCollisionWith

    constructor(pOffsetX = 0, pOffsetY = 0) {
        super()
        this._offsetX = pOffsetX
        this._offsetY = pOffsetY
    }

    linkGameObject(pGameObject) {
        super.linkGameObject(pGameObject);
        physics.add(this, this._gameObject.id)
    }

    collidesWith(otherCollider) {
        return this.x === otherCollider.x && this.y === otherCollider.y
    }

    getCollisionResolutionFor(otherCollider) {}

    get x () { return this.gameObject.transform.x + this._offsetX }
    get y () { return this.gameObject.transform.y + this._offsetY }
    get rightXBorder () { return this.x }
    get bottomYBorder () { return this.y }

    draw(pCtx) {
        pCtx.fillRect(this.x, this.y, 1, 1)
    }

    setLayer(pLayer) {
        this.layer = pLayer
        physics.refreshCollisionCache(this)
    }
}