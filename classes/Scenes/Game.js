class Game extends SceneBase {
    #level
    #hero
    #heroRb
    #heroFighter
    #ui
    #foliageManager
    #gameObjectManager = new GameObjectManager
    #waveManager
    #collisionsManager = new CollisionsManager({
        [HERO]: { includes: [CAMERA, ENEMY_PROJECTILES, ENEMY], excludes: [HERO, HERO_PROJECTILES] },
        [ENEMY]: { includes: [HERO_PROJECTILES], excludes: [ENEMY, ENEMY_PROJECTILES, CAMERA] },
        [HERO_PROJECTILES]: { includes: [ENEMY, CAMERA], excludes: [HERO_PROJECTILES] },
        [ENEMY_PROJECTILES]: { includes: [HERO, CAMERA], excludes: [ENEMY_PROJECTILES] },
        [FOLIAGE]: { includes: [CAMERA], excludes: [FOLIAGE] }
    })
    #cameraColliders

    get neededAssets() {
        let assets = [
            './assets/images/projectiles/arrow.png',
            './assets/images/empty-heart.png',
            './assets/images/filled-heart.png',
            './assets/images/half-filled-heart.png',
            './assets/audios/musics/alexander-nakarada-medieval-loop-one.mp3',
            './assets/audios/clips/bullet-shots/basic-arrow.wav',
            './assets/audios/clips/bullet-shots/fire-arrow.wav',
            './assets/images/enemies/kirikou.png',
            this.#levelFileName
        ]

        for (let i = 1; i <= 49; i++) {
            assets.push(`./assets/images/foliage/${i}.png`)
        }

        return assets
    }

    get #levelFileName() { return `./assets/levels/lev-${this.#level}.json` }

    constructor(pSelectedLevel) {
        super()
        this.#level = pSelectedLevel
    }

    load (pCtx) {
        this._assetAtlas.get('./assets/audios/musics/alexander-nakarada-medieval-loop-one.mp3').volume = .2
        this._assetAtlas.get('./assets/audios/musics/alexander-nakarada-medieval-loop-one.mp3').play()
        this.#hero = new Hero(this.#gameObjectManager, this.#collisionsManager, new Transform(480, 524), this._assetAtlas)
        this.#heroRb = this.#hero.getComponent(RigidBody)
        this.#heroFighter = this.#hero.getComponent(Fighter)
        this.#foliageManager = new FoliageManager(this.#gameObjectManager, this.#collisionsManager, this.#hero, this._assetAtlas)
        this.#createCameraColliders()

        this.#heroFighter.events.subscribe('killed', _ => this.sceneChanger.selectScene(new Defeat))
        this.#waveManager = new WaveManager(this.#gameObjectManager, this.#collisionsManager, this._assetAtlas.get(this.#levelFileName), this._assetAtlas)
        this.#waveManager.events.subscribe('levelFinished', _ => this.sceneChanger.selectScene(new Victory(this.#ui.score)))

        this.#ui = new GameUI(pCtx, this.#heroFighter, this.#waveManager)

        this.#waveManager.run()

        this._keyboardEvents.push(keyUpDown(
            'Space',
            _ => this.#heroFighter.weapon.startFiring(),
            _ => this.#heroFighter.weapon.stopFiring()
        ))
    }

    update (pDt) {
        this.#handleKeyboardControls()
        this.#hero.update(pDt)
        this.#gameObjectManager.update(pDt)
        this.#foliageManager.update(pDt)
        this.#waveManager.update(pDt)

        this.#gameObjectManager.endFrame()
    }

    draw (pCtx) {
        this.#waveManager.draw(pCtx)
        this.#foliageManager.draw(pCtx)
        this.#hero.draw(pCtx)
        this.#gameObjectManager.draw(pCtx)
        this.#ui.draw(pCtx)
    }

    fixedUpdate(pFixedDt) {
        this.#gameObjectManager.fixedUpdate(pFixedDt)
        this.#waveManager.fixedUpdate(pFixedDt)
        this.#collisionsManager.fixedUpdate(pFixedDt)
    }

    #handleKeyboardControls() {
        const HERO_SPEED = 360
        let movementVectors = []

        if (isKeyDown("KeyA")) movementVectors.push(Vec2.left())
        if (isKeyDown("KeyD")) movementVectors.push(Vec2.right())
        if (isKeyDown("KeyW")) movementVectors.push(Vec2.top())
        if (isKeyDown("KeyS")) movementVectors.push(Vec2.bottom())

        this.#heroRb.velocity = movementVectors.reduce(
            (prev, cur) => prev.add(cur.scale(HERO_SPEED)),
            Vec2.zero()
        )
    }

    #createCameraColliders() {
        const cameraTopGameObject = new GameObject(this.#gameObjectManager, new Transform(0, 50))
        const cameraBottomGameObject = new GameObject(this.#gameObjectManager, new Transform(0, 576))
        const cameraLeftGameObject = new GameObject(this.#gameObjectManager, new Transform(0, 120))
        const cameraRightGameObject = new GameObject(this.#gameObjectManager, new Transform(850, 120))
        const cameraTopCollider = cameraTopGameObject.addComponent(new RectangleCollider(this.#collisionsManager, 960,70))
        const cameraBottomCollider = cameraBottomGameObject.addComponent(new RectangleCollider(this.#collisionsManager, 960, 64))
        const cameraLeftCollider = cameraLeftGameObject.addComponent(new RectangleCollider(this.#collisionsManager, 110, 456))
        const cameraRightCollider = cameraRightGameObject.addComponent(new RectangleCollider(this.#collisionsManager, 110, 456))
        cameraTopCollider.setLayer(CAMERA)
        cameraBottomCollider.setLayer(CAMERA)
        cameraLeftCollider.setLayer(CAMERA)
        cameraRightCollider.setLayer(CAMERA)
        cameraTopCollider.isStatic = cameraBottomCollider.isStatic = cameraRightCollider.isStatic = cameraLeftCollider.isStatic = true

        this.#cameraColliders = [cameraBottomGameObject, cameraBottomGameObject, cameraLeftGameObject, cameraRightGameObject]
    }
}