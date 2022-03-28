import { Vector2 } from "./Vector2.js";
import Collider from "./Collider.js";
import {DEFAULT} from "../constants.js";

export default class CircleCollider extends Collider {
    size

    constructor(pTransform, pLayer = DEFAULT, pSize, pIsTrigger = false) {
        super(pTransform, pLayer, pIsTrigger);
        this.size = pSize
    }

    collidesWith(otherCollider) {
        return this._transform.x === otherCollider.x && this._transform.y === otherCollider.y
    }

    resolveCollisionWith(otherCollider) {

    }

    /**
     * Return whether a point is inside the circle or not
     * @param x
     * @param y
     * @returns {boolean}
     */
    pointIsInside(x, y) {
        return Math.sqrt((x - this.x)^2 + (y - this.x)^2) <= this.size
    }

    get width() {
        return this.size * 2
    }

    get height() {
        return this.size * 2
    }

    get x() {
        return this._transform.x
    }

    get y() {
        return this._transform.y
    }
}