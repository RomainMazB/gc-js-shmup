const tilesetsDir = '../assets/images/'

export default function (tilesetName, firstgid) {
    return new Promise(async resolve => {
        // Import the tileset config file
        const tilesetFilename = tilesetName + '.js'
        const tilesetDataImport = await import(tilesetsDir + tilesetFilename)
        const tilesetData = tilesetDataImport.default

        // Load the image
        const imagePath = tilesetsDir + tilesetData.image
        const tilesetImage = new Image()
        tilesetImage.src = imagePath

        const tiles = {}
        // Loop through all the tileset image tiles to create a unique "quad" for each item
        for (let i = 0; i < tilesetData.tilecount; i++) {
            let x = (i + tilesetData.columns) % tilesetData.columns
            let y = Math.floor(i / tilesetData.columns)
            let tileId = firstgid + i

            let newTile = {
                image: tilesetImage,
                coords: {
                    x: x * tilesetData.tilewidth,
                    y: y * tilesetData.tileheight,
                    width: tilesetData.tilewidth,
                    height: tilesetData.tileheight
                }
            }

            // Read any eventual tile properties
            let tileProperties = tilesetData.tiles.find(tile => tile.id === i)
            if (tileProperties !== undefined) {
                newTile.properties = {}
                tileProperties.properties.forEach(function (property) {
                    newTile.properties[property.name] = property.value
                })
            }

            tiles[tileId] = newTile
        }

        resolve(tiles)
    })
}