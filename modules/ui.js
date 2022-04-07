import Transform from "../classes/Components/Transform.js"
import HeartLifeBar from "../classes/HeartLifeBar.js"
import {HeroGameObject} from "./hero.js"
import Fighter from "../classes/Components/Fighter.js"

const menuHeight = 64

let lifeBarTransform = new Transform(10, 500)
let heroLifeBar
const heroFighterComp = HeroGameObject.getComponent(Fighter)

export default {
    update(pDt) {

    },

    load(pCtx) {
        heroLifeBar = new HeartLifeBar(pCtx, lifeBarTransform, heroFighterComp.maxLife)
        let subscription = heroFighterComp.events.subscribe('takeDamage', heroLife => heroLifeBar.current = heroLife)
    },

    draw(pCtx) {
        heroLifeBar.draw(pCtx)
    }
}