import {ALL, DEFAULT} from "../utils/constants.js";
import physics from "../utils/physics.js";

export default class Collider {
    _transform
    isTrigger = false
    layer = DEFAULT

    constructor(pTransform, offsetX = 0, offsetY = 0) {
        this._transform = pTransform
        this._offsetX = offsetX
        this._offsetY = offsetY
        physics.add(this)
    }

    collidesWith(otherCollider) {
        return this.isOnTheSameLayer(otherCollider) && this.x === otherCollider.x && this.y === otherCollider.y
    }

    resolveCollisionWith(otherCollider) {
        throw new Error('You have to implement the method resolveCollisionWith!')
    }

    isOnTheSameLayer(otherCollider) {
        return this.layer === ALL || otherCollider.layer === ALL || otherCollider.layer === this.layer
    }

    get x () { return this._transform.x + this._offsetX }
    get y () { return this._transform.y + this._offsetY }
    get rightXBorder () { return this.x }
    get bottomYBorder () { return this.y }

    draw(pCtx) {
        pCtx.fillRect(this.x, this.y, 1, 1)
    }
}