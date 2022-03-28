export default class Sprite {
    // get x () => this._x

    constructor(pSrc, pX, pY, pWidth, pHeight) {
        this._img = new Image()
        this._img.src = pSrc
        this._x = pX ?? 0
        this._y = pY ?? 0
        this._width = pWidth ?? this._img.naturalWidth
        this._height = pHeight ?? this._img.naturalHeight
    }

    draw(pCtx, pX, pY, pWidth, pHeight) {
        pCtx.drawImage(this._img, this._x, this._y, this._width, this._height, pX, pY, pWidth ?? this._width, pHeight ?? this._height)
    }
}
