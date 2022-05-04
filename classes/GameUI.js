class GameUI {
    #heroLifeBar
    #bossLifeBar
    #scrollingRoadElement
    #scrollingGrassGroundElement
    #heroWasFiring
    #score = 0
    #canvasContext

    get score() { return this.#score }

    constructor(pCtx, pHeroFighterComp, pWaveManager) {
        this.#canvasContext = pCtx
        // Subscribe to weapon events to stop&restart the ui scroll and decrease the hero's life
        pHeroFighterComp.weapon.events.subscribe('startFiring', _ => this.#syncScrollWithFiringStatus(true))
        pHeroFighterComp.weapon.events.subscribe('stopFiring', _ => this.#syncScrollWithFiringStatus(false))
        pHeroFighterComp.events.subscribe('takeDamage', heroLife => {
            this.#score -= 2
            this.#heroLifeBar.current = heroLife
        })

        // Register to wave manager events to display boss and increase the score
        pWaveManager.events.subscribe('bossSpawned', boss => this.displayBossLife(boss))
        pWaveManager.events.subscribe('newWave', wave => {
            wave.enemies.forEach(enemy =>
                enemy.events.subscribe(DESTROYED_EVENT, e => this.#score += e.scoreOnKill)
            )
        })

        // Create hero's lifebar object
        this.#heroLifeBar = new HeartLifeBar(pCtx, new Transform(10, 10), 'You', pHeroFighterComp.maxLife)
        this.#scrollingRoadElement = document.getElementById('repeating-road')
        this.#scrollingGrassGroundElement = document.getElementById('grass-ground')

        this.#syncScrollWithFiringStatus(pHeroFighterComp.isFiring)
    }

    draw(pCtx) {
        this.#heroLifeBar.draw(pCtx)

        pCtx.font = '30pt sans-serif'
        pCtx.fillText('Score: '+ this.#score, 600, 600)

        if (this.#bossLifeBar !== undefined)
            this.#bossLifeBar.draw(pCtx)
    }

    /**
     * Stop&restart the road scroll when firing
     * @param isFiring
     */
    #syncScrollWithFiringStatus(isFiring) {
        this.#heroWasFiring = isFiring
        let playState = isFiring ? 'paused' : 'running'
        this.#scrollingRoadElement.style.animationPlayState = this.#scrollingGrassGroundElement.style.animationPlayState = playState
    }

    /**
     * Display the boss life
     * @param pBoss
     */
    displayBossLife(pBoss) {
        let bossFighterComp = pBoss.getComponent(Fighter)
        bossFighterComp.events.subscribe('takeDamage', bossLife => this.#bossLifeBar.current = bossLife)

        let transform = new Transform(940 / 2 + 10, 10)
        this.#bossLifeBar = new HeartLifeBar(this.#canvasContext, transform, 'The BOSS', bossFighterComp.maxLife)
    }
}