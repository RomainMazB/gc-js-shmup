export default class HeartLifeBar {
    max
    current
    emptyHeartPattern
    halfHeartPattern
    filledHeartPattern
    #transform

    constructor(pCtx, pTransform, pMax, pFilled = true) {
        let emptyHeartImg = new Image()
        let HalfFilledHeartImg = new Image()
        let filledHeartImg = new Image()
        emptyHeartImg.src = '../assets/images/empty-heart.png'
        HalfFilledHeartImg.src = '../assets/images/half-filled-heart.png'
        filledHeartImg.src = '../assets/images/filled-heart.png'
        emptyHeartImg.onload=_ => this.emptyHeartPattern = pCtx.createPattern(emptyHeartImg, 'repeat-x')
        HalfFilledHeartImg.onload=_ => this.halfHeartPattern = pCtx.createPattern(HalfFilledHeartImg, 'repeat-x')
        filledHeartImg.onload=_ => this.filledHeartPattern = pCtx.createPattern(filledHeartImg, 'repeat-x')

        this.max = pMax
        this.current = pFilled ? pMax : 0
        this.#transform = pTransform
    }

    draw(pCtx) {
        let nbHalfHearts = this.current % 2
        let nbFilledHearts = (this.current - nbHalfHearts) / 2
        let nbEmptyHearts = (this.max / 2) - nbFilledHearts - nbHalfHearts

        pCtx.save()
        pCtx.translate(this.#transform.x, this.#transform.y)
        if (nbFilledHearts > 0) {
            let width = nbFilledHearts * 32
            pCtx.fillStyle = this.filledHeartPattern
            pCtx.fillRect(0, 0, width, 32)

            pCtx.translate(width, 0)
        }

        if (nbHalfHearts === 1) {
            pCtx.fillStyle = this.halfHeartPattern
            pCtx.fillRect(0, 0, 32, 32)

            pCtx.translate(32, 0)
        }

        if (nbEmptyHearts > 0) {
            pCtx.fillStyle = this.emptyHeartPattern
            pCtx.fillRect(0, 0, nbEmptyHearts * 32, 32)
        }
        pCtx.restore()
    }
}