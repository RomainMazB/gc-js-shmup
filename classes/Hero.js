class Hero extends GameObject {
    constructor(pGameObjectManager, pCollisionsManager, pTransform, pAssetAtlas) {
        super(pGameObjectManager, pTransform);
        this.addComponent(new RigidBody())

        let fighterComp = this.addComponent(new Fighter(20, 20))
        fighterComp.setWeapon(new MultiVBullets(pGameObjectManager, pCollisionsManager, pAssetAtlas, Projectile, HERO_PROJECTILES, this, 1))
        fighterComp.weapon.shootingRate = 1
        fighterComp.weapon.direction = - Math.PI /2
        fighterComp.weapon.nbBullets = 7
        fighterComp.weapon.angle = Math.PI /4
        let headCollider = this.addComponent(new CircleCollider(pCollisionsManager, 16, -16, -40))
        // let bodyCollider = this.addComponent(new RectangleCollider(pCollisionsManager, 20, 45, -10))
        // let armsCollider = this.addComponent(new RectangleCollider(pCollisionsManager, 60, 20, -30))
        headCollider.setLayer(HERO)
        // armsCollider.setLayer(HERO)
        // bodyCollider.setLayer(HERO)

        let heroAnimator = new Animator('./assets/images/redhead.png', 88, 96, -44, -55)
        heroAnimator.addAnimatedState(IDLE, DEFAULT, 0, 1026, 9, .3, 40)
        heroAnimator.addAnimatedState(FIRING, _ => fighterComp.weapon.isFiring, 0, 0, 6, fighterComp.weapon.shootingRate / 6, 40)

        this.addComponent(heroAnimator)
    }
}
