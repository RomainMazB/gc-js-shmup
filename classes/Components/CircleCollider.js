import Collider from "./Collider.js"

/**
 * Circle collider class
 * offsetX and offsetY are automatically set with the circle size to center it
 */
export default class CircleCollider extends Collider {
    size

    constructor(pSize, offsetX, offsetY) {
        offsetX = offsetX !== undefined ? offsetX : -pSize
        offsetY = offsetY !== undefined ? offsetX : -pSize
        super(offsetX, offsetY);
        this.size = pSize
    }

    collidesWith(otherCollider) {
        if (otherCollider instanceof CircleCollider)
            return Math.abs(
                Math.hypot(otherCollider.center.x - this.center.x, otherCollider.center.y - this.center.y)
            ) >= this.size + otherCollider.size

        // Test for AABB collision first to eliminate most of the cases
        if (!aabb(otherCollider, this)) return false

        // Test for a corner inside the circle
        if (circleContainsPoint(this, point(otherCollider.x, otherCollider.y)) ||
               circleContainsPoint(this, point(otherCollider.rightXBorder, otherCollider.y)) ||
               circleContainsPoint(this, point(otherCollider.x, otherCollider.bottomYBorder)) ||
               circleContainsPoint(this, point(otherCollider.rightXBorder, otherCollider.bottomYBorder))) return true

        let center = this.center
        // Test for the circle center inside the other collider
        if (rectContainsPoint(otherCollider, center)) return true

        // Test for line (not corner) intersection inside the circle
        let verticalProj = segmentProjection(
            point(otherCollider.x, otherCollider.y),
            point(this.x, this.y),
            point(this.x, this.bottomYBorder)
        );

        let horizontalProj = segmentProjection(
            point(otherCollider.x, otherCollider.y),
            point(this.x, this.y),
            point(this.rightXBorder, this.y)
        );

        return verticalProj || horizontalProj
    }

    getCollisionResolutionFor(otherCollider) {
        console.log(otherCollider.layer)
    }

    get width() { return this.size * 2 }
    get height() { return this.size * 2 }
    get rightXBorder () { return this.x + this.width-1 }
    get bottomYBorder () { return this.y + this.height-1 }
    get center () { return point(this.x + this.size, this.y + this.size) }

    draw(pCtx) {
        if (!debug) return

        pCtx.strokeStyle = 'yellow'
        pCtx.beginPath()
        let center = this.center
        pCtx.arc(center.x, center.y, this.size, 0, 2 * Math.PI)
        pCtx.stroke()
    }
}