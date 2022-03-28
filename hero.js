import RigidBody from './classes/RigidBody.js'
import {Transform} from "./classes/Transform.js";
import {Vector2} from "./classes/Vector2.js";
import CircleCollider from "./classes/CircleCollider.js";
import Animator from "./classes/Animator.js";
import {cameraCollider} from "./camera.js";
import {DEAD, DEFAULT, IDLE, JUMP, RUN} from "./constants.js";

export const heroTransform = new Transform(32, 26, 32, 26)
export const heroRigidBody = new RigidBody(heroTransform)
export const heroCollider = new CircleCollider(heroTransform, DEFAULT, 52)
let heroAnimator

export default {
    load () {
        return new Promise(resolve => {
            heroAnimator = new Animator('hero', './assets/images/tilesheet.png', 64, 52)
            heroAnimator.addStaticState(IDLE, 1152, 460)
            heroAnimator.addStaticState(DEAD, 1472, 460)
            heroAnimator.addAnimatedState(RUN, 1216, 460, 3, .3)
            heroAnimator.addAnimatedState(JUMP, 1472, 460, 2, .3)

            resolve()
        })
    },

    update(pDt) {
        if (cameraCollider.collidesWith(heroCollider)) console.log("collision!")
        heroAnimator.setActiveState(heroRigidBody.velocity.equals(Vector2.zero()) ? IDLE : RUN)
    },

    draw (pCtx) {
        heroAnimator.draw(pCtx, heroTransform.drawnX, heroTransform.drawnY)
    }
}