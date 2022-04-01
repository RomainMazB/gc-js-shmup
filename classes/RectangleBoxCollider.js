import RectangleCollider from "./RectangleCollider.js";

export default class RectangleBoxCollider extends RectangleCollider {
    collidesWith(otherCollider) {
        return otherCollider.x < this.x ||
               otherCollider.rightXBorder >= this.rightXBorder ||
               otherCollider.y < this.y ||
               otherCollider.bottomYBorder >= this.bottomYBorder
    }

    getCollisionResolutionFor(otherCollider) {
        otherCollider._transform.x = clamp(otherCollider._transform.x, this.x - otherCollider._offsetX, this.rightXBorder + otherCollider._offsetX)
        otherCollider._transform.y = clamp(otherCollider._transform.y, this.y - otherCollider._offsetY, this.bottomYBorder + otherCollider._offsetY)
    }
}