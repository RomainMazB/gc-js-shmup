import './utils/input-system.js'
import './utils/math-utils.js'
import level from './modules/level.js'
import hero, {heroRigidBody} from './modules/hero.js'
import camera from './modules/camera.js'
import controls from './modules/controls.js'
import updater from './utils/updater.js'
import physics from "./utils/physics.js";
window.debug = true

let scroll = 0
export default {
    async load (canvas) {
        camera.setCameraSize(canvas.width, canvas.height)
        await level.load(1)
        await hero.load()
        controls.load(heroRigidBody)
    },

    update (dt) {
        level.update(dt)
        hero.update(dt)
        physics.update(dt)
        controls.update(dt)
        updater.update(dt)
        camera.setPosition(Math.round(scroll), 0)
        // scroll += 50 * dt
    },

    draw (pCtx) {
        camera.translate(pCtx)
        level.draw(pCtx)
        hero.draw(pCtx)
        physics.draw(pCtx)
        camera.reset(pCtx)
    }
}