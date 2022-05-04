class SingleBullet extends WeaponBase {
    /**
     * Fire only one bullet in front of the weapon
     */
    shoot() {
        let cosProjectile = Math.cos(this.direction),
            sinProjectile = Math.sin(this.direction)

        let direction = new Vec2(cosProjectile, sinProjectile).scale(500)
        let projectile = this.newBullet(this._holder.transform.x, this._holder.transform.y, direction, 1)

        projectile.playShootingSound(this._assetAtlas)
    }
}