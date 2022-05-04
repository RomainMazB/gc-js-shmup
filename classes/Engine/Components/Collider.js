class Collider extends ComponentBase {
    id
    isTrigger = false
    isStatic = false
    layer = DEFAULT
    #collisionsManager
    triggerCollisionWith = _ => {}
    endCollisionWith = _ => {}

    get x () { return this.gameObject.transform.x + this._offsetX }
    get y () { return this.gameObject.transform.y + this._offsetY }
    get rightXBorder () { return this.x }
    get bottomYBorder () { return this.y }
    get width () { return 1 }
    get height () { return 1 }
    get center () { return point(this.x, this.y) }

    constructor(pCollisionsManager, pOffsetX = 0, pOffsetY = 0) {
        super()
        this._offsetX = pOffsetX
        this._offsetY = pOffsetY
        this.#collisionsManager = pCollisionsManager
    }

    linkGameObject(pGameObject) {
        super.linkGameObject(pGameObject);
        this.#collisionsManager.add(this)
    }

    destroy() {
        this.#collisionsManager.removeCollider(this)
        super.destroy();
    }

    collidesWith(otherCollider) {
        return this.x === otherCollider.x && this.y === otherCollider.y
    }

    getCollisionResolutionFor(otherCollider) {}

    draw(pCtx) {
        pCtx.fillStyle = this.isActive ? 'red' : 'pink'
        pCtx.fillRect(this.x, this.y, 1, 1)
    }

    setLayer(pLayer) {
        this.layer = pLayer
        this.#collisionsManager.refreshCollisionCache(this)
    }
}