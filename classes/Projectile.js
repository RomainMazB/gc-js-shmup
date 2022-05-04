class Projectile extends GameObject {
    damage
    _gameObjectManager
    _collisionsManager
    soundOnShoot = 'basic-arrow.wav'
    soundOnImpact = 'basic-arrow.wav'

    constructor(pGameObjectManager, pCollisionsManager, pX, pY, pSpeed, pDamage, pLayer) {
        let rotation = Math.atan2(pSpeed.y, pSpeed.x)
        super(pGameObjectManager, new Transform(pX, pY, rotation))

        this.addComponent(new AnimatedSprite('./assets/images/projectiles/fireball.png', 0, 0, 4, 25, 20, .3, 0, false, true, -10, -12))
        let rigidBody = this.addComponent(new RigidBody())
        let collider = this.addComponent(new RectangleCollider(pCollisionsManager, 20, 20, -10, -10))
        this.configCollider(collider, pLayer)
        this.damage = pDamage
        rigidBody.velocity = pSpeed

        this._gameObjectManager = pGameObjectManager
        this._collisionsManager = pCollisionsManager
        pGameObjectManager.add(this)
    }

    configCollider(collider, pLayer) {
        collider.isTrigger = true
        collider.setLayer(pLayer)
        collider.triggerCollisionWith = otherCollider => {
            let fighterComponent = otherCollider.gameObject.getComponent(Fighter)
            if (fighterComponent !== undefined)
                fighterComponent.takeDamage(this.damage)

            if (otherCollider.layer !== CAMERA)
                ParticlesEmitter.emit(this._gameObjectManager, this._collisionsManager, this.transform.x, this.transform.y, 10, otherCollider.id, collider.layer, 1)

            this._gameObjectManager.destroy(this.id)
        }

        collider.endCollisionWith = otherCollider => {
            if (otherCollider.layer === CAMERA)
                this._gameObjectManager.destroy(this.id)
        }
    }

    playShootingSound(pAssetAtlas) {
        let audioClip = pAssetAtlas.get('./assets/audios/clips/bullet-shots/'+ this.soundOnShoot)

        if (audioClip !== undefined) {
            audioClip.data.onended = audioClip.release

            audioClip.data.play()
        }
    }

    playImpactSound(pAssetAtlas) {
        let audioClip = pAssetAtlas.get('./assets/audios/clips/bullet-shots/'+ this.soundOnImpact)

        if (audioClip !== undefined) {
            audioClip.data.currentTime = 0
            audioClip.play()
        }
    }
}