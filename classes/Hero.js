import GameObject from "./GameObject.js"
import RigidBody from "./Components/RigidBody.js"
import CircleCollider from "./Components/CircleCollider.js"
import {HERO} from "../utils/constants.js"
import Fighter from "./Components/Fighter.js"

export default class Hero extends GameObject {
    constructor(pTransform) {
        super(pTransform);
        this.addComponent(new RigidBody())
        this.addComponent(new Fighter(20, 20))
        let collider = this.addComponent(new CircleCollider(60))
        collider.setLayer(HERO)
    }
}