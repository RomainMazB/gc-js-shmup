class Splash extends SceneBase {
    #selectedLevel = 1
    #levels = [1, 2]
    neededAssets = [
        './assets/audios/clips/twig-breaking.wav',
        './assets/audios/clips/bullet-shots/fire-arrow.wav'
    ]

    load() {
        this._keyboardEvents.push(keyDown('ArrowLeft', _ => this.moveSelection(LEFT)))
        this._keyboardEvents.push(keyDown('ArrowRight', _ => this.moveSelection(RIGHT)))
        this._keyboardEvents.push(keyDown('Enter', _ => this.goToSelectedLevelScene(this.#selectedLevel)))
    }

    draw(pCtx) {
        pCtx.save()
        pCtx.font = '50px sans-serif'
        pCtx.fillText('Choisissez votre niveau :', 50, 50)
        pCtx.translate(100, 120)

        this.#levels.forEach(level => {
            pCtx.strokeStyle = level === this.#selectedLevel ? 'red' : 'black'
            pCtx.fillStyle = level === this.#selectedLevel ? 'red' : 'black'
            pCtx.strokeRect((level-1) * 60, 0, 50, 50)
            pCtx.fillText(level, (level-1) * 60 + 12, 40)
        })

        pCtx.restore()
    }

    moveSelection(direction) {
        if (direction === LEFT) {
            if (this.#selectedLevel === 1) this.#selectedLevel = this.#levels[this.#levels.length-1]
            else this.#selectedLevel--
        } else {
            if (this.#selectedLevel === this.#levels.length) this.#selectedLevel = 1
            else this.#selectedLevel++
        }
        this._assetAtlas.get('./assets/audios/clips/twig-breaking.wav').data.play()
    }

    goToSelectedLevelScene() {
        this._assetAtlas.get('./assets/audios/clips/bullet-shots/fire-arrow.wav').data.play()
        let levelScene = new Game(this.#selectedLevel)
        this.sceneChanger.selectScene(new Loading(levelScene))
    }
}