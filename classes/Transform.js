export class Transform {
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
        pCtx.strokeStyle = 'pink'
        pCtx.beginPath()
        pCtx.arc(this.x, this.y, 4, 0, 2 * Math.PI)
        pCtx.stroke()
    }
}