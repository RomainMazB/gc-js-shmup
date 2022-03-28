import {Transform} from "../classes/Transform.js";
import RectangleBoxCollider from "../classes/RectangleBoxCollider.js";
import {ALL, HERO} from "../utils/constants.js";

const camera = {
    maxX: 0,
    maxY: 0,
    width: 0,
    height: 0,
    tileWidth: 0,
    tileHeight: 0
}

export const cameraTransform = new Transform(0, 0)
export const cameraCollider = new RectangleBoxCollider(cameraTransform, 800, 600)
cameraCollider.layer = ALL

export default {
    tileToScreen (x, y) {
        return { x: x * camera.tileWidth, y: y * camera.tileHeight }
    },

    worldToScreen (x, y) {
        return { x: x - cameraTransform.x, y: y - cameraTransform.y }
    },

    screenToWorld(pX, pY) {
        return { x: pX + cameraTransform.x, y: pY + cameraTransform.y }
    },

    setCameraSize(pWidth, pHeight) {
        camera.width = pWidth
        camera.height = pHeight
        cameraCollider.width = pWidth
        cameraCollider.height = pHeight - 128
        cameraCollider._offsetY = 32

        if (camera.maxX === 0 && camera.maxY === 0) {
            camera.maxX = pWidth
            camera.maxY = pHeight
        }
    },

     setTileSize(tileWidth, tileHeight) {
        camera.tileWidth = tileWidth
        camera.tileHeight = tileHeight
    },

    // Return the visible quads in the camera expressed in tilemap coordinates + a margin
    getVisibleTilesRange(margin = 1) {
        const viewPortX = Math.ceil(cameraTransform.x / camera.tileWidth)
        const viewPortY = Math.ceil(cameraTransform.y / camera.tileHeight)
        const x1 = Math.max(0, viewPortX - margin)
        const y1 = Math.max(0, viewPortY - margin)
        const x2 = viewPortX + Math.ceil(camera.width / camera.tileWidth) + margin
        const y2 = viewPortY + Math.ceil(camera.height / camera.tileHeight) + margin

        return { x1, y1, x2, y2 }
    },

    // Place the camera at a precise x and y position and make sure it doesn't overflow the camera limits
    setPosition(x, y) {
        cameraTransform.x = clamp(x, 0, camera.maxX - camera.width)
        cameraTransform.y = clamp(y, 0, camera.maxY - camera.height)
    },

    // Set the max x and y position of the bottom-right corner of the camera view
    setLimits(maxX, maxY) {
        camera.maxX = maxX
        camera.maxY = maxY
    },

    translate(pCtx) {
        pCtx.save()
        pCtx.translate(-cameraTransform.x, -cameraTransform.y)
    },

    reset(pCtx) {
        pCtx.restore()
    }
}