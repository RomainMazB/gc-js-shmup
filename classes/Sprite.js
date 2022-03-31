export default class Sprite {
    constructor(pTransform, pSrc, pX, pY, pWidth, pHeight, pOffsetX = 0, pOffsetY = 0) {
        this._transform = pTransform
        this._img = new Image()
        this._img.src = pSrc
        this._x = pX ?? 0
        this._y = pY ?? 0
        this._offsetX = pOffsetX
        this._offsetY = pOffsetY
        this._width = pWidth ?? this._img.naturalWidth
        this._height = pHeight ?? this._img.naturalHeight
    }

    get drawnX () { return this._transform.x + this._offsetX + (this._transform.isFlipped ? this._width : 0) }
    get drawnY () { return this._transform.y + this._offsetY }
    get drawnWidth () { return this._width * this._transform.scaleX }
    get drawnHeight () { return this._height * this._transform.scaleY }
    get scaleX () { return this._transform.isFlipped ? -1 : 1 }

    draw(pCtx) {
        pCtx.save()
        pCtx.translate(this.drawnX, this.drawnY);
        pCtx.scale(this.scaleX, 1);
        pCtx.drawImage(this._img, this._x, this._y, this._width, this._height, 0, 0, this.drawnWidth, this.drawnHeight)

        // if (debug) {
        //     pCtx.strokeStyle = 'red'
        //     pCtx.strokeRect(0, 0, this.drawnWidth, this.drawnHeight)
        // }

        pCtx.restore()
    }
}
