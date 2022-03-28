export class Vector2 {
    static zero = _ => new Vector2(0, 0)
    static left = _ => new Vector2(-1, 0)
    static right = _ => new Vector2(1, 0)
    static top = _ => new Vector2(0, -1)
    static bottom = _ => new Vector2(0, 1)

    x
    y

    constructor(pX, pY) {
        this.x = pX
        this.y = pY
    }

    length () {
        return Math.sqrt(this.x^2 + this.y^2)
    }

    clampLength(maxLength) {
        let length = this.length()
        if (length <= maxLength) return this

        let ratio = length / maxLength
        return new Vector2(this.x / ratio, this.y / ratio)
    }

    add(otherVector2) {
        return new Vector2(this.x + otherVector2.x, this.y + otherVector2.y)
    }

    sub(otherVector2) {
        return new Vector2(this.x - otherVector2.x, this.y - otherVector2.y)
    }

    multiply(multiplier) {
        return new Vector2(this.x * multiplier, this.y * multiplier)
    }

    equals(otherVector2) {
        return this.x === otherVector2.x && this.y === otherVector2.y
    }
}