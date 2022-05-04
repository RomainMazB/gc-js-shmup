class Fighter extends ComponentBase {
    events = new PubSub

    life
    maxLife
    isFiring = false
    weapon
    projectile
    #rb

    constructor(pLife, pMaxLife) {
        super()
        this.life = pLife
        this.maxLife = pMaxLife
    }

    linkGameObject(pGameObject) {
        super.linkGameObject(pGameObject);
        this.#rb = this.gameObject.getComponent(RigidBody)
    }

    takeDamage(pDamage) {
        this.life -= pDamage
        this.events.publish('takeDamage', this.life)

        if (this.life <= 0) this.#kill()
    }

    update(pDt) {
        if (this.weapon)
            this.weapon.update(pDt)
    }

    #kill() {
        this.events.publish("killed", this.gameObject.id)
        this.gameObject.destroy()
    }

    setWeapon(pWeapon) {
        this.weapon = pWeapon
    }

    setProjectile(pProjectile) {
        this.projectile = pProjectile
    }
}