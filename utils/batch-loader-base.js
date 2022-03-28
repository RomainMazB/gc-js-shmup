export default class BatchLoaderBase {
    #pathsLst = []
    #loadedItemsCount = 0
    #itemsLst = []

    add(pPathItem) {
        this.#pathsLst.push(pPathItem)
    }

    getTotalItems() {
        return this.#pathsLst.length
    }

    getTotalItemsLoaded() {
        return this.#loadedItemsCount
    }

    getListItems() {
        return this.#itemsLst
    }

    getItem(pPath) {
        return this.#itemsLst[pPath];
    }
}
