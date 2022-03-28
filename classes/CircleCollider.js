import Collider from "./Collider.js";

/**
 * Circle collider class
 * offsetX and offsetY are automatically set with the circle size to center it
 */
export default class CircleCollider extends Collider {
    size

    constructor(pTransform, pSize, offsetX, offsetY) {
        offsetX = offsetX !== undefined ? offsetX : -pSize
        offsetY = offsetY !== undefined ? offsetX : -pSize
        super(pTransform, offsetX, offsetY);
        this.size = pSize
    }

    collidesWith(otherCollider) {
        if (! this.isOnTheSameLayer(otherCollider)) return false

        if (otherCollider instanceof CircleCollider)
            return this.size + otherCollider.size <= Math.abs(this.x - otherCollider.x) + Math.abs(this.y - otherCollider.y)

        return this.pointIsInside(otherCollider.x, this.y) ||
               this.pointIsInside(otherCollider.x + otherCollider.width, this.y) ||
               this.pointIsInside(this.x, otherCollider.y) ||
               this.pointIsInside(this.x, otherCollider.y + otherCollider.height)
    }

    resolveCollisionWith(otherCollider) {
        console.log("boup")
    }

    /**
     * Return whether a point is inside the circle or not
     * @param x
     * @param y
     * @returns {boolean}
     */
    pointIsInside(x, y) {
        return Math.abs(Math.hypot(x - this.x, y - this.x)) <= this.size
    }

    get width() { return this.size * 2 }
    get height() { return this.size * 2 }
    get rightXBorder () { return this.x - this._offsetX + this.size }
    get bottomYBorder () { return this.y - this._offsetY + this.size }

    draw(pCtx) {
        pCtx.strokeStyle = 'yellow'
        pCtx.beginPath()
        pCtx.arc(this.x - this._offsetX, this.y - this._offsetY, this.size, 0, 2 * Math.PI)
        pCtx.stroke()
    }
}