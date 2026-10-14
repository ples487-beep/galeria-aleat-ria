let http = require('http')
let fs = require('fs')


async function getPaintings() {
    let offset = Math.floor(Math.random() * 100)
    let searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1.1/search?medium=Paintings&hasImages=true&q=*&limit=500&offset=${offset}`
    //let searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1.1/search?medium=Paintings&hasImages=true&q=abstract&limit=500&offset=${offset}`
    let searchResponse = await fetch(searchUrl)
    let searchData = await searchResponse.json()
    if (!searchResponse.ok) {
    throw new Error('Erro ao pesquisar obras no Met')
    }
    let ids = searchData.objectIDs || []
    let selectedIds = []

    while (selectedIds.length < 20 && selectedIds.length < ids.length) {
        let randomIndex = Math.floor(Math.random() * ids.length)
        let id = ids[randomIndex]

        if (!selectedIds.includes(id)) {
            selectedIds.push(id)
        }
    }

    let paintings = []

    for (let id of selectedIds) {
        let artworkUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`

        let artworkResponse = await fetch(artworkUrl)
        let painting = await artworkResponse.json()

        if (painting.primaryImageSmall || painting.primaryImage) {
            paintings.push({
                title: painting.title,
                artist: painting.artistDisplayName,
                date: painting.objectDate,
                image: painting.primaryImageSmall || painting.primaryImage

            })
        }
    }

    return paintings
}


http.createServer(async (request, response) => {
    try {
        if (request.url == '/api/paintings') {
            let paintings = await getPaintings()

            response.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            })

            response.end(JSON.stringify(paintings))

        } else if (request.url == '/') {
            let html = await fs.promises.readFile('index.html')

            response.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            })

            response.end(html)

        } else if (request.url == '/style.css') {
            let css = await fs.promises.readFile('style.css')

            response.writeHead(200, {
                'Content-Type': 'text/css; charset=utf-8'
            })

            response.end(css)

        } else if (request.url == '/gallery.js') {
            let script = await fs.promises.readFile('gallery.js')

            response.writeHead(200, {
                'Content-Type': 'text/javascript; charset=utf-8'
            })

            response.end(script)

        } else {
            response.writeHead(404, {
                'Content-Type': 'text/plain; charset=utf-8'
            })

            response.end('Not found')
        }
    } catch (error) {
        response.writeHead(500, {
            'Content-Type': 'text/plain; charset=utf-8'
        })

        response.end('Could not load paintings.')
        console.log(error)
    }
}).listen(3000, () => {
    console.log('Server running at http://localhost:3000')
})
