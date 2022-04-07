let gameObjects = []

export default {
    destroy(pId) {
        let idx = gameObjects.findIndex(go => go.id === pId)
        if (idx === -1) return
        gameObjects[idx].destroy()
        gameObjects.splice(idx, 1)
    },

    add(pGameObject) {
        gameObjects.push(pGameObject)
    }
}