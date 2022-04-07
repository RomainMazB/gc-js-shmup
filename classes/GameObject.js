import UniqIdGenerator from "./utils/UniqIdGenerator.js"
import Transform from "./Components/Transform.js"
import updater from "../utils/updater.js"
import PubSub from "./utils/PubSub.js"
import {DESTROYED_EVENT} from "../utils/constants.js"

export default class GameObject {
    static #idGenerator = new UniqIdGenerator()

    id
    #components = []
    transform
    isActive = true
    events = new PubSub()

    constructor(pTransform = new Transform(0, 0)) {
        this.id = GameObject.#idGenerator.newId
        this.transform = pTransform
        updater.add(this, this.id)
        this.events.publish('created', this.id)
    }

    addComponent(pComponent) {
        this.#components.push(pComponent)
        pComponent.linkGameObject(this)

        return pComponent
    }

    getComponent(pComponentClass) {
        return this.#components.find(c => c instanceof pComponentClass)
    }

    update(pDt) {
        if (this.isActive)
            this.#components.forEach(comp => comp.update(pDt))
    }

    fixedUpdate(pFixedDt) {
        this.#components.forEach(comp => comp.fixedUpdate(pFixedDt))
    }

    draw(pCtx) {
        this.#components.forEach(comp => comp.draw(pCtx))
        if (!debug) return

        this.transform.draw(pCtx)
        pCtx.font = '16pt sans-serif'
        pCtx.fillStyle = 'white'
        pCtx.strokeStyle = 'black'
        pCtx.strokeText(this.id, this.transform.x + 5, this.transform.y - 5)
        pCtx.fillText(this.id, this.transform.x + 5, this.transform.y - 5)
    }

    destroy() {
        this.events.publish(DESTROYED_EVENT, this.id)
        this.#components.forEach(comp => comp.destroy())
        updater.remove(this.id)
        this.#components = []
        this.transform = undefined
    }
}