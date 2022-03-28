import TilesetLoader from "../utils/tileset-loader.js";
import camera from "./camera.js"
import UI from "./ui.js"

const level = {}
const levelBasePath = '../../assets/levels/'

const XYToTiled = (x, y) => y * level.data.width + x
const tiledToXY = (n) => ({ x: n / level.data })

let i = 1
export default {
    load (levelN) {
        return new Promise(async (resolve, reject) => {
            try {
                // Load the level file
                const levelFileDataImport = await import(levelBasePath + 'level' + levelN + '.js')
                level.data = levelFileDataImport.default

                // Create an empty tileset and fill it going through each tilesets' items of the level
                level.tilesFromTileSet = {}
                for (const tileset of level.data.tilesets) {
                    // Retrieve only the tileset filename without extension and path. Ex: ../assets/images/tileset-image.png becomes `tileset-image`
                    const tilesetName = tileset.source.split("/").pop().split(".").shift()

                    level.tilesFromTileSet = {...level.tilesFromTileSet, ...await TilesetLoader(tilesetName, tileset.firstgid) }
                }

                camera.setLimits(level.data.width * level.data.tilewidth, level.data.height * level.data.tileheight + UI.getMenuHeight())
                camera.setTileSize(level.data.tilewidth, level.data.tileheight)
                camera.setPosition(0, 0)

                resolve()
            } catch (e) {
                reject(e)
            }
        })
    },

    update(dt) {
    },

    draw (pCtx) {
        let visibleTilesQuad = camera.getVisibleTilesRange()

        for (let x = visibleTilesQuad.x1; x <= visibleTilesQuad.x2; x++) {
            for (let y = visibleTilesQuad.y1; y <= visibleTilesQuad.y2; y++) {
                let textureId = level.data.layers[0].data[XYToTiled(x, y)]

                let texture = level.tilesFromTileSet[textureId]
                if (texture === undefined) continue

                let worldCoords = camera.tileToScreen(x, y)

                pCtx.drawImage(texture.image, texture.coords.x, texture.coords.y, texture.coords.width, texture.coords.height, worldCoords.x, worldCoords.y, texture.coords.width, texture.coords.height);
            }
        }
    }
}