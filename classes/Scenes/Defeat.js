class Defeat extends SceneBase {
    draw(pCtx) {
        pCtx.fillStyle = 'black'
        pCtx.fillRect(0, 0, 960, 640)
        pCtx.strokeStyle = 'white'
        pCtx.font = '50px sans-serif'
        pCtx.strokeText('YOU LOSE', 400, 200)
    }
}