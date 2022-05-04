class GameObjectManager {
    #idGenerator = new UniqIdGenerator

    #gameObjects = []

    /**
     * Helper returning only the active game objects
     * @returns {GameObject[]}
     */
    get #activeGameObjects() { return this.#gameObjects.filter(go => go.isActive) }

    /**
     * Marks a gameObject as destroyed
     * @param pId
     */
    destroy(pId) {
        let idx = this.#gameObjects.findIndex(go => go.id === pId)

        if (idx === -1) return
        this.#gameObjects[idx].isDestroyed = true
    }

    /**
     * Add a GameObject to the list
     * @param pGameObject
     */
    add(pGameObject) {
        if (!pGameObject instanceof GameObject)
            throw new Error("Only GameObject can be added to the GameObjectManager")

        pGameObject.id = this.#idGenerator.newId
        this.#gameObjects.push(pGameObject)
    }

    /**
     * Update all active game objects
     * @param pDt
     */
    update(pDt) {
        this.#activeGameObjects.forEach(go => go.update(pDt))
    }

    /**
     * Update all active game objects
     * @param pDt
     */
    fixedUpdate(pDt) {
        this.#activeGameObjects.forEach(go => go.fixedUpdate(pDt))
    }

    /**
     * On frame end, delete all the destroyed game objects
     */
    endFrame() {
        for (let idx = this.#gameObjects.length - 1; idx > -1; idx--) {
            if (this.#gameObjects[idx].isDestroyed) {
                this.#gameObjects[idx].destroy()
                this.#gameObjects.splice(idx, 1)
            }
        }
    }

    /**
     * Draw all active game objects with z-index depending on the object's y position
     * @param pCtx
     */
    draw(pCtx) {
        this.#activeGameObjects.sort((a, b) => a.y > b.y ? 1 : -1).forEach(go => go.draw(pCtx))
    }
}