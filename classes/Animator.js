import Sprite from "./Sprite.js";
import AnimatedSprite from "./AnimatedSprite.js";
import updater from "../updater.js";

export default class Animator {
    #id
    get id() { return this.#id }
    #src
    #width
    #height
    #states = {}
    #activeState

    constructor(pId, pSrc, pWidth, pHeight) {
        this.#id = pId
        this.#src = pSrc
        this.#width = pWidth
        this.#height = pHeight
        updater.add(this)
    }

    addStaticState(pStateName, pX, pY) {
        this.registerState(pStateName, new Sprite(this.#src, pX, pY, this.#width, this.#height))
    }

    addAnimatedState(pStateName, pX, pY, pNbFrames, pSpeed, pMargin, pIsHorizontal = true) {
        this.registerState(pStateName, new AnimatedSprite(this.#src, pX, pY, pNbFrames, this.#width, this.#height, pSpeed, pMargin, pIsHorizontal = true))
    }

    setActiveState(pStateName) {
        if (this.#states[pStateName] === undefined) throw Error(`The state ${pStateName} is not registered.`)

        this.#activeState = pStateName
    }

    registerState(pStateName, pSprite) {
        this.#states[pStateName] = pSprite

        if (this.#activeState === undefined) this.#activeState = pStateName
    }

    update(pDt) {
        if (this.#activeState === undefined) return

        if (this.#states[this.#activeState] instanceof AnimatedSprite) this.#states[this.#activeState].tick(pDt)
    }

    draw(pCtx, pX, pY, pWidth, pHeight) {
        this.#states[this.#activeState].draw(pCtx, pX, pY, pWidth, pHeight)
    }
}