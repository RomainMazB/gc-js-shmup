class AnimatedSprite extends Sprite {
    #frames
    #margin
    #speed
    #isHorizontal
    #currentFrame = 0
    #currentFrameX = 0
    #currentFrameY = 0
    #frameTimer = 0
    #playing = true
    #isRepeating

    constructor(pSrc, pX, pY, pFrames, pWidth, pHeight, speed, pMargin, pIsHorizontal = true, pIsRepeating = true, pOffsetX = 0, pOffsetY = 0, pRotation = 0) {
        super(pSrc, pX, pY, pWidth, pHeight, pOffsetX, pOffsetY, pRotation)

        this.#frames = pFrames ?? 1
        this.#isHorizontal = pIsHorizontal
        this.#margin = pMargin ?? 0
        this.#speed = speed ?? 1
        this.#currentFrameX = pX
        this.#currentFrameY = pY
        this.#isRepeating = pIsRepeating
    }

    update(pDt) {
        if (! this.#playing) return

        let cur = this.#currentFrame
        this.#currentFrame = Math.floor(this.#frameTimer / this.#speed) % this.#frames

        if (cur !== this.#currentFrame) this.#refreshFrameCoordinates()

        if (!this.#isRepeating && this.#frames === this.#currentFrame)
            this.#playing = false

        this.#frameTimer += pDt
    }

    restart() {
        this.#currentFrame = 0
        this.#frameTimer = 0
        this.#refreshFrameCoordinates()
    }
    pause () { this.#playing = false }
    play () { this.#playing = true }

    draw(pCtx) {
        pCtx.save()
        pCtx.translate(this.drawnX, this.drawnY)
        pCtx.scale(this.scaleX * this.worldScale, this.gameObject.transform.scaleY * this.worldScale)
        pCtx.rotate(this.gameObject.transform.rotation + this.rotation)
        pCtx.drawImage(this._img, this.#currentFrameX, this.#currentFrameY, this._width, this._height, 0, 0, this._width, this._height)

        if (debug) {
            pCtx.strokeStyle = 'red'
            pCtx.strokeRect(0, 0, this._width, this._height)
        }

        pCtx.restore()
    }

    #refreshFrameCoordinates() {
        this.#isHorizontal
            ? this.#currentFrameX = this._x + this.#currentFrame * (this._width + this.#margin)
            : this.#currentFrameY = this._y + this.#currentFrame * (this._height + this.#margin)
    }
}