import {DEFAULT} from "../constants.js";
import Collider from "./Collider.js";

export default class RectangleCollider extends Collider {
    width
    height

    constructor(pTransform, pLayer = DEFAULT, pWidth, pHeight, pIsTrigger = false) {
        super(pTransform, pLayer, pIsTrigger);
        this.width = pWidth
        this.height = pHeight
    }

    /**
     * @in
     * @param otherCollider
     * @returns {boolean|*}
     */
    collidesWith(otherCollider) {
        return this.isOnTheSameLayer(otherCollider) && (
                   otherCollider.pointIsInside(this._transform.x, this._transform.y) ||
                   otherCollider.pointIsInside(this._transform.x + this.width, this._transform.y) ||
                   otherCollider.pointIsInside(this._transform.x, this._transform.y + this.height) ||
                   otherCollider.pointIsInside(this._transform.x + this.width, this._transform.y + this.height)
        )
    }

    resolveCollisionWith(otherCollider) {

    }

    /**
     * Return whether a point is inside the rectangle or not
     * @param x
     * @param y
     * @returns {boolean}
     */
    pointIsInside(x, y) {
        return x >= this._transform.x &&
               x <= this._transform.x + this.width &&
               y >= this._transform.y &&
               y <= this._transform.y + this.height
    }
}