window.debug = false

class SceneChanger {
    #startingScene
    #currentScene
    #gameCtx

    constructor(pStartingScene) {
        this.#startingScene = pStartingScene
    }

    load(pCtx) {
        this.#gameCtx = pCtx
        this.selectScene(this.#startingScene)
    }

    selectScene(newScene) {
        if (this.#currentScene !== undefined) {
            this.#currentScene.destroy()
        }

        newScene.setSceneChanger(this)
        newScene.load(this.#gameCtx)

        this.#currentScene = newScene
    }

    update(pDt) {
        this.#currentScene.update(pDt)
    }

    fixedUpdate(pDt) {
        this.#currentScene.fixedUpdate(pDt)
    }

    draw(pCtx) {
        this.#currentScene.draw(pCtx)
    }
}

const game = new SceneChanger(new Loading(new Splash))