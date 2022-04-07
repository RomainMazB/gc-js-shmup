import PubSub from "./utils/PubSub.js"
import Enemy from "./Enemy.js"
import {Vec2} from "./utils/Vec2.js"
import Collider from "./Components/Collider.js"
import RigidBody from "./Components/RigidBody.js"
import GameObjectManager from "./GameObjectManager.js"

export default class EnemiesWave {
    /** @var {Enemy[]} */
    enemies = []
    events = new PubSub()
    x
    #delay
    #firstEnemyOnLeft
    #lastEnemyOnRight
    #appearingSpeed
    get delay() { return this.#delay }
    get width() { return this.#lastEnemyOnRight.x - this.#firstEnemyOnLeft.x + this.#lastEnemyOnRight.width }

    constructor(pDelay, pX, pAppearingSpeed = Vec2.bottom().scale(20)) {
        this.#delay = pDelay
        this.x = pX
        this.#appearingSpeed = pAppearingSpeed instanceof Number ? new Vec2(pAppearingSpeed, 0) : pAppearingSpeed
    }

    addEnemy(enemy) {
        enemy.getComponent(Collider).isActive = false
        enemy.getComponent(RigidBody).isActive = false
        if (this.enemies.length === 0) {
            this.#firstEnemyOnLeft = enemy
            this.#lastEnemyOnRight = enemy
        } else {
            if (enemy.x < this.#firstEnemyOnLeft.x) this.#firstEnemyOnLeft = enemy
            if (enemy.x > this.#lastEnemyOnRight.x) this.#lastEnemyOnRight = enemy
        }

        enemy.events.subscribe('destroyed', id => {
            let idx = this.enemies.findIndex(e => e.id === id)
            this.enemies.splice(idx, 1)
            this.#checkWaveEnd()
        })

        this.enemies.push(enemy)
        GameObjectManager.add(enemy)
    }

    #checkWaveEnd() {
        if (this.enemies.length === 0) {
            this.events.publish('allEnemiesDefeated')
        }
    }

    update() {}

    fixedUpdate(pFixedDt) {
        if (this.#lastEnemyOnRight.y + this.#lastEnemyOnRight.height > this.x)
            this.enemies.forEach(enemy => enemy.getComponent(RigidBody).velocity = Vec2.zero())
    }

    start() {
        this.enemies.forEach(enemy => {
            enemy.getComponent(RigidBody).velocity = this.#appearingSpeed
            enemy.getComponent(RigidBody).isActive = true
            enemy.getComponent(Collider).isActive = true
            enemy.isActive = true
        })
    }

    draw(pCtx) {
        this.enemies.forEach(enemy => enemy.draw(pCtx))
    }
}