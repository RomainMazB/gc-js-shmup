import Component from "../Component.js"

export default class Sprite extends Component {
    constructor(pSrc, pX, pY, pWidth, pHeight, pOffsetX = 0, pOffsetY = 0) {
        super()
        if (pSrc instanceof Image)
            this._img = pSrc
        else {
            this._img = new Image()
            this._img.src = pSrc
        }
        this._x = pX ?? 0
        this._y = pY ?? 0
        this._offsetX = pOffsetX
        this._offsetY = pOffsetY
        this._width = pWidth ?? this._img.naturalWidth
        this._height = pHeight ?? this._img.naturalHeight
    }

    get drawnX () {
        let midScreen = 960/2

        let distanceFromMid = midScreen - (this.gameObject.transform.x + this._offsetX + (this.gameObject.transform.isFlipped ? this._width : 0))

        return midScreen - distanceFromMid * this.worldScale
    }
    get drawnY () { return this.gameObject.transform.y + this._offsetY * this.worldScale }
    get scaleX () { return ( this.gameObject.transform.isFlipped ? -1 : 1) }
    get worldScale () { return (this.gameObject.transform.y + 100) / (544+85) }

    draw(pCtx) {
        pCtx.save()
        pCtx.translate(this.drawnX, this.drawnY)
        pCtx.scale(this.scaleX * this.worldScale, this.gameObject.transform.scaleY * this.worldScale);
        pCtx.drawImage(this._img, this._x, this._y, this._width, this._height, 0, 0, this._width, this._height)

        if (debug) {
            pCtx.strokeStyle = 'red'
            pCtx.setLineDash([6, 0])
            pCtx.strokeRect(0, 0, this._width, this._height)
            pCtx.setLineDash([])
        }
        pCtx.restore()
    }
}
