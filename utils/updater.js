const items = []

export default {
    update(pDt) {
        for (let i in items) {
            items[i].update(pDt)
        }
    },

    add(pItem) {
        items.push(pItem)
    }
}