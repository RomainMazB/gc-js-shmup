class CollisionsManager {
    #idGenerator = new UniqIdGenerator

    #colliders = []
    #collidersCollisionsCache = {}
    #processingCollisions = []

    #collidingLayers

    constructor(pCollidingLayers) {
        this.#collidingLayers = pCollidingLayers
    }

    /**
     * Remove a collider from all the colliders lists and clean-up corresponding caches
     * @param {Collider} collider
     */
    removeCollider(collider) {
        let idx = this.#colliders.findIndex(c => c.id === collider.id)

        if (idx === -1) return
        this.#colliders.splice(idx, 1)

        this.#processingCollisions = this.#processingCollisions.filter(cacheString => !cacheString.includes(`-${collider.id}-`))

        this.#deleteCollisionCache(collider)
    }

    /**
     * Return if two layers should collide each other
     * @param {String} layerA
     * @param {String} layerB
     * @returns {boolean}
     */
    #layersShouldCollide(layerA, layerB) {
        return (this.#collidingLayers[layerA] === undefined || this.#collidingLayers[layerA].excludes === undefined || !this.#collidingLayers[layerA].excludes.includes(layerB))
            &&
            (this.#collidingLayers[layerB] === undefined || this.#collidingLayers[layerB].excludes === undefined || !this.#collidingLayers[layerB].excludes.includes(layerA))
            &&
            (layerA === ALL || layerB === ALL ||
                (this.#collidingLayers[layerA] !== undefined && this.#collidingLayers[layerA].includes !== undefined && this.#collidingLayers[layerA].includes.includes(layerB)) ||
                (this.#collidingLayers[layerB] !== undefined && this.#collidingLayers[layerB].includes !== undefined && this.#collidingLayers[layerB].includes.includes(layerA)))
    }

    /**
     * Return if two items should collide each other, using the cache status
     * @param {Collider} colliderA
     * @param {Collider} colliderB
     * @returns {boolean}
     */
    #itemsShouldCollide(colliderA, colliderB) {
        return this.#collidersCollisionsCache[CollisionsManager.#cacheStringFor(colliderA, colliderB)]
    }

    /**
     * Return a cache string with ids sorted to enforce cohesion
     * @param {Collider} colliderA
     * @param {Collider} colliderB
     * @returns {`-${*}-${*}-`}
     */
    static #cacheStringFor(colliderA, colliderB) {
        let sortedId = [colliderA.id, colliderB.id].sort()

        return `-${sortedId[0]}-${sortedId[1]}-`
    }

    /**
     * Delete the collider collision cache for a collider
     * @param {Collider} collider
     */
    #deleteCollisionCache = collider => {
        Object.keys(this.#collidersCollisionsCache)
            .filter(cacheString => cacheString.includes(`-${collider.id}-`))
            .forEach(key => delete this.#collidersCollisionsCache[key])
    }

    /**
     * Refresh the collider collision cache for a collider
     * @param {Collider} collider
     */
    refreshCollisionCache(collider) {
        this.#deleteCollisionCache(collider)

        this.#colliders.forEach(otherCollider => {
            if (otherCollider.id !== collider.id)
                this.#collidersCollisionsCache[CollisionsManager.#cacheStringFor(otherCollider, collider)] = this.#layersShouldCollide(collider.layer, otherCollider.layer)
        })
    }

    /**
     * Check whether a collision is already registered or not
     * @param {Collider} colliderA
     * @param {Collider} colliderB
     * @returns {boolean}
     */
    #collisionIsRegistered(colliderA, colliderB) {
        return this.#processingCollisions.includes(CollisionsManager.#cacheStringFor(colliderA, colliderB))
    }

    /**
     * Find a collider by the id
     * @param {Number} id
     * @returns {Collider}
     */
    #findCollider(id) {
        return this.#colliders[Object.keys(this.#colliders).find(cId => cId === id)]
    }

    /**
     *
     * @param pDt
     */
    fixedUpdate(pDt) {
        let frameCollisions = []
        let collisionResolutions = {}

        // Loop through all the this.#colliders
        this.#colliders.forEach((collider, idx) => {
            // Check for collision between this collider and the following items in the this.#colliders list
            this.#colliders.slice(idx + 1).forEach(otherCollider => {
                // Abort if one of the collider is destroyed at the end of the frame
                if (otherCollider.gameObject.isDestroyed || collider.gameObject.isDestroyed)
                    return

                // Abort if one of the collider or the collider's gameobject is inactive
                if (!collider.gameObject.isActive || !otherCollider.gameObject.isActive || !collider.isActive || !otherCollider.isActive) return

                try {
                    if (this.#itemsShouldCollide(collider, otherCollider) && collider.collidesWith(otherCollider)) {
                        let cacheString = CollisionsManager.#cacheStringFor(collider, otherCollider)

                        frameCollisions.push(cacheString)

                        // Fire the enterTriggerCollision if necessary
                        if (!this.#collisionIsRegistered(collider, otherCollider)) {
                            collider.triggerCollisionWith(otherCollider)
                            otherCollider.triggerCollisionWith(collider)

                            // Register the collision
                            this.#processingCollisions.push(cacheString)
                        }

                        // If one of the two colliders is a trigger, collision resolution shouldn't be calculated
                        if (collider.isTrigger || otherCollider.isTrigger)
                            return

                        // If one of collider is static, resolve the collision by "pushing" the other collider
                        function addCollisionResolutionFor(colliderA, colliderB) {
                            if (collisionResolutions[colliderB.id] === undefined)
                                collisionResolutions[colliderB.id] = [colliderA.getCollisionResolutionFor(colliderB)]
                            else
                                collisionResolutions[colliderB.id].push(colliderA.getCollisionResolutionFor(colliderB))
                        }

                        if (collider.isStatic && !otherCollider.isStatic)
                            addCollisionResolutionFor(collider, otherCollider)
                        else if (otherCollider.isStatic && !collider.isStatic)
                            addCollisionResolutionFor(otherCollider, collider)
                    }
                } catch (e) {
                    console.error(e)
                }
            })
        })

        // Loop through all the collision resolutions
        for (let id of Object.keys(collisionResolutions)) {
            let collider = this.#findCollider(id)

            // If only one collisionResolution is set for this collider, just apply it
            if (collisionResolutions[id].length === 1) {
                collider.gameObject.transform.x += collisionResolutions[id][0].vec.x
                collider.gameObject.transform.y += collisionResolutions[id][0].vec.y
            }
            // Else, sort the collisions to keep only the greatest priorities ones and merge them before applying
            else {
                let highestResolutionPriority =
                    collisionResolutions[id]
                        .reduce((prev, cur) => {
                            if (cur.priority > prev.priority) return cur
                            else if (cur.priority < prev.priority) return prev
                            else prev.vec.add(cur.vec)
                        })

                let mergedResolutionX = highestResolutionPriority.vec.x < 0 ? Math.ceil(highestResolutionPriority.vec.x) : Math.floor(highestResolutionPriority.vec.x)
                let mergedResolutionY = highestResolutionPriority.vec.y < 0 ? Math.ceil(highestResolutionPriority.vec.y) : Math.floor(highestResolutionPriority.vec.y)

                collider.gameObject.transform.x += mergedResolutionX
                collider.gameObject.transform.y += mergedResolutionY
            }
        }

        // Check if a collision ended. If so, call the endCollisionWith callback
        this.#processingCollisions
            .filter(cacheString => !frameCollisions.includes(cacheString))
            .forEach((cacheString, key) => {
                let collidersIds = cacheString.split('-').filter(removeEmpty => removeEmpty),
                    colliderA = this.#findCollider(collidersIds[0]),
                    colliderB = this.#findCollider(collidersIds[1])

                if (colliderA === undefined || colliderB === undefined)
                    return

                colliderA.endCollisionWith(colliderB)
                colliderB.endCollisionWith(colliderA)
            })
    }

    /**
     * Add a collider to the colliders list
     * @param pItem
     */
    add(pItem) {
        // Add a unique id to the collider to allow layer-collision caching
        pItem.id = this.#idGenerator.newId

        this.#colliders.forEach(collider => {
            return this.#collidersCollisionsCache[CollisionsManager.#cacheStringFor(collider, pItem)] = this.#layersShouldCollide(pItem.layer, collider.layer)
        })

        this.#colliders.push(pItem)
    }

    /**
     * Draw all the colliders on debug mode
     * @param pCtx
     */
    draw(pCtx) {
        if (debug) this.#colliders.forEach(collider => collider.draw(pCtx))
    }
}