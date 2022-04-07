const items = []

export default {
    update(pDt) {
        items.forEach(item => {
            if (!item.itemToUpdate.isActive) return

            item.itemToUpdate.update(pDt)
        })
    },

    fixedUpdate(pFixedDt) {
        items.forEach(item => {
            if (!item.itemToUpdate.isActive) return

            item.itemToUpdate.fixedUpdate(pFixedDt)
        })
    },

    add(itemToUpdate, id) {
        items.push({id, itemToUpdate})
    },

    remove(pId) {
        let idx = items.findIndex(item => item.id === pId)
        if (idx !== -1) items.splice(idx, 1)
    }
}