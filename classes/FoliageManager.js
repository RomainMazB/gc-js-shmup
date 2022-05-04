class FoliageManager {
    #assetsAtlas
    timerMin = .3
    timerMax = 1
    timer
    #spawnedFoliage = []
    #gameObjectManager
    #collisionsManager
    #heroIsFiring

    constructor(pGameObjectManager, pCollisionsManager, pHero, pAssetsAtlas) {
        this.#gameObjectManager = pGameObjectManager
        this.#collisionsManager = pCollisionsManager
        this.#assetsAtlas = pAssetsAtlas
        this.reloadTimer()
        let heroFighterComp = pHero.getComponent(Fighter)
        heroFighterComp.weapon.events.subscribe('startFiring', _ => this.#syncScrollWithFiringStatus(true))
        heroFighterComp.weapon.events.subscribe('stopFiring', _ => this.#syncScrollWithFiringStatus(false))
    }

    reloadTimer() {
        this.timer = Math.randomNumber(this.timerMin, this.timerMax)
    }

    update(pDt) {
        if (this.#heroIsFiring)
            return

        this.timer -= pDt

        if (this.timer <= 0) {
            this.#spawnRandomFoliage()
            this.reloadTimer()
        }
    }

    draw(pCtx) {
        this.#spawnedFoliage.forEach(f => f.draw(pCtx))
    }

    #spawnRandomFoliage() {
        let randomNumber = Math.randomNumber(1, 49)
        let randomFoliage = this.#assetsAtlas.get(`./assets/images/foliage/${randomNumber}.png`)

        let x = Boolean.random() ? Math.randomNumber(- randomFoliage.naturalWidth-260, 0) - randomFoliage.naturalWidth : randomFoliage.naturalWidth + Math.randomNumber(900, 1160)
        let newFoliage = new Foliage(this.#gameObjectManager, this.#collisionsManager, new Transform(x, 150), randomFoliage)
        newFoliage.events.subscribe('destroyed', id => this.#removeFoliage(id))

        // Use unshift instead of push to z-index the foliages
        this.#spawnedFoliage.unshift(newFoliage)
    }

    #removeFoliage(pId) {
        let idx = this.#spawnedFoliage.findIndex(f => f.id === pId)

        this.#spawnedFoliage.splice(idx, 1)
    }

    #syncScrollWithFiringStatus(isFiring) {
        this.#heroIsFiring = isFiring
        this.#spawnedFoliage.forEach(f => f.getComponent(RigidBody).isActive = !isFiring)
    }
}