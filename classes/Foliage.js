class Foliage extends GameObject {
    #sprite

    get facticeCollider () {
        return rect(this.#sprite.drawnX, this.#sprite.drawnY, this.#sprite._width, this.#sprite.height)
    }

    constructor(pGameObjectManager, pCollisionsManager, pTransform, pImageElement) {
        super(pGameObjectManager, pTransform)
        let rigidBody = this.addComponent(new RigidBody())
        rigidBody.velocity = Vec2.bottom().scale(80)
        this.#sprite = this.addComponent(new Sprite(pImageElement, 0, 0, pImageElement.naturalWidth, pImageElement.naturalHeight, -pImageElement.naturalWidth, -pImageElement.naturalHeight))
    }

    draw(pCtx) {
        pCtx.save()
        pCtx.globalAlpha = ((this.transform.y - 150) / 25 ).clamp(0, 1)
        super.draw(pCtx)
        pCtx.restore()
    }

    /**
     * Manually destroy the foliage when out of the screen
     * @param pDt
     */
    update(pDt) {
        super.update(pDt);

        if (this.isActive && (
            0 > this.facticeCollider.x + this.facticeCollider.width ||
            960 < this.facticeCollider.x ||
            640 < this.facticeCollider.y
        )) {
            this.destroy()
        }
    }
}