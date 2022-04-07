import Component from "../Component.js"
import PubSub from "../utils/PubSub.js"

export default class Fighter extends Component {
    events = new PubSub()
    life
    maxLife

    constructor(pLife, pMaxLife) {
        super();
        this.life = pLife
        this.maxLife = pMaxLife
    }

    takeDamage(pDamage) {
        this.life -= pDamage
        this.events.publish('takeDamage', this.life)

        if (this.life <= 0) this.#kill()
    }

    #kill() {
        this.events.publish("killed")
        this.gameObject.destroy()
    }
}