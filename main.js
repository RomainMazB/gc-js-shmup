import './utils/input-system.js'
import './utils/math-utils.js'
import level from './modules/level.js'
import hero from './modules/hero.js'
import camera from './modules/camera.js'
import controls from './modules/controls.js'
import projectiles from "./modules/projectiles.js"
import updater from './utils/updater.js'
import physics from "./utils/physics.js"
import ui from "./modules/ui.js"
import waveManager from "./classes/WaveManager.js"
import WaveManager from "./classes/WaveManager.js";
window.debug = true

export default {
    async load (pCanvas, pCtx) {
        camera.setCameraSize(pCanvas.width, pCanvas.height)
        await level.load(1)
        await hero.load()
        ui.load(pCtx)
        controls.load()
        projectiles.load()
        WaveManager.run()
    },

    update (pDt) {
        level.update(pDt)
        hero.update(pDt)
        controls.update(pDt)
        updater.update(pDt)
        waveManager.update(pDt)
        ui.update(pDt)
    },

    draw (pCtx) {
        camera.translate(pCtx)
        level.draw(pCtx)
        hero.draw(pCtx)
        waveManager.draw(pCtx)
        physics.draw(pCtx)
        projectiles.draw(pCtx)
        camera.reset(pCtx)
        ui.draw(pCtx)
    },

    fixedUpdate(pFixedDt) {
        updater.fixedUpdate(pFixedDt)
        physics.fixedUpdate(pFixedDt)
        waveManager.fixedUpdate(pFixedDt)
    }
}