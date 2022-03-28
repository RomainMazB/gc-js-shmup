const colliders = []

export default {
    update(pDt) {
        colliders.forEach(function (collider, index, allColliders) {
            if (index < allColliders.length - 1)
                allColliders.slice(index).forEach(otherCollider => {
                    if (collider.collidesWith(otherCollider)) collider.resolveCollisionWith(otherCollider)
                })
        })
    },

    add(pItem) {
        colliders.push(pItem)
    }
}