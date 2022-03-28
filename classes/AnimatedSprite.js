import Sprite from './Sprite.js'

export default class AnimatedSprite extends Sprite {
    #frames
    #margin
    #speed
    #isHorizontal
    #currentFrame = 1
    #currentFrameX = 0
    #currentFrameY = 0
    #frameTimer
    #playing = true

    constructor(pSrc, pX, pY, pFrames, pWidth, pHeight, speed, pMargin, pIsHorizontal = true) {
        super(pSrc, pX, pY, pWidth, pHeight)

        this.#frames = pFrames ?? 1
        this.#isHorizontal = pIsHorizontal
        this.#margin = pMargin ?? 0
        this.#speed = speed ?? 1
        this.#frameTimer = this.#speed
        this.#currentFrameX = pX
        this.#currentFrameY = pY
    }

    tick(dt) {
        if (! this.#playing) return

        if (this.#frameTimer <= 0) {
            this.#currentFrame = this.#currentFrame === this.#frames ? 1 : this.#currentFrame + 1
            let frameIndex = this.#currentFrame - 1

            if (this.#isHorizontal)
                this.#currentFrameX = this._x + frameIndex * (this._width + this.#margin)
            else
                this.#currentFrameY = this._y + frameIndex * (this._height + this.#margin)

            this.#frameTimer = this.#speed
        }

        this.#frameTimer -= dt
    }

    pause () { this.#playing = false }
    play () { this.#playing = true }

    draw(pCtx, pX, pY, pWidth, pHeight) {
        pCtx.drawImage(this._img, this.#currentFrameX, this.#currentFrameY, this._width, this._height, pX, pY, pWidth ?? this._width, pHeight ?? this._height)
    }
}