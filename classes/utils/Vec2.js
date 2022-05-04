class Vec2 {
    /**
     * Static direction and zero helpers
     */
    static zero = _ => new Vec2(0, 0)
    static left = _ => new Vec2(-1, 0)
    static right = _ => new Vec2(1, 0)
    static top = _ => new Vec2(0, -1)
    static bottom = _ => new Vec2(0, 1)

    x
    y

    constructor(pX, pY) {
        this.x = pX
        this.y = pY
    }

    /**
     * Return the length of the vector
     * @returns {number}
     */
    length () {
        return Math.hypot(this.x, this.y)
    }

    /**
     * Clamp the length of the vector to a maximum size
     * @param maxLength
     * @returns {Vec2}
     */
    clampLength(maxLength) {
        let length = this.length()
        if (length <= maxLength) return this

        let ratio = length / maxLength
        return new Vec2(this.x / ratio, this.y / ratio)
    }

    /**
     * Add a vector to this one
     * @param otherVec2
     * @returns {Vec2}
     */
    add(otherVec2) {
        return new Vec2(this.x + otherVec2.x, this.y + otherVec2.y)
    }

    /**
     * Sub a vector to this one
     * @param otherVec2
     * @returns {Vec2}
     */
    sub(otherVec2) {
        return new Vec2(this.x - otherVec2.x, this.y - otherVec2.y)
    }

    /**
     * Scale this vector to a precise length
     * @param scale
     * @returns {Vec2}
     */
    scale(scale) {
        return new Vec2(this.x * scale, this.y * scale)
    }

    /**
     * Compares a vector to this one
     * @param otherVec2
     * @returns {boolean}
     */
    equals(otherVec2) {
        return this.x === otherVec2.x && this.y === otherVec2.y
    }
}