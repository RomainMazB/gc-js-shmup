import Collider from "./Collider.js"
import CircleCollider from "./CircleCollider.js"
import {BOTTOM, LEFT, RIGHT, TOP} from "../../utils/constants.js"
import {Vec2} from "../utils/Vec2.js"
import CollisionResolution from "../CollisionResolution.js"

export default class RectangleCollider extends Collider {
    width
    height

    constructor(pWidth, pHeight, offsetX = 0, offsetY = 0) {
        super(offsetX, offsetY);
        this.width = pWidth
        this.height = pHeight
    }

    /**
     * @param otherCollider
     * @returns {boolean|*}
     */
    collidesWith(otherCollider) {
        return (otherCollider instanceof CircleCollider) ? otherCollider.collidesWith(this) : aabb(this, otherCollider)
    }

    getCollisionResolutionFor(otherCollider) {
        let collisionSide = this.collisionSideWith(otherCollider)

        switch (collisionSide) {
            case TOP:
                return new CollisionResolution(new Vec2(0, - (otherCollider.bottomYBorder - this.y) - 1), 1)
            case BOTTOM:
                return new CollisionResolution(new Vec2(0, (this.bottomYBorder - otherCollider.y) + 1), 1)
            case LEFT:
                return new CollisionResolution(new Vec2(- (otherCollider.rightXBorder - this.x) - 1, 0), 1)
            case RIGHT:
                return new CollisionResolution(new Vec2((this.rightXBorder - otherCollider.x) + 1, 0), 1)
            case TOP + LEFT:
            case TOP + RIGHT:
            case BOTTOM + LEFT:
            case BOTTOM + RIGHT:
                let distanceBetweenAngleAndCircleCenter
                if (collisionSide === TOP + LEFT)
                    distanceBetweenAngleAndCircleCenter = new Vec2(otherCollider.center.x - this.x, otherCollider.center.y - this.y)
                else if (collisionSide === TOP + RIGHT)
                    distanceBetweenAngleAndCircleCenter = new Vec2(otherCollider.center.x - this.rightXBorder, otherCollider.center.y - this.y)
                else if (collisionSide === BOTTOM + LEFT)
                    distanceBetweenAngleAndCircleCenter = new Vec2(otherCollider.center.x - this.x, otherCollider.center.y - this.bottomYBorder)
                else
                    distanceBetweenAngleAndCircleCenter = new Vec2(otherCollider.center.x - this.rightXBorder, otherCollider.center.y - this.bottomYBorder)

                let vecLength = distanceBetweenAngleAndCircleCenter.length()
                let newDistance = distanceBetweenAngleAndCircleCenter.scale((otherCollider.size + 1) / vecLength)

                return new CollisionResolution(newDistance.sub(distanceBetweenAngleAndCircleCenter), 0)
        }
    }

    get rightXBorder () { return this.x + this.width }
    get bottomYBorder () { return this.y + this.height }
    get center () { return point(this.x + this.width / 2, this.y + this.height / 2) }

    draw(pCtx) {
        if (!debug) return

        pCtx.strokeStyle = this.isActive ? 'red' : 'pink'
        pCtx.setLineDash([6])
        pCtx.strokeRect(this.x, this.y, this.width, this.height)
        pCtx.setLineDash([])
    }

    collisionSideWith(otherCollider) {
        if (otherCollider instanceof CircleCollider) {
            let otherCenter = otherCollider.center
            if (otherCenter.y <= this.y && otherCenter.x.isBetween(this.x, this.rightXBorder, true)) return TOP
            else if (otherCenter.y >= this.bottomYBorder && otherCenter.x.isBetween(this.x, this.rightXBorder, true)) return BOTTOM
            else if (otherCenter.x <= this.x && otherCenter.y.isBetween(this.y, this.bottomYBorder, true)) return LEFT
            else if (otherCenter.x >= this.rightXBorder && otherCenter.y.isBetween(this.y, this.bottomYBorder, true)) return RIGHT
            else if (otherCenter.x < this.x && otherCenter.y < this.y) return TOP + LEFT
            else if (otherCenter.x > this.x && otherCenter.y < this.y) return TOP + RIGHT
            else if (otherCenter.x < this.x && otherCenter.y > this.y) return BOTTOM + LEFT
            else if (otherCenter.x > this.x && otherCenter.y > this.y) return BOTTOM + RIGHT
        } else {
            // TODO: implement for rectangle
        }
    }
}