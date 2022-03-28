export class Transform {
    constructor(pX, pY, pOffsetX = 0, pOffsetY = 0, pRotation = 0, pScaleX = 1, pScaleY = 1) {
        this.x = pX
        this.y = pY
        this.rotation = pRotation
        this.scaleX = pScaleX
        this.scaleY = pScaleY
    }

    get drawnX () { return this.x - this.offsetX }
    get drawnY () { return this.y - this.offsetY }
}