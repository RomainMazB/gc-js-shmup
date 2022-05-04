class CircleBoxCollider extends CircleCollider {
    collidesWith(otherCollider) {
        if (otherCollider instanceof CircleCollider)
            return Math.abs(
                Math.hypot(otherCollider.center.x - this.center.x, otherCollider.center.y - this.center.y)
            ) >= this.size - otherCollider.size

        let midX = otherCollider.x + otherCollider.width / 2
        let midY = otherCollider.y + otherCollider.height / 2

        return !circleContainsPoint(this, point(otherCollider.x, midY)) ||
               !circleContainsPoint(this, point(otherCollider.x + otherCollider.width, midY)) ||
               !circleContainsPoint(this, point(midX, otherCollider.y)) ||
               !circleContainsPoint(this, point(midX, otherCollider.y + otherCollider.height))
    }
}