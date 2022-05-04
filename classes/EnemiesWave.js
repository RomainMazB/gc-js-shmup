class EnemiesWave {
    /** @var {EnemyBase[]} */
    #enemies = []
    events = new PubSub()
    #stoppingY
    #delay
    #crossedTheLimit = false
    #started = false
    get firstEnemy() { return this.#enemies[0] }
    get delay() { return this.#delay }
    get enemies() { return this.#enemies }

    constructor(pGameObjectManager, pDelay, pStoppingY) {
        this.#delay = pDelay
        this.#stoppingY = pStoppingY
    }

    addEnemy(enemy) {
        enemy.isActive = false

        enemy.events.subscribe(DESTROYED_EVENT, enemy => this.#removeEnemy(enemy.id))

        this.#enemies.push(enemy)
    }

    #removeEnemy(pId) {
        let idx = this.#enemies.findIndex(e => e.id === pId)

        if (idx !== -1)
            this.#enemies.splice(idx, 1)

        this.#checkWaveEnd()
    }

    #checkWaveEnd() {
        if (this.#enemies.length === 0)
            this.events.publish('allEnemiesDefeated')
    }

    fixedUpdate(pFixedDt) {
        if (!this.#started) return

        if (this.#crossedTheLimit || this.#enemies.length === 0) return

        let currentAnimatorSprite = this.firstEnemy.getComponent(Animator).currentStateSprite

        if (currentAnimatorSprite && this.firstEnemy.transform.y + currentAnimatorSprite._height > this.#stoppingY) {
            this.#enemies.forEach(enemy => enemy.getComponent(RigidBody).velocity = Vec2.zero())
            this.#crossedTheLimit = true
        }
    }

    start() {
        // Order enemies to make the wave stop at the good position depending on the first enemy position
        this.#enemies.sort((a, b) => a.y > b.y ? 1 : 0)
        this.#enemies.forEach(enemy => enemy.isActive = true )
        this.#started = true
    }
}