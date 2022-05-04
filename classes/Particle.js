class Particle extends Projectile {
    #excludedColliderId

    constructor(pGameObjectManager, pCollisionsManager, pX, pY, pSpeed, pDuration, pExcludedColliderId, pLayer = DEFAULT, pDamage = 0) {
        super(pGameObjectManager, pCollisionsManager, pX, pY, pSpeed, pDamage, pLayer)
        this.duration = pDuration
        this.#excludedColliderId = pExcludedColliderId
    }

    fixedUpdate(pFixedDt) {
        if (this.isActive) {
            super.fixedUpdate(pFixedDt)
            this.duration -= pFixedDt

            if (this.duration <= 0)
                this._gameObjectManager.destroy(this.id)
        }
    }

    configCollider(collider, pLayer) {
        collider.isTrigger = true
        collider.setLayer(pLayer)
        collider.triggerCollisionWith = otherCollider => {
            if (otherCollider.id === this.#excludedColliderId)
                return

            let fighterComponent = otherCollider.gameObject.getComponent(Fighter)
            if (fighterComponent !== undefined)
                fighterComponent.takeDamage(this.damage)

            this._gameObjectManager.destroy(this.id)
        }

        collider.endCollisionWith = otherCollider => {
            if (otherCollider.layer === CAMERA)
                this._gameObjectManager.destroy(this.id)
        }
    }
}