import Collider from "./Collider.js";

export default class RectangleCollider extends Collider {
    width
    height

    constructor(pTransform, pWidth, pHeight, offsetX = 0, offsetY = 0) {
        super(pTransform, offsetX, offsetY);
        this.width = pWidth
        this.height = pHeight
    }

    /**
     * @in
     * @param otherCollider
     * @returns {boolean|*}
     */
    collidesWith(otherCollider) {
        return this.isOnTheSameLayer(otherCollider) && (
                   otherCollider.pointIsInside(this.x, this.y) ||
                   otherCollider.pointIsInside(this.rightXBorder, this.y) ||
                   otherCollider.pointIsInside(this.x, this.bottomYBorder) ||
                   otherCollider.pointIsInside(this.rightXBorder, this.bottomYBorder)
        )
    }

    resolveCollisionWith(otherCollider) {
        console.log("ok")
    }

    /**
     * Return whether a point is inside the rectangle or not
     * @param x
     * @param y
     * @returns {boolean}
     */
    pointIsInside(x, y) {
        return x >= this._transform.x &&
               x <= this._transform.x + this.width &&
               y >= this._transform.y &&
               y <= this._transform.y + this.height
    }

    get rightXBorder () { return this.x + this.width }
    get bottomYBorder () { return this.y + this.height }

    draw(pCtx) {
        pCtx.strokeStyle = 'yellow'
        pCtx.strokeRect(this.x, this.y, this.width, this.height)
    }
}