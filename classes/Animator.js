import Sprite from "./Sprite.js";
import AnimatedSprite from "./AnimatedSprite.js";
import updater from "../utils/updater.js";
import {DEFAULT} from "../utils/constants.js";

export default class Animator {
    #transform
    #src
    #width
    #height
    #offsetX
    #offsetY
    #states = []
    #activeState

    constructor(pTransform, pSrc, pWidth, pHeight, pOffsetX = 0, pOffsetY = 0) {
        this.#transform = pTransform
        this.#src = pSrc
        this.#width = pWidth
        this.#height = pHeight
        this.#offsetX = pOffsetX
        this.#offsetY = pOffsetY
        updater.add(this)
    }

    addStaticState(pStateName, pConditionCallback, pX, pY) {
        this.registerState(pStateName, pConditionCallback, new Sprite(this.#transform, this.#src, pX, pY, this.#width, this.#height, this.#offsetX, this.#offsetY))
    }

    addAnimatedState(pStateName, pConditionCallback, pX, pY, pNbFrames, pSpeed, pMargin, pIsHorizontal = true) {
        this.registerState(pStateName, pConditionCallback, new AnimatedSprite(this.#transform, this.#src, pX, pY, pNbFrames, this.#width, this.#height, pSpeed, pMargin, pIsHorizontal = true, this.#offsetX, this.#offsetY))
    }

    setActiveState(pStateName) {
        let stateIndex = this.#states.findIndex(state => state.conditionCallback())

        if (stateIndex === -1) throw Error(`The state ${pStateName} is not registered.`)

        this.#activeState = stateIndex
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

        if (stateIndex === -1) stateIndex = 0
        this.#activeState = stateIndex

        if (this.#states[this.#activeState].sprite instanceof AnimatedSprite) this.#states[this.#activeState].sprite.tick(pDt)
    }

    draw(pCtx) {
        this.#states[this.#activeState].sprite.draw(pCtx)
    }
}