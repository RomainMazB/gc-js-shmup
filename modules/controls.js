import { HeroGameObject } from "./hero.js"
import { Vec2 } from "../classes/utils/Vec2.js"
import {isKeyDown, keyUpDown} from "../utils/input-system.js"
import {HERO_PROJECTILES} from "../utils/constants.js"
import Projectile from "../classes/Projectile.js"
import RigidBody from "../classes/Components/RigidBody.js"
import GameObjectManager from "../classes/GameObjectManager.js"

let delayBetweenShot = .5
let timer = 0
let isFiring = false

let heroRigidBody = HeroGameObject.getComponent(RigidBody)
// Dependencies
export default {
    load () {
        keyUpDown(
            'Space',
                _ => isFiring = true,
                _ => isFiring = false
        )
    },

    update(pDt) {
        const HERO_SPEED = 360
        let movementVectors = []

        if (isKeyDown("KeyA")) movementVectors.push(Vec2.left())
        if (isKeyDown("KeyD")) movementVectors.push(Vec2.right())
        if (isKeyDown("KeyW")) movementVectors.push(Vec2.top())
        if (isKeyDown("KeyS")) movementVectors.push(Vec2.bottom())

        heroRigidBody.velocity = movementVectors.reduce(
            (prev, cur) => prev.add(cur.scale(HERO_SPEED)),
            Vec2.zero()
        )

        if (timer > 0) timer = Math.max(0, timer - pDt)

        if (isFiring) {
            if (timer === 0) {
                let direction = Vec2.top().scale(500)
                let projectile = new Projectile(HeroGameObject.transform.x, HeroGameObject.transform.y, direction, 1, HERO_PROJECTILES)
                GameObjectManager.add(projectile)
                timer = delayBetweenShot
            }
        }
    },

    draw () {}
}