class Animator extends ComponentBase {
    #src
    #width
    #height
    #offsetX
    #offsetY
    #states = []
    #activeState
    get currentStateSprite () { return this.#states[this.#activeState].sprite }

    constructor(pSrc, pWidth, pHeight, pOffsetX = 0, pOffsetY = 0) {
        super()
        this.#src = pSrc
        this.#width = pWidth
        this.#height = pHeight
        this.#offsetX = pOffsetX
        this.#offsetY = pOffsetY
    }

    linkGameObject(pGameObject) {
        super.linkGameObject(pGameObject)
        this.#states.forEach(state => state.sprite.linkGameObject(pGameObject))
    }

    addStaticState(pStateName, pConditionCallback, pX, pY) {
        let sprite = new Sprite(this.#src, pX, pY, this.#width, this.#height, this.#offsetX, this.#offsetY)
        this.registerState(pStateName, pConditionCallback, sprite)

        return sprite
    }

    addAnimatedState(pStateName, pConditionCallback, pX, pY, pNbFrames, pSpeed, pMargin, pIsHorizontal = true, pIsRepeating = true) {
        let sprite = new AnimatedSprite(this.#src, pX, pY, pNbFrames, this.#width, this.#height, pSpeed, pMargin, pIsHorizontal, pIsRepeating, this.#offsetX, this.#offsetY)
        this.registerState(pStateName, pConditionCallback, sprite)

        return sprite
    }

    setActiveState(pStateName) {
        let stateIndex = this.#states.findIndex(state => state.conditionCallback())

        if (stateIndex === -1) throw Error(`The state ${pStateName} is not registered.`)

        this.#switchState(stateIndex)
    }

    /**
     * Add a possible state to the Animator
     * @param pStateName
     * @param pConditionCallback
     * @param pSprite
     */
    registerState(pStateName, pConditionCallback, pSprite) {
        if (pConditionCallback === DEFAULT) pConditionCallback = _ => true

        this.#states.unshift({
            name: pStateName,
            conditionCallback: pConditionCallback,
            sprite: pSprite
        })

        /** If it's the first registered state of the Animator
         * Add it as the activeState and set it as default
         */
        if (this.#activeState === undefined) this.#activeState = 0
    }

    update(pDt) {
        if (this.#activeState === undefined) return

        let stateIndex = this.#states.findIndex(state => state.conditionCallback())

        if (stateIndex !== this.#activeState)
            this.#switchState(stateIndex === -1 ? 0 : stateIndex)

        if (this.currentStateSprite instanceof AnimatedSprite) this.currentStateSprite.update(pDt)
    }

    draw(pCtx) {
        this.currentStateSprite.draw(pCtx)
    }

    #switchState(pStateIndex) {
        if (this.currentStateSprite instanceof AnimatedSprite) this.currentStateSprite.restart()

        this.#activeState = pStateIndex
    }
}