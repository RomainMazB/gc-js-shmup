import RectangleCollider from "./RectangleCollider.js";

export default class RectangleBoxCollider extends RectangleCollider {
    collidesWith(otherCollider) {
        if (! this.isOnTheSameLayer(otherCollider)) return false

        return otherCollider.x < this.x ||
               otherCollider.rightXBorder >= this.rightXBorder ||
               otherCollider.y < this.y ||
               otherCollider.bottomYBorder >= this.bottomYBorder
    }

    resolveCollisionWith(otherCollider) {
        otherCollider._transform.x = clamp(otherCollider._transform.x, this.x - otherCollider._offsetX, this.rightXBorder + otherCollider._offsetX)
        otherCollider._transform.y = clamp(otherCollider._transform.y, this.y - otherCollider._offsetY, this.bottomYBorder + otherCollider._offsetY)
    }
}