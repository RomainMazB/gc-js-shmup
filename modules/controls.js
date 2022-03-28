import { heroRigidBody } from "./hero.js";
import { Vector2 } from "../classes/Vector2.js";
import { isKeyDown } from "../utils/input-system.js";

// Dependencies
export default {
    load (heroRb) {},

    update() {
        const HERO_SPEED = 120
        let movementVectors = []

        if (isKeyDown("KeyA")) movementVectors.push(Vector2.left())
        if (isKeyDown("KeyD")) movementVectors.push(Vector2.right())
        if (isKeyDown("KeyW")) movementVectors.push(Vector2.top())
        if (isKeyDown("KeyS")) movementVectors.push(Vector2.bottom())

        heroRigidBody.velocity = movementVectors.reduce(
            (prev, cur) => prev.add(cur.multiply(HERO_SPEED)),
            Vector2.zero()
        )
    },

    draw () {}
}