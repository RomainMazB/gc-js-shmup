class SceneBase {
    sceneChanger
    _assetAtlas
    _keyboardEvents = []

    get neededAssets() { return [] }

    setSceneChanger(pSceneChanger) {
        this.sceneChanger = pSceneChanger
    }

    load() {}

    update(pDt) {}

    fixedUpdate(pDt) {}

    draw(pCtx) {}

    // Destroy all the keyboard event previously registered
    destroy() {
        this._keyboardEvents.forEach(e => e.removeEvent())
    }

    setAssetsAtlas(pAssetAtlas) {
        this._assetAtlas = pAssetAtlas
    }
}