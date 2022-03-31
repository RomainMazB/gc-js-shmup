import Collider from "./Collider.js";
import CircleCollider from "./CircleCollider.js";
import {BOTTOM, LEFT, RIGHT, TOP} from "../utils/constants.js";
import {Vector2} from "./Vector2.js";

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
        return (otherCollider instanceof CircleCollider) ? otherCollider.collidesWith(this) : aabb(this, otherCollider)
    }

    resolveCollisionWith(otherCollider) {
        let isCircle = otherCollider instanceof CircleCollider

        switch (this.collisionSideWith(otherCollider)) {
            case TOP:
                otherCollider._transform.y = this.y + otherCollider._offsetY - 1
                break;
            case BOTTOM:
                otherCollider._transform.y = this.bottomYBorder - otherCollider._offsetY + 1
                break;
            case LEFT:
                otherCollider._transform.x = this.x + otherCollider._offsetX - 1
                break;
            case RIGHT:
                otherCollider._transform.x = this.rightXBorder - otherCollider._offsetX + 1
                break;
            case TOP + LEFT:
                if (isCircle) {
                    let distanceBetweenAngleAndCircleCenter = new Vector2(this.x - otherCollider.center.x, this.y - otherCollider.center.y)
                    let hypot = Math.hypot(distanceBetweenAngleAndCircleCenter.x, distanceBetweenAngleAndCircleCenter.y)
                    let newDistance = distanceBetweenAngleAndCircleCenter.multiply((otherCollider.size + 1) / hypot)
                    otherCollider._transform.x = this.x - newDistance.x
                    otherCollider._transform.y = this.y - newDistance.y
                } else {
                    otherCollider._transform.x = this.x + otherCollider._offsetX - 1
                    otherCollider._transform.y = this.y + otherCollider._offsetY - 1
                }
                break;
            case TOP + RIGHT:
                if (isCircle) {
                    let distanceBetweenAngleAndCircleCenter = new Vector2(this.rightXBorder - otherCollider.center.x, this.y - otherCollider.center.y)
                    let hypot = Math.hypot(distanceBetweenAngleAndCircleCenter.x, distanceBetweenAngleAndCircleCenter.y)
                    let newDistance = distanceBetweenAngleAndCircleCenter.multiply((otherCollider.size + 1) / hypot)
                    otherCollider._transform.x = this.rightXBorder - newDistance.x
                    otherCollider._transform.y = this.y - newDistance.y
                } else {
                    otherCollider._transform.x = this.rightXBorder - otherCollider._offsetX + 1
                    otherCollider._transform.y = this.y + otherCollider._offsetY - 1
                }
                break;
            case BOTTOM + LEFT:
                if (isCircle) {
                    let distanceBetweenAngleAndCircleCenter = new Vector2(this.x - otherCollider.center.x, this.bottomYBorder - otherCollider.center.y)
                    let hypot = Math.hypot(distanceBetweenAngleAndCircleCenter.x, distanceBetweenAngleAndCircleCenter.y)
                    let newDistance = distanceBetweenAngleAndCircleCenter.multiply((otherCollider.size + 1) / hypot)
                    otherCollider._transform.x = this.x - newDistance.x
                    otherCollider._transform.y = this.bottomYBorder - newDistance.y
                } else {
                    otherCollider._transform.x = this.x + otherCollider._offsetX - 1
                    otherCollider._transform.y = this.bottomYBorder - otherCollider._offsetY + 1
                }
                break;
            case BOTTOM + RIGHT:
                if (isCircle) {
                    let distanceBetweenAngleAndCircleCenter = new Vector2(this.rightXBorder - otherCollider.center.x, this.bottomYBorder - otherCollider.center.y)
                    let hypot = Math.hypot(distanceBetweenAngleAndCircleCenter.x, distanceBetweenAngleAndCircleCenter.y)
                    let newDistance = distanceBetweenAngleAndCircleCenter.multiply((otherCollider.size + 1) / hypot)
                    otherCollider._transform.x = this.rightXBorder - newDistance.x
                    otherCollider._transform.y = this.bottomYBorder - newDistance.y
                } else {
                    otherCollider._transform.x = this.rightXBorder - otherCollider._offsetX + 1
                    otherCollider._transform.y = this.bottomYBorder - otherCollider._offsetY + 1
                }
                break;
        }
    }

    get rightXBorder () { return this.x + this.width }
    get bottomYBorder () { return this.y + this.height }
    get center () { return point(this.x + this.width / 2, this.y + this.height / 2) }

    draw(pCtx) {
        pCtx.strokeStyle = 'yellow'
        pCtx.strokeRect(this.x, this.y, this.width, this.height)
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