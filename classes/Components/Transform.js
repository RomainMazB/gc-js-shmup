export default class Transform {
    x
    y
    isFlipped
    constructor(pX, pY, pRotation = 0, pScaleX = 1, pScaleY = 1, pIsFlipped = false) {
        this.x = pX
        this.y = pY
        this.rotation = pRotation
        this.scaleX = pScaleX
        this.scaleY = pScaleY
        this.isFlipped = pIsFlipped
    }

    draw(pCtx) {
        if (!debug) return

        pCtx.lineWidth = 3
        pCtx.strokeStyle = '#00FF2E'
        pCtx.beginPath()
        pCtx.moveTo(this.x, this.y);
        pCtx.lineTo(this.x, this.y - 20);
        pCtx.stroke()
        pCtx.strokeStyle = 'red'
        pCtx.beginPath()
        pCtx.moveTo(this.x, this.y);
        pCtx.lineTo(this.x + (this.isFlipped ? -20 : 20), this.y);
        pCtx.stroke()
        pCtx.lineWidth = 1
    }
}