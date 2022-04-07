import Transform from "../classes/Components/Transform.js"
import Animator from "../classes/Components/Animator.js"
import {DEAD, DEFAULT, IDLE, JUMP, RIGHT, TURNING_LEFT, TURNING_RIGHT} from "../utils/constants.js"
import Hero from "../classes/Hero.js"
import RigidBody from "../classes/Components/RigidBody.js"

export const HeroGameObject = new Hero(new Transform(480, 524))
export const hero = {
    isJumping: false,
    lastDirection: RIGHT,
    isFlipped: false
}
const heroRigidBody = HeroGameObject.getComponent(RigidBody)

export default {
    load () {
        return new Promise(async resolve => {
            let heroAnimator = await new Animator('./assets/images/mario.png', 64, 64, -32, -32)
            heroAnimator.addStaticState(IDLE, DEFAULT, 0, 64)
            heroAnimator.addAnimatedState(TURNING_RIGHT, _ => heroRigidBody.velocity.x > 0, 64, 64, 2, .3, 0, true, false)
            heroAnimator.addAnimatedState(TURNING_LEFT, _ => heroRigidBody.velocity.x < 0, 64, 128, 2, .3, 0, true, false)
            heroAnimator.addAnimatedState(JUMP, _ => hero.isJumping, 1344, 460, 2, .3)
            heroAnimator.addStaticState(DEAD, _ => hero.life <= 0, 1472, 460)

            HeroGameObject.addComponent(heroAnimator)
            resolve()
        })
    },

    update(pDt) {
    },

    draw (pCtx) {
        HeroGameObject.draw(pCtx)
    }
}