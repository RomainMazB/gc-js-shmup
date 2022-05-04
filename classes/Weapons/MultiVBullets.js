class MultiVBullets extends MultiParallelBullets {
    angle = Math.PI / 8
    spaceBetweenBullets = 3

    get angleBetweenBullets () { return this.angle / this.nbBullets }

    /**
     * Fire nbBullets bullets in a "V" form in front of the weapon
     */
    shoot() {
        for (let i = -Math.floor(this.nbBullets / 2); i <= Math.floor(this.nbBullets / 2); i++) {
            let projectileAngle = this.direction + i * this.angleBetweenBullets,
                cosProjectile = Math.cos(projectileAngle),
                sinProjectile = Math.sin(projectileAngle),

                direction = new Vec2(cosProjectile, sinProjectile).scale(500),

                projectile = this.newBullet(this._holder.transform.x + i * this.spaceBetweenBullets, this._holder.transform.y, direction, 1)

            if (i === 0)
                projectile.playShootingSound(this._assetAtlas)
        }
    }
}