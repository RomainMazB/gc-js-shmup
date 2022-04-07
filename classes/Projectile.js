import RigidBody from "./Components/RigidBody.js"
import GameObject from "./GameObject.js"
import Transform from "./Components/Transform.js"
import RectangleCollider from "./Components/RectangleCollider.js"
import GameObjectManager from "./GameObjectManager.js"
import AnimatedSprite from "./Components/AnimatedSprite.js"
import projectiles from "../modules/projectiles.js"
import Fighter from "./Components/Fighter.js"

export default class Projectile extends GameObject {
    #damage

    constructor(pX, pY, pSpeed, pDamage, pLayer) {
        super(new Transform(pX, pY))
        this.addComponent(new AnimatedSprite('./assets/images/items.png', 0, 0, 3, 32, 32, .3, 0, true, true, -8, -8))
        let rigidBody = this.addComponent(new RigidBody())
        let collider = this.addComponent(new RectangleCollider(32, 32, -16, -16))
        collider.isTrigger = true
        collider.triggerCollisionWith = function (otherCollider) {
            otherCollider.gameObject.getComponent(Fighter).takeDamage(pDamage)
            GameObjectManager.destroy(this.gameObject.id)
        }
        collider.setLayer(pLayer)
        this.#damage = pDamage
        rigidBody.velocity = pSpeed

        projectiles.add(this)
    }

    destroy() {
        super.destroy();
    }
}