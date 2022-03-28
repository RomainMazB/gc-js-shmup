import level from './modules/level.js'
import hero, {heroCollider, heroRigidBody} from './modules/hero.js'
import camera, {cameraCollider} from './modules/camera.js'
import controls from './modules/controls.js'
import updater from './utils/updater.js'
import './utils/input-system.js'
import physics from "./utils/physics.js";

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
        controls.update(dt)
        hero.update(dt)
        updater.update(dt)
        physics.update(dt)
        camera.setPosition(Math.round(scroll), 0)
        scroll += 50 * dt
    },

    draw (pCtx) {
        camera.translate(pCtx)
        level.draw(pCtx)
        hero.draw(pCtx)
        cameraCollider.draw(pCtx)
        heroCollider.draw(pCtx)
        camera.reset(pCtx)
    }
}