import CircleCollider from "./CircleCollider.js";

export default class CircleBoxCollider extends CircleCollider {
    collidesWith(otherCollider) {
        if (! this.isOnTheSameLayer(otherCollider)) return false

        let midX = otherCollider.x + otherCollider.width / 2
        let midY = otherCollider.y + otherCollider.height / 2
        return !this.pointIsInside(otherCollider.x, midY) ||
               !this.pointIsInside(otherCollider.x + otherCollider.width, midY) ||
               !this.pointIsInside(midX, otherCollider.y) ||
               !this.pointIsInside(midX, otherCollider.y + otherCollider.height)
    }
}