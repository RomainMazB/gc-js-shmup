import TilesetLoader from "../utils/tileset-loader.js"
import camera from "./camera.js"
import Transform from "../classes/Components/Transform.js"
import RectangleCollider from "../classes/Components/RectangleCollider.js"
import Sprite from "../classes/Components/Sprite.js"
import {ENEMY, MAP} from "../utils/constants.js"
import WaveManager from "../classes/WaveManager.js"
import EnemiesWave from "../classes/EnemiesWave.js"
import Enemy from "../classes/Enemy.js"
import RigidBody from "../classes/Components/RigidBody.js"

export const level = {}
const levelBasePath = '../../assets/levels/'

const XYToTiled = (x, y) => y * level.data.width + x
const tiledToXY = (n) => ({ x: (n % level.data.width) * level.data.tilewidth, y: Math.floor(n / level.data.width) * level.data.tileheight})

// Return a tiled object property by its name
function getObjectProperty(obj, prop) {
    let property = obj.properties.find(p => p.name === prop)
    return property === undefined ? undefined : property.value
}

let mapTiles = []

let i = 1
export default {
    load (levelN) {
        return new Promise(async (resolve, reject) => {
            try {
                // Load the level file
                let levelFileDataImport = await import(levelBasePath + 'level' + levelN + '.js')
                level.data = levelFileDataImport.default

                // Create an empty tileset and fill it going through each tilesets' items of the level
                level.tilesFromTileSet = {}
                for (let tileset of level.data.tilesets) {
                    // Retrieve only the tileset filename without extension and path. Ex: ../assets/images/tileset-image.png becomes `tileset-image`
                    let tilesetName = tileset.source.split("/").pop().split(".").shift()

                    level.tilesFromTileSet = {...level.tilesFromTileSet, ...await TilesetLoader(tilesetName, tileset.firstgid)}
                }

                // Fill the obstacles layer
                for (let i = 0; i < level.data.layers[0].data.length; i++) {
                    let textureId = level.data.layers[0].data[i]

                    let texture = level.tilesFromTileSet[textureId]
                    if (texture === undefined) continue

                    let tileCoords = tiledToXY(i)
                    let tileComponents = {}
                    tileComponents.transform = new Transform(tileCoords.x, tileCoords.y)
                    tileComponents.sprite = new Sprite(texture.image, texture.coords.x, texture.coords.y, texture.coords.width, texture.coords.height)

                    if (texture.properties !== undefined) {
                        if (texture.properties.walkable === false) {
                            tileComponents.collider = new RectangleCollider(texture.coords.width, texture.coords.height)
                            tileComponents.collider.setLayer(MAP)
                            tileComponents.collider.isStatic = true
                        }
                    }

                    mapTiles.push(tileComponents)
                }

                // Search the ennemies layers group
                let enemiesLayerGroup = level.data.layers.find(layer => layer.type === 'group' && layer.name === 'Ennemies')
                if (enemiesLayerGroup !== undefined) {
                    enemiesLayerGroup.layers.forEach(enemiesWaveLayer => {
                        let delay = getObjectProperty(enemiesWaveLayer, 'delay'),
                            x = getObjectProperty(enemiesWaveLayer, 'x'),
                            appearingSpeed = getObjectProperty(enemiesWaveLayer, 'appearingSpeed')
                        let enemiesWave = new EnemiesWave(delay, x, appearingSpeed)

                        // Get the lowest x from the wave to align enemies with each others
                        let initialValue = enemiesWaveLayer.objects[0].x
                        let minX = enemiesWaveLayer.objects.reduce((prev, cur) => cur.x < prev ? cur.x : prev, initialValue)
                        enemiesWaveLayer.objects.forEach(enemyOnLayer => {
                            let tilesetObject = level.tilesFromTileSet[enemyOnLayer.gid]
                            let sprite = new Sprite(tilesetObject.image, tilesetObject.coords.x, tilesetObject.coords.y, tilesetObject.coords.width, tilesetObject.coords.height, -tilesetObject.coords.width / 2, -tilesetObject.coords.height / 2)
                            let collider = new RectangleCollider(tilesetObject.coords.width, tilesetObject.coords.height, -tilesetObject.coords.width / 2, -tilesetObject.coords.height / 2)

                            collider.setLayer(ENEMY)
                            collider.isActive = false

                            let transform = new Transform(480 + enemyOnLayer.y + tilesetObject.coords.width / 2 - minX, 0)
                            let enemy = new Enemy(transform, sprite)
                            enemy.isActive = false
                            enemiesWave.addEnemy(enemy)
                        })
                        WaveManager.addWave(enemiesWave)
                    })
                }

                camera.setLimits(level.data.width * level.data.tilewidth, level.data.height * level.data.tileheight)
                camera.setTileSize(level.data.tilewidth, level.data.tileheight)
                camera.setPosition(0, 0)

                resolve()
            } catch (e) {
                reject(e)
            }
        })
    },

    update(dt) {
        // Make enemies start moving
    },

    draw (pCtx) {
        mapTiles.forEach(tile => tile.sprite.draw(pCtx))
        // let visibleTilesQuad = camera.getVisibleTilesRange()
        //
        // for (let x = visibleTilesQuad.x1; x <= visibleTilesQuad.x2; x++) {
        //     for (let y = visibleTilesQuad.y1; y <= visibleTilesQuad.y2; y++) {
        //         let textureId = level.data.layers[0].data[XYToTiled(x, y)]
        //
        //         let texture = level.tilesFromTileSet[textureId]
        //         if (texture === undefined) continue
        //
        //         let worldCoords = camera.tileToScreen(x, y)
        //
        //         pCtx.drawImage(texture.image, texture.coords.x, texture.coords.y, texture.coords.width, texture.coords.height, worldCoords.x, worldCoords.y, texture.coords.width, texture.coords.height)
        //     }
        // }
    }
}