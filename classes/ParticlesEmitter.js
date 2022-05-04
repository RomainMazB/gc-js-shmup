class ParticlesEmitter {
    static emit(pGameObjectManager, pCollisionsManager, pX, pY, pNb, pExcludedColliderId, pLayer = DEFAULT, pDamage = 0) {
        for (let i = 0; i < pNb; i++) {
            let duration = Math.randomNumber(100, 300)/100,
                angleDirection = Math.PI * Math.randomNumber(0, 200)/100,
                cosProjectile = Math.cos(angleDirection),
                sinProjectile = Math.sin(angleDirection),
                direction = new Vec2(cosProjectile, sinProjectile).scale(Math.randomNumber(100, 300))

            let particle = new Particle(pGameObjectManager, pCollisionsManager, pX, pY, direction, duration, pExcludedColliderId, pLayer, pDamage)
            particle.getComponent(Collider)
        }
    }
}