import EasyStar from 'easystarjs'

export default class PathFinding {

    constructor (Player) {
        this.Finder = new EasyStar.js()
        this.Player = Player
        this.tiles = []
    }

    init (tiles) {
        this.tiles = tiles
        var GridRight = 0
        var GridBottom = 0
        for (let i = 0; i < tiles.length; i++) {
            for (let j = 0; j < tiles.length; j++) {
                const element = tiles[j]
                GridRight = (element.coordinateX > GridRight) ? element.coordinateX : GridRight
                GridBottom = (element.coordinateX > GridBottom) ? element.coordinateX : GridBottom
            }
        }
        var _grid = []
        _grid.length = GridRight + 1
        for (let i = 0; i < _grid.length; i++) {
            _grid[i] = []
            _grid[i].length = GridBottom + 1
        }
        //1=X
        //0=Passable
        for (let index = 0; index < tiles.length; index++) {
            const element = tiles[index]
            if (element.acceptable === false) {
                _grid[element.coordinateX][element.coordinateY] = 1
            }
            _grid[element.coordinateX][element.coordinateY] = 0
        }
        this.Finder.setGrid(_grid)
        this.Finder.setAcceptableTiles([0])
    }

    Find (Tile, comfirm, tiles = this.tiles) {
        for (let t = 0; t < tiles.length; t++) {
            var element = tiles[t]
            element.clearTint()
        }
        console.log(this.Player.coordinateX + '/' + this.Player.coordinateY + '/' + Tile.coordinateX + '/' + Tile.coordinateY)
        this.Finder.findPath(this.Player.coordinateX, this.Player.coordinateY, Tile.coordinateX, Tile.coordinateY,
            function (path) {
                const tilePath = []
                for (let p = 0; p < path.length; p++) {
                    const element = path[p]
                    const tile = tiles.find(t => t.coordinateX == element.x && t.coordinateY == element.y)
                    if (p === path.length - 1 && tile.hasOwnProperty('item')) {
                        continue
                    }
                    tile.setTint(0xff0000)
                    tilePath[p] = tile
                }
                comfirm(tilePath)
            })
    }
}