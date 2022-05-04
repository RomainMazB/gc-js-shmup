class WaveManager {
    events = new PubSub()
    remainingWaves = []
    timer = 0
    timerIsRunning = false
    isRunning = false
    currentWave
    currentWaveDefeatedSubscription
    currentNWave = 0
    textTimer = 0
    #bossWave
    #bossIsDefeated = false

    constructor(pGameObjectManager, pCollisionsManager, pLevelData, pAssetsAtlas) {
        // Create all the level's wave
        pLevelData.waves.forEach(waveData => {
            let wave = new EnemiesWave(pGameObjectManager, waveData.delay, waveData.stoppingY)

            // For each enemies, read the data and create it
            waveData.enemies.forEach(enemyData => {
                let className = (new Function(`return ${enemyData.class}`))()

                let transform = new Transform(enemyData.x, enemyData.y + 150)
                let enemy = new className(pGameObjectManager, pCollisionsManager, transform, pAssetsAtlas)
                enemy.isActive = false
                enemy.getComponent(RigidBody).velocity = Vec2.bottom().scale(waveData.speed)

                if (enemyData.weaponClass !== undefined) {
                    let fireRate = enemyData.fireRate !== undefined ? enemyData.fireRate : 1
                    let projectileClass = enemyData.projectileClass !== undefined ? (new Function(`return ${enemyData.projectileClass}`))() : Projectile
                    let className = (new Function(`return ${enemyData.weaponClass}`))()

                    enemy.getComponent(Fighter).setWeapon(new className(pGameObjectManager, pCollisionsManager, pAssetsAtlas, projectileClass, ENEMY_PROJECTILES, enemy, fireRate))
                    enemy.getComponent(Fighter).weapon.isFiring = true
                }

                wave.addEnemy(enemy)
            })

            this.addWave(wave)
        })

        // Create the boss wave
        this.#bossWave = new EnemiesWave(pGameObjectManager, 5, 300)

        let className = (new Function(`return ${pLevelData.boss.class}`))()

        let transform = new Transform(960/2, 150)
        let enemy = new className(pGameObjectManager, pCollisionsManager, transform, pAssetsAtlas)
        enemy.isActive = false
        enemy.getComponent(RigidBody).velocity = Vec2.bottom().scale(300)
        enemy.getComponent(Fighter).life = enemy.getComponent(Fighter).maxLife = pLevelData.boss.life
        enemy.getComponent(Fighter).damage = pLevelData.boss.damage

        this.#bossWave.addEnemy(enemy)
    }

    addWave(pWave) {
        this.remainingWaves.push(pWave)
    }

    run() {
        this.isRunning = true
        this.spawnNextWave()
    }

    update(pDt) {
        if (!this.isRunning) return

        if (this.timerIsRunning) {
            this.timer -= pDt
            if (this.timer <= 0) this.spawnNextWave()
        }

        if (this.textTimer > 0) this.textTimer -= pDt
    }

    fixedUpdate(pFixedDt) {
        if (this.currentWave === undefined)
            return

        this.currentWave.fixedUpdate(pFixedDt)
    }

    draw(pCtx) {
        if (this.currentWave === null)
            return

        if (this.textTimer > 0) {
            pCtx.font = '50pt sans-serif'
            pCtx.fontWeight = '900'
            pCtx.textAlign = 'center'
            pCtx.fillText(`Starting wave ${this.currentNWave}`, 480, 300)
        }
    }

    spawnNextWave() {
        // Stop the timer
        this.timerIsRunning = false

        // Emit the waveEnd event
        this.events.publish('waveEnd')

        // Inject the next wave and subscribe to the allEnemiesDefeated event to restart the timer
        this.currentWave = this.remainingWaves.shift()
        this.currentWaveDefeatedSubscription = this.currentWave.events.subscribe('allEnemiesDefeated', _ => this.#checkVictory())
        this.timer = this.currentWave.delay

        // Start the wave
        this.currentWave.start()
        this.events.publish('newWave', this.currentWave)

        // Make the next wave text appear
        this.currentNWave++
        this.textTimer = 3
    }

    /**
     * Check if the level is finished or if a new wave or boss should spawn
     */
    #checkVictory() {
        if (this.remainingWaves.length === 0)
            this.#bossIsDefeated
                ? this.events.publish('levelFinished')
                : this.#spawnBoss()
        else
            this.timerIsRunning = true
    }

    #spawnBoss() {
        // Stop the timer
        this.timerIsRunning = false

        // Unsubscribe from the previous wave events
        if (this.currentWaveDefeatedSubscription)
            this.currentWaveDefeatedSubscription.unsubscribe()

        // Inject the boss wave and subscribe to the allEnemiesDefeated event to finish the level
        this.currentWave = this.#bossWave
        this.#bossWave = null
        this.currentWaveDefeatedSubscription = this.currentWave.events.subscribe('allEnemiesDefeated', _ => this.events.publish('levelFinished'))
        this.timer = 5

        // Fire the bossSpawned event with boss' data
        this.events.publish('bossSpawned', this.currentWave.firstEnemy)

        // Start the wave
        this.currentWave.start()
    }
}