import {ALL, DEFAULT} from "../constants.js";

export default class Collider {
    _transform
    isTrigger
    layer

    constructor(pTransform, pLayer = DEFAULT, pIsTrigger = false) {
        this._transform = pTransform
        this.isTrigger = pIsTrigger
        this.layer = pLayer
    }

    collidesWith(otherCollider) {
        return this.isOnTheSameLayer(otherCollider) && this._transform.x === otherCollider.x && this._transform.y === otherCollider.y
    }

    resolveCollisionWith(otherCollider) {
        throw new Error('You have to implement the method resolveCollisionWith!');
    }

    isOnTheSameLayer(otherCollider) {
        return this.layer === ALL || otherCollider.layer === ALL || otherCollider.layer === this.layer
    }

    get x() {
        return this._transform.drawnX
    }

    get y() {
        return this._transform.drawnY
    }
}