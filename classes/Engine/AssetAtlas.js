class AssetAtlas {
    #assets = {}

    /**
     * Add an asset to the atlas
     * @param url
     * @param asset
     */
    add(url, asset) {
        this.#assets[url] = asset
    }

    /**
     * Return an asset from the atlas, using ObjectPool if necessary
     * @param url
     * @returns {ObjectPoolMember|*}
     */
    get(url) {
        if (this.#assets[url] === undefined)
            throw new Error("Attempt to access an un-loaded assets: "+ url)
        else if(this.#assets[url] instanceof ObjectPool)
            return this.#assets[url].getObject()

        return this.#assets[url]
    }
}