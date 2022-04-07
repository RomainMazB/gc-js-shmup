import {ALL, CAMERA, DESTROYED_EVENT, ENEMY, ENEMY_PROJECTILES, HERO, HERO_PROJECTILES, MAP} from "./constants.js"
import Collider from "../classes/Components/Collider.js"

let collidingLayers = {
    [HERO]: { includes: [CAMERA, MAP, ENEMY_PROJECTILES, ENEMY] },
    [ENEMY]: { includes: [HERO_PROJECTILES], excludes: [ENEMY, ENEMY_PROJECTILES, CAMERA] },
    [MAP]: { excludes: [MAP] },
    [HERO_PROJECTILES]: { includes: [ENEMY] },
    [ENEMY_PROJECTILES]: { excludes: [ENEMY_PROJECTILES] }
}

function removeCollider(pId) {
    let idx = colliders.findIndex(c => c.gameObject.id === pId)
    console.log(pId, idx)
    if (idx === -1) return
    colliders.splice(idx, 1)
}

let colliders = []
let collidersCollisionsCache = {}

// Auto-incrementing id system
let colliderId = 0
const getNewColliderId = _ => colliderId++

/**
 * Return if two layers should collide each other
 * @param layerA
 * @param layerB
 * @returns {boolean}
 */
const layersShouldCollide = (layerA, layerB) =>
    (collidingLayers[layerA] === undefined || collidingLayers[layerA].excludes === undefined || collidingLayers[layerA].excludes.findIndex(l => l === layerB) === -1)
    &&
    (collidingLayers[layerB] === undefined || collidingLayers[layerB].excludes === undefined || collidingLayers[layerB].excludes.findIndex(l => l === layerA) === -1)
    &&
    (layerA === layerB || layerA === ALL || layerB === ALL ||
    (collidingLayers[layerA] !== undefined && collidingLayers[layerA].includes !== undefined && collidingLayers[layerA].includes.findIndex(l => l === layerB) !== -1) ||
    (collidingLayers[layerB] !== undefined && collidingLayers[layerB].includes !== undefined && collidingLayers[layerB].includes.findIndex(l => l === layerA) !== -1))

/**
 * Return if two items should collide each other, using the cache status
 * @param colliderA
 * @param colliderB
 * @returns {boolean}
 */
const itemsShouldCollide = (colliderA, colliderB) => collidersCollisionsCache[cacheStringFor(colliderA, colliderB)]

/**
 * Return a cache string with ids sorted to enforce cohesion
 * @param colliderA
 * @param colliderB
 * @returns {`-${*}-${*}-`}
 */
const cacheStringFor = (colliderA, colliderB) => {
    let sortedId = [colliderA.colliderId, colliderB.colliderId].sort()

    return `-${sortedId[0]}-${sortedId[1]}-`
}

const processingCollisions = []

const collisionIsRegistered = (colliderA, colliderB) => processingCollisions.includes(cacheStringFor(colliderA, colliderB))

const findCollider = colliderId => colliders[Object.keys(colliders).find(cId => cId === colliderId)]

export default {
    fixedUpdate(pDt) {
        let frameCollisions = []
        let collisionResolutions = {}
        // Loop through all the colliders
        for (let i = 0; i < colliders.length; i++) {
            let collider = colliders[i]
            // Check for collision between this collider and the following items in the colliders list
            colliders.slice(i+1).forEach(otherCollider => {
                if (!collider.isActive || !otherCollider.isActive) return

                try {
                    if (itemsShouldCollide(collider, otherCollider) && collider.collidesWith(otherCollider)) {
                        // If one of the two items is just a trigger and the collision is not yet registered
                        if (collider.isTrigger || otherCollider.isTrigger) {
                            if (collisionIsRegistered(collider, otherCollider)) return

                            // Fire the enterTriggerCollision callback
                            if (collider.isTrigger && collider.triggerCollisionWith !== undefined) collider.triggerCollisionWith(otherCollider)
                            if (otherCollider.isTrigger && otherCollider.triggerCollisionWith !== undefined) otherCollider.triggerCollisionWith(collider)

                            let cacheString = cacheStringFor(collider, otherCollider)
                            processingCollisions.push(cacheString)
                            frameCollisions.push(cacheString)
                        }
                        else if (collider.isStatic && !otherCollider.isStatic) {
                            if (collisionResolutions[otherCollider.colliderId] === undefined)
                                collisionResolutions[otherCollider.colliderId] = [collider.getCollisionResolutionFor(otherCollider)]
                            else
                                collisionResolutions[otherCollider.colliderId].push(collider.getCollisionResolutionFor(otherCollider))
                        }
                        else if (otherCollider.isStatic && !collider.isStatic) {
                            if (collisionResolutions[collider.colliderId] === undefined)
                                collisionResolutions[collider.colliderId] = [otherCollider.getCollisionResolutionFor(collider)]
                            else
                                collisionResolutions[collider.colliderId].push(otherCollider.getCollisionResolutionFor(collider))
                        }
                    }
                } catch(e) {
                    console.log(collider, otherCollider)
                }
            })
        }

        for(let colliderId of Object.keys(collisionResolutions)) {
            let collider = findCollider(colliderId)
            if (collisionResolutions[colliderId].length === 1) {
                collider.gameObject.transform.x += collisionResolutions[colliderId][0].vec.x
                collider.gameObject.transform.y += collisionResolutions[colliderId][0].vec.y
            } else {
                let highestResolutionPriority =
                    collisionResolutions[colliderId]
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

        // Check if a trigger collision ended
        processingCollisions
            .filter(cacheString => !frameCollisions.includes(cacheString))
            .forEach((cacheString, key) => {
                let collidersIds = cacheString.split('-').filter(removeEmpty => removeEmpty)
                let colliderA = findCollider(collidersIds[0])
                let colliderB = findCollider(collidersIds[1])

                if (colliderA && typeof colliderA.endCollisionWith === 'function') colliderA.endCollisionWith(colliderB)
                if (colliderB && typeof colliderB.endCollisionWith === 'function') colliderB.endCollisionWith(colliderA)
            })
    },

    /**
     *
     * @param {Collider} pItem
     */
    add(pItem) {
        // Add a unique id to the collider to allow layer-collision caching
        let colliderId = getNewColliderId()
        pItem.colliderId = colliderId

        colliders.forEach(collider => {
            return collidersCollisionsCache[cacheStringFor(collider, pItem)] = layersShouldCollide(pItem.layer, collider.layer)
        })

        pItem.events.subscribe(DESTROYED_EVENT, _ => removeCollider(pItem.gameObject.id))
        colliders.push(pItem)
    },

    /**
     * Refresh the collider collision cache for a collider
     * @param collider
     */
    refreshCollisionCache(collider) {
        console.log('refreshCollisionCache')
        Object.keys(collidersCollisionsCache)
              .filter(cacheString => cacheString.includes(`-${collider.colliderId}-`))
              .forEach(key => delete collidersCollisionsCache[key])

        colliders.forEach(otherCollider => {
            if (otherCollider.colliderId !== collider.colliderId)
                collidersCollisionsCache[cacheStringFor(otherCollider, collider)] = layersShouldCollide(collider.layer, otherCollider.layer)
        })
    },

    draw(pCtx) {
        if (debug) colliders.forEach(collider => collider.draw(pCtx))
    }
}