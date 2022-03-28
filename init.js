import game from './main.js'

let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

let lastUpdate = 0

function run(time) {
    requestAnimationFrame(run)
    let dt = (time - lastUpdate) / 1000

    lastUpdate = time
    game.update(dt)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.draw(ctx)
}

(async function () {
    ctx.imageSmoothingEnabled = false
    ctx.msImageSmoothingEnabled = false
    ctx.webkitImageSmoothingEnabled = false
    await game.load(canvas, ctx)
    requestAnimationFrame(run)
})()
