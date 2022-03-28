import RectangleCollider from "./RectangleCollider.js";

export default class RectangleBoxCollider extends RectangleCollider {
    collidesWith(otherCollider) {
        if (! this.isOnTheSameLayer(otherCollider)) return false

        return otherCollider.x < this.x ||
               otherCollider.x + otherCollider.width > this.x + this.width ||
               otherCollider.y < this.y ||
               otherCollider.y + otherCollider.height > this.y + this.height
    }
}