class Victory extends SceneBase {
    #score

    constructor(pScore) {
        super();
        this.#score = pScore
    }

    draw(pCtx) {
        pCtx.fillStyle = 'black'
        pCtx.fillRect(0, 0, 960, 640)
        pCtx.strokeStyle = 'green'
        pCtx.font = '50px sans-serif'
        pCtx.strokeText('YOU WIN', 400, 200)
        pCtx.strokeText('Score: '+ this.#score, 400, 250)
    }
}