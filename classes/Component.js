import PubSub from "./utils/PubSub.js"
import {DESTROYED_EVENT} from "../utils/constants.js"

export default class Component {
    _gameObject
    events = new PubSub()

    get gameObject() { return this._gameObject }

    linkGameObject (pGameObject) {
        this._gameObject = pGameObject
    }

    destroy() {
        this.events.publish(DESTROYED_EVENT)
    }

    update(pDt) {}

    fixedUpdate(pFixedDt) {}

    draw(pCtx) {}
}