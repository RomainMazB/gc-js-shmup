import game from './main.js'

let gameCanvas = document.getElementById("game-layer")
let gameCtx = gameCanvas.getContext("2d")

let dtTick = 0
const fixedTimeStep = 0.02
let fixedDtTick = 0

function run(time) {
    let dt = (time - dtTick) / 1000

    dtTick = time

    let fixedTime = time - time % fixedTimeStep
    let nbToRun = Math.floor((fixedTime - fixedDtTick) / 1000 / fixedTimeStep)

    game.update(dt)
    if (nbToRun > 0) {
        for (let i = 0; i < nbToRun; i++)
            game.fixedUpdate(fixedTimeStep)

        fixedDtTick = fixedTime
    }

    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
    game.draw(gameCtx)
    requestAnimationFrame(run)
}

(async function () {
    gameCtx.imageSmoothingEnabled = false
    gameCtx.msImageSmoothingEnabled = false
    gameCtx.webkitImageSmoothingEnabled = false
    await game.load(gameCanvas, gameCtx)
    requestAnimationFrame(run)
})()
