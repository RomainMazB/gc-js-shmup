class MultiParallelBullets extends WeaponBase {
    nbBullets = 3
    spaceBetweenBullets = 30

    /**
     * Fire nbBullets bullets in front of the weapon
     */
    shoot() {
        let cosProjectile = Math.cos(this.direction),
            sinProjectile = Math.sin(this.direction)

        let direction = new Vec2(cosProjectile, sinProjectile).scale(500)
        for (let i = 0; i < this.nbBullets; i++) {
            let projectile = this.newBullet(this._holder.transform.x + i * this.spaceBetweenBullets, this._holder.transform.y, direction, 1)

            if (i === 0)
                projectile.playShootingSound(this._assetAtlas)

            this._gameObjectManager.add(projectile);
        }
    }
}