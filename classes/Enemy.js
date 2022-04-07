import GameObject from "./GameObject.js"
import RigidBody from "./Components/RigidBody.js"
import RectangleCollider from "./Components/RectangleCollider.js"
import {ENEMY, ENEMY_PROJECTILES} from "../utils/constants.js"
import {Vec2} from "./utils/Vec2.js"
import Projectile from "./Projectile.js"
import GameObjectManager from "./GameObjectManager.js"
import Fighter from "./Components/Fighter.js"

export default class Enemy extends GameObject {
    #life
    #shootingTimer = Math.ceil(Math.random()*3)
    #shootingRate = 3

    get x () { return this.transform.x }
    get y () { return this.transform.y }
    get width () { return 64 }

    constructor(pTransform, pSprite) {
        super(pTransform)
        this.addComponent(pSprite)
        this.addComponent(new Fighter(4, 4))
        this.addComponent(new RigidBody())
        let collider = this.addComponent(new RectangleCollider(64, 64, -32, -32))
        collider.setLayer(ENEMY)
    }

    update(pDt) {
        super.update(pDt);
        if (!this.isActive) return

        this.#shootingTimer = Math.max(0, this.#shootingTimer - pDt)
        if (this.#shootingTimer === 0) {

            let direction = Vec2.bottom().scale(500)
            let projectile = new Projectile(this.transform.x, this.transform.y, direction, 1, ENEMY_PROJECTILES)
            GameObjectManager.add(projectile)

            this.#shootingTimer = this.#shootingRate
        }
    }
}