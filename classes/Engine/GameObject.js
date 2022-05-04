class GameObject {
    id
    #components = []
    transform
    isActive = true
    events = new PubSub()
    isDestroyed = false

    /**
     * Helpers to get only the active components
     * @returns {ComponentBase[]}
     */
    get #activeComponents () { return this.#components.filter(c => c.isActive) }

    constructor(pGameObjectManager, pTransform = new Transform(0, 0)) {
        this.transform = pTransform
        pGameObjectManager.add(this)

        this.events.publish('created', this.id)
    }

    /**
     * Add a component
     * @param pComponent
     * @returns {ComponentBase}
     */
    addComponent(pComponent) {
        this.#components.push(pComponent)
        pComponent.linkGameObject(this)

        return pComponent
    }

    /**
     * Remove a component and return t
     * @param pComponent
     * @returns {ComponentBase}
     */
    removeComponent(pComponent) {
        let idx = this.#components.findIndex(c => c === pComponent)

        if (idx !== -1)
            return this.#components.splice(idx, 1)
    }

    /**
     * Return **if found** a component based on its class name
     * @param pComponentClass
     * @returns {ComponentBase}
     */
    getComponent(pComponentClass) {
        return this.#components.find(c => c instanceof pComponentClass)
    }

    /**
     * Update all active components of the game object
     * @param pDt
     */
    update(pDt) {
        if (this.isActive)
            this.#activeComponents.forEach(comp => comp.update(pDt))
    }


    /**
     * Update all active components of the game object
     * @param pFixedDt
     */
    fixedUpdate(pFixedDt) {
        if (this.isActive)
            this.#activeComponents.forEach(comp => comp.fixedUpdate(pFixedDt))
    }

    /**
     * Draw all active component and the transform on debug mode
     * @param pCtx
     */
    draw(pCtx) {
        if (this.isActive)
            this.#activeComponents.forEach(comp => comp.draw(pCtx))
        if (!debug || !this.transform) return

        this.transform.draw(pCtx)
        pCtx.font = '16pt sans-serif'
        pCtx.fillStyle = 'white'
        pCtx.strokeStyle = 'black'
        pCtx.strokeText(this.id, this.transform.x + 5, this.transform.y - 5)
        pCtx.fillText(this.id, this.transform.x + 5, this.transform.y - 5)
    }

    /**
     * Destroy all the components and publish the DESTROYED_EVENT
     */
    destroy() {
        this.events.publish(DESTROYED_EVENT, this)
        this.#components.forEach(comp => comp.destroy())
        // Release all internal reference of components
        this.#components = []
        this.transform = undefined
        this.isDestroyed = true
    }
}