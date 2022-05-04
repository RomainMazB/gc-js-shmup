class ComponentBase {
    _gameObject
    events = new PubSub()
    isActive = true

    get gameObject() { return this._gameObject }

    linkGameObject (pGameObject) {
        this._gameObject = pGameObject
    }

    changeGameObject (pGameObject) {
        pGameObject.addComponent(this._gameObject.removeComponent(this))
    }

    destroy() {
        this.events.publish(DESTROYED_EVENT, this)
    }

    update(pDt) {}

    fixedUpdate(pFixedDt) {}

    draw(pCtx) {}
}