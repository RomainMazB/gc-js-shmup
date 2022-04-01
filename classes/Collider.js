import {DEFAULT} from "../utils/constants.js";
import physics from "../utils/physics.js";

export default class Collider {
    _transform
    isTrigger = false
    isStatic = false
    layer = DEFAULT

    constructor(pTransform, pOffsetX = 0, pOffsetY = 0) {
        this._transform = pTransform
        this._offsetX = pOffsetX
        this._offsetY = pOffsetY
        physics.add(this)
    }

    collidesWith(otherCollider) {
        return this.x === otherCollider.x && this.y === otherCollider.y
    }

    getCollisionResolutionFor(otherCollider) {}

    get x () { return this._transform.x + this._offsetX }
    get y () { return this._transform.y + this._offsetY }
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