import { heroRigidBody } from "./hero.js";
import { Vec2 } from "../classes/Vec2.js";
import { isKeyDown } from "../utils/input-system.js";

// Dependencies
export default {
    load (heroRb) {},

    update() {
        const HERO_SPEED = 120
        let movementVectors = []

        if (isKeyDown("KeyA")) movementVectors.push(Vec2.left())
        if (isKeyDown("KeyD")) movementVectors.push(Vec2.right())
        if (isKeyDown("KeyW")) movementVectors.push(Vec2.top())
        if (isKeyDown("KeyS")) movementVectors.push(Vec2.bottom())

        heroRigidBody.velocity = movementVectors.reduce(
            (prev, cur) => prev.add(cur.scale(HERO_SPEED)),
            Vec2.zero()
        )
    },

    draw () {}
}