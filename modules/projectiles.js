let lstProjectiles = []

function removeProjectile(pProjectile) {
    let idx = lstProjectiles.findIndex(p => p.id === pProjectile.id)
    console.log(pProjectile.id, idx)
    if (idx === -1) return

    lstProjectiles.splice(idx, 1)
}

export default {
    load() {

    },

    draw(pCtx) {
        lstProjectiles.forEach(projectile => projectile.draw(pCtx))
    },

    add(pProjectile) {
        pProjectile.events.subscribe('destroyed', _ => removeProjectile(pProjectile))
        lstProjectiles.push(pProjectile)
    }
}