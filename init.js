import game from './main.js'

let gameCanvas = document.getElementById("game-layer")
let gameCtx = gameCanvas.getContext("2d")

let lastUpdate = 0

function run(time) {
    requestAnimationFrame(run)
    let dt = (time - lastUpdate) / 1000

    lastUpdate = time
    game.update(dt)
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
    game.draw(gameCtx)
}

(async function () {
    gameCtx.imageSmoothingEnabled = false
    gameCtx.msImageSmoothingEnabled = false
    gameCtx.webkitImageSmoothingEnabled = false
    await game.load(gameCanvas, gameCtx)
    requestAnimationFrame(run)
})()
