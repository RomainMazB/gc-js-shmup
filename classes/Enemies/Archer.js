class Archer extends EnemyBase {
    constructor(pGameObjectManager, pCollisionsManager, pTransform, pAssetAtlas) {
        super(pGameObjectManager, pTransform);

        let fighterComp = this.addComponent(new Fighter(5, 5))
        fighterComp.setWeapon(new MultiVBullets(pGameObjectManager, pCollisionsManager, pAssetAtlas, Projectile, ENEMY_PROJECTILES, this, 1))
        fighterComp.weapon.isFiring = true
        fighterComp.weapon.direction = Math.PI /2
        fighterComp.weapon.angle = Math.PI /2

        let rb = this.getComponent(RigidBody)

        let spriteAnimator = new Animator('./assets/images/enemies/archer.png', 88, 96, -44, -55)
        spriteAnimator.addAnimatedState(IDLE, DEFAULT, 0, 745, 2, 1, 40)
        spriteAnimator.addAnimatedState(RUN, _ => !rb.velocity.equals(Vec2.zero()), 0, 1266, 9, .3, 40)
        spriteAnimator.addAnimatedState(FIRING, _ => fighterComp.weapon.isFiring, 0, 254, 6, fighterComp.weapon.shootingRate / 6, 40)

        this.addComponent(spriteAnimator)

        let collider = this.addComponent(new RectangleCollider(pCollisionsManager, 32, 32, -16, -16))
        collider.setLayer(ENEMY)
    }
}