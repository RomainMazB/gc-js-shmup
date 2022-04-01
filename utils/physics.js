import {ALL, CAMERA, ENEMY, ENEMY_PROJECTILES, HERO, HERO_PROJECTILES, MAP} from "./constants.js";
import {Vec2} from "../classes/Vec2.js";

let collidingLayers = {
    [HERO]: [CAMERA, MAP, ENEMY_PROJECTILES],
    [ENEMY]: [CAMERA, HERO_PROJECTILES]
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
const layersShouldCollide = (layerA, layerB) => !(layerA === MAP && layerB === MAP) && ( // TODO: Find a way to exclude map vs map collisions because two sibling tiles are forcefully colliding
    layerA === layerB || layerA === ALL || layerB === ALL ||
    (collidingLayers[layerA] !== undefined && collidingLayers[layerA].findIndex(l => l !== layerB) !== -1) ||
    (collidingLayers[layerB] !== undefined && collidingLayers[layerB].findIndex(l => l !== layerA) !== -1))

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

const collisionIsRegistered = (colliderA, colliderB) => collidersCollisionsCache[cacheStringFor(colliderA, colliderB)] !== undefined

const findCollider = colliderId => colliders[Object.keys(colliders).find(cId => cId === colliderId)]

export default {
    update(pDt) {
        let frameCollisions = []
        let collisionResolutions = {}
        let a = []
        // Loop through all the colliders
        for (let i = 0; i < colliders.length; i++) {
            let collider = colliders[i]
            // Check for collision between this collider and the following items in the colliders list
            colliders.slice(i+1).forEach(otherCollider => {
                if (itemsShouldCollide(collider, otherCollider) && collider.collidesWith(otherCollider)) {
                    // If one of the two items is just a trigger and the collision is not yet registered
                    if ((collider.isTrigger || otherCollider.isTrigger) && !collisionIsRegistered(collider, otherCollider)) {
                        // Fire the enterTriggerCollision callback
                        if (collider.isTrigger && collider.triggerCollisionWith !== undefined) collider.triggerCollisionWith(otherCollider)
                        if (otherCollider.isTrigger && otherCollider.triggerCollisionWith !== undefined) otherCollider.triggerCollisionWith(collider)

                        let cacheString = cacheStringFor(collider, otherCollider)
                        processingCollisions.push(cacheString)
                        frameCollisions.push(cacheString)
                    }
                    else if (collider.isStatic && !otherCollider.isStatic) {
                        console.log("add: "+ otherCollider.colliderId)
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
            })
        }

        for(colliderId of Object.keys(collisionResolutions)) {
            let collider = findCollider(colliderId)
            if (collisionResolutions[colliderId].length === 1) {
                collider._transform.x += collisionResolutions[colliderId][0].vec.x
                collider._transform.y += collisionResolutions[colliderId][0].vec.y
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

                collider._transform.x += mergedResolutionX
                collider._transform.y += mergedResolutionY
            }
        }

        // Check if a trigger collision ended
        processingCollisions
            .filter(cacheString => !frameCollisions.contains(cacheString))
            .forEach((cacheString, key) => {
                let collidersIds = cacheString.split('-').filter(removeEmpty => removeEmpty)
                let colliderA = findCollider(collidersIds[0])
                let colliderB = findCollider(collidersIds[1])

                if (colliderA && typeof colliderA.endCollisionWith === 'function') colliderA.endCollisionWith(colliderB)
                if (colliderB && typeof colliderB.endCollisionWith === 'function') colliderB.endCollisionWith(colliderA)
            })
    },

    add(pItem) {
        // Add a unique id to the collider to allow layer-collision caching
        pItem.colliderId = getNewColliderId()

        colliders.forEach(collider => {
            return collidersCollisionsCache[cacheStringFor(collider, pItem)] = layersShouldCollide(pItem.layer, collider.layer)
        })
        colliders.push(pItem)
    },

    /**
     * Refresh the collider collision cache for a collider
     * @param collider
     */
    refreshCollisionCache(collider) {
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