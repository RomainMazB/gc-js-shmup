import RigidBody from '../classes/RigidBody.js'
import {Transform} from "../classes/Transform.js";
import {Vec2} from "../classes/Vec2.js";
import CircleCollider from "../classes/CircleCollider.js";
import Animator from "../classes/Animator.js";
import {DEAD, DEFAULT, HERO, IDLE, JUMP, LEFT, RIGHT, RUN} from "../utils/constants.js";

export const heroTransform = new Transform(32, 200)
export const heroRigidBody = new RigidBody(heroTransform)
export const heroCollider = new CircleCollider(heroTransform, 15)
heroCollider.setLayer(HERO)
export const hero = {
    isJumping: false,
    lastDirection: RIGHT,
    isFlipped: false,
    life: 100
}
let heroAnimator

export default {
    load () {
        return new Promise(async resolve => {
            heroAnimator = await new Animator(heroTransform, './assets/images/tilesheet.png', 64, 52, -32, -26)
            heroAnimator.addStaticState(IDLE, DEFAULT, 1152, 460)
            heroAnimator.addAnimatedState(RUN, _ => !heroRigidBody.velocity.equals(Vec2.zero()), 1216, 460, 2, .3)
            heroAnimator.addAnimatedState(JUMP, _ => hero.isJumping, 1344, 460, 2, .3)
            heroAnimator.addStaticState(DEAD, _ => hero.life <= 0, 1472, 460)

            resolve()
        })
    },

    flipHero() {
        heroTransform.isFlipped = !heroTransform.isFlipped
        hero.lastDirection = heroTransform.isFlipped ? LEFT : RIGHT
    },

    update(pDt) {
        if (hero.lastDirection === RIGHT && heroRigidBody.velocity.x < 0 ||
            hero.lastDirection === LEFT && heroRigidBody.velocity.x > 0
        ) this.flipHero()
    },

    draw (pCtx) {
        heroAnimator.draw(pCtx)
        heroTransform.draw(pCtx)
    }
}