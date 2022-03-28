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

            tiles[firstgid + i] = {
                image: tilesetImage,
                coords: {
                    x: x * tilesetData.tilewidth,
                    y: y * tilesetData.tileheight,
                    width: tilesetData.tilewidth,
                    height: tilesetData.tileheight
                }
            }
        }

        resolve(tiles)
    })
}