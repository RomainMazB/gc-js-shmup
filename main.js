import level from './level.js'
import hero, { heroRigidBody } from './hero.js'
import camera from './camera.js'
import controls from './controls.js'
import updater from './updater.js'
import './input-system.js'

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
    },

    draw (pCtx) {
        level.draw(pCtx)
        hero.draw(pCtx)
    }
}