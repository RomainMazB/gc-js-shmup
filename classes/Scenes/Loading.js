class Loading extends SceneBase {
    #assetsLoader = new AssetsLoader
    #error
    #nextScene

    get #currentLoadingCategoryText() {
        return this.#assetsLoader.currentAssetType ? `Loading assets: ${this.#assetsLoader.loadedAssetsCount} / ${this.#assetsLoader.totalAssetsCount}` : 'Loading...'
    }

    get #ratio () { return this.#assetsLoader.loadedAssetsCount / this.#assetsLoader.totalAssetsCount }

    constructor(pNextScene) {
        super()
        this.#nextScene = pNextScene
        this.#assetsLoader.events.subscribe('loaded', _ => {
            this.#nextScene.setAssetsAtlas(this.#assetsLoader.atlas)
            this.sceneChanger.selectScene(pNextScene)
        })

        this.#assetsLoader.events.subscribe('assetLoadingError', e => this.#error = e)
    }

    load() {
        this.#nextScene.neededAssets.forEach(asset => {
            this.#assetsLoader.add(asset)
        })

        this.#assetsLoader.startLoading()
    }

    draw(pCtx) {
        if (this.#error) {
            pCtx.fillText(this.#error, 100, 170)
        }

        pCtx.fillRect(100, 100, 300 * this.#ratio, 50)
        pCtx.strokeRect(100, 100, 300, 50)
        pCtx.fillText(this.#currentLoadingCategoryText, 100, 170)
    }
}