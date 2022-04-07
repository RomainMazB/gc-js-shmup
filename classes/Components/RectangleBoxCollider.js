import RectangleCollider from "./RectangleCollider.js"
import CollisionResolution from "../CollisionResolution.js"
import {Vec2} from "../utils/Vec2.js"

export default class RectangleBoxCollider extends RectangleCollider {
    collidesWith(otherCollider) {
        return otherCollider.x < this.x ||
               otherCollider.rightXBorder >= this.rightXBorder ||
               otherCollider.y < this.y ||
               otherCollider.bottomYBorder >= this.bottomYBorder
    }

    getCollisionResolutionFor(otherCollider) {
        let resultingX = clamp(otherCollider.gameObject.transform.x, this.x - otherCollider._offsetX, this.rightXBorder + otherCollider._offsetX)
        let resultingY = clamp(otherCollider.gameObject.transform.y, this.y - otherCollider._offsetY, this.bottomYBorder + otherCollider._offsetY)

        return new CollisionResolution(new Vec2(resultingX - otherCollider.gameObject.transform.x, resultingY - otherCollider.gameObject.transform.y, 1))
    }
}