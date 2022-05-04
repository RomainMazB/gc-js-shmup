class AssetsLoader {
    events = new PubSub()
    #loadedAssets = []
    #assetsToLoad = []
    #loadedAssetsCount = 0
    #currentAssetType
    #loadedACurrentAssetType = 0
    #totalAssetsCount = 0
    #atlas = new AssetAtlas

    get totalAssetsCount() { return this.#totalAssetsCount }
    get loadedAssetsCount() { return this.#loadedAssetsCount }
    get currentAssetTypeCount() { return this.#currentAssetType ? this.#assetsToLoad[this.#currentAssetType].length : undefined }
    get currentAssetTypeLoaded() { return this.#loadedACurrentAssetType }
    get currentAssetType() { return this.#currentAssetType }
    get atlas() { return this.#atlas }

    getTotalAssetTypeCount(assetType) {
        return this.#assetsToLoad[assetType] ? this.#assetsToLoad[assetType].length : 0
    }

    getLoadedAssetTypeCount(assetType) {
        return this.#assetsToLoad[assetType] ? this.#assetsToLoad[assetType].length : 0
    }

    /**
     * Add an url to the assets list to load
     * @param url
     */
    add(url) {
        let type = AssetsLoader.#guessTypeFromExtension(url.split('.').pop())

        if (this.#assetsToLoad[type] === undefined)
            this.#assetsToLoad[type] = []

        this.#assetsToLoad[type].push(url)
        this.#totalAssetsCount++
    }

    /**
     * Start the loading process
     */
    startLoading() {
        Object.keys(this.#assetsToLoad).forEach(assetType => {
            this.events.publish('startLoadingType', {assetType, total: this.#assetsToLoad.length})
            this.#loadedACurrentAssetType = 0
            this.#currentAssetType = assetType

            this.#assetsToLoad[assetType].forEach(async url => {
                this.events.publish('startLoadingAsset', {url})

                // On load callback
                let onLoadCB = evt => {
                    this.#loadedAssets[url] = evt.target

                    // For audio clips where durationTime < 10, create au ObjectPool with 10 audios ready-to-use
                    if (assetType === 'audio' && evt.target.duration < 10) {
                        const creatorFunc = _ => new Audio(url)
                        const resetFunc = audio => audio !== undefined ? audio.currentTime = 0 : undefined

                        this.#atlas.add(url, new ObjectPool(creatorFunc, resetFunc, 10))
                    } else
                        this.#atlas.add(url, evt.target)

                    this.#loadedAssetsCount++
                    this.#loadedACurrentAssetType++
                    this.events.publish('assetLoaded', {url})

                    if (this.totalAssetsCount === this.loadedAssetsCount) this.events.publish('loaded')
                }

                // On error callback, just publish the assetLoadingError events
                let onErrorCB = error => this.events.publish('assetLoadingError', {url, error})

                // If the asset type is a json, use the fetch API to load it
                if (assetType === 'json') {
                    await fetch(url)
                        .then(response => {
                            return response.json()
                        })
                        .then(json => onLoadCB({target: json}))
                        .catch(onErrorCB)
                }
                // Else, create an Image or Audio HTML Element
                else {
                    let asset
                    switch (assetType) {
                        case 'image':
                            asset = new Image
                            asset.onload = onLoadCB
                            break

                        case 'audio':
                            asset = new Audio
                            asset.oncanplaythrough = onLoadCB
                            break
                    }

                    asset.onerror = onErrorCB
                    asset.src = url
                }
            })
        })
    }

    /**
     * Helper to get the type of an asset depending on its extension
     * @param extension
     * @returns {string}
     */
    static #guessTypeFromExtension(extension) {
        if (['jpg', 'jpeg', 'png'].includes(extension)) {
            return 'image'
        } else if (['mp3', 'wav'].includes(extension)) {
            return 'audio'
        } else if (extension === 'json') {
            return 'json'
        } else
            throw new Error('Unsupported asset extension: '+ extension)
    }
}