class WeaponBase {
    events = new PubSub

    projectileLayer
    isFiring = false
    _holder
    _bulletClass
    shootingTimer = 0
    shootingRate = 0
    direction
    _gameObjectManager
    _collisionsManager
    _assetAtlas

    constructor(pGameObjectManager, pCollisionsManager, pAssetsAtlas, pBulletClass, pProjectileLayer, pHolder, pShootingRate) {
        this.projectileLayer = pProjectileLayer
        this.shootingRate = this.shootingTimer = pShootingRate
        this._holder = pHolder
        this._bulletClass = pBulletClass
        this._gameObjectManager = pGameObjectManager
        this._collisionsManager = pCollisionsManager
        this._assetAtlas = pAssetsAtlas
    }

    /**
     * Reset the firing timer when necessary
     * @param pDt
     */
    update(pDt) {
        if (this.isFiring) {
            this.shootingTimer = Math.max(0, this.shootingTimer - pDt)

            if (this.shootingTimer === 0) {
                this.shoot()
                this.shootingTimer = this.shootingRate
            }
        }
    }

    shoot() {}

    /**
     * Create and return a new Projectile
     * @param pX
     * @param pY
     * @param pDirection
     * @param pDamage
     * @returns {Projectile}
     */
    newBullet(pX, pY, pDirection, pDamage) {
        return new this._bulletClass(this._gameObjectManager, this._collisionsManager, pX, pY, pDirection, pDamage, this.projectileLayer)
    }

    setBulletClass(pBulletClass) {
        this._bulletClass = pBulletClass
    }

    startFiring() {
        this.events.publish('startFiring')
        this.isFiring = true
    }

    stopFiring() {
        this.events.publish('stopFiring')
        this.isFiring = false
    }
}