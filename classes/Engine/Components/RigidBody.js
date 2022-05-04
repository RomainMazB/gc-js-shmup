class RigidBody extends ComponentBase {
    velocity = new Vec2(0, 0)

    fixedUpdate(pFixedDt) {
        this.gameObject.transform.x += this.velocity.x * pFixedDt
        this.gameObject.transform.y += (this.velocity.y * (this.gameObject.transform.y / (435 + 150))) * pFixedDt
    }
}