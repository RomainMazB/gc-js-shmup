export class Vec2 {
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

    length () {
        return Math.hypot(this.x, this.y)
    }

    clampLength(maxLength) {
        let length = this.length()
        if (length <= maxLength) return this

        let ratio = length / maxLength
        return new Vec2(this.x / ratio, this.y / ratio)
    }

    add(otherVec2) {
        return new Vec2(this.x + otherVec2.x, this.y + otherVec2.y)
    }

    sub(otherVec2) {
        return new Vec2(this.x - otherVec2.x, this.y - otherVec2.y)
    }

    scale(scale) {
        return new Vec2(this.x * scale, this.y * scale)
    }

    equals(otherVec2) {
        return this.x === otherVec2.x && this.y === otherVec2.y
    }
}