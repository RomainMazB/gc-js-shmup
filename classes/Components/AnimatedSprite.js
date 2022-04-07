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
    #isRepeating

    constructor(pSrc, pX, pY, pFrames, pWidth, pHeight, speed, pMargin, pIsHorizontal = true, pIsRepeating = true, pOffsetX = 0, pOffsetY = 0) {
        super(pSrc, pX, pY, pWidth, pHeight, pOffsetX, pOffsetY)

        this.#frames = pFrames ?? 1
        this.#isHorizontal = pIsHorizontal
        this.#margin = pMargin ?? 0
        this.#speed = speed ?? 1
        this.#frameTimer = this.#speed
        this.#currentFrameX = pX
        this.#currentFrameY = pY
        this.#isRepeating = pIsRepeating
    }

    tick(pDt) {
        if (! this.#playing) return

        if (this.#frameTimer <= 0) {
            if (this.#isRepeating)
                this.#currentFrame = this.#currentFrame === this.#frames ? 1 : this.#currentFrame + 1
            else if (this.#currentFrame !== this.#frames)
                this.#currentFrame = this.#currentFrame + 1

            this.#refreshFrameCoordinates()

            this.#frameTimer = this.#speed
        }

        this.#frameTimer -= pDt
    }

    restart() {
        this.#currentFrame = 0
        this.#frameTimer = this.#speed
        this.#refreshFrameCoordinates()
    }
    pause () { this.#playing = false }
    play () { this.#playing = true }

    draw(pCtx) {
        pCtx.save()
        pCtx.translate(this.drawnX, this.drawnY);
        pCtx.scale(this.scaleX * this.worldScale, this.gameObject.transform.scaleY * this.worldScale);
        pCtx.drawImage(this._img, this.#currentFrameX, this.#currentFrameY, this._width, this._height, 0, 0, this._width, this._height)

        if (debug) {
            pCtx.strokeStyle = 'red'
            pCtx.strokeRect(0, 0, this._width, this._height)
        }

        pCtx.restore()
    }

    #refreshFrameCoordinates() {
        let frameIndex = this.#currentFrame
        if (this.#isHorizontal)
            this.#currentFrameX = this._x + frameIndex * (this._width + this.#margin)
        else
            this.#currentFrameY = this._y + frameIndex * (this._height + this.#margin)
    }
}